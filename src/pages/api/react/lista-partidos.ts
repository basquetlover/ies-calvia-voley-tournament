
import { supabaseAdmin } from "src/lib/supabase";

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();
  let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
  console.log("TablaPartidos:", TablaPartidos);

export async function POST({ request }: { request: Request }) {

const { data: ListaPartidos, error } = await supabaseAdmin
  .from(TablaPartidos)
  .select('*')
  .order('id', { ascending: true });
  //console.log("Partidos:", ListaPartidos);
  if(error){
    //console.log("Error al obtener Partidos:", error);
  }

  return new Response(JSON.stringify({ ListaPartidos  }), { status: 200 });
}