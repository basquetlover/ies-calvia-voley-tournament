// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre = formData.get("nombre")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString() || "contraseña-no-cambiada";
  const curso = formData.get("curso")?.toString();
  const id = formData.get("id")?.toString();
  const fecha = Date.now();

  if (!nombre || !email || !curso) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }
  async function hashPassword(password: string) {
    const saltRounds = 10; // Número de rondas de sal recomendado
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  // Esperar el resultado de hashPassword
  const hashedPassword = await hashPassword(password);
  console.log(nombre, email, password, curso, id)

    if(password !== "contraseña-no-cambiada"){
      const { data } = await supabaseAdmin
      .from('Usuarios')
      .update({ contraseña: hashedPassword })
      .eq('id', id)
      .select()
    }
  const { data, error } = await supabaseAdmin
  .from('Usuarios')
  .update([
    { nombre: nombre, email: email, curso: curso, staff: fecha },
  ])
    .eq('id', id)
    .select()

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/admin/acceso-usuarios");
};