import type { APIRoute } from "astro";
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { supabase, supabaseAdmin } from "../../../lib/supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase
import { setSourceMapRange } from "typescript";

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    contraseña: string; // Asegúrate de que este campo sea el correcto
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const politica_cookies = cookies.get("all_cookies");

    if(politica_cookies){
        const formData = await request.formData();
    const nombre = formData.get("nombre_admin")?.toString();
    const password = formData.get("password")?.toString();
    const id_partido = formData.get("id_partido")?.toString();
    
     

    // Validar que se proporcionen nombre y contraseña
    if (!nombre || !password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario y contraseña obligatorios</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    // Consultar el usuario en la base de datos
    let { data: Usuarios, error } = await supabaseAdmin
        .from('Usuarios') // Especifica el tipo aquí
        .select('*')
        .eq('nombre', nombre)
        .single();

    // Manejar el error si el usuario no se encuentra
    if (error || !Usuarios) {
        const { data: UsuariosPorEmail, error: errorEmail } = await supabaseAdmin
                .from('Usuarios')
                .select('*')
                .eq('email', nombre) // Usamos el nombre como email
                .single();

            if (errorEmail || !UsuariosPorEmail) {
                return new Response(
                    `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario no encontrado</div>`,
                    { status: 401, headers: { "Content-Type": "text/html" } }
                );
            }

            Usuarios = UsuariosPorEmail;
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, Usuarios.contraseña);
    if (!isPasswordValid) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario o contraseña inválido</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    const { data: EquipoLocale, error: EquipoLocaleError } = await supabaseAdmin
    .from('PartidosSS')
    .update({
        estado: "En Directe"
    })
    .eq('id_partido', id_partido)
    .single();









    // Redirigir a la página principal
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
    }
    return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">No s'han acceptat les cookies necessàries.</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
    );
    
};