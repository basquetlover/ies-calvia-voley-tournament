import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {
  const data = await request.json();
  console.log("Datos recibidos en API:",  data );

  if(!data){
    return new Response(JSON.stringify({ok: false, error: {  mensaje: "Falten dades per omplir" } }), { status: 400 });
  }

  const fecha_hoy = new Date().toISOString();
  console.log("Fecha actual", fecha_hoy)
  
const { data: crearNoti, error } = await supabaseAdmin
  .from('Noticis')
  .insert([
    { 
        titular: data.titular,
        subtitulo: data.subtitulo,
        cover_image: data.cover_image,
        slug: data.slug,
        author: data.author,
        author_curso: data.author_curso,
        status: "Public",
        created_at: data.created_at,
        publication_date: fecha_hoy,
        content: data.content,
        tiempo_lectura: data.tiempo_lectura,
        categoria: data.categoria,
        last_save: data.last_save


    },
  ])
  .select()

  if(error){
    console.log(error)
    return new Response(JSON.stringify({ok: false, error: {  mensaje: "Error pujant a la db" } }), { status: 400 });
  }

  console.log(crearNoti)
          

  return new Response(JSON.stringify({ok:true, data: "Edició actualizada correctament"  }), { status: 200 });
}
