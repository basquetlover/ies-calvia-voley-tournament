// import {  supabaseAdmin } from "src/lib/supabase";
// import type { APIContext } from "astro";

// export async function get(context: APIContext) {
//     try {
//       const { data: Usuarios, error } = await supabaseAdmin
//         .from("Usuarios")
//         .select("nombre");
  
//       if (error) {
//         return new Response(
//           JSON.stringify({ error: "Error al obtener los usuarios" }),
//           { status: 500, headers: { "Content-Type": "application/json" } }
//         );
//       }
//       console.log("Usuarios obtenidos:", Usuarios); 
//       return new Response(JSON.stringify({ usuarios: Usuarios }), {
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (err) {
//       return new Response(
//         JSON.stringify({ error: "Error inesperado al procesar la solicitud" }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }
// }