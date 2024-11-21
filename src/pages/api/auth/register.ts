// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }

    // Verificar si ya existe un usuario con este email
    const { data: existingUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (fetchError) {
      return new Response(`Error al comprobar el usuario: ${fetchError.message}`, { status: 500 });
    }
  
    if (existingUser) {
      return new Response("El usuario ya existe", { status: 409 }); // Código de conflicto
    }
    
  const { error } = await supabaseAdmin.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/admin/lista-administradores");
};