import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';



export const POST: APIRoute = async ({ request }) => {
try {
    const { torneoID } = await request.json();

    if (!torneoID) {
        console.log("Error constantes")
    return new Response(JSON.stringify({ error: 'torneoID requerido' }), {
        status: 400
    });
    }

    let { data: Configuracion, error } = await supabaseAdmin
        .from('Configuracion')
        .select('*')
        .eq("id_torneo", torneoID)
        .single()

    
    // respuesta final
    // const respuesta = {
    //     ...Configuracion
    // };

    // console.log(Configuracion)

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