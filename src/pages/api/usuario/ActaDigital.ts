//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';
import { jugadores } from '@sections/administracion/CrearEquipo.astro';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const FormAction = formData.get("FormAction")?.toString().trim() || "";
  const id_partido = formData.get("id_partido")?.toString().trim() || "";

  if(FormAction === "GuardarJugada"){
    const nombre_jugador = formData.get("nombre-jugador")?.toString().trim() || "";
    const id_equipo = formData.get("id-equipo")?.toString().trim() || "";
    const tipo_punto = formData.get("tipo-punto")?.toString().trim() || "";
    const tiempo = formData.get("tiempo")?.toString().trim() || "";
    const orden = formData.get("orden")?.toString().trim() || "";
    

    const FormLocPuntos = formData.get("FormLocPuntos")?.toString().trim() || "";
    const FormLocSet = formData.get("FormLocSet")?.toString().trim() || "";
    const FormVisPuntos = formData.get("FormVisPuntos")?.toString().trim() || "";
    const FormVisSet = formData.get("FormVisSet")?.toString().trim() || "";

    const referencia_equipo_local = formData.get("referencia_equipo_local")?.toString().trim() || "";
    const referencia_equipo_visitante = formData.get("referencia_equipo_visitante")?.toString().trim() || "";

    console.log("Datos recibidos en api", nombre_jugador, id_equipo, tipo_punto, tiempo, orden, id_partido, FormAction, FormLocPuntos, FormLocSet, FormVisPuntos, FormVisSet);

    if(id_equipo === "equipo-local"){
        const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
        .from('JugadoresSS')
        .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
        .eq('nombre', nombre_jugador)
        .eq('pertenece_equipo', referencia_equipo_local)
        .single();
    
        if(JugadoresLocales){
            let bloqueos = Number(JugadoresLocales.punto_bloqueo);
            let remates = Number(JugadoresLocales.punto_remate);
            let directos = Number(JugadoresLocales.punto_directo);
            let errores = Number(JugadoresLocales.punto_error);
            let id = JugadoresLocales.id
    
            if(tipo_punto === "Directo"){
                directos++
            }
            if(tipo_punto === "Remate"){
                remates++
            }
            if(tipo_punto === "Bloqueo"){
                bloqueos++
            }
            if(tipo_punto === "Error"){
                errores++
            }
    
            const { data, error } = await supabaseAdmin
            .from('JugadoresSS')
            .update({ 
                punto_bloqueo: bloqueos,
                punto_remate: remates,
                punto_directo: directos,
                punto_error: errores
             })
            .eq('id', id)
            .select()
    
        }
    }
    if(id_equipo === "equipo-visitante"){
        const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
        .from('JugadoresSS')
        .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
        .eq('nombre', nombre_jugador)
        .eq('pertenece_equipo', referencia_equipo_visitante)
        .single();
    
        if(JugadoresLocales){
            let bloqueos = Number(JugadoresLocales.punto_bloqueo);
            let remates = Number(JugadoresLocales.punto_remate);
            let directos = Number(JugadoresLocales.punto_directo);
            let errores = Number(JugadoresLocales.punto_error);
            let id = JugadoresLocales.id
    
            if(tipo_punto === "Directo"){
                directos++
            }
            if(tipo_punto === "Remate"){
                remates++
            }
            if(tipo_punto === "Bloqueo"){
                bloqueos++
            }
            if(tipo_punto === "Error"){
                errores++
            }
    
            const { data, error } = await supabaseAdmin
            .from('JugadoresSS')
            .update({ 
                punto_bloqueo: bloqueos,
                punto_remate: remates,
                punto_directo: directos,
                punto_error: errores
             })
            .eq('id', id)
            .select()
    
        }
    }
    

    const { data: GuardarHistorial, error: ErrorGuardarHistorial } = await supabaseAdmin
    .from('HistorialSS')
    .insert([
    { id_partido: id_partido, 
      id_equipo: id_equipo,
      locPuntos: FormLocPuntos,
      locSet: FormLocSet,
      nombre: nombre_jugador,
      orden: orden,
      tiempo: tiempo,
      tipoPunto: tipo_punto,
      visPuntos: FormVisPuntos,
      visSet: FormVisSet
    },
    ])
    .select()

    if(ErrorGuardarHistorial){
        console.log("Error insertando datos", ErrorGuardarHistorial)
    }
  }

  if(FormAction === "EliminarJugada"){
    const modificar_reference = formData.get("modificar_reference")?.toString().trim() || "";
    console.log("Eliminando jugada", modificar_reference)

    const { data: EliminarJugada, error: ErrorEliminarJugada } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .select()

    console.log(EliminarJugada)
    const ordenMayor: any[] = EliminarJugada?.filter(jugada => jugada.orden > modificar_reference) || [];

    console.log("Jugadas con orden mayor:", ordenMayor);

    const jugadaAEliminar = EliminarJugada?.find(jugada => jugada.orden === modificar_reference);

// Verificar si la jugada a eliminar no es de tipo "Error" y es del equipo local
  if (jugadaAEliminar && jugadaAEliminar.id_equipo === 'equipo-local') {
    if(jugadaAEliminar.tipoPunto !== "Error"){
        // Restar 1 a locPuntos de todas las jugadas de orden mayor
        for (const jugada of ordenMayor) {
          // Actualizar locPuntos
          jugada.locPuntos -= 1;

          // Aquí puedes hacer la actualización en la base de datos si es necesario
          const { error: updateError } = await supabaseAdmin
              .from('HistorialSS')
              .update({ locPuntos: jugada.locPuntos })
              .eq('id_partido', jugada.id_partido)
              .eq('orden', jugada.orden);

          if (updateError) {
              console.error("Error actualizando locPuntos:", updateError);
          }
      }
    } else{
      for (const jugada of ordenMayor) {
        // Actualizar locPuntos
        jugada.visPuntos -= 1;

        // Aquí puedes hacer la actualización en la base de datos si es necesario
        const { error: updateError } = await supabaseAdmin
            .from('HistorialSS')
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.error("Error actualizando locPuntos:", updateError);
        }
    }
    }
      
      console.log(jugadaAEliminar, jugadaAEliminar.tipoPunto, jugadaAEliminar.id_equipo)
  } else{
    if(jugadaAEliminar.tipoPunto !== "Error"){
      // Restar 1 a locPuntos de todas las jugadas de orden mayor
      for (const jugada of ordenMayor) {
        // Actualizar locPuntos
        jugada.visPuntos -= 1;

        // Aquí puedes hacer la actualización en la base de datos si es necesario
        const { error: updateError } = await supabaseAdmin
            .from('HistorialSS')
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.error("Error actualizando locPuntos:", updateError);
        }
    }
  } else{
    for (const jugada of ordenMayor) {
      // Actualizar locPuntos
      jugada.locPuntos -= 1;

      // Aquí puedes hacer la actualización en la base de datos si es necesario
      const { error: updateError } = await supabaseAdmin
          .from('HistorialSS')
          .update({ locPuntos: jugada.locPuntos })
          .eq('id_partido', jugada.id_partido)
          .eq('orden', jugada.orden);

      if (updateError) {
          console.error("Error actualizando locPuntos:", updateError);
      }
  }
  }
    
    console.log(jugadaAEliminar, jugadaAEliminar.tipoPunto, jugadaAEliminar.id_equipo)
  }

  if(jugadaAEliminar.tipoPunto === "FinSet"){
    // Buscar la jugada anterior en la base de datos
    const { data: jugadaAnterior, error: ErrorJugadaAnterior } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .lt('orden', modificar_reference) // Buscar jugadas con orden menor
    .order('orden', { ascending: false }) // Ordenar de mayor a menor para obtener la más reciente
    .limit(1) // Limitar a 1 resultado
    .single(); // Obtener un solo resultado

if (ErrorJugadaAnterior) {
    console.error("Error buscando la jugada anterior:", ErrorJugadaAnterior);
} else if (jugadaAnterior) {
    // Eliminar la jugada anterior
    const { error: deleteError } = await supabaseAdmin
        .from('HistorialSS')
        .delete()
        .eq('id_partido', id_partido)
        .eq('orden', jugadaAnterior.orden);

    if (deleteError) {
        console.error("Error eliminando la jugada anterior:", deleteError);
    }
}

  }

    const { error } = await supabaseAdmin
    .from('HistorialSS')
    .delete()
    .eq('id_partido', id_partido)
    .eq('orden', modificar_reference)


    
  }
  
  if(FormAction === "ModificarJugada"){
    const modificar_reference = formData.get("modificar_reference")?.toString().trim() || "";
    console.log("Eliminando jugada", modificar_reference)

    const nombre_jugador = formData.get("nombre-jugador")?.toString().trim() || "";
    const id_equipo = formData.get("id-equipo")?.toString().trim() || "";
    const tipo_punto = formData.get("tipo-punto")?.toString().trim() || "";

    const { data: EliminarJugada, error: ErrorEliminarJugada } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .select()

    console.log(EliminarJugada)
    const ordenMayor: any[] = EliminarJugada?.filter(jugada => jugada.orden > modificar_reference) || [];

    console.log("Jugadas con orden mayor:", ordenMayor);

    const jugadaAEliminar = EliminarJugada?.find(jugada => jugada.orden === modificar_reference);

    
    let locPuntos = Number(jugadaAEliminar.locPuntos);
    let visPuntos = Number(jugadaAEliminar.visPuntos);
    if (jugadaAEliminar.id_equipo === id_equipo) {
      console.log("Ejecutando 5")
      if (tipo_punto === "Error" && jugadaAEliminar.tipoPunto !== "Error") {
          //if (jugadaAEliminar.tipoPunto !== tipo_punto) {
              if (id_equipo === "equipo-local") {
                console.log("Ejecutando 1")
                visPuntos = visPuntos + 1;
                if(locPuntos > 0){
                locPuntos = locPuntos - 1;
                }
              } else {
                console.log("Ejecutando 2")
                if(visPuntos > 0){
                visPuntos = visPuntos - 1;
                }
                locPuntos = locPuntos + 1;
                  
              }
          //}
      } else {
          if (jugadaAEliminar.tipoPunto === "Error") {
              if (id_equipo === "equipo-local") {
                console.log("Ejecutando 3")
                if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
                  }
                locPuntos = locPuntos + 1;
                 
              } else {
                console.log("Ejecutando 4")
                visPuntos = visPuntos + 1;
                if(locPuntos > 0){
                  locPuntos = locPuntos - 1;
                  }
              }
          }
      }
  } else{
    if(id_equipo === "equipo-local"){
      if (tipo_punto === "Error") {
          if (jugadaAEliminar.tipoPunto !== tipo_punto) {
  
           } else {
              if(locPuntos > 0){                
                locPuntos = locPuntos - 1;
              }
  
              visPuntos = visPuntos + 1;
      }
      } else {
          
                  locPuntos = locPuntos + 1;
                  if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
              }
                 
          
      }
  
  } else{
      if (tipo_punto === "Error") {
          if (jugadaAEliminar.tipoPunto !== tipo_punto) {
              
          }else {
              
              locPuntos = locPuntos + 1;
              if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
              }
              
      }
      } else {
          
                  if(locPuntos > 0){
                  locPuntos = locPuntos - 1;
              }
                 
                  visPuntos = visPuntos + 1;
          
      }
  
  }
  }
   // console.log(nombre_jugador, id_equipo, tipo_punto, visPuntos, locPuntos, jugadaAEliminar.id_equipo)
  
      const { error } = await supabaseAdmin
      .from('HistorialSS')
      .update({
        nombre: nombre_jugador,
        id_equipo: id_equipo,
        tipoPunto: tipo_punto,
        locPuntos: locPuntos,
        visPuntos: visPuntos,
      })
      .eq('id_partido', id_partido)
      .eq('orden', modificar_reference);


  //       for (const jugada of ordenMayor) {
  //         // Actualizar locPuntos
  //             if (jugadaAEliminar.id_equipo === id_equipo) {
     
  //     if (tipo_punto === "Error" && jugadaAEliminar.tipoPunto !== "Error") {
  //         //if (jugadaAEliminar.tipoPunto !== tipo_punto) {
  //             if (id_equipo === "equipo-local") {
               
  //               jugada.visPuntos = Number(jugada.visPuntos) + 1;
  //               if(jugada.locPuntos > 0){
  //               jugada.locPuntos = Number(jugada.locPuntos) - 1;
  //               }
  //             } else {
                
  //               if(jugada.visPuntos > 0){
  //               jugada.visPuntos = Number(jugada.visPuntos) - 1;
  //               }
  //               jugada.locPuntos = Number(jugada.locPuntos) + 1;
                  
  //             }
  //         //}
  //     } else {
  //         if (jugadaAEliminar.tipoPunto === "Error") {
  //             if (id_equipo === "equipo-local") {
                
  //               if(jugada.visPuntos > 0){
  //                 jugada.visPuntos = Number(jugada.visPuntos) - 1;
  //                 }
  //               jugada.locPuntos = Number(jugada.locPuntos) + 1;
                 
  //             } else {
                
  //               jugada.visPuntos = Number(jugada.visPuntos) + 1;
  //               if(jugada.locPuntos > 0){
  //                 jugada.locPuntos = Number(jugada.locPuntos) - 1;
  //                 }
  //             }
  //         }
  //     }
  // } else{
  //   if(id_equipo === "equipo-local"){
  //     if (tipo_punto === "Error") {
  //         if (jugadaAEliminar.tipoPunto !== tipo_punto) {
  
  //          } else {
  //             if(jugada.locPuntos > 0){                
  //               jugada.locPuntos = Number(jugada.locPuntos) - 1;
  //             }
  
  //             jugada.visPuntos = Number(jugada.visPuntos) + 1;
  //     }
  //     } else {
          
  //                 jugada.locPuntos = Number(jugada.locPuntos) + 1;
  //                 if(jugada.visPuntos > 0){
  //                 jugada.visPuntos = Number(jugada.visPuntos) - 1;
  //             }
                 
          
  //     }
  
  // } else{
  //     if (tipo_punto === "Error") {
  //         if (jugadaAEliminar.tipoPunto !== tipo_punto) {
              
  //         }else {
              
  //             jugada.locPuntos = Number(jugada.locPuntos) + 1;
  //             if(jugada.visPuntos > 0){
  //                 jugada.visPuntos = Number(jugada.visPuntos) - 1;
  //             }
              
  //     }
  //     } else {
          
  //                 if(jugada.locPuntos > 0){
  //                 jugada.locPuntos = Number(jugada.locPuntos) - 1;
  //             }
                 
  //                 jugada.visPuntos = Number(jugada.visPuntos) + 1;
          
  //     }
  
  // }
  // }
          
  //         // Aquí puedes hacer la actualización en la base de datos si es necesario
  //         const { error: updateError } = await supabaseAdmin
  //             .from('HistorialSS')
  //             .update({ 
  //               locPuntos: jugada.locPuntos,
  //               visPuntos: jugada.visPuntos
  //              })
  //             .eq('id_partido', jugada.id_partido)
  //             .eq('orden', jugada.orden);

  //         if (updateError) {
  //             console.error("Error actualizando locPuntos:", updateError);
  //         }
  //     }


  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};