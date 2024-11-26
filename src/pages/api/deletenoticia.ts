import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const id = formData.get("id")?.toString().trim();
  // Insertar los datos en la tabla 'administradores'
  
    const { error } = await supabaseAdmin
    .from('Noticias')
    .delete()
    .eq('id', id)


  if (error) {
    console.error("Error insertando en administradores:", error.message);
    return new Response("Hubo un error al asignar el categoria.", { status: 500 });
  }

  console.log("categoria eliminada correctamente");
  return redirect("/admin/noticias");
};