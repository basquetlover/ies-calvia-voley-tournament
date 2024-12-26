import { supabaseAdmin } from '../../lib/supabase';
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    
    const pagina_nueva= formData.get(`pagina_nueva`)?.toString().trim();
    const acceso_nuevo = formData.get(`acceso_nuevo`) === 'true';

     // Esto debería mostrar todos los accesos, tanto true como false
    if(!pagina_nueva){
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">URL de la pagina necesaria</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }
    
    
        const { error: ModificarError } = await supabaseAdmin
            .from('AccesoUsuarios')
            .insert([
                { pagina: pagina_nueva, acceso: acceso_nuevo },
                
              ])
              .select()
            
    
        if (ModificarError) {
            console.error("Error actualizando acceso:", ModificarError.message);
            // Considera si quieres detener todo el proceso o continuar con los siguientes accesos
        }
    

        return new Response(
            JSON.stringify({ success: true }), 
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
};