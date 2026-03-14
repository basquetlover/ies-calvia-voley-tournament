import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();

let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
let TablaEquipos = `Equipos${ConfTorneo?.id_torneo}`;
//console.log("TablaPartidos:", TablaPartidos);

export async function POST({ request }: { request: Request }) {

  // 1️⃣ Obtener partidos
  const { data: ListaPartidos, error } = await supabaseAdmin
    .from(TablaPartidos)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log("Error al obtener Partidos:", error);
  }

  if (!ListaPartidos) {
    return new Response(JSON.stringify({ ListaPartidos: [] }), { status: 200 });
  }

  // 2️⃣ Obtener todos los equipos con su escudo
  const { data: Equipos, error: errorEquipos } = await supabaseAdmin
    .from(TablaEquipos)
    .select('nombre_equipo, escudo');

  if (errorEquipos) {
    console.log("Error al obtener equipos:", errorEquipos);
  }

  // 3️⃣ Crear mapa nombre -> escudo
  const mapaEscudos: Record<string, string> = {};

  Equipos?.forEach((equipo) => {
    mapaEscudos[equipo.nombre_equipo] = equipo.escudo;
  });

  // 4️⃣ Añadir escudos a los partidos
  const PartidosConEscudos = ListaPartidos.map((partido: any) => ({
    ...partido,
    escudo_local: mapaEscudos[partido.equipo_local] || null,
    escudo_visitante: mapaEscudos[partido.equipo_visitante] || null
  }));

  // const { data: ListaPartidos2, error: error2 } = await supabaseAdmin
  //   .from(TablaPartidos)
  //   .select('id_partido, equipo_local, equipo_visitante, pista, jornada')
  //   .order('id', { ascending: true });
  //console.log("Partidos con escudos:", PartidosConEscudos);
 // console.log("Lista Partidos", ListaPartidos2);
  return new Response(
    JSON.stringify({ ListaPartidos: PartidosConEscudos }),
    { status: 200 }
  );
}