import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaHistorial = `Historial${ConfTorneo?.id_torneo}`;
export async function POST({ request }: { request: Request }) {
  const { jugadaModificar, id_partido } = await request.json();

  const { data: EliminarJugada, error: ErrorEliminarJugada } = await supabaseAdmin
    .from(TablaHistorial)
    .select('*')
    .eq('id_partido', id_partido)
    .select()
        
        
        //console.log(HistorialGuardado)
    //console.log(EliminarJugada)
    const ordenMayor: any[] = EliminarJugada?.filter(jugada => jugada.orden > jugadaModificar) || [];

    console.log("Jugadas con orden mayor:", ordenMayor);

    const jugadaAEliminar = EliminarJugada?.find(jugada => jugada.orden === jugadaModificar);

// Verificar si la jugada a eliminar no es de tipo "Error" y es del equipo local
console.log("Datos jugada a eliminar",jugadaAEliminar)
  if (jugadaAEliminar && jugadaAEliminar.id_equipo === 'equipo-local') {
    if(jugadaAEliminar.tipoPunto !== "Error"){
        // Restar 1 a locPuntos de todas las jugadas de orden mayor
        for (const jugada of ordenMayor) {
          // Actualizar locPuntos
          jugada.locPuntos -= 1;

          // Aquí puedes hacer la actualización en la base de datos si es necesario
          const { error: updateError } = await supabaseAdmin
              .from(TablaHistorial)
              .update({ locPuntos: jugada.locPuntos })
              .eq('id_partido', jugada.id_partido)
              .eq('orden', jugada.orden);

          if (updateError) {
              console.log("Error actualizando locPuntos:", updateError);
          }
      }
    } else{
      for (const jugada of ordenMayor) {
        // Actualizar locPuntos
        jugada.visPuntos -= 1;

        // Aquí puedes hacer la actualización en la base de datos si es necesario
        const { error: updateError } = await supabaseAdmin
            .from(TablaHistorial)
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.log("Error actualizando locPuntos:", updateError);
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
            .from(TablaHistorial)
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.log("Error actualizando locPuntos:", updateError);
        }
    }
  } else{
    for (const jugada of ordenMayor) {
      // Actualizar locPuntos
      jugada.locPuntos -= 1;

      // Aquí puedes hacer la actualización en la base de datos si es necesario
      const { error: updateError } = await supabaseAdmin
          .from(TablaHistorial)
          .update({ locPuntos: jugada.locPuntos })
          .eq('id_partido', jugada.id_partido)
          .eq('orden', jugada.orden);

      if (updateError) {
          console.log("Error actualizando locPuntos:", updateError);
      }
  }
  }
    
    console.log(jugadaAEliminar, jugadaAEliminar.tipoPunto, jugadaAEliminar.id_equipo)
  }

  if(jugadaAEliminar.tipoPunto === "FinSet"){
    // Buscar la jugada anterior en la base de datos
    // const { data: jugadaAnterior, error: ErrorJugadaAnterior } = await supabaseAdmin
    // .from('HistorialV')
    // .select('*')
    // .eq('id_partido', id_partido)
    // .lt('orden', jugadaModificar) // Buscar jugadas con orden menor
    // .order('orden', { ascending: false }) // Ordenar de mayor a menor para obtener la más reciente
    // .limit(1) // Limitar a 1 resultado
    // .single(); // Obtener un solo resultado

        // if (ErrorJugadaAnterior) {
        //     console.log("Error buscando la jugada anterior:", ErrorJugadaAnterior);
        // } else if (jugadaAnterior) {
        //     // Eliminar la jugada anterior
        //     const { error: deleteError } = await supabaseAdmin
        //         .from('HistorialV')
        //         .delete()
        //         .eq('id_partido', id_partido)
        //         .eq('orden', jugadaAnterior.orden);

        //     if (deleteError) {
        //         console.log("Error eliminando la jugada anterior:", deleteError);
        //     }
        // }

         }

    const { data,error } = await supabaseAdmin
    .from(TablaHistorial)
    .delete()
    .eq('id_partido', id_partido)
    .eq('orden', jugadaModificar)
        

 

  return new Response(JSON.stringify({ data }), { status: 200 });
}