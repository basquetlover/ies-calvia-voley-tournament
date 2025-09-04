import { supabaseAdmin } from "src/lib/supabase";


export async function POST({ request }: { request: Request }) {
  const { jugada, id_partido, nuevoLocSet1, nuevoLocSet2, nuevoLocSet3, nuevoVisSet1, nuevoVisSet2, nuevoVisSet3 } = await request.json();

  console.log(jugada, id_partido, nuevoLocSet1, nuevoLocSet2, nuevoLocSet3, nuevoVisSet1, nuevoVisSet2, nuevoVisSet3)
  //const { data, error } = await supabaseAdmin
    // .from('jugadas')
    // .insert([{ id_partido, ...jugada }]);

//   if (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }

const { data: GuardarHistorial, error: ErrorGuardarHistorial } = await supabaseAdmin
    .from('HistorialV')
    .insert([
    { id_partido: id_partido, 
      id_equipo: jugada.idEquipo,
      locPuntos: jugada.nuevoLoc,
      locSet: jugada.nuevoLocSet,
      nombre: jugada.jugador,
      orden: jugada.orden,
      tiempo: jugada.tiempo,
      tipoPunto: jugada.tipo,
      visPuntos: jugada.nuevoVis,
      visSet: jugada.nuevoVisSet
    },
    ])
    .select()

      if (ErrorGuardarHistorial) {
        console.log(ErrorGuardarHistorial)
            return new Response(JSON.stringify({ mensaje: ErrorGuardarHistorial.message }), { status: 500 });
        }
    // const data = "Api finalizada Correctamente"

    if(jugada.tipo === "FinSet"){
      const { data, error } = await supabaseAdmin
        .from('PartidosSS')
        .update({ 
          LocSet1: nuevoLocSet1,
          VisSet1: nuevoVisSet1,
          LocSet2: nuevoLocSet2,
          VisSet2: nuevoVisSet2,
          LocSet3: nuevoLocSet3,
          VisSet3: nuevoVisSet3,
        
        })
        .eq('id_partido', id_partido)
        .select()
    }

  return new Response(JSON.stringify({ GuardarHistorial }), { status: 200 });
}