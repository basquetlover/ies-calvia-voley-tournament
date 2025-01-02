import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import Email from "../email.astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const id_equipo = nombre_equipo.toLowerCase().replace(/\s+/g, '-');
  const capitan = formData.get("capitan")?.toString().trim();
  const acompañante = formData.get("entrenador")?.toString().trim() || "";
  const email_entrenador = formData.get("email_entrenador")?.toString().trim() || "";
  
  const { data: equipoData, error } = await supabaseAdmin
  .from('Equipos')
  .select('nombre_equipo, id, capitan, entrenador, escudo')
  .eq('id_equipo', id_equipo) // Asegúrate de que id_equipo tenga el valor correcto
  .single();


if (error) {
  console.error(`Error al buscar equipo:`, error.message);
  return new Response("Error al buscar equipo.", { status: 500 });
}

if (!equipoData) {
  console.error(`No se encontró ningún equipo con id_equipo: ${id_equipo}`);
  return new Response("Equipo no encontrado.", { status: 404 });
}
const id = equipoData.id;
  console.log("ID del equipo:", id);
  // Recoger la información del escudo (imagen)
  const escudo = formData.get("escudo") as File;
  console.log("Tipo de archivo:", escudo.name);
  console.log("Tipo de archivo:", escudo.type);
  console.log("Tamaño de archivo:", escudo.size);
  // Recoger la información de los jugadores
  const jugadores = [];
    let index = 0; // Comienza en 0 para que coincida con el índice del frontend
    while (formData.has(`jugador_id_${index}`)) {
        const nombre = formData.get(`player_${index + 1}_name`);
        const email = formData.get(`player_${index + 1}_email`);
        const opcion = formData.get(`player_${index + 1}_opcion`);
        const curso = formData.get(`player_${index + 1}_curso`)?.toString().trim();
        const id_jugador = formData.get(`jugador_id_${index}`); // Asegúrate de que el nombre coincida

        if (nombre && curso) {
            jugadores.push({ nombre, curso, id_jugador, opcion, email });
        }
        index++;
    }

  // Recoger la información de los jugadores extra
  const jugadores_nuevos = []; 
  index = 1; // Asegúrate de que coincida con la indexación del frontend
while (formData.has(`new_player_${index}_name`)) {
    const nombre = formData.get(`new_player_${index}_name`)?.toString().trim();
    const curso = formData.get(`new_player_${index}_curso`)?.toString().trim() || '';
    if (nombre) {
        jugadores_nuevos.push({ nombre, curso });
    }
    index++;
}


  console.log("Datos recibidos:", { id, nombre_equipo });
  console.log("Jugadores:", jugadores)
  console.log("Jugadores Nueos:", jugadores_nuevos)
  console.log("Datos recibidos:", {id_equipo, nombre_equipo, capitan, acompañante, escudo });

// }

//actualizar escudo
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

  let publicUrl = equipoData.escudo; // Mantener la URL existente por defecto

  if (escudo.size > 0) {
    try {
      const escudoPath = await uploadFile(escudo, id_equipo);
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
  //Insertar los datos en la tabla 'administradores'
   const { error: adminError } = await supabaseAdmin
     .from('Equipos')
     .update({ 
        id_equipo: id_equipo,
        nombre_equipo: nombre_equipo,
        capitan: capitan,
        entrenador: acompañante,
        escudo: publicUrl,
        email_entrenador: email_entrenador,
     })
     .eq("id", id)
     .select();
    

   if (adminError) {
     console.error("Error insertando en administradores:", adminError.message);
     return new Response("Hubo un error al asignar el rango.", { status: 500 });
   }

   for (const jugador of jugadores) {
    if(jugador.opcion === "delete"){
        console.log("Jugador a eliminar", jugador.nombre, jugador.id_jugador)
        const { error } = await supabaseAdmin
        .from('Jugadores')
        .delete()
        .eq('id', jugador.id_jugador)
    }
    const { error: jugadorError } = await supabaseAdmin
      .from('Jugadores')
      .update([
        { 
            nombre: jugador.nombre, 
            curso: jugador.curso,
            email: jugador.email,
          },
      ])
      .eq("id", jugador.id_jugador )
      .select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }

  for (const jugador of jugadores_nuevos) {
    
    const { error: jugadorExtraError } = await supabaseAdmin
      .from('Jugadores')
      .insert([
        { nombre: jugador.nombre, 
          curso: jugador.curso,
          pertenece_equipo: id,
        },
    ]).select()

    if (jugadorExtraError) {
      console.error("Error insertando jugador extra:", jugadorExtraError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }

  console.log("Equipo actualizado correctamente");
  return redirect("/admin/equipos");
};



