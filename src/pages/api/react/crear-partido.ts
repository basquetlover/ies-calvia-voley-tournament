import { useEffect, useRef, useState } from "react";
import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
  console.log("TablaPartidos:", TablaPartidos);
export async function POST({ request }: { request: Request }) {
  const { nuevoPartido } = await request.json();
  let partido_id = nuevoPartido.numero;
  let equipo_local = nuevoPartido.equipo_local;
  if(equipo_local === "ganador") equipo_local = `Guanyador P${nuevoPartido.equipo_local_ref}`;
  if(equipo_local === "perdedor") equipo_local = `Perdedor P${nuevoPartido.equipo_local_ref}`;
  if(equipo_local === "equipo") equipo_local = `Equip ${nuevoPartido.equipo_local_ref}`;
  let equipo_visitante = nuevoPartido.equipo_visitante;
  if(equipo_visitante === "ganador") equipo_visitante = `Guanyador P${nuevoPartido.equipo_visitante_ref}`;
  if(equipo_visitante === "perdedor") equipo_visitante = `Perdedor P${nuevoPartido.equipo_visitante_ref}`;
  if(equipo_visitante === "equipo") equipo_visitante = `Equip ${nuevoPartido.equipo_visitante_ref}`;
  let pista = nuevoPartido.pista;
  let estado = nuevoPartido.estado;
  let bracket = nuevoPartido.bracket;
  if(bracket === "Octavos") bracket = `octavos${nuevoPartido.bracket_numero}`;
  if(bracket === "Cuartos") bracket = `quartos${nuevoPartido.bracket_numero}`;
  if(bracket === "Semifinal") bracket = `semi${nuevoPartido.bracket_numero}`;
  if(bracket === "3r i 4t") bracket = `tercer_quarto`;
  if(bracket === "Final") bracket = `final`;
  if(bracket === "Perdedors") bracket = `perdedores`;
  if(bracket === "octavos_2") bracket = `octavo_2`;
  console.log("Creant partit:", nuevoPartido);

const { data, error } = await supabaseAdmin
  .from(TablaPartidos)
  .insert([
    { 
        id_partido: partido_id,
        pista: pista,
        estado: estado,
        equipo_local: equipo_local,
        equipo_visitante: equipo_visitante,
        LocGlobal: "-",
        VisGlobal: "-",
        LocSet1: "-",
        VisSet1: "-",
        LocSet2: "-",
        VisSet2: "-",
        LocSet3: "-",
        VisSet3: "-",
        bracket: bracket
     },
  ])
  .select()

  return new Response(JSON.stringify({ data: "Partit creat correctament"  }), { status: 200 });
}