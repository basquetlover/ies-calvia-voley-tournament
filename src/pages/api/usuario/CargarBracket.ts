// src/pages/api/partidos.ts
import { supabaseAdmin } from "../../../lib/supabase";
  let TablaPartidos = `Partidos`
let TablaEquipos = `Equipos`

interface Partido {
  bracket: string;
  pista: string;
  equipo_local: string;
  escudo_local: string;
  equipo_visitante: string;
  escudo_visitante: string;
  resultado_local: string;
  resultado_visitante: string;
  estado: string;
  numero: string;
}

function traducirPartido(str: string) {
  const match = str?.match(/\d+$/);
  const numero = match ? match[0] : "";
  return `Partit ${numero}`;
}

async function fetchEscudo(nombreEquipo: string): Promise<string> {
  if (!nombreEquipo) return "";
  const { data, error } = await supabaseAdmin
    .from(TablaEquipos)
    .select("escudo")
    .eq("nombre_equipo", nombreEquipo)
    .single();

  return error || !data ? "" : data.escudo;
}

async function fetchSiglas(nombreEquipo: string) {
  if (!nombreEquipo) return "";
  const { data, error } = await supabaseAdmin
    .from(TablaEquipos)
    .select("siglas")
    .eq("nombre_equipo", nombreEquipo)
    .single();

  return error || !data ? "" : data.siglas;
}

async function traducirEquipo(nombre: string) {
  if (!nombre) return "";

  // comprobamos si contiene "guanyador"
  if (nombre.toLowerCase().includes("guanyador")) {
    return "PDT";
  }

  const siglas = await fetchSiglas(nombre);
  
  return siglas;

  //return nombre;
}

export async function POST({ request }: { request: Request }) {


let mes = "true";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, fecha, nombre')
  .eq('estado', 'Actual')
  .single();

  if(ConfTorneo){
    const torneoDate = new Date(ConfTorneo.fecha);
  const today = new Date();

  const mismoMes =
    torneoDate.getMonth() === today.getMonth() &&
    torneoDate.getFullYear() === today.getFullYear();

  if (mismoMes) {
    //console.log(`El torneo actual de este mes es: ${ConfTorneo.nombre}`);
     TablaPartidos = `Partidos${ConfTorneo.id_torneo}`;
    TablaEquipos = `Equipos${ConfTorneo.id_torneo}`;
  } else{
    // console.log(`El torneo actual  ${ConfTorneo.nombre} no es de este mes`);
    mes = "false";
  }
  mes = "true";
   TablaPartidos = `Partidos${ConfTorneo.id_torneo}`;
    TablaEquipos = `Equipos${ConfTorneo.id_torneo}`;
   
  } 
  
  if(!ConfTorneo || error || mes === "false"){
    //Si no hay torneo actual, coger el último finalizado
   const { data: ConfTorneo, error } = await supabaseAdmin
    .from('Configuracion')
    .select('id_torneo, fecha')
    .eq('estado', 'Finalizado')
    .order('fecha', { ascending: false }) // ordenar por fecha más reciente
    .limit(1) // solo el primero
    .single(); // devuelve un solo objeto
    
    if(ConfTorneo){
        TablaPartidos = `Partidos${ConfTorneo.id_torneo}`;
        TablaEquipos = `Equipos${ConfTorneo.id_torneo}`;
    }
  }

  try {
    // todos los brackets que quieres cargar
    const brackets = [
      "octavos_1",
      "octavo_2",
      "octavos_3",
      "octavos_4",
      "octavos_5",
      "octavos_6",
      "octavos_7",
      "octavos_8",
      "quartos_1",
      "quartos_2",
      "quartos_3",
      "quartos_4",
      "semi_1",
      "semi_2",
      "tercer_quarto",
      "final",
    ];

    const resultados: Partido[] = [];

    for (const bracket of brackets) {
      const { data: partido, error } = await supabaseAdmin
        .from(TablaPartidos)
        .select(
          "pista, equipo_local, equipo_visitante, LocGlobal, VisGlobal, estado, id_partido"
        )
        .eq("bracket", bracket)
        .single();

      if (!error && partido) {
        const equipoLocal = await traducirEquipo(partido.equipo_local);
        const equipoVisitante = await traducirEquipo(partido.equipo_visitante);
        const escudoLocal = await fetchEscudo(partido.equipo_local);
        const escudoVis = await fetchEscudo(partido.equipo_visitante);
        const siglasLocal = await fetchSiglas(partido.equipo_local);
        const siglasVis = await fetchSiglas(partido.equipo_visitante);

        resultados.push({
          bracket,
          pista: partido.pista || "Sin Pista",
          equipo_local: equipoLocal,
          escudo_local: escudoLocal,
          equipo_visitante: equipoVisitante,
          escudo_visitante: escudoVis,
          resultado_local: partido.LocGlobal || "-",
          resultado_visitante: partido.VisGlobal || "-",
          estado: partido.estado || "Por Jugar",
          numero: traducirPartido(partido.id_partido),
        });
      }
    }

    return new Response(JSON.stringify(resultados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error en API de partidos:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}