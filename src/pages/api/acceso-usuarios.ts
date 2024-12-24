import { supabaseAdmin } from '../../lib/supabase';
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    
    const accesos = [];
    let index = 0;
    while (formData.has(`id_${index}`)) {
        const id = formData.get(`id_${index}`)?.toString().trim();
        const acceso = formData.get(`acceso_${index}`) === 'true'; // Convertir a booleano
        if (id) {
            accesos.push({ acceso, id });
        }
        index++;
    }

    console.log(accesos); // Esto debería mostrar todos los accesos, tanto true como false
  
    for (const acceso of accesos) {
        const { error: ModificarError } = await supabaseAdmin
            .from('AccesoUsuarios')
            .update({ acceso: acceso.acceso }) // Actualiza el acceso
            .eq("id", acceso.id)
            .select();
    
        if (ModificarError) {
            console.error("Error actualizando acceso:", ModificarError.message);
            // Considera si quieres detener todo el proceso o continuar con los siguientes accesos
        }
    }

    return redirect("/admin/acceso-usuarios");
};