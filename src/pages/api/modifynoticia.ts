import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre_noticia = formData.get("nombre_noticia")?.toString().trim() || "";
  const id = formData.get("id")?.toString().trim();
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

  const { data: equipoData, error } = await supabaseAdmin
  .from('Noticias')
  .select('titulo, imagen_noticia, id, category, fecha, contenido')
  .eq('id', id) // Asegúrate de que id_equipo tenga el valor correcto
  .single();

  if (error) {
    console.error(`Error al buscar noticia:`, error.message);
    return new Response("Error al buscar equipo.", { status: 500 });
  }
  
  if (!equipoData) {
    console.error(`No se encontró ningún equipo con id_equipo: ${id_noticia}`);
    return new Response("Equipo no encontrado.", { status: 404 });
  }
  
  // Recoger la información del escudo (imagen)
  const imagen_noticia = formData.get("imagen_noticia") as File;
  console.log("Tipo de archivo:", imagen_noticia.name);
  console.log("Tipo de archivo:", imagen_noticia.type);
  console.log("Tamaño de archivo:", imagen_noticia.size);
//   const { data: equipoData, error } = await supabaseAdmin
//   .from('Equipos')
//   .select('nombre_equipo, id, capitan, entrenador, escudo')
//   .eq('nombre_noticia', nombre_noticia) // Asegúrate de que id_equipo tenga el valor correcto
//   .single();


// if (error) {
//   console.error(`Error al buscar equipo:`, error.message);
//   return new Response("Error al buscar equipo.", { status: 500 });
// }

// if (!equipoData) {
//   console.error(`No se encontró ningún equipo con id_equipo: ${id_equipo}`);
//   return new Response("Equipo no encontrado.", { status: 404 });
// }
// const id = equipoData.id;

  console.log("ID del equipo:", id);
  // Recoger la información del escudo (imagen)
  // Recoger la información de los jugadores
  
  console.log("Datos recibidos:", { id, nombre_noticia });
  console.log("Datos recibidos:", {id_noticia, nombre_noticia, categoria, fecha, cuerpo });

// }

//actualizar escudo
// async function uploadFile(file: File, id_equipo: string) {
//     const extension = file.name.split('.').pop();
//     const uniqueFileName = `${id_equipo}_${Date.now()}.${extension}`;
//     const filePath = `${uniqueFileName}png`;
   
  
//     const { data, error } = await supabaseAdmin.storage
//         .from('NoticiasIMG')
//         .upload(filePath, file); // Sube el archivo
  
//     if (error) {
//         console.error("Error al subir imagen:", error.message);
//         throw new Error("Error al subir imagen.");
//     }
  
//     console.log("Imagen subida correctamente:", data.path);
//     return filePath; // Devuelve la ruta del archivo
//   }
  
//   // Llama a la función para subir el imagen_noticia
//   const imagen_noticiaPath = await uploadFile(imagen_noticia, id_noticia);
  
//   // Obtener la URL pública del imagen_noticia subido
//   const { data: urlData } = supabaseAdmin.storage
//       .from('NoticiasIMG')
//       .getPublicUrl(imagen_noticiaPath); // Usa el imagen_noticiaPath que se generó al subir el archivo
  
//   // Verifica si urlData contiene la propiedad publicUrl
//   if (!urlData || !urlData.publicUrl) {
//       console.error("No se pudo obtener la URL pública del imagen_noticia.");
//       return new Response("Hubo un error al procesar el imagen_noticia.", { status: 500 });
//   }
  
//   // Ahora puedes usar urlData.publicUrl para insertar en la base de datos
//   const publicUrl = urlData.publicUrl;
async function uploadFile(file: File, id_equipo: string) {
    const extension = file.name.split('.').pop();
    const uniqueFileName = `${id_equipo}_${Date.now()}.${extension}`;
    const filePath = `escudos/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from('EquiposIMG')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Error al subir imagen:", error.message);
      throw new Error("Error al subir imagen.");
    }

    console.log("Imagen subida correctamente:", data.path);
    return filePath;
  }
 // Mantener la URL existente por defecto
 let publicUrl = equipoData.imagen_noticia;
  if (imagen_noticia.size > 0) {
    try {
      const escudoPath = await uploadFile(imagen_noticia, id_noticia);
      const { data: urlData } = supabaseAdmin.storage
        .from('EquiposIMG')
        .getPublicUrl(escudoPath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error("No se pudo obtener la URL pública del escudo.");
      }

         publicUrl = urlData.publicUrl;
      console.log("Nueva URL pública del escudo:", publicUrl);
    } catch (error) {
      console.error("Error al procesar el escudo:", error);
      return new Response("Hubo un error al procesar el escudo.", { status: 500 });
    }
  }

    // const escudoPath = await uploadFile(escudo, id_equipo);

    // // Obtener la URL pública del escudo subido
    // const { data: urlData } = supabaseAdmin.storage
    //     .from('EquiposIMG')
    //     .getPublicUrl(escudoPath); // Usa el escudoPath que se generó al subir el archivo
    
    // // Verifica si urlData contiene la propiedad publicUrl
    // if (!urlData || !urlData.publicUrl) {
    //     console.error("No se pudo obtener la URL pública del escudo.");
    //     return new Response("Hubo un error al procesar el escudo.", { status: 500 });
    // }
  
  // Ahora puedes usar urlData.publicUrl para insertar en la base de datos
//   const publicUrl = urlData.publicUrl;

  console.log("URL pública del escudo:", publicUrl);


  console.log("URL pública del imagen_noticia:", publicUrl);

  //Insertar los datos en la tabla 'administradores'
   const { error: adminError } = await supabaseAdmin
     .from('Noticias')
     .update({ 
        titulo: nombre_noticia,
        id_noticia: id_noticia,
        category: categoria,
        fecha: fecha,
        contenido: cuerpo,
        imagen_noticia: publicUrl
     })
     .eq("id", id)
     .select();
    

   if (adminError) {
     console.error("Error insertando en administradores:", adminError.message);
     return new Response("Hubo un error al asignar el rango.", { status: 500 });
   }

  

  console.log("Noticia actualizada correctamente");
  return redirect("/admin/noticias");
};



