import type { APIRoute } from "astro";
import { supabaseAdmin } from "src/lib/supabase";

async function obtenerTablasActivas() {
  const { data: confTorneo, error } = await supabaseAdmin
    .from("Configuracion")
    .select("id_torneo, nombre")
    .eq("estado", "Actual")
    .single();

  if (error || !confTorneo?.id_torneo) {
    throw new Error(error?.message || "No se encontró un torneo activo");
  }

  return {
    TablaPartidos: `Partidos${confTorneo.id_torneo}`,
    TablaEquipos: `Equipos${confTorneo.id_torneo}`,
  };
}

export const POST: APIRoute = async () => {
  try {
    const { TablaPartidos, TablaEquipos } = await obtenerTablasActivas();

    const { data: listaPartidos, error: partidosError } = await supabaseAdmin
      .from(TablaPartidos)
      .select("*")
      .order("jornada", { ascending: true })
      .order("id_partido", { ascending: true });

    if (partidosError) {
      console.log("Error al obtener Partidos:", partidosError);
      return new Response(
        JSON.stringify({ ListaPartidos: [], error: partidosError.message }),
        { status: 500 }
      );
    }

    const { data: equipos, error: equiposError } = await supabaseAdmin
      .from(TablaEquipos)
      .select("nombre_equipo, escudo");

    if (equiposError) {
      console.log("Error al obtener equipos:", equiposError);
    }

    const mapaEscudos: Record<string, string | null> = {};

    equipos?.forEach((equipo: { nombre_equipo: string; escudo: string | null }) => {
      mapaEscudos[equipo.nombre_equipo] = equipo.escudo;
    });

    const partidosConEscudos = (listaPartidos ?? []).map((partido: any) => ({
      ...partido,
      supervision: partido.supervision ?? "",
      escudo_local: mapaEscudos[partido.equipo_local] || null,
      escudo_visitante: mapaEscudos[partido.equipo_visitante] || null,
    }));

    return new Response(
      JSON.stringify({ ListaPartidos: partidosConEscudos }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en lista-partidos:", error);
    return new Response(
      JSON.stringify({ ListaPartidos: [], error: "No se pudieron cargar los partidos" }),
      { status: 500 }
    );
  }
};