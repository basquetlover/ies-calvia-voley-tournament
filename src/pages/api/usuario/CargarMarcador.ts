import { supabaseAdmin } from "src/lib/supabase";

// 👉 pequeña utilidad para devolver la última jugada de un partido
async function getUltimaJugada(id_partido: number | string) {
  const { data, error } = await supabaseAdmin
    .from("HistorialV")
    .select(
      "locPuntos, visPuntos"
    )
    .eq("id_partido", id_partido)
    .order("id", { ascending: false }) // la última jugada queda primera
    .limit(1); // solo necesitamos una
    //console.log(data)
  if (error) throw error;
  return data?.[0] ?? null; // si no hay jugadas, null
}

async function fetchEscudo(nombreEquipo: string): Promise<string> {
  if (!nombreEquipo) return "";
  const { data, error } = await supabaseAdmin
    .from("EquiposSS")
    .select("escudo")
    .eq("nombre_equipo", nombreEquipo)
    .single();

  return error || !data ? "" : data.escudo;
}

export async function POST({ request }: { request: Request }) {


  try {
    const { data: partidos, error } = await supabaseAdmin
      .from("PartidosSS")
      .select(`
        id_partido,
        equipo_local,
        equipo_visitante,
        estado,
        pista,
        LocGlobal, VisGlobal,
        LocSet1, VisSet1,
        LocSet2, VisSet2,
        LocSet3, VisSet3
      `)
      .eq("estado", "En Directe");

    if (error) throw error;



    const resultado = await Promise.all(
      partidos.map(async (p) => {
      
        const ultimaJugada = await getUltimaJugada(p.id_partido);

      // 🔎 Determinar set actual según los campos
      if(p.LocGlobal === "-"){
        p.LocGlobal = 0
      }
      if(p.VisGlobal === "-"){
        p.VisGlobal = 0
      }
      let setActual = 0;
      setActual = Number(p.LocGlobal) + Number(p.VisGlobal) + 1
    //   if (p.LocSet1 && p.VisSet1 && Number(p.LocSet1) >= 0 && Number(p.VisSet1) >= 0) setActual = 2;
    //   if (p.LocSet2 && p.VisSet2 && Number(p.LocSet2) >= 0 && Number(p.VisSet2) >= 0) setActual = 3;
        let LocSet1 = p.LocSet1
        let LocSet2 = p.LocSet2
        let LocSet3 = p.LocSet3
        let VisSet1 = p.VisSet1
        let VisSet2 = p.VisSet2
        let VisSet3 = p.VisSet3
        if (ultimaJugada) {
            //console.log("Ultima jugada: ",ultimaJugada)
            if(setActual === 1){
                LocSet1 = ultimaJugada.locPuntos
                VisSet1 = ultimaJugada.visPuntos
            } else if(setActual === 2){
                LocSet2 = ultimaJugada.locPuntos
                VisSet2 = ultimaJugada.visPuntos
            }
            if(setActual === 3){
                LocSet3 = ultimaJugada.locPuntos
                VisSet3 = ultimaJugada.visPuntos
            }
        }
        const escudoLocal = await fetchEscudo(p.equipo_local);
        const escudoVis = await fetchEscudo(p.equipo_visitante);

      return {
        id_partido: p.id_partido,
        estado: p.estado,
        equipo_local: p.equipo_local,
        escudo_equipo_local: escudoLocal,
        equipo_visitante: p.equipo_visitante,
        escudo_equipo_visitante: escudoVis,
        pista: p.pista,
        setActual, // nuevo campo
        marcador: {
          global: { local: p.LocGlobal, visitante: p.VisGlobal },
          set1: { local: LocSet1, visitante: VisSet1 },
          set2: { local: LocSet2, visitante: VisSet2 },
          set3: { local: LocSet3, visitante: VisSet3 },
        },
              };
      })
    );

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