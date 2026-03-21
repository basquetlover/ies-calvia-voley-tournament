// src/pages/api/partidos.ts
import { supabaseAdmin } from "../../../lib/supabase";

let TablaEquipos = `Equipos`



export async function POST({ request }: { request: Request }) {


let mes = "true";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, fecha, nombre')
  .eq('estado', 'Actual')
  .single();

    if(ConfTorneo){
        TablaEquipos = `Equipos${ConfTorneo.id_torneo}`;
    }

    if(error){
        console.error("Error al obtener la configuración del torneo:", error);
    }

    const { data: equipos, error: errorEquipos } = await supabaseAdmin
    .from(TablaEquipos)
    .select("nombre_equipo, escudo, id");

    if (errorEquipos) {
        console.error("Error al obtener los equipos inscritos:", errorEquipos);
        return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
        });
    }

    //console.log("Equipos inscritos:", equipos);

    return new Response(JSON.stringify(equipos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
 
    //console.error("Error en API de partidos:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  
}