
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";



export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();



    const id_torneo = formData.get(`id_torneo`)?.toString().trim();
    const nombre = formData.get(`nombre`)?.toString().trim();
    const fecha = formData.get(`fecha`);
    const estado= formData.get(`estado`)?.toString().trim();
    const in_inicio = formData.get(`in_inicio`);
    const in_fin = formData.get(`in_fin`);
    const vo_inicio = formData.get(`vo_inicio`);
    const vo_fin = formData.get(`vo_fin`);
    const min_jugadores = formData.get(`min_jugadores`);
    const max_jugadores = formData.get(`max_jugadores`);
    const min_staff = formData.get(`min_staff`);
    const max_staff = formData.get(`max_staff`);
    const entrenador = formData.get(`entrenador`)?.toString().trim();
    const foto = formData.get(`foto`)?.toString().trim();
    const profesor = formData.get(`profesor`)?.toString().trim();

 
const { data, error } = await supabaseAdmin
  .from('Configuracion')
  .insert({ 
    id_torneo: id_torneo,
    nombre: nombre,
    fecha: fecha,
    estado: estado,
    in_inicio: in_inicio,
    in_fin: in_fin,
    vo_inicio: vo_inicio,
    vo_fin: vo_fin,
    min_jugadores: min_jugadores,
    max_jugadores: max_jugadores,
    min_staff: min_staff,
    max_staff: max_staff,
    entrenador: entrenador,
    profesor: profesor,
    foto: foto


})
  
  .select()
   if(error){
    console.log(error)
 }
 







  console.log("Configuracion guardada correctamente");
return new Response(
      `<div id="respuesta" class="bg-verde-claro  border-3 border-verde text-verde rounded-lg p-2 my-2 flex items-center text-center">Configuracion guardada correctamente</div>`, 
      { status: 201, headers: { "Content-Type": "text/html" } }
  );
//   return new Response(
//     JSON.stringify({ success: true }), 
//     { status: 200, headers: { "Content-Type": "application/json" } }
// );
};
