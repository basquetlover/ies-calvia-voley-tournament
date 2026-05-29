import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';



export const POST: APIRoute = async ({ request }) => {
try {
    const { importarID } = await request.json();

    if (!importarID) {
        console.log("Error constantes")
    return new Response(JSON.stringify({ error: 'importarID requerido' }), {
        status: 400
    });
    }

    let { data: Configuracion, error } = await supabaseAdmin
        .from('Configuracion')
        .select('*')
        .eq("id_torneo", importarID)
        .single()

    
    // campos que quieres vaciar
const camposAVaciar = [
  'id',
  'id_torneo',
  'nombre',
  'fecha',
  'in_inicio',
  'in_fin',
  'vo_inicio',
  'vo_fin',
  'fecha_cierre'
];

// crear objeto con mismos campos pero algunos vacíos
const ConfiguracionLimpia = Object.fromEntries(
  Object.entries(Configuracion).map(([key, value]) => [
    key,
    key === 'estado'
      ? 'En Preparació'
      : camposAVaciar.includes(key)
        ? ''
        : value
  ])
);


console.log(ConfiguracionLimpia);


console.log(Configuracion);
    return new Response(JSON.stringify(Configuracion), {
    status: 200,
    headers: { "Content-Type": "application/json" }
    });

    

} catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
    status: 500
    });
}
};