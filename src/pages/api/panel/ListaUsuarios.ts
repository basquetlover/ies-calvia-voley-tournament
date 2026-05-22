import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';



export const POST: APIRoute = async ({ request }) => {
try {

    let { data: Configuracion, error } = await supabaseAdmin
        .from('Usuarios')
        .select('*')
        .eq('estado', "activa")

    
   

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