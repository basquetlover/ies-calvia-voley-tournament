import { supabaseAdmin } from "src/lib/supabase";
const { data: torneo, error: errorTorneos } = await supabaseAdmin
  .from('Configuracion')
  .select('in_inicio, in_fin, id_torneo')
  .eq('estado', 'Actual')
  .single();
  
  const TablaHistorial = `Historial${torneo?.id_torneo}`
  const TablaEquipos = `Equipos${torneo?.id_torneo}`
  const TablaPartidos = `Partidos${torneo?.id_torneo}`
  console.log(TablaPartidos)
// 🔹 utilidad: última jugada
async function getUltimaJugada(id_partido: number | string) {
  const { data, error } = await supabaseAdmin
    .from(TablaHistorial)
    .select("locPuntos, visPuntos")
    .eq("id_partido", id_partido)
    .order("id", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

// 🔹 utilidad: escudo de un equipo
async function fetchEscudo(nombreEquipo: string): Promise<string> {
  if (!nombreEquipo) return "";
  const { data, error } = await supabaseAdmin
    .from(TablaEquipos)
    .select("escudo")
    .eq("nombre_equipo", nombreEquipo)
    .single();

  return error || !data ? "" : data.escudo;
}

// 🔹 función para adaptar un partido a JSON básico
async function mapPartidoBasico(p: any) {
  return {
    id_partido: p.id_partido,
    equipo_local: p.equipo_local,
    escudo_equipo_local: await fetchEscudo(p.equipo_local),
    equipo_visitante: p.equipo_visitante,
    escudo_equipo_visitante: await fetchEscudo(p.equipo_visitante),
  };
}

// 🔹 función para adaptar un partido en directo (con sets y última jugada)
async function mapPartidoEnDirecte(p: any) {
  const ultimaJugada = await getUltimaJugada(p.id_partido);

  // Ajustar global a 0 si viene "-"
  if (p.LocGlobal === "-") p.LocGlobal = 0;
  if (p.VisGlobal === "-") p.VisGlobal = 0;

  // Set actual
  const setActual = Number(p.LocGlobal) + Number(p.VisGlobal) + 1;

  let LocSet1 = p.LocSet1,
    LocSet2 = p.LocSet2,
    LocSet3 = p.LocSet3,
    VisSet1 = p.VisSet1,
    VisSet2 = p.VisSet2,
    VisSet3 = p.VisSet3;

  if (ultimaJugada) {
    if (setActual === 1) {
      LocSet1 = ultimaJugada.locPuntos;
      VisSet1 = ultimaJugada.visPuntos;
    } else if (setActual === 2) {
      LocSet2 = ultimaJugada.locPuntos;
      VisSet2 = ultimaJugada.visPuntos;
    } else if (setActual === 3) {
      LocSet3 = ultimaJugada.locPuntos;
      VisSet3 = ultimaJugada.visPuntos;
    }
  }
  let tipo = "";
        const bracket = p.bracket?.toLowerCase() ?? "";
        if (bracket.includes("octavo")) tipo = "Octaus";
        else if (bracket.includes("quartos")) tipo = "Quarts";
        else if (bracket.includes("semi")) tipo = "Semifinal";
        else if (bracket.includes("tercer")) tipo = "3/4 Puesto";
        else if (bracket.includes("final")) tipo = "Final";
        else tipo = "Perdedors";

  return {
    id_partido: p.id_partido,
    estado: p.estado,
    tipo,
    equipo_local: p.equipo_local,
    escudo_equipo_local: await fetchEscudo(p.equipo_local),
    equipo_visitante: p.equipo_visitante,
    escudo_equipo_visitante: await fetchEscudo(p.equipo_visitante),
    setActual,
    marcador: {
      global: { local: p.LocGlobal, visitante: p.VisGlobal },
      set1: { local: LocSet1, visitante: VisSet1 },
      set2: { local: LocSet2, visitante: VisSet2 },
      set3: { local: LocSet3, visitante: VisSet3 },
    },
  };
}

export async function POST({ request }: { request: Request }) {
  try {
    // ⚙️ 1. Partidos en directo
    const { data: enDirecto, error: errDirecto } = await supabaseAdmin
      .from(TablaPartidos)
      .select(
        `id_partido, equipo_local, equipo_visitante, estado, pista,
         LocGlobal, VisGlobal, LocSet1, VisSet1, LocSet2, VisSet2, LocSet3, VisSet3, bracket`
      )
      .eq("estado", "En Directe");

    if (errDirecto) throw errDirecto;

    // ⚙️ 2. Próximos (sin empezar) – adapta condición según tu tabla
    const { data: proximos, error: errProximos } = await supabaseAdmin
      .from(TablaPartidos)
      .select(`id_partido, equipo_local, equipo_visitante, pista, estado, bracket, jornada`)
      .eq("estado", "Per Jugar") // ajusta a tu esquema
      .order("jornada", { ascending: true }); // o por id si no tienes hora

    if (errProximos) throw errProximos;

    // 🔹 pistas que vamos a devolver
    const pistas = ["Pista 1", "Pista 2", "Pista Central"];

    const bruto = await Promise.all(
  pistas.map(async (nombrePista) => {
    let partidoEnDirecte = null;

    if (nombrePista === "Pista Central") {
      // Mostrar Pista Central si alguna semifinal está en directo
      const semiEnDirecte = enDirecto.find(
        (p) => p.bracket === "semi_1" || p.bracket === "semi_2"
      );
      if (semiEnDirecte) {
        partidoEnDirecte = null; // no hay partido en directo real en Pista Central
      }
    } else {
      // Pistas normales: cualquier partido en directo
      partidoEnDirecte = enDirecto.find((p) => p.pista === nombrePista);
    }

    const proxs = proximos
      .filter((p) => p.pista === nombrePista)
      .slice(0, 2);

        const proximosConTipo = await Promise.all(
        proxs.map(async (p) => {
        const partido = await mapPartidoBasico(p);
        let tipo = "";
        const bracket = p.bracket?.toLowerCase() ?? "";
        if (bracket.includes("octavo")) tipo = "Octaus";
        else if (bracket.includes("quartos")) tipo = "Quarts";
        else if (bracket.includes("semi")) tipo = "Semifinal";
        else if (bracket.includes("tercer")) tipo = "3/4 Puesto";
        else if (bracket.includes("final")) tipo = "Final";
        else tipo = "Perdedors";

        return { ...partido, tipo };
      })
    );

    return {
      pista: nombrePista,
      enDirecte: partidoEnDirecte
        ? await mapPartidoEnDirecte(partidoEnDirecte)
        : null,
      proximos: proximosConTipo,
      mostrar: nombrePista !== "Pista Central" || (nombrePista === "Pista Central" && enDirecto.some(p => p.bracket === "semi_1" || p.bracket === "semi_2"))
    };
  })
);

// Filtrar para mostrar solo pistas que cumplan la condición
const resultado = bruto.filter((p) => p.enDirecte || p.mostrar);

//console.log("Resultado API de partidos:", resultado);

   return new Response(JSON.stringify(resultado), {
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


// const resultado: {
//     pista: string;
//     enDirecte: {
//         id_partido: any;
//         estado: any;
//         tipo: string;
//         equipo_local: any;
//         escudo_equipo_local: string;
//         equipo_visitante: any;
//         escudo_equipo_visitante: string;
//         setActual: number;
//         marcador: {
//             global: {
//                 local: any;
//                 visitante: any;
//             };
//             set1: {
//                 local: any;
//                 visitante: any;
//             };
//             set2: {
//                 local: any;
//                 visitante: any;
//             };
//             set3: {
//                 local: any;
//                 visitante: any;
//             };
//         };
//     } | null;
//     proximos: {
//         tipo: string;
//         id_partido: any;
//         equipo_local: any;
//         escudo_equipo_local: string;
//         equipo_visitante: any;
//         escudo_equipo_visitante: string;
//     }[];
//     mostrar: boolean;
// }[]