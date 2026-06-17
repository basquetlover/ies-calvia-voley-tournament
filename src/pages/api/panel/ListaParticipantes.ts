import type { APIRoute } from "astro";

import { supabaseAdmin } from "src/lib/supabase";

interface Participante {
  nombre: string;
  _1r_apellido: string;
  _2n_apellido: string;
  curso: string;
  tipo_ficha?: string;
  tipo?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { torneoID } = await request.json();

    if (!torneoID) {
      return new Response(
        JSON.stringify({
          error: "Falta torneoID",
        }),
        { status: 400 }
      );
    }

    // Equipos inscritos
    const { data: equipos, error: equiposError } = await supabaseAdmin
      .from(`Equipos${torneoID}`)
      .select("id")
      .eq("aceptado", "Inscrit");

    if (equiposError) throw equiposError;

    const idsEquipos = equipos.map((e) => e.id);

    // Jugadores
    const { data: jugadores, error: jugadoresError } = await supabaseAdmin
      .from(`Jugadores${torneoID}`)
      .select(`
        nombre,
        _1r_apellido,
        _2n_apellido,
        curso,
        tipo_ficha,
        pertenece_equipo
      `)
      .in("pertenece_equipo", idsEquipos);

    if (jugadoresError) throw jugadoresError;

    // Voluntarios aceptados
    const { data: voluntarios, error: voluntariosError } = await supabaseAdmin
      .from("voluntarios")
      .select(`
        nombre,
        _1r_apellido,
        _2n_apellido,
        curso,
        tipo
      `)
      .eq("estado", "acceptat");

    if (voluntariosError) throw voluntariosError;

    // Evitar duplicados (si alguien es jugador y voluntario)
    const jugadoresSet = new Set(
      jugadores.map(
        (j) =>
          `${j.nombre}|${j._1r_apellido}|${j._2n_apellido}|${j.curso}`
            .toLowerCase()
            .trim()
      )
    );

    const voluntariosFiltrados = voluntarios.filter((v) => {
      const clave =
        `${v.nombre}|${v._1r_apellido}|${v._2n_apellido}|${v.curso}`
          .toLowerCase()
          .trim();

      return !jugadoresSet.has(clave);
    });

    const participantes: Participante[] = [
      ...jugadores.map((j) => ({
        nombre: j.nombre,
        _1r_apellido: j._1r_apellido,
        _2n_apellido: j._2n_apellido,
        curso: j.curso,
        tipo_ficha: j.tipo_ficha,
      })),
      ...voluntariosFiltrados.map((v) => ({
        nombre: v.nombre,
        _1r_apellido: v._1r_apellido,
        _2n_apellido: v._2n_apellido,
        curso: v.curso,
        tipo: v.tipo,
      })),
    ];

    const cursosMap: Record<string, Participante[]> = {};

    for (const participante of participantes) {
      const curso = participante.curso || "Sense curs";

      if (!cursosMap[curso]) {
        cursosMap[curso] = [];
      }

      cursosMap[curso].push(participante);
    }

    const cursos = Object.entries(cursosMap).map(
      ([curso, participantes]) => ({
        curso,
        numero: participantes.length,
        participantes,
      })
    );

    return new Response(
      JSON.stringify({
        numero: participantes.length,
        cursos,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "Error interno del servidor",
      }),
      { status: 500 }
    );
  }
};