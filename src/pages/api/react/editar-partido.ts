import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

async function obtenerTablaPartidosActiva() {
  const { data: confTorneo, error } = await supabaseAdmin
    .from("Configuracion")
    .select("id_torneo, nombre")
    .eq("estado", "Actual")
    .single();

  if (error || !confTorneo?.id_torneo) {
    throw new Error(error?.message || "No se encontró un torneo activo");
  }

  return `Partidos${confTorneo.id_torneo}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const TablaPartidos = await obtenerTablaPartidosActiva();
    const payload = await request.json();
    const datos = payload?.datos ?? {};
    const idRegistro = datos.id;
    const idPartido = payload?.id_partido ?? datos.id_partido;

    const datosActualizados = {
      pista: datos.pista,
      estado: datos.estado,
      supervision: datos.supervision || "Sense supervisió",
      equipo_local: datos.equipo_local,
      equipo_visitante: datos.equipo_visitante,
      arbitro: datos.arbitro,
      oficial_1: datos.oficial_1,
      oficial_2: datos.oficial_2,
      LocGlobal: datos.LocGlobal,
      VisGlobal: datos.VisGlobal,
      LocSet1: datos.LocSet1,
      VisSet1: datos.VisSet1,
      LocSet2: datos.LocSet2,
      VisSet2: datos.VisSet2,
      LocSet3: datos.LocSet3,
      VisSet3: datos.VisSet3,
      bracket: datos.bracket,
      jornada: datos.jornada,
    };

    let updateQuery = supabaseAdmin
      .from(TablaPartidos)
      .update(datosActualizados);

    if (idRegistro !== undefined && idRegistro !== null) {
      updateQuery = updateQuery.eq("id", idRegistro);
    } else if (idPartido) {
      updateQuery = updateQuery.eq("id_partido", idPartido);
    } else {
      return new Response(
        JSON.stringify({ error: "Falta el identificador del partido" }),
        { status: 400 }
      );
    }

    const { data, error: updateError } = await updateQuery.select().maybeSingle();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, partido: data }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en editar-partido:", err);
    return new Response(
      JSON.stringify({ error: "Error en la API" }),
      { status: 500 }
    );
  }
};