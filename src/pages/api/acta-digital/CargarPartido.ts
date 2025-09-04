import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

export async function POST({ request }: { request: Request }) {
  const { id_partido } = await request.json();

  const { data: HistorialGuardado, error: ErrorGuardarHistorial } = await supabaseAdmin
        .from('HistorialV')
        .select("*")
        .eq("id_partido", id_partido)
        .order('id', { ascending: true });
        
        //console.log(HistorialGuardado)

        if(ErrorGuardarHistorial){
            console.log(ErrorGuardarHistorial)
        }

 

  return new Response(JSON.stringify({ HistorialGuardado }), { status: 200 });
}