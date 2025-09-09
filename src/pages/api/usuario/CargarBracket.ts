// src/pages/api/partidos.ts
import { supabaseAdmin } from "../../../lib/supabase";

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
    .from("EquiposSS")
    .select("escudo")
    .eq("nombre_equipo", nombreEquipo)
    .single();

  return error || !data ? "" : data.escudo;
}

export async function POST({ request }: { request: Request }) {
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
        .from("PartidosSS")
        .select(
          "pista, equipo_local, equipo_visitante, LocGlobal, VisGlobal, estado, id_partido"
        )
        .eq("bracket", bracket)
        .single();

      if (!error && partido) {
        const escudoLocal = await fetchEscudo(partido.equipo_local);
        const escudoVis = await fetchEscudo(partido.equipo_visitante);

        resultados.push({
          bracket,
          pista: partido.pista || "Sin Pista",
          equipo_local: partido.equipo_local || "",
          escudo_local: escudoLocal,
          equipo_visitante: partido.equipo_visitante || "",
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