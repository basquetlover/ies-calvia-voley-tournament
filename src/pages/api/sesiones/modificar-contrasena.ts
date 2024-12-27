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
    const nombre = formData.get("nombre")?.toString();
    const password = formData.get("password")?.toString();
    const nueva_password = formData.get("nueva_password")?.toString();
    const confirmar_password = formData.get("confirmar_password")?.toString();

    // Validar que se proporcionen nombre y contraseña
    if (!password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Introdueix la contrasenya antiga</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }
    if (!nueva_password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Introdueix la nova contrasenya antiga</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }
    if (!confirmar_password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Confirma la nova contrasenya antiga</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    // Consultar el usuario en la base de datos
    const { data: Usuarios, error } = await supabaseAdmin
        .from('Usuarios') // Especifica el tipo aquí
        .select('*')
        .eq('nombre', nombre)
        .single();

    // Manejar el error si el usuario no se encuentra
    if (error || !Usuarios) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario no encontrado</div>`, 
            { status: 401, headers: { "Content-Type": "text/html" } }
        );
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, Usuarios.contraseña);
    if (!isPasswordValid) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Contrasenya invàlida</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    if (nueva_password !== confirmar_password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Les contrasenyes no coincideixen</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    if (nueva_password === password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">La nova contrasenya no pot ser igual que la contrasenya antiga</div>`, 
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
    .eq('id', Usuarios.id)
    .select()

    // Redirigir a la página principal
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
