import type { APIRoute } from "astro";
import bcrypt from 'bcrypt';

import {  supabaseAdmin } from "../../../lib/supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase
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

  if (!nombre || !password) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }

  const { data: Usuarios, error } = await supabaseAdmin
    .from('Usuarios') // Especifica el tipo aquí
    .select('*')
    .eq('nombre', nombre)
    .single();

  if (error || !Usuarios) {
    return new Response("Usuario no encontrado", { status: 401 });
  }
 if(Usuarios){
  const isPasswordValid = await bcrypt.compare(password, Usuarios.contraseña);

    if (isPasswordValid) {
  cookies.set('session', Usuarios.id, { httpOnly: true, path: '/' });
}else{
  
  return new Response("Usuario o contraseña invalido", { status: 400 });
}
}
  return redirect("/");
};
