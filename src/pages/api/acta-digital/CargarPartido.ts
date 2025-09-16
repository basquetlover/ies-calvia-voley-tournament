import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaHistorial = `Historial${ConfTorneo?.id_torneo}`;
export async function POST({ request }: { request: Request }) {
  const { id_partido } = await request.json();

  const { data: HistorialGuardado, error: ErrorGuardarHistorial } = await supabaseAdmin
        .from(TablaHistorial)
        .select("*")
        .eq("id_partido", id_partido)
        .order('id', { ascending: true });
        
        //console.log(HistorialGuardado)

        if(ErrorGuardarHistorial){
            console.log(ErrorGuardarHistorial)
        }

 

  return new Response(JSON.stringify({ HistorialGuardado }), { status: 200 });
}