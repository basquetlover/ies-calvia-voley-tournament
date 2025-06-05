
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';

const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const usuario_nombre = formData.get("usuario_nombre")?.toString().trim() || "";
  const usuario_email = formData.get("usuario_email")?.toString().trim() || "";
  const usuario_curso = formData.get("usuario_curso")?.toString().trim() || "";
  const usuario_id = formData.get("usuario_id")?.toString().trim() || "";
  const capitan = formData.get("capitan")?.toString().trim();
  const capitan_email = formData.get("capitan_email")?.toString().trim() || "";
  const condiciones = formData.get("condiciones")?.toString().trim();

  const capitan_edit = formData.get("capitan_edit")?.toString().trim();

  if(!condiciones){
    console.log(condiciones)
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">És necessari acceptar les condicions d'inscripció, l'avís legal i la política de privacitat per continuar amb el procés.</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }

  let publicUrl = "https://iescalvia-voley.com/img/escudos/sin-escudo.png";
  let acompañante_nombre = "";
  let acompañante_curso = "";
  let acompañante_1r_apellido = "";
  let acompañante_2n_apellido = "";
  let acompañante_genero = "";
  let acompañante_email = "";

  let acompañante = "";
  //const acompañante_foto = formData.get('entrenador_img')  as File;
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
//const { data: existingCoach, error: checkError } = await supabaseAdmin
  //.from("JugadoresSS")
  //.select("id") // Seleccionar un campo mínimo
  //.eq("email", acompañante_email);

 // if(existingCoach){
   // return new Response(
     // `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'entrenador ja està inscript en un altre Equip</div>`, 
     // { status: 401, headers: { "Content-Type": "text/html" } }
 // );
  //}
 // if(checkError){
  //  console.log("Entrenador no inscrito en otro equipo")
//}
let { data: Usuarios, error } = await supabaseAdmin
    .from(`JugadoresV`)
    .select('email')

    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === acompañante_email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'entrenador ja es troba inscrit.</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }

  if (!acompañante_genero) {
    return new Response(
      `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere de l'entrenador</div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }
}

let profesor_nombre = "";
let profesor_curso = "";
let profesor_1r_apellido = "";
let profesor_2n_apellido = "";
let profesor_genero = "";
let profesor_email = "";


let profesor = "";
//const profesor_foto = formData.get('profesor_img')  as File;
profesor_nombre = formData.get("profesor_name")?.toString().trim() || "";
if(profesor_nombre !== "") {
 profesor_curso = formData.get(`profesor_curso`)?.toString().trim() || "";
 profesor_1r_apellido = formData.get(`profesor_1r_apellido`)?.toString().trim() || "";
 profesor_2n_apellido = formData.get(`profesor_2n_apellido`)?.toString().trim() || "";
 profesor_genero = formData.get(`genero_profesor`)?.toString().trim() || "";
 profesor_email = formData.get(`profesor_email`)?.toString().trim() || "";

 

 profesor = profesor_nombre + " " + profesor_1r_apellido;
if (profesor_email) { 
  const dominio = profesor_email.split('@')[1]; // Esto te dará 'gmail.com'
  const dominioConArroba = '@' + dominio;
  if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
    console.log(`El email del professor ha de ser del centre`)
    return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El email del professor ha de ser del centre</div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
}
} else {
  // Manejo del caso en que email es undefined o vacío
  console.error("El email no es válido.");
}
//const { data: existingCoach, error: checkError } = await supabaseAdmin
//.from("JugadoresSS")
//.select("id") // Seleccionar un campo mínimo
//.eq("email", profesor_email);

// if(existingCoach){
 // return new Response(
   // `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'entrenador ja està inscript en un altre Equip</div>`, 
   // { status: 401, headers: { "Content-Type": "text/html" } }
// );
//}
// if(checkError){
//  console.log("Entrenador no inscrito en otro equipo")
//}
let { data: Usuarios, error } = await supabaseAdmin
  .from(`JugadoresV`)
  .select('email')

  if (Usuarios) {
  
    
    // Verificar si ya existe un usuario con el mismo email
    const userExistsByEmail = Usuarios.some(usuario => usuario.email === acompañante_email);
    
    if (userExistsByEmail) {
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Del professor ja es troba inscrit.</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }
  }

if (!acompañante_genero) {
  return new Response(
    `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere del professor</div>`, 
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
    //const img = formData.get(`player_${index}_img`) as File;
    const numero = index + 1;
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
    let { data: Usuarios, error } = await supabaseAdmin
    .from(`JugadoresV`)
    .select('email')

    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El jugador Nº${index +1} ja es troba inscrit</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }
    jugadores.push({ nombre, curso, _1r_apellido, _2n_apellido, genero, email, numero });
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
      //const img = formData.get(`extra_player_${index}_img`) as File;
      const numero = index + 7;
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
      let { data: Usuarios, error } = await supabaseAdmin
    .from(`JugadoresV`)
    .select('email')

    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El jugador Nº${index +7} ja es troba inscrit</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }
      jugadores_extra.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_extra, email, numero });
    }
    index++;
  }


  //Recoger la informacion del staff del equipo
  const staff = [];
  index = 0;
  while (formData.has(`staff_player_${index}_name`)) {
    const nombre = formData.get(`staff_player_${index}_name`)?.toString().trim();
    if(nombre !== ""){
      const _1r_apellido = formData.get(`staff_player_${index }_1r_apellido`)?.toString().trim();
      const _2n_apellido = formData.get(`staff_player_${index}_2n_apellido`)?.toString().trim();
      const genero_staff = formData.get(`staff_genero_${index}`)?.toString().trim();
      const curso = formData.get(`staff_player_${index}_curso`)?.toString().trim();
      const email = formData.get(`staff_player_${index}_email`)?.toString().trim();
      //const img = formData.get(`staff_player_${index}_img`) as File;
      const numero = index + 1;
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
      if(!genero_staff) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Seleccioni el gènere del ${index + 7}. Jugador ${nombre}</div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      
      }
      let { data: Usuarios, error } = await supabaseAdmin
    .from(`JugadoresV`)
    .select('email')

    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">El jugador Nº${index +7} ja es troba inscrit</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }
    staff.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_staff, email, numero });
    }
    index++;
  }

  console.log("Datos usuario:", {usuario_id, usuario_curso, usuario_email, usuario_nombre });
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
  

  // Verificar si el equipo ya existe en la tabla `EquiposV`
  const { data: existingEquipo, error: checkError } = await supabaseAdmin
  .from("`EquiposV`")
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
  const filePath = `escudosV/${uniqueFileName}`; // Define la ruta del archivo

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
  //   console.error("No se pudo obtener la URL pública del escudo.");
  //   return new Response(
  //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
  //     { status: 401, headers: { "Content-Type": "text/html" } }
  // );
}
if (urlData) {
  publicUrl = urlData.publicUrl;
}

