
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";



export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();


   const configuraciones = [];
   let index = 0;
  while (formData.has(`id_torneo_${index}`)) {
    const id_torneo = formData.get(`id_torneo_${index}`)?.toString().trim();
    const nombre = formData.get(`nombre_${index}`)?.toString().trim();
    const fecha = formData.get(`fecha_${index}`);
    const estado= formData.get(`estado_${index}`)?.toString().trim();
    const in_inicio = formData.get(`in_inicio_${index}`);
    const in_fin = formData.get(`in_fin_${index}`);
    const vo_inicio = formData.get(`vo_inicio_${index}`);
    const vo_fin = formData.get(`vo_fin_${index}`);
    const min_jugadores = formData.get(`min_jugadores_${index}`);
    const max_jugadores = formData.get(`max_jugadores_${index}`);
    const min_staff = formData.get(`min_staff_${index}`);
    const max_staff = formData.get(`max_staff_${index}`);
    const entrenador = formData.get(`entrenador_${index}`)?.toString().trim();
    const foto = formData.get(`foto_${index}`)?.toString().trim();
    const profesor = formData.get(`profesor_${index}`)?.toString().trim();
    
    if (nombre?.trim()) {
    configuraciones.push({ id_torneo, nombre, fecha, estado, in_inicio, in_fin, vo_inicio, vo_fin, min_jugadores, max_jugadores, min_staff, max_staff, entrenador, profesor,foto });
  }
    
    
    index++;
  }

  console.log(configuraciones)

 for (const configuracion of configuraciones) {
const { data, error } = await supabaseAdmin
  .from('Configuracion')
  .update({ 
    id_torneo: configuracion.id_torneo,
    nombre: configuracion.nombre,
    fecha: configuracion.fecha,
    estado: configuracion.estado,
    in_inicio: configuracion.in_inicio,
    in_fin: configuracion.in_fin,
    vo_inicio: configuracion.vo_inicio,
    vo_fin: configuracion.vo_fin,
    min_jugadores: configuracion.min_jugadores,
    max_jugadores: configuracion.max_jugadores,
    min_staff: configuracion.min_staff,
    max_staff: configuracion.max_staff,
    entrenador: configuracion.entrenador,
    profesor: configuracion.profesor,
    foto: configuracion.foto


})
  .eq('id_torneo', configuracion.id_torneo)
  .select()
   if(error){
    console.log(error)
 }
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
