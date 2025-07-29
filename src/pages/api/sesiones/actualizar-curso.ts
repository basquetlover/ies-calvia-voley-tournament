import type { APIRoute } from "astro";
import bcrypt from 'bcrypt';
import { supabaseAdmin } from "../../../lib/supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    contraseña: string; // Asegúrate de que este campo sea el correcto
}

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    let anyo_actual = formData.get("anyo_actual")?.toString();
    const id_usuario = formData.get("id_usuario")?.toString();
    const nuevo_curso = formData.get("nuevo_curso")?.toString();


    // Validar que se proporcionen nombre y contraseña
    if (!id_usuario) {
        return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">No s'ha trobat cap usuari.</p>
        </div>
          `, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    if (!nuevo_curso) {
        return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">No s'ha indicat el nou curs</p>
        </div>
          `, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    if(!anyo_actual){
        function obtenerAñosEscolares(fecha = new Date()) {
        const año = fecha.getFullYear();
        const mes = fecha.getMonth(); // enero = 0, diciembre = 11

        let inicio;
        if (mes >= 8) {
            // Si estamos en septiembre (8) o después, el curso actual empieza este año
            inicio = año;
        } else {
            // Si estamos antes de septiembre, el curso actual empezó el año anterior
            inicio = año - 1;
        }

        const actual = `${inicio}-${inicio + 1}`;
        //   const pasado = `${inicio - 1}-${inicio}`;
        const proximo = `${inicio + 1}-${inicio + 2}`;

        return actual;
        }

        anyo_actual = obtenerAñosEscolares();
    }
    
    
      // Esperar el resultado de hashPassword
     
    const { data } = await supabaseAdmin
    .from('Usuarios')
    .update({ curso:  nuevo_curso, anyo: anyo_actual})
    .eq('id', id_usuario)
    .select()

    // Redirigir a la página principal
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
