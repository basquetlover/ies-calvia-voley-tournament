
//Mi codigo

import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";


export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const id_equipo = nombre_equipo.toLowerCase().replace(/\s+/g, '-');
  const capitan = formData.get("capitan")?.toString().trim();
  const acompañante = formData.get("entrenador")?.toString().trim() || "";
  
  // Recoger la información del escudo (imagen)
  const escudo = formData.get("escudo") as File;
  console.log("Tipo de archivo:", escudo.name);
  console.log("Tipo de archivo:", escudo.type);
  console.log("Tamaño de archivo:", escudo.size);
  // Recoger la información de los jugadores
  const jugadores = [];
  let index = 1;
  while (formData.has(`player_${index}_name`)) {
    const nombre = formData.get(`player_${index}_name`)?.toString().trim();
    const curso = formData.get(`player_${index}_curso`)?.toString().trim();
    const _1r_apellido = formData.get(`player_${index}_1r_apellido`)?.toString().trim();
    const _2n_apellido = formData.get(`player_${index}_2n_apellido`)?.toString().trim();
    const genero = formData.get(`genero_${index}`)?.toString().trim();
    if (nombre && curso) {
      jugadores.push({ nombre, curso });
    }
    index++;
  }

  // Recoger la información de los jugadores extra
  const jugadores_extra = [];
  index = 1;
  while (formData.has(`extra_player_${index}_name`)) {
    const nombre = formData.get(`extra_player_${index}_name`)?.toString().trim();
    const _1r_apellido = formData.get(`extra_player_${index}_1r_apellido`)?.toString().trim();
    const _2n_apellido = formData.get(`extra_player_${index}_2n_apellido`)?.toString().trim();
    const genero = formData.get(`extra_genero_${index}`)?.toString().trim();
    if (nombre) {
      const curso = formData.get(`extra_player_${index}_curso`)?.toString().trim() || '';
      jugadores_extra.push({ nombre, curso });
    }
    index++;
  }


  if (!nombre_equipo || !capitan) {
    return new Response("nombre y capitan son obligatorios", { status: 400 });
  }

  console.log("Datos recibidos:", {id_equipo, nombre_equipo, capitan, acompañante, escudo, jugadores, jugadores_extra });

  // Verificar si el correo electrónico ya existe en la tabla 'administradores'
  const { data: existingEquipo, error: checkError } = await supabaseAdmin
  .from("Equipos")
  .select("id") // Seleccionar un campo mínimo
  .eq("nombre_equipo", nombre_equipo);

if (checkError) {
  console.error("Error al verificar la existencia:", checkError.message);
  return new Response("Hubo un error al verificar el correo electrónico.", { status: 500 });
}


if (existingEquipo && existingEquipo.length > 0) {
  
  console.log("El equipo ya tiene un capitan asignado.")
}
   
// async function uploadFile(file: File, id_equipo: string) {
//   // Extraer la extensión del archivo
//   const extension = file.name.split('.').pop(); // Obtiene la extensión
//   const uniqueFileName = `${id_equipo}.${extension}`; // Combina id_equipo con la extensión
//   const filePath = `escudos/${uniqueFileName}`; // Define la ruta del archivo

//   const { data, error } = await supabaseAdmin.storage
//       .from('EquiposIMG')
//       .upload(filePath, file); // Sube el archivo

//   if (error) {
//       console.error("Error al subir imagen:", error.message);
//       throw new Error("Error al subir imagen.");
//   }

//   console.log("Imagen subida correctamente:", data.path);
//   return filePath; // Devuelve la ruta del archivo
// }

// Llama a la función para subir el escudo
// const escudoPath = await uploadFile(escudo, id_equipo);

// Obtener la URL pública del escudo subido
// const { data: urlData } = supabaseAdmin.storage
//     .from('EquiposIMG')
//     .getPublicUrl(escudoPath); // Usa el escudoPath que se generó al subir el archivo

// // Verifica si urlData contiene la propiedad publicUrl
// if (!urlData || !urlData.publicUrl) {
//     console.error("No se pudo obtener la URL pública del escudo.");
//     return new Response("Hubo un error al procesar el escudo.", { status: 500 });
// }

// Ahora puedes usar urlData.publicUrl para insertar en la base de datos
// const publicUrl = urlData.publicUrl;
// console.log("URL pública del escudo:", publicUrl);
    
    
  // Insertar los datos en la tabla 'administradores'
//    const { data: datosEquipos, error: equipoError } = await supabaseAdmin
//     .from('Equipos')
//     .insert([
//         { nombre_equipo: nombre_equipo ,
//           id_equipo: id_equipo ,
//           capitan: capitan,
//           entrenador: acompañante,
//           escudo: publicUrl
//         },
//     ])
//     .select()

//   if (equipoError) {
//     console.error("Error insertando en equipos:", equipoError.message);
//     return new Response("Hubo un error al añadir el equipo.", { status: 500 });
//   }

//   const { data: equipoData, error: busquedaError } = await supabaseAdmin
//     .from('Equipos')
//     .select('id')
//     .eq('nombre_equipo', nombre_equipo)
//     .single();

//   if (busquedaError || !equipoData) {
//     console.error("Error buscando el ID del equipo:", busquedaError?.message);
//     return new Response("Hubo un error al procesar el equipo.", { status: 500 });
//   }

//   const equipoId = equipoData.id;

//   for (const jugador of jugadores) {
//     const { error: jugadorError } = await supabaseAdmin
//       .from('Jugadores')
//       .insert([
//         { nombre: jugador.nombre, 
//             curso: jugador.curso,
//             pertenece_equipo: equipoId
//           },
//       ]).select()

//     if (jugadorError) {
//       console.error("Error insertando jugador principal:", jugadorError.message);
//       // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
//     }
//   }

//   for (const jugador of jugadores_extra) {
//     const { error: jugadorExtraError } = await supabaseAdmin
//       .from('Jugadores')
//       .insert([
//         { nombre: jugador.nombre, 
//           curso: jugador.curso,
//           pertenece_equipo: equipoId
//         },
//     ]).select()

//     if (jugadorExtraError) {
//       console.error("Error insertando jugador extra:", jugadorExtraError.message);
//       // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
//     }
//   }


  console.log("Equipo añadido correctamente");
  return redirect("/usuario/inscripcion");
};