//Subir img entrenador
// async function uploadFileCoach(file: File, email: string | undefined) {
//   // Extraer la extensión del archivo
//   const extension = file.name.split('.').pop(); // Obtiene la extensión
//   const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
//   const filePath = `${uniqueFileName}`; // Define la ruta del archivo

//   const { data, error } = await supabaseAdmin.storage
//       .from('JugadoresIMG')
//       .upload(filePath, file); // Sube el archivo

//   if (error) {
//       console.error("Error al subir imagen:", error.message);
//       throw new Error("Error al subir imagen.");
//   }

//   console.log("Imagen subida correctamente:", data.path);
//   return filePath; // Devuelve la ruta del archivo
// }

// Llama a la función para subir el escudo
//const CoachPath = await uploadFileCoach(acompañante_foto, acompañante_email);

//let publicCoachUrl ="";
//Obtener la URL pública del escudo subido
// const { data: urlDataCoach } = supabaseAdmin.storage
//     .from('JugadoresIMG')
//     .getPublicUrl(CoachPath); // Usa el escudoPath que se generó al subir el archivo

// Verifica si urlData contiene la propiedad publicUrl
// if (!urlDataCoach || !urlDataCoach.publicUrl) {
//   //   console.error("No se pudo obtener la URL pública del escudo.");
//   //   return new Response(
//   //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
//   //     { status: 401, headers: { "Content-Type": "text/html" } }
//   // );
// }
// if (urlData) {
//   publicCoachUrl = urlDataCoach.publicUrl;
// }


// Ahora puedes usar urlData.publicUrl para insertar en la base de datos
if(escudo.size <= 0){
  publicUrl = "https://iescalvia-voley.com/img/escudos/sin-escudo.png";
}
console.log("URL pública del escudo:", publicUrl);

const getCurrentDateInCatalan = () => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date();
  return new Intl.DateTimeFormat('ca-ES', options).format(date);
};

