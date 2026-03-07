import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {

    const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
  console.log("TablaPartidos:", TablaPartidos);

    const datos = await request.json();

    console.log("Datos recibidos en API editar-partido:", datos);

    // const { error } = await supabase
    //   .from("partidos")
    //   .update(restoDatos)
    //   .eq("id_partido", id_partido);
    const { data, error: updateError } = await supabaseAdmin
    .from(TablaPartidos)
    .update({
        pista: datos.datos.pista,
        estado: datos.datos.estado,
        equipo_local: datos.datos.equipo_local,
        equipo_visitante: datos.datos.equipo_visitante,
        arbitro: datos.datos.arbitro,
        oficial_1: datos.datos.oficial_1,
        oficial_2: datos.datos.oficial_2,
        LocGlobal: datos.datos.LocGlobal,
        VisGlobal: datos.datos.VisGlobal,
        LocSet1: datos.datos.LocSet1,
        VisSet1: datos.datos.VisSet1,
        LocSet2: datos.datos.LocSet2,
        VisSet2: datos.datos.VisSet2,
        LocSet3: datos.datos.LocSet3,
        VisSet3: datos.datos.VisSet3,
        bracket: datos.datos.bracket,
        jornada: datos.datos.jornada
    })
    .eq("id", datos.datos.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error en la API" }),
      { status: 500 }
    );
  }
};