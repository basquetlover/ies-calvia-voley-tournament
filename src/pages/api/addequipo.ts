import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

async function uploadFile(file: File, fileName: string) {
    const { data, error } = await supabaseAdmin.storage
      .from('EquiposIMG')
      .upload(`escudos/${fileName}`, file);
  
    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  
    const { data: urlData } = supabaseAdmin.storage
      .from('EquiposIMG')
      .getPublicUrl(`escudos/${fileName}`);
  
    if (!urlData || !urlData.publicUrl) {
      console.error("Error getting public URL");
      return null;
    }
  
    return urlData.publicUrl;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const id_equipo = nombre_equipo.toLowerCase().replace(/\s+/g, '-');
  const capitan = formData.get("capitan")?.toString().trim();
  const acompañante = formData.get("entrenador")?.toString().trim() || "";
  
  // Recoger la información del escudo (imagen)
  const escudo = formData.get("escudo") as File;

  // Recoger la información de los jugadores
  const jugadores = [];
  let index = 1;
  while (formData.has(`player_${index}_name`)) {
    const nombre = formData.get(`player_${index}_name`)?.toString().trim();
    const curso = formData.get(`player_${index}_curso`)?.toString().trim();
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

// if (existingEquipo && existingEquipo.length > 0) {
//   return new Response(JSON.stringify({ error: "El usuario ya tiene un capitan asignado." }), {
//     status: 400,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
if (existingEquipo && existingEquipo.length > 0) {
  // return new Response("El usuario ya tiene un capitan asignado.", { status: 400 });
  console.log("El usuario ya tiene un capitan asignado.")
}
    let escudoUrl = null;
    if (escudo && escudo.size > 0) {
        const fileName = `${id_equipo}_${Date.now()}.${escudo.name.split('.').pop()}`;
        escudoUrl = await uploadFile(escudo, fileName);
        if (!escudoUrl) {
        return new Response("Error al subir el escudo del equipo.", { status: 500 });
        }
    }
  // Insertar los datos en la tabla 'administradores'
   const { data: datosEquipos, error: equipoError } = await supabaseAdmin
    .from('Equipos')
    .insert([
        { nombre_equipo: nombre_equipo ,
          id_equipo: id_equipo ,
          capitan: capitan,
          entrenador: acompañante,
          escudo: escudoUrl},
    ])
    .select()

  if (equipoError) {
    console.error("Error insertando en equipos:", equipoError.message);
    return new Response("Hubo un error al añadir el equipo.", { status: 500 });
  }

  const { data: equipoData, error: busquedaError } = await supabaseAdmin
    .from('Equipos')
    .select('id')
    .eq('nombre_equipo', nombre_equipo)
    .single();

  if (busquedaError || !equipoData) {
    console.error("Error buscando el ID del equipo:", busquedaError?.message);
    return new Response("Hubo un error al procesar el equipo.", { status: 500 });
  }

  const equipoId = equipoData.id;

  for (const jugador of jugadores) {
    const { error: jugadorError } = await supabaseAdmin
      .from('Jugadores')
      .insert([
        { nombre: jugador.nombre, 
            curso: jugador.curso,
            pertenece_equipo: equipoId
          },
      ]).select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }

  for (const jugador of jugadores_extra) {
    const { error: jugadorExtraError } = await supabase
      .from('Jugadores')
      .insert([
        { nombre: jugador.nombre, 
          curso: jugador.curso,
          pertenece_equipo: equipoId
        },
    ]).select()

    if (jugadorExtraError) {
      console.error("Error insertando jugador extra:", jugadorExtraError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }


  console.log("Equipo añadido correctamente");
  return redirect("/admin");
};
