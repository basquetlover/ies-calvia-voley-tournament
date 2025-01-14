
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const destinatario = formData.get("destinatario")?.toString().trim() || "";
  const asunto = formData.get("asunto")?.toString().trim() || "";
  const codigo_html = formData.get("codigo_html")?.toString().trim() || "";
  const usuario_curso = formData.get("usuario_curso")?.toString().trim() || "";
  const usuario_id = formData.get("usuario_id")?.toString().trim() || "";
  const capitan = formData.get("capitan")?.toString().trim();



const resend = new Resend(import.meta.env.RESEND_API_KEY);


try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [destinatario], // Asegúrate de que esta variable tenga el valor correcto
    subject: `${asunto}`,
    html: codigo_html,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
  const { data: Emails, error: EmailsError } = await supabaseAdmin
  .from('Emails')
  .insert([
    { destinatario: destinatario, asunto: asunto, contenido: codigo_html, id_resend: data?.id },
  ])
  .select()
} catch (error) {
  console.error("Error al enviar el correo:", error);
}
  

// try {
//   send: defineAction({
//     accept: 'form',
//     handler: async () => {
//       const { data, error } = await resend.emails.send({
//         from: 'IES Calvià Voley Tournament <onboarding@resend.dev>',
//         to: [usuario_email],
//         subject: `Inscripció Realitzada de ${nombre_equipo}`,
//         html: emailContent,
//       });

//       if (error) {
//         throw new ActionError({
//           code: 'BAD_REQUEST',
//           message: error.message,
//         });
//       }

//       return data;
//     },
//   }),
//   console.log("Correo enviado correctamente");
// } catch (error) {
//   console.error("Error al enviar el correo:");
// }

  return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
};
