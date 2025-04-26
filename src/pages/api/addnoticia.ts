import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre_noticia = formData.get("nombre_noticia")?.toString().trim() || "";
  const categoria = formData.get("categoria")?.toString().trim();
  const fecha = formData.get("fecha")?.toString().trim();
  const cuerpo = formData.get("cuerpo")?.toString().trim();
  function removeAccents(str: string): string  {
    const accents = [
        { base: 'a', letters: /[áàäâ]/g },
        { base: 'e', letters: /[éèëê]/g },
        { base: 'i', letters: /[íìïî]/g },
        { base: 'o', letters: /[óòöô]/g },
        { base: 'u', letters: /[úùüû]/g },
        { base: 'n', letters: /[ñ]/g },
    ];

    accents.forEach(accent => {
        str = str.replace(accent.letters, accent.base);
    });

    return str;
}
  let id_noticia = nombre_noticia.toLowerCase().replace(/\s+/g, '-');
  id_noticia = removeAccents(id_noticia)
  
  // Recoger la información del escudo (imagen)
  const imagen_noticia = formData.get("imagen_noticia") as File;
  console.log("Tipo de archivo:", imagen_noticia.name);
  console.log("Tipo de archivo:", imagen_noticia.type);
  console.log("Tamaño de archivo:", imagen_noticia.size);


  if (!nombre_noticia || !categoria) {
    return new Response("Correo electrónico y categoria son obligatorios", { status: 400 });
  }

  console.log("Datos recibidos:", { nombre_noticia, categoria });

  // Verificar si el correo electrónico ya existe en la tabla 'administradores'
  const { data: existingAdmins, error: checkError } = await supabaseAdmin
  .from("Noticias")
  .select("id") // Seleccionar un campo mínimo
  .eq("titulo", nombre_noticia);

if (checkError) {
  console.error("Error al verificar la existencia:", checkError.message);
  return new Response("Hubo un error al verificar el correo electrónico.", { status: 500 });
}

console.log(cuerpo)

async function uploadFile(file: File, id_noticia: string) {
    
  
  const extension = file.name.split('.').pop(); // Obtiene la extensión
  const sanitizedId = removeAccents(id_noticia); // Elimina acentos del id_noticia
  const uniqueFileName = `${sanitizedId}.${extension}`;
    const filePath = `${uniqueFileName}`; // Define la ruta del archivo
  
    const { data, error } = await supabaseAdmin.storage
        .from('NoticiasIMG')
        .upload(filePath, file); // Sube el archivo
  
    if (error) {
        console.error("Error al subir imagen:", error.message);
        //throw new Error("Error al subir imagen.");
    }
  if(data){
    console.log("Imagen subida correctamente:", data.path);
    
  }
  return filePath; // Devuelve la ruta del archivo
  }
  
  // Llama a la función para subir el imagen_noticia
  const imagen_noticiaPath = await uploadFile(imagen_noticia, id_noticia);
  
  // Obtener la URL pública del imagen_noticia subido
  const { data: urlData } = supabaseAdmin.storage
      .from('NoticiasIMG')
      .getPublicUrl(imagen_noticiaPath); // Usa el imagen_noticiaPath que se generó al subir el archivo
  
  // Verifica si urlData contiene la propiedad publicUrl
  if (!urlData || !urlData.publicUrl) {
      console.error("No se pudo obtener la URL pública del imagen_noticia.");
      //return new Response("Hubo un error al procesar el imagen_noticia.", { status: 500 });
  }
  
  // Ahora puedes usar urlData.publicUrl para insertar en la base de datos
  const publicUrl = urlData.publicUrl;
  console.log("URL pública del imagen_noticia:", publicUrl);


if (existingAdmins && existingAdmins.length > 0) {
  // return new Response("El usuario ya tiene un categoria asignado.", { status: 400 });
  console.log("El usuario ya tiene un categoria asignado.")
}

 // Insertar los datos en la tabla 'administradores'
  const { error: adminError } = await supabaseAdmin
    .from("Noticias")
    .insert([
      {
        titulo: nombre_noticia,
        id_noticia: id_noticia,
        category: categoria,
        fecha: fecha,
        contenido: cuerpo,
        imagen_noticia: publicUrl
      },
    ]);

  if (adminError) {
    console.error("Error insertando en administradores:", adminError.message);
    return new Response("Hubo un error al asignar el categoria.", { status: 500 });
  }

  console.log("categoria asignado correctamente");
  return redirect("/admin/noticias");
};