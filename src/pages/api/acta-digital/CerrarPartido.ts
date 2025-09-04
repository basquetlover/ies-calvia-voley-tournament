import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

export async function POST({ request }: { request: Request }) {
  const {id_partido, nombreEquipoLocal, nombreEquipoVisitante, LocSets, VisSets } = await request.json();
    console.log(id_partido, nombreEquipoLocal, nombreEquipoVisitante, LocSets, VisSets)

    let id_equipoG = "";
    let id_equipoP = "";

    if(LocSets > VisSets){
        id_equipoG = nombreEquipoLocal;
        id_equipoP = nombreEquipoVisitante;
    } else if(VisSets > LocSets){
        id_equipoP = nombreEquipoLocal;
        id_equipoG = nombreEquipoVisitante;
    }
    console.log("Equipo Ganador:", id_equipoG)
    console.log("Equipo Perdedor:", id_equipoP)

    //const id_equipo = 'partido_38'; // Cambia esto al ID que necesites
    
    // Función para extraer el número del ID
    function extractPartidoNumber(id: string) {
        // Usamos una expresión regular para capturar el número
        const match = id.match(/partido_(\d+)/);
        return match ? match[1] : null; // Retorna el número o null si no hay coincidencia
    }
    const numero_partido = extractPartidoNumber(id_partido);
    console.log(`El número extraído de ${id_partido} es: ${numero_partido}`);

    const equipoGanadorBuscado = `Guanyador P${numero_partido}`;
    const equipoPerdedorBuscado = `Perdedor P${numero_partido}`;
    console.log(equipoGanadorBuscado, equipoPerdedorBuscado)
    //Actualizar CLasificacion Equipo Ganador
    const { data: GanadorLocal, error: EGanadorLocal } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_local', equipoGanadorBuscado)
        .single();
        if(GanadorLocal){
            const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_local: id_equipoG })
            .eq('id_partido', GanadorLocal.id_partido)
            .select()
        }
    const { data: GanadorVisitante, error: EGanadorVisitante } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_visitante', equipoGanadorBuscado)
        .single();
        if(GanadorVisitante){
            const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_visitante: id_equipoG })
            .eq('id_partido', GanadorVisitante.id_partido)
            .select()
        }

        //Actualizar CLasificacion Equipo Perdedor
    const { data: PerdedorLocal, error: EPerdedorLocal } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_local', equipoPerdedorBuscado)
        .single();
        if(PerdedorLocal){
            const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_local: id_equipoP })
            .eq('id_partido', PerdedorLocal.id_partido)
            .select()
        }
    const { data: PerdedorVisitante, error: EPerdedorVisitante } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_visitante', equipoPerdedorBuscado)
        .single();
        if(PerdedorVisitante){
            const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_visitante: id_equipoP })
            .eq('id_partido', PerdedorVisitante.id_partido)
            .select()
        }
    
                const { data, error } = await supabaseAdmin
        .from('PartidosSS')
        .update({ 
          estado: 'Finalitzat',
          LocGlobal: LocSets,
          VisGlobal: VisSets,
        
        })
        .eq('id_partido', id_partido)
        .select()


  return new Response(JSON.stringify({ data: "Completado" }), { status: 200 });
}