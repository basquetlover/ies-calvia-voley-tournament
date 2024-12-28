
//Mi codigo

import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";


export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const usuario_id = formData.get("usuario_id")?.toString().trim() || "";
  const capitan = formData.get("capitan")?.toString().trim();


  let acompañante_nombre = "";
  let acompañante_curso = "";
  let acompañante_1r_apellido = "";
  let acompañante_2n_apellido = "";
  let acompañante_genero = "";
  let acompañante_email = "";

  let acompañante = "";

  acompañante_nombre = formData.get("entrenador_name")?.toString().trim() || "";
  if(acompañante_nombre !== "") {
   acompañante_curso = formData.get(`entrenador_curso`)?.toString().trim() || "";
   acompañante_1r_apellido = formData.get(`entrenador_1r_apellido`)?.toString().trim() || "";
   acompañante_2n_apellido = formData.get(`entrenador_2n_apellido`)?.toString().trim() || "";
   acompañante_genero = formData.get(`genero_entrenador`)?.toString().trim() || "";
   acompañante_email = formData.get(`entrenador_email`)?.toString().trim() || "";

   acompañante = acompañante_nombre + " " + acompañante_1r_apellido;
  if (acompañante_email) { 
    const dominio = acompañante_email.split('@')[1]; // Esto te dará 'gmail.com'
    const dominioConArroba = '@' + dominio;
    if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
      console.log(`El email de l'entrenador ha de ser del centre`)
      return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El email de l'entrenador ha de ser del centre</div>`, 
            { status: 401, headers: { "Content-Type": "text/html" } }
        );
  }
} else {
    // Manejo del caso en que email es undefined o vacío
    console.error("El email no es válido.");
}
  if (!acompañante_genero) {
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere de l'entrenador</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }
}


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
  let id_equipo = nombre_equipo.toLowerCase().replace(/\s+/g, '-');
  id_equipo = removeAccents(id_equipo)

  // Recoger la información del escudo (imagen)
  const escudo = formData.get("escudo") as File;
  console.log("Tipo de archivo:", escudo.name);
  console.log("Tipo de archivo:", escudo.type);
  console.log("Tamaño de archivo:", escudo.size);
  // Recoger la información de los jugadores
  let hombres = 0;
  let mujeres = 0;
   const jugadores = [];
   let index = 0;
  while (formData.has(`player_${index}_name`)) {
    const nombre = formData.get(`player_${index}_name`)?.toString().trim();
    const curso = formData.get(`player_${index}_curso`)?.toString().trim();
    const _1r_apellido = formData.get(`player_${index}_1r_apellido`)?.toString().trim();
    const _2n_apellido = formData.get(`player_${index}_2n_apellido`)?.toString().trim();
    const genero = formData.get(`genero_${index}`)?.toString().trim();
    const email = formData.get(`player_${index}_email`)?.toString().trim();
    if (email) { 
      const dominio = email.split('@')[1]; // Esto te dará 'gmail.com'
      const dominioConArroba = '@' + dominio;
      if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
        console.log(`El email del ${index + 1}. Jugador ha de ser del centre`)
        return new Response(
              `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El email del ${index + 1}. Jugador ha de ser del centre</div>`, 
              { status: 401, headers: { "Content-Type": "text/html" } }
          );
    }
  } else {
      // Manejo del caso en que email es undefined o vacío
      console.error("El email no es válido.");
  }
    if (!genero) {
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere del ${index +1}. Jugador</div>`, 
        { status: 401, headers: { "Content-Type": "text/html" } }
    );
    }
    if(genero === "hombre"){
      hombres++;
    }
    if(genero === "mujer"){
      mujeres++;
    }
    jugadores.push({ nombre, curso, _1r_apellido, _2n_apellido, genero, email });
    index++;
  }

  // Recoger la información de los jugadores extra
  const jugadores_extra = [];
  index = 0;
  while (formData.has(`extra_player_${index}_name`)) {
    const nombre = formData.get(`extra_player_${index}_name`)?.toString().trim();
    if(nombre !== ""){
      const _1r_apellido = formData.get(`extra_player_${index }_1r_apellido`)?.toString().trim();
      const _2n_apellido = formData.get(`extra_player_${index}_2n_apellido`)?.toString().trim();
      const genero_extra = formData.get(`extra_genero_${index}`)?.toString().trim();
      const curso = formData.get(`extra_player_${index}_curso`)?.toString().trim();
      const email = formData.get(`extra_player_${index}_email`)?.toString().trim();
      if (email) { 
        const dominio = email.split('@')[1]; // Esto te dará 'gmail.com'
        const dominioConArroba = '@' + dominio;
        if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
          console.log(`El email del ${index + 7}. Jugador ha de ser del centre`)
          return new Response(
                `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El email del ${index + 7}. Jugador ha de ser del centre</div>`, 
                { status: 401, headers: { "Content-Type": "text/html" } }
            );
      }
    } else {
        // Manejo del caso en que email es undefined o vacío
        console.error("El email no es válido.");
    }
      if(!genero_extra) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere del ${index + 7}. Jugador ${nombre}</div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      }
      if(genero_extra === "hombre"){
        hombres++;
      }
      if(genero_extra === "mujer"){
        mujeres++;
      }
      jugadores_extra.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_extra, email });
    }
    index++;
  }

  console.log("Datos usuario:", {usuario_id });
  console.log("Datos recibidos:", {id_equipo, nombre_equipo, capitan, acompañante, escudo, jugadores,  jugadores_extra });
  if (!capitan) {
    console.log(capitan)
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ha de haber un capità a l'equip</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }
  
  if(hombres <2 || mujeres <2){
    console.log("Falta variedad de genero", hombres, mujeres)
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ha de haber un minim de 2 nins i 2 nines</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }
  

  // Verificar si el equipo ya existe en la tabla 'EquiposSS'
  const { data: existingEquipo, error: checkError } = await supabaseAdmin
  .from("EquiposSS")
  .select("id") // Seleccionar un campo mínimo
  .eq("nombre_equipo", nombre_equipo);

if (checkError) {
  console.error("Error al verificar la existencia:", checkError.message);
  return new Response(
    `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Error: Torna-ho a intentar més tard.</div>`, 
    { status: 401, headers: { "Content-Type": "text/html" } }
);
}


if (existingEquipo && existingEquipo.length > 0) {
  console.log("El equipo ya esta inscrito.")
  return new Response(
    `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ja existeix un equip amb aquest nom</div>`, 
    { status: 401, headers: { "Content-Type": "text/html" } }
);
}
   
async function uploadFile(file: File, id_equipo: string) {
  // Extraer la extensión del archivo
  const extension = file.name.split('.').pop(); // Obtiene la extensión
  const uniqueFileName = `${id_equipo}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
  const filePath = `escudosSS/${uniqueFileName}`; // Define la ruta del archivo

  const { data, error } = await supabaseAdmin.storage
      .from('EquiposIMG')
      .upload(filePath, file); // Sube el archivo

  if (error) {
      console.error("Error al subir imagen:", error.message);
      throw new Error("Error al subir imagen.");
  }

  console.log("Imagen subida correctamente:", data.path);
  return filePath; // Devuelve la ruta del archivo
}

// Llama a la función para subir el escudo
const escudoPath = await uploadFile(escudo, id_equipo);

//Obtener la URL pública del escudo subido
const { data: urlData } = supabaseAdmin.storage
    .from('EquiposIMG')
    .getPublicUrl(escudoPath); // Usa el escudoPath que se generó al subir el archivo

// Verifica si urlData contiene la propiedad publicUrl
if (!urlData || !urlData.publicUrl) {
    console.error("No se pudo obtener la URL pública del escudo.");
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
}

// Ahora puedes usar urlData.publicUrl para insertar en la base de datos
const publicUrl = urlData.publicUrl;
console.log("URL pública del escudo:", publicUrl);
    
    
  // Insertar los datos en la tabla 'administradores'
   const { data: datosEquipos, error: equipoError } = await supabaseAdmin
    .from('EquiposSS')
    .insert([
        { nombre_equipo: nombre_equipo ,
          id_equipo: id_equipo ,
          capitan: capitan,
          entrenador: acompañante,
          escudo: publicUrl,
          inscrito: usuario_id,
        },
    ])
    .select()

  if (equipoError) {
    console.error("Error insertando en equipos:", equipoError.message);
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error error en afegir l'equip.. Torna-ho a intentar més tard.</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }

  const { data: equipoData, error: busquedaError } = await supabaseAdmin
    .from('EquiposSS')
    .select('id')
    .eq('nombre_equipo', nombre_equipo)
    .single();

  if (busquedaError || !equipoData) {
    console.error("Error buscando el ID del equipo:", busquedaError?.message);
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error error en processar l'equip.. Torna-ho a intentar més tard.</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }

  const equipoId = equipoData.id;

  for (const jugador of jugadores) {
    const { error: jugadorError } = await supabaseAdmin
      .from('JugadoresSS')
      .insert([
        {   nombre: jugador.nombre, 
            _1r_apellido: jugador._1r_apellido,
            _2n_apellido: jugador._2n_apellido,
            curso: jugador.curso,
            genero: jugador.genero,
            pertenece_equipo: equipoId,
            email: jugador.email,
            ficha: 'jugador',
          },
      ]).select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }

  for (const jugador of jugadores_extra) {
    const { error: jugadorExtraError } = await supabaseAdmin
      .from('JugadoresSS')
      .insert([
        { nombre: jugador.nombre, 
          _1r_apellido: jugador._1r_apellido,
          _2n_apellido: jugador._2n_apellido,
          curso: jugador.curso,
          genero: jugador.genero_extra,
          pertenece_equipo: equipoId,
          email: jugador.email,
          ficha: 'jugador',
        },
    ]).select()

    if (jugadorExtraError) {
      console.error("Error insertando jugador extra:", jugadorExtraError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }

  const { error: jugadorExtraError } = await supabaseAdmin
      .from('JugadoresSS')
      .insert([
        { nombre: acompañante_nombre, 
          _1r_apellido: acompañante_1r_apellido,
          _2n_apellido: acompañante_2n_apellido,
          curso: acompañante_curso,
          genero: acompañante_genero,
          email: acompañante_email,
          pertenece_equipo: equipoId,
          ficha: 'entrenador',
        },
    ]).select()

    if (jugadorExtraError) {
      console.error("Error insertando jugador extra:", jugadorExtraError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }


  console.log("Equipo añadido correctamente");
  return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
};
