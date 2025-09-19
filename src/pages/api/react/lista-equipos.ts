import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaEquipos = `Equipos${ConfTorneo?.id_torneo}`;
  console.log("TablaEquipos:", TablaEquipos);

export async function POST({ request }: { request: Request }) {

const { data: ListaEquipos, error } = await supabaseAdmin
  .from(TablaEquipos)
  .select('nombre_equipo, escudo')
  .order('id', { ascending: true });
  console.log("Equipos:", ListaEquipos);
  if(error){
    console.log("Error al obtener equipos:", error);
  }

  return new Response(JSON.stringify({ ListaEquipos  }), { status: 200 });
}