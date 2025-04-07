//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const FormAction = formData.get("FormAction")?.toString().trim() || "";

  if(FormAction === "GuardarJugada"){
    const nombre_jugador = formData.get("nombre-jugador")?.toString().trim() || "";
    const id_equipo = formData.get("id-equipo")?.toString().trim() || "";
    const tipo_punto = formData.get("tipo-punto")?.toString().trim() || "";
    const tiempo = formData.get("tiempo")?.toString().trim() || "";
    const orden = formData.get("orden")?.toString().trim() || "";
    const id_partido = formData.get("id_partido")?.toString().trim() || "";

    const FormLocPuntos = formData.get("FormLocPuntos")?.toString().trim() || "";
    const FormLocSet = formData.get("FormLocSet")?.toString().trim() || "";
    const FormVisPuntos = formData.get("FormVisPuntos")?.toString().trim() || "";
    const FormVisSet = formData.get("FormVisSet")?.toString().trim() || "";

    const referencia_equipo_local = formData.get("referencia_equipo_local")?.toString().trim() || "";
    const referencia_equipo_visitante = formData.get("referencia_equipo_visitante")?.toString().trim() || "";

    console.log("Datos recibidos en api", nombre_jugador, id_equipo, tipo_punto, tiempo, orden, id_partido, FormAction, FormLocPuntos, FormLocSet, FormVisPuntos, FormVisSet);

    // if(id_equipo === "equipo-local"){
    //     const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
    //     .from('JugadoresSS')
    //     .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
    //     .eq('nombre', nombre_jugador)
    //     .eq('pertenece_equipo', referencia_equipo_local)
    //     .single();
    
    //     if(JugadoresLocales){
    //         let bloqueos = Number(JugadoresLocales.punto_bloqueo);
    //         let remates = Number(JugadoresLocales.punto_remate);
    //         let directos = Number(JugadoresLocales.punto_directo);
    //         let errores = Number(JugadoresLocales.punto_error);
    //         let id = JugadoresLocales.id
    
    //         if(tipo_punto === "Directo"){
    //             directos++
    //         }
    //         if(tipo_punto === "Remate"){
    //             remates++
    //         }
    //         if(tipo_punto === "Bloqueo"){
    //             bloqueos++
    //         }
    //         if(tipo_punto === "Error"){
    //             errores++
    //         }
    
    //         const { data, error } = await supabaseAdmin
    //         .from('JugadoresSS')
    //         .update({ 
    //             punto_bloqueo: bloqueos,
    //             punto_remate: remates,
    //             punto_directo: directos,
    //             punto_error: errores
    //          })
    //         .eq('id', id)
    //         .select()
    
    //     }
    // }
    // if(id_equipo === "equipo-visitante"){
    //     const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
    //     .from('JugadoresSS')
    //     .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
    //     .eq('nombre', nombre_jugador)
    //     .eq('pertenece_equipo', referencia_equipo_visitante)
    //     .single();
    
    //     if(JugadoresLocales){
    //         let bloqueos = Number(JugadoresLocales.punto_bloqueo);
    //         let remates = Number(JugadoresLocales.punto_remate);
    //         let directos = Number(JugadoresLocales.punto_directo);
    //         let errores = Number(JugadoresLocales.punto_error);
    //         let id = JugadoresLocales.id
    
    //         if(tipo_punto === "Directo"){
    //             directos++
    //         }
    //         if(tipo_punto === "Remate"){
    //             remates++
    //         }
    //         if(tipo_punto === "Bloqueo"){
    //             bloqueos++
    //         }
    //         if(tipo_punto === "Error"){
    //             errores++
    //         }
    
    //         const { data, error } = await supabaseAdmin
    //         .from('JugadoresSS')
    //         .update({ 
    //             punto_bloqueo: bloqueos,
    //             punto_remate: remates,
    //             punto_directo: directos,
    //             punto_error: errores
    //          })
    //         .eq('id', id)
    //         .select()
    
    //     }
    // }
    

    // const { data: GuardarHistorial, error: ErrorGuardarHistorial } = await supabaseAdmin
    // .from('HistorialSS')
    // .insert([
    // { id_partido: id_partido, 
    //   id_equipo: id_equipo,
    //   locPuntos: FormLocPuntos,
    //   locSet: FormLocSet,
    //   nombre: nombre_jugador,
    //   orden: orden,
    //   tiempo: tiempo,
    //   tipoPunto: tipo_punto,
    //   visPuntos: FormVisPuntos,
    //   visSet: FormVisSet
    // },
    // ])
    // .select()

    // if(ErrorGuardarHistorial){
    //     console.log("Error insertando datos", ErrorGuardarHistorial)
    // }
  }

  if(FormAction === "EliminarJugada"){
    const modificar_reference = formData.get("modificar_reference")?.toString().trim() || "";
    console.log("Eliminando jugada", modificar_reference)
  }
    
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};