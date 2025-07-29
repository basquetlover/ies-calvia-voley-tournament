import type { APIRoute } from "astro";
import bcrypt from 'bcrypt';
import { supabaseAdmin } from "../../../lib/supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    contraseña: string; // Asegúrate de que este campo sea el correcto
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
     const referencia_id = formData.get("referencia_id")?.toString();
    const nueva_password = formData.get("nueva_password")?.toString();
    const confirmar_password = formData.get("confirmar_password")?.toString();

    
    // Validar que se proporcionen nombre y contraseña
   const { data: Usuario } = await supabaseAdmin
    .from('Usuarios')
    .select("*")
    .eq('reestablecer_id', referencia_id)
    .single();
    console.log(Usuario)

    if(!referencia_id || !Usuario){
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
    const horaActual = Date.now();
    if((Number(horaActual) - Number(Usuario.reestablecer_hora)) > (30 * 60 * 1000)){
        
         return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Ha caducat l'enllaç.</p>
        </div>
          `, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
    } 



    if (!nueva_password) {
            return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Introdueix la nova contrasenya</p>
        </div>
          `,  
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }
    if (!confirmar_password) {
        return new Response(
            `
            <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Confirma la nova contrasenya antiga</p>
        </div>
            `, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

   

    // Validar la contraseña
   

    if (nueva_password !== confirmar_password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Les contrasenyes no coincideixen</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    

    // Si la contraseña es válida, establecer la cookie de sesión
    async function hashPassword(password: string) {
        const saltRounds = 10; // Número de rondas de sal recomendado
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      }
    
      // Esperar el resultado de hashPassword
       const hashedPassword = await hashPassword(nueva_password);
    const { data } = await supabaseAdmin
    .from('Usuarios')
    .update({ contraseña: hashedPassword })
    .eq('id', Usuario.id)
    .select()

    // Redirigir a la página principal
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