const currentDate = getCurrentDateInCatalan();
console.log(currentDate);

    
  // Insertar los datos en la tabla 'administradores'
   const { data: datosEquipos, error: equipoError } = await supabaseAdmin
    .from(`EquiposV`)
    .insert([
        { nombre_equipo: nombre_equipo ,
          id_equipo: id_equipo ,
          capitan: capitan,
          entrenador: acompañante,
          escudo: publicUrl,
          inscrito: usuario_id,
          estado: 'Revisant',
          email_capitan: capitan_email,
          capitan_edit: capitan_edit,
          fecha_inscripcion: currentDate,
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
    .from(`EquiposV`)
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


  // async function uploadJugadorIMG(file: File, email: string | undefined) {
  //   // Extraer la extensión del archivo
  //   const extension = file.name.split('.').pop(); // Obtiene la extensión
  //   const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
  //   const filePath = `${uniqueFileName}`; // Define la ruta del archivo
  
  //   const { data, error } = await supabaseAdmin.storage
  //       .from('JugadoresIMG')
  //       .upload(filePath, file); // Sube el archivo
  
  //   if (error) {
  //       console.error("Error al subir imagen:", error.message);
  //       throw new Error("Error al subir imagen.");
  //   }
  
  //   console.log("Imagen subida correctamente:", data.path);
  //   return filePath; // Devuelve la ruta del archivo
  // }
  
  for (const jugador of jugadores) {
    //if(jugador.img.size <= 0){
      const { error: jugadorError } = await supabaseAdmin
        .from(`JugadoresV`)
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
    // } else {
    //   let publicIMGurl = "";
    //   // Llama a la función para subir el escudo
    // const JugadorIMGPath = await uploadJugadorIMG(jugador.img, jugador.email);
    
    // //Obtener la URL pública del escudo subido
    // const { data: urlIMGData } = supabaseAdmin.storage
    //     .from('JugadoresIMG')
    //     .getPublicUrl(JugadorIMGPath); // Usa el escudoPath que se generó al subir el archivo
    
    // // Verifica si urlData contiene la propiedad publicUrl
    // if (!urlIMGData || !urlIMGData.publicUrl) {
    //   //   console.error("No se pudo obtener la URL pública del escudo.");
    //   //   return new Response(
    //   //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
    //   //     { status: 401, headers: { "Content-Type": "text/html" } }
    //   // );
    // }
    // if (urlIMGData) {
    //   publicIMGurl = urlIMGData.publicUrl;
    // }
  
    //   const { error: jugadorError } = await supabaseAdmin
    //     .from(`JugadoresV`)
    //     .insert([
    //       {   nombre: jugador.nombre, 
    //           _1r_apellido: jugador._1r_apellido,
    //           _2n_apellido: jugador._2n_apellido,
    //           curso: jugador.curso,
    //           genero: jugador.genero,
    //           pertenece_equipo: equipoId,
    //           email: jugador.email,
    //           ficha: 'jugador',
    //           img: publicIMGurl,
    //         },
    //     ]).select()
  
    //   if (jugadorError) {
    //     console.error("Error insertando jugador principal:", jugadorError.message);
    //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    //   }
    // }
  }

  for (const jugador of jugadores_extra) {
    //if(jugador.img.size <= 0){
      const { error: jugadorError } = await supabaseAdmin
        .from(`JugadoresV`)
        .insert([
          {   nombre: jugador.nombre, 
              _1r_apellido: jugador._1r_apellido,
              _2n_apellido: jugador._2n_apellido,
              curso: jugador.curso,
              genero: jugador.genero_extra,
              pertenece_equipo: equipoId,
              email: jugador.email,
              ficha: 'jugador',
              
            },
        ]).select()
  
      if (jugadorError) {
        console.error("Error insertando jugador principal:", jugadorError.message);
        // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
      }
    // } else {
    //   let publicIMGurl = "";
    //   // Llama a la función para subir el escudo
    // const JugadorIMGPath = await uploadJugadorIMG(jugador.img, jugador.email);
    
    // //Obtener la URL pública del escudo subido
    // const { data: urlIMGData } = supabaseAdmin.storage
    //     .from('JugadoresIMG')
    //     .getPublicUrl(JugadorIMGPath); // Usa el escudoPath que se generó al subir el archivo
    
    // // Verifica si urlData contiene la propiedad publicUrl
    // if (!urlIMGData || !urlIMGData.publicUrl) {
    //   //   console.error("No se pudo obtener la URL pública del escudo.");
    //   //   return new Response(
    //   //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
    //   //     { status: 401, headers: { "Content-Type": "text/html" } }
    //   // );
    // }
    // if (urlIMGData) {
    //   publicIMGurl = urlIMGData.publicUrl;
    // }
  
    //   const { error: jugadorError } = await supabaseAdmin
    //     .from(`JugadoresV`)
    //     .insert([
    //       {   nombre: jugador.nombre, 
    //           _1r_apellido: jugador._1r_apellido,
    //           _2n_apellido: jugador._2n_apellido,
    //           curso: jugador.curso,
    //           genero: jugador.genero_extra,
    //           pertenece_equipo: equipoId,
    //           email: jugador.email,
    //           ficha: 'jugador',
    //           img: publicIMGurl,
    //         },
    //     ]).select()
  
    //   if (jugadorError) {
    //     console.error("Error insertando jugador principal:", jugadorError.message);
    //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    //   }
    // }
  }

  for (const jugador of staff) {
   // if(jugador.img.size <= 0){
    const { error: jugadorError } = await supabaseAdmin
      .from(`JugadoresV`)
      .insert([
        {   nombre: jugador.nombre, 
            _1r_apellido: jugador._1r_apellido,
            _2n_apellido: jugador._2n_apellido,
            curso: jugador.curso,
            genero: jugador.genero_staff,
            pertenece_equipo: equipoId,
            email: jugador.email,
            ficha: 'cuerpo_tecnico',
            
          },
      ]).select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  // } else {
  //   let publicIMGurl = "";
  //   // Llama a la función para subir el escudo
  // const JugadorIMGPath = await uploadJugadorIMG(jugador.img, jugador.email);
  
  // //Obtener la URL pública del escudo subido
  // const { data: urlIMGData } = supabaseAdmin.storage
  //     .from('JugadoresIMG')
  //     .getPublicUrl(JugadorIMGPath); // Usa el escudoPath que se generó al subir el archivo
  
  // // Verifica si urlData contiene la propiedad publicUrl
  // if (!urlIMGData || !urlIMGData.publicUrl) {
  //   //   console.error("No se pudo obtener la URL pública del escudo.");
  //   //   return new Response(
  //   //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
  //   //     { status: 401, headers: { "Content-Type": "text/html" } }
  //   // );
  // }
  // if (urlIMGData) {
  //   publicIMGurl = urlIMGData.publicUrl;
  // }

  //   const { error: jugadorError } = await supabaseAdmin
  //     .from(`JugadoresV`)
  //     .insert([
  //       {   nombre: jugador.nombre, 
  //           _1r_apellido: jugador._1r_apellido,
  //           _2n_apellido: jugador._2n_apellido,
  //           curso: jugador.curso,
  //           genero: jugador.genero_staff,
  //           pertenece_equipo: equipoId,
  //           email: jugador.email,
  //           ficha: 'cuerpo_tecnico',
  //           img: publicIMGurl,
  //         },
  //     ]).select()

  //   if (jugadorError) {
  //     console.error("Error insertando jugador principal:", jugadorError.message);
  //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
  //   }
  // }
    
  }

  //if(acompañante_foto.size <= 0){
    const { error: jugadorExtraError } = await supabaseAdmin
      .from(`JugadoresV`)
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
  // } else {
  //   const { error: jugadorExtraError } = await supabaseAdmin
  //     .from(`JugadoresV`)
  //     .insert([
  //       { nombre: acompañante_nombre, 
  //         _1r_apellido: acompañante_1r_apellido,
  //         _2n_apellido: acompañante_2n_apellido,
  //         curso: acompañante_curso,
  //         genero: acompañante_genero,
  //         email: acompañante_email,
  //         pertenece_equipo: equipoId,
  //         img: publicCoachUrl,
  //         ficha: 'entrenador',
  //       },
  //   ]).select()

  //   if (jugadorExtraError) {
  //     console.error("Error insertando jugador extra:", jugadorExtraError.message);
  //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
  //   }
  // }

 // if(profesor_foto.size > 0){
    //Subir img entrenador
    // async function uploadFileCoach(file: File, email: string | undefined) {
    //     // Extraer la extensión del archivo
    //     const extension = file.name.split('.').pop(); // Obtiene la extensión
    //       const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
    //       const filePath = `${uniqueFileName}`; // Define la ruta del archivo
      
    //     const { data, error } = await supabaseAdmin.storage
    //         .from('EquiposIMG')
    //         .upload(filePath, file); // Sube el archivo
      
    //     if (error) {
    //         console.error("Error al subir imagen:", error.message);
    //         throw new Error("Error al subir imagen.");
    //     }
      
    //     console.log("Imagen subida correctamente:", data.path);
    //     return filePath; // Devuelve la ruta del archivo
    //   }
      
    //   // Llama a la función para subir el escudo
    //   const CoachPath = await uploadFileCoach(profesor_foto, profesor_email);
    //   let publicCoachUrl ="";
    //   //Obtener la URL pública del escudo subido
    //   const { data: urlDataCoach } = supabaseAdmin.storage
    //       .from('EquiposIMG')
    //       .getPublicUrl(CoachPath); // Usa el escudoPath que se generó al subir el archivo
      
    //   // Verifica si urlData contiene la propiedad publicUrl
    //   if (!urlDataCoach || !urlDataCoach.publicUrl) {
    //     //   console.error("No se pudo obtener la URL pública del escudo.");
    //     //   return new Response(
    //     //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
    //     //     { status: 401, headers: { "Content-Type": "text/html" } }
    //     // );
    //   }
    //   if (urlDataCoach) {
    //     publicCoachUrl = urlDataCoach.publicUrl;
    //   }

  //     const { error: jugadorError } = await supabaseAdmin
  //     .from(`JugadoresV`)
  //     .insert([
  //       {   nombre: profesor_nombre, 
  //         _1r_apellido: profesor_1r_apellido,
  //         _2n_apellido: profesor_2n_apellido,
  //         curso: profesor_curso,
  //         genero: profesor_genero,
  //         pertenece_equipo: equipoId,
  //         email: profesor_email,
  //         ficha: 'profesor',
  //         imag: publicCoachUrl,
  //         },
  //     ])
  //     .select()

  // }else{
    const { error: jugadorError } = await supabaseAdmin
    .from(`JugadoresV`)
    .insert([
      {   nombre: profesor_nombre, 
        _1r_apellido: profesor_1r_apellido,
        _2n_apellido: profesor_2n_apellido,
        curso: profesor_curso,
        genero: profesor_genero,
        pertenece_equipo: equipoId,
        email: profesor_email,
        ficha: 'profesor',
        
        },
    ])
    .select()

 // }
  


  console.log("Equipo añadido correctamente");


  //Enviar Email
  const acceso_emails = "email-inscripcion";
  let accessibleBlocks = [];
  
  // Obtén las páginas a las que el usuario tiene acceso
  try {
      const { data: pageAccess, error } = await supabaseAdmin
          .from('AccesoUsuarios')
          .select('pagina, acceso');
  
      if (error) {
          console.error("Error al obtener acceso:", error);
      } else if (pageAccess) {
          // Filtra las páginas a las que el usuario tiene acceso
          accessibleBlocks = pageAccess
              .filter(page => page.acceso === true) // Solo páginas con acceso true
              .map(page => page.pagina); // Obtiene solo las páginas
          // console.log(accessibleBlocks);
      }
  } catch (err) {
      console.error("Error al obtener acceso:", err);
  }
  
  // Verifica si el usuario tiene acceso a la página actual
  const userHasAccess = accessibleBlocks.includes(acceso_emails);
  if(userHasAccess){
    console.log("Se envian emails");

    const resend = new Resend(import.meta.env.RESEND_API_KEY);


const emailBody =`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="ca">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Nuevo mensaje 2</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]--><!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
  <style type="text/css">
.rollover:hover .rollover-first {
  max-height:0px!important;
  display:none!important;
}
.rollover:hover .rollover-second {
  max-height:none!important;
  display:block!important;
}
.rollover span {
  font-size:0px;
}
u + .body img ~ div div {
  display:none;
}
#outlook a {
  padding:0;
}
span.MsoHyperlink,
span.MsoHyperlinkFollowed {
  color:inherit;
  mso-style-priority:99;
}
a.es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
}
a[x-apple-data-detectors],
#MessageViewBody a {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
}
.es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
}
@media only screen and (max-width:600px) {.es-m-p10t { padding-top:10px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p10r { padding-right:10px!important } .es-m-p20r { padding-right:20px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p20l { padding-left:20px!important } .es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } .img-6359 { width:200px!important; height:auto!important } .img-6730 { width:84px!important; height:auto!important } h1 a { text-align:left } h2 a { text-align:left } .es-m-w0 { width:0px!important } h3 a { text-align:left } .es-text-3268 .es-text-mobile-size-18.es-override-size, .es-text-3268 .es-text-mobile-size-18.es-override-size * { font-size:18px!important; line-height:150%!important } table.es-spacer-6583 { width:100%!important } .es-text-9774 .es-text-mobile-size-14.es-override-size, .es-text-9774 .es-text-mobile-size-14.es-override-size * { font-size:14px!important; line-height:150%!important } .es-text-8594 .es-text-mobile-size-14.es-override-size, .es-text-8594 .es-text-mobile-size-14.es-override-size * { font-size:14px!important; line-height:150%!important } .es-text-3285 .es-text-mobile-size-14.es-override-size, .es-text-3285 .es-text-mobile-size-14.es-override-size * { font-size:14px!important; line-height:150%!important } .es-text-2485 .es-text-mobile-size-36, .es-text-2485 .es-text-mobile-size-36 * { font-size:36px!important; line-height:150%!important } .es-text-2701 .es-text-mobile-size-16, .es-text-2701 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-4830 .es-text-mobile-size-16, .es-text-4830 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-8859 .es-text-mobile-size-16, .es-text-8859 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-6521 .es-text-mobile-size-16, .es-text-6521 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-9225 .es-text-mobile-size-16, .es-text-9225 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-8976 .es-text-mobile-size-16, .es-text-8976 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-8417 .es-text-mobile-size-16, .es-text-8417 .es-text-mobile-size-16 * { font-size:16px!important; line-height:150%!important } .es-text-9857 .es-text-mobile-size-18, .es-text-9857 .es-text-mobile-size-18 * { font-size:18px!important; line-height:150%!important } }
@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
</style>
 </head>
 <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="ca" style="background-color:#E0DFDF"><!--[if gte mso 9]>
 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
   <v:fill type="tile"  color="#e0dfdf" origin="0.5, 0" position="0.5, 0"></v:fill>
 </v:background>
<![endif]-->
   <table cellspacing="0" cellpadding="0" width="100%" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#E0DFDF">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table cellspacing="0" cellpadding="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" role="none">
             <tr>
              <td bgcolor="#1B1D20" align="left" style="padding:10px;Margin:0;background-color:#1B1D20">
               <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td valign="top" align="center" style="padding:0;Margin:0;width:580px">
                   <table cellspacing="0" cellpadding="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><a href="https://iescalvia-voley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/webappmanifest192x192.png" alt="" width="84" class="img-6730" height="84" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
                      <td align="left" class="es-text-3268" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:30px;font-style:normal;font-weight:normal;line-height:36px;color:#FFC700"><strong class="es-override-size es-text-mobile-size-18" style="font-size:22px">IES Calvià Voley Tournament</strong></h1></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" style="padding:20px;Margin:0">
               <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" cellpadding="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#333333"><b style="color:#1666ff">Preinscripció realitzada correctament al ${ConfTorneo?.nombre}</b></h2></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;font-size:0">
                       <table cellspacing="0" cellpadding="0" width="10%" height="100%" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td style="padding:0;Margin:0;border-bottom:3px solid #FFC700;background:none;height:0px;width:100%;margin:0px"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Benvolguts/des,<br><br>Hem rebut correctament la vostra preinscripció al ${ConfTorneo?.nombre}. Us informem que aquesta preinscripció serà revisada pel nostre equip de staff per assegurar que compleix amb tots els requisits necessaris. Un cop validada, rebreu un correu electrònic confirmant l'acceptació definitiva de la vostra inscripció.<br><br>Gràcies per la vostra participació i no dubteu a contactar-nos si teniu cap dubte.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#31cb4b" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#31cb4b;width:600px" role="none">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#2cb543" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2cb543;width:600px" role="none">
             <tr>
              <td bgcolor="#2cb543" align="left" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
               <table cellspacing="0" cellpadding="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:20px"></td><td style="width:290px" valign="top"><![endif]-->
               <table cellspacing="0" cellpadding="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td bgcolor="#2cb543" align="left" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:300px" valign="top"><![endif]-->
               <table cellspacing="0" cellpadding="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:0px"></td><td style="width:300px" valign="top"><![endif]-->
               <table cellspacing="0" cellpadding="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" bgcolor="#1B1D20" class="es-m-p10t" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                       <table cellspacing="0" cellpadding="0" width="100%" height="100%" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td style="padding:0;Margin:0;border-bottom:2px solid #FFC700;background:none;height:0px;width:100%;margin:0px"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#FFC700">Equip Inscrit Per:</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p0r es-m-p0l" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;padding-bottom:10px">
               <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                 <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:130px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" class="es-text-3285" style="padding:0;Margin:0"><p class="es-override-size es-text-mobile-size-14 es-m-txt-c" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#FFFFFF;font-size:16px">${usuario_nombre}</p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:280px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" class="es-text-9774" style="padding:0;Margin:0"><p class="es-text-mobile-size-14 es-override-size" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:19.2px;letter-spacing:0;color:#FFFFFF;font-size:16px">${usuario_email}</p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:130px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" class="es-text-8594" style="padding:0;Margin:0"><p class="es-text-mobile-size-14 es-override-size" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#FFFFFF;font-size:16px">${usuario_curso}</p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" class="es-text-2485" style="padding:0;Margin:0"><h1 class="es-text-mobile-size-36 es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:36px;font-style:normal;font-weight:normal;line-height:43.2px;color:#1666ff"><strong>${nombre_equipo}</strong></h1></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><img src="${publicUrl}" alt="" width="250" class="img-6359" height="250" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
               <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                 <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:57px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Estat:</h4></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:81px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" bgcolor="#ffd966" class="es-text-9857" style="Margin:0;padding-top:4px;padding-right:8px;padding-bottom:4px;padding-left:8px;border-radius:10px"><p class="es-text-mobile-size-18" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#bf9000;font-size:18px;border-radius:10px"><strong>REVISANT</strong></p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:402px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" class="es-text-2701" style="padding:0;Margin:0"><p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#FFFFFF;font-size:16px"><span style="color:#FFC700">Capità:</span> ${capitan}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#FFC700">Entrenador</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p20l es-m-p20r es-m-p10t es-m-p10b" style="padding:0;Margin:0;padding-top:20px;padding-right:40px;padding-left:40px;border-radius:10px">
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:520px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" bgcolor="#313131" style="border-radius:10px;padding:10px;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><strong>${acompañante_nombre} ${acompañante_1r_apellido} ${acompañante_2n_apellido}</strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Curs: ${acompañante_curso}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Email: ${acompañante_email}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#FFC700">Alumnes Jugadors</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             
             ${jugadores.map(jugador => `
              <tr>
              <td align="left" class="es-m-p20l es-m-p20r" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:40px;padding-left:40px;border-radius:10px">
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:520px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" bgcolor="#313131" class="es-text-4830" style="border-radius:10px;padding:10px;Margin:0"><h5 class="es-text-mobile-size-16" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#1666ff"><strong>Jugador ${jugador.numero}</strong></h5><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><strong>${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Curs: ${jugador.curso}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Email: ${jugador.email}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
            `).join('')}
            ${jugadores_extra.map(jugador => `
              <tr>
              <td align="left" class="es-m-p20l es-m-p20r" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:40px;padding-left:40px;border-radius:10px">
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:520px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" bgcolor="#313131" class="es-text-4830" style="border-radius:10px;padding:10px;Margin:0"><h5 class="es-text-mobile-size-16" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#1666ff"><strong>Jugador ${jugador.numero}</strong></h5><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><strong>${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Curs: ${jugador.curso}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Email: ${jugador.email}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
            `).join('')}
            <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#FFC700">Tècnics d'equip</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             ${staff.map(jugador => `
              <tr>
              <td align="left" class="es-m-p20l es-m-p20r" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:40px;padding-left:40px;border-radius:10px">
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:520px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" bgcolor="#313131" class="es-text-4830" style="border-radius:10px;padding:10px;Margin:0"><h5 class="es-text-mobile-size-16" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#1666ff"><strong>Staff ${jugador.numero}</strong></h5><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><strong>${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Curs: ${jugador.curso}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Email: ${jugador.email}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
            `).join('')}
             <tr>
              <td align="left" bgcolor="#0E347D" style="Margin:0;padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;background-color:#0E347D">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:580px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Aquest és un correu generat automàticament, per la qual cosa no podem respondre els missatges enviats a aquesta adreça. Si necessiteu ajuda o teniu algun dubte, si us plau, poseu-vos en contacte amb nosaltres a través del correu voley_tournament@iescalvia.com.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:193px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
               </table><!--[if mso]></td><td style="width:173px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:173px">
                   <table cellspacing="0" cellpadding="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h3 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#333333"><strong style="color:#1666ff">Organitzat per</strong></h3></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellspacing="0" cellpadding="0" class="es-table-not-adapt" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:173px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:270px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" style="padding:0;Margin:0;font-size:0"><img src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/organizadores.png" alt="" width="250" height="100" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                         </tr><!--[if !mso]><!-- -->
                         <tr class="es-desk-hidden" style="display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;mso-hide:all">
                          <td align="center" bgcolor="#1B1D20" class="es-m-p10b es-m-p10t" style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-bottom:40px;font-size:0">
                           <table cellspacing="0" cellpadding="0" width="100%" height="100%" border="0" class="es-spacer-6583" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td style="padding:0;Margin:0;border-bottom:1px solid #1666ff;background:none;height:0px;width:100%;margin:0px"></td>
                             </tr>
                           </table></td>
                         </tr><!--<![endif]-->
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td><td style="width:20px"</td><td style="width:174px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="center" style="padding:0;Margin:0;width:174px">
                   <table cellspacing="0" cellpadding="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;font-size:0"><img src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_245.png" alt="" width="125" height="107" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
        <table cellspacing="0" cellpadding="0" align="center" class="es-footer">
                <tbody>
                  <tr>
                    <td align="center" class="esd-stripe">
                      <table cellspacing="0" cellpadding="0" width="600" align="center" class="es-footer-body">
                        <tbody>
                          <tr>
                            <td align="left" bgcolor="#1B1D20" class="esd-structure es-p20" style="background-color:#1B1D20">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tbody>
                                  <tr>
                                    <td width="560" align="left" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                        <tbody>
                                          <tr>
                                            <td align="center" class="esd-block-image" style="font-size:0">
                                              <a target="_blank">
                                                <img width="560" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_246.png" alt="" class="adapt-img">
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" bgcolor="#0E347D" class="esd-structure es-p20t es-p20r es-p20l" style="background-color:#0E347D">
                              <table cellspacing="0" width="100%" cellpadding="0">
                                <tbody>
                                  <tr>
                                    <td align="left" width="560" class="esd-container-frame">
                                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                        <tbody>
                                          <tr>
                                            <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">
                                              <p style="color:#FFFFFF">
                                                Heu rebut aquest correu perquè heu realitzat la preinscripció al torneig des de la nostra web <a target="_blank" href="https://iescalvia-coley.com" style="color:#FFC700"><strong>iescalvia-voley.com</strong></a> utilitzant el compte de correu <strong style="color:#FFC700"><a style="color:#FFC700">${usuario_email}</a></strong>.
                                              </p>
                                              <p style="color:#FFFFFF">
                                                Per a més informació sobre com tractem les vostres dades, podeu consultar el nostre <a href="https://iescalvia-voley.com/aviso-legal" target="_blank" style="color:#FFC700">Avís Legal</a> i <a target="_blank" href="https://iescalvia-voley.com/cookies" style="color:#FFC700">Política de Cookies</a>.&nbsp;
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`;

//email torneo
const organizadores = "voley_tournament@iescalvia.com";

try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [organizadores], // Asegúrate de que esta variable tenga el valor correcto
    subject: `Nova Inscripció Realitzada de l'equip ${nombre_equipo} | Versió Inscriptor`,
    html: emailBody,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
  let asunto = `Nova Inscripció Realitzada de l'equip ${nombre_equipo}  | Versió Inscriptor`
  const { data: Emails, error: EmailsError } = await supabaseAdmin
  .from('Emails')
  .insert([
    { destinatario: organizadores, asunto: asunto, contenido: emailBody, id_resend: data?.id },
  ])
  .select()
} catch (error) {
  console.error("Error al enviar el correo:", error);
}

//Realizador Inscripcion
try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [usuario_email], // Asegúrate de que esta variable tenga el valor correcto
    subject: `Inscripció Realitzada de l'equip ${nombre_equipo} | Versió Inscriptor`,
    html: emailBody,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
  let asunto = `Inscripció Realitzada de l'equip ${nombre_equipo}  | Versió Inscriptor`
  const { data: Emails, error: EmailsError } = await supabaseAdmin
  .from('Emails')
  .insert([
    { destinatario: usuario_email, asunto: asunto, contenido: emailBody, id_resend: data?.id },
  ])
  .select()
} catch (error) {
  console.error("Error al enviar el correo:", error);
}

//Capitan
if (capitan_email !== usuario_email){
  if(capitan_edit === "si_edit"){
    try {
      const { data, error } = await resend.emails.send({
        from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
        to: [capitan_email], // Asegúrate de que esta variable tenga el valor correcto
        subject: `Inscripció Realitzada de l'equip ${nombre_equipo} | Versió Capità`,
        html: emailBody,
      });
    
      if (error) {
        throw new Error(error.message); // Lanza un error si hay un problema
      }
    
      console.log("Correo enviado correctamente", data);
      let asunto = `Inscripció Realitzada de l'equip ${nombre_equipo} | Versió Capità`
      const { data: Emails, error: EmailsError } = await supabaseAdmin
      .from('Emails')
      .insert([
        { destinatario: capitan_email, asunto: asunto, contenido: emailBody, id_resend: data?.id },
      ])
      .select()
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  }
}





  }else{
    console.log("No se envian emails");
  }

  

// try {
//   send: defineAction({
//     accept: 'form',
//     handler: async () => {
//       const { data, error } = await resend.emails.send({
//         from: 'IES Calvià Voley Tournament <onboarding@resend.dev>',
//         to: [usuario_email],
//         subject: `Inscripció Realitzada de ${nombre_equipo}`,
//         html: emailContent,
//       });

//       if (error) {
//         throw new ActionError({
//           code: 'BAD_REQUEST',
//           message: error.message,
//         });
//       }

//       return data;
//     },
//   }),
//   console.log("Correo enviado correctamente");
// } catch (error) {
//   console.error("Error al enviar el correo:");
// }

  return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
};
