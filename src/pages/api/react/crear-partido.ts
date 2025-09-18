import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;

export async function POST({ request }: { request: Request }) {
  const { nuevoPartido } = await request.json();
  let partido_id = nuevoPartido.numero;
  console.log("Creant partit:", nuevoPartido);

//   const { data: HistorialGuardado, error: ErrorGuardarHistorial } = await supabaseAdmin
//         .from(TablaPartidos)
//         .select("*")
        
        

 

  return new Response(JSON.stringify({ data: "Partit creat correctament"  }), { status: 200 });
}