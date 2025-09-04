import { supabaseAdmin } from "src/lib/supabase";

export async function POST({ request }: { request: Request }) {
  const { jugada, id_partido } = await request.json();

  // 1️⃣ Comprobar si la jugada ya existe
const { data: existing, error: selectError } = await supabaseAdmin
  .from("HistorialV")
  .select("id") // solo necesitamos saber si hay algún registro
  .eq("id_partido", id_partido)
  .eq("orden", jugada.orden)
  .eq("nombre", jugada.jugador)
  .eq("tipoPunto", jugada.tipo);

  if (existing?.length === 0) {
  const { data, error } = await supabaseAdmin
    .from("HistorialV")
    .insert([
      {
        id_partido: id_partido,
        id_equipo: jugada.idEquipo,
        locPuntos: jugada.nuevoLoc,
        locSet: jugada.nuevoLocSet,
        nombre: jugada.jugador,
        orden: jugada.orden,
        tiempo: jugada.tiempo,
        tipoPunto: jugada.tipo,
        visPuntos: jugada.nuevoVis,
        visSet: jugada.nuevoVisSet,
      },
    ])
    .select();
    
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

    return new Response(JSON.stringify({ data }), { status: 200 });

  } else{
    console.log("La jugada ya existe")
    // return new Response(JSON.stringify({ data: "Completado" }), { status: 200 });
  }


return new Response(JSON.stringify({ data: "Completado" }), { status: 200 });
}
