// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre = formData.get("nombre")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const curso = formData.get("curso")?.toString();

  if (!nombre || !email || !password || !curso) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }
  async function hashPassword(password: string) {
    const saltRounds = 10; // Número de rondas de sal recomendado
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  // Esperar el resultado de hashPassword
  const hashedPassword = await hashPassword(password);

    
  const { data, error } = await supabaseAdmin
  .from('Usuarios')
  .insert([
    { nombre: nombre, email: email, contraseña: hashedPassword, curso: curso },
  ])

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/");
};