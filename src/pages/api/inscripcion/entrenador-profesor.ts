import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
//import { Resend } from 'resend';

let TablaJugadores = "Jugadores";
let TablaEquipos = "Equipos";
let Equipo_id = "sin_equipo"
let equipoId = "";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();

if(ConfTorneo){
  TablaJugadores = `Jugadores${ConfTorneo.id_torneo}`
  TablaEquipos = `Equipos${ConfTorneo.id_torneo}`
}


export const POST: APIRoute = async ({ request }) => {
  
// console.log("Datos a entrenador/profesor")
// function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
//   await sleep(10000);

  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";

  const { data: EquipoData, error: checkError } = await supabaseAdmin
  .from(TablaEquipos)
  .select("id, id_equipo") // Seleccionar un campo mínimo
  .eq("nombre_equipo", nombre_equipo)
  .single();

  if(EquipoData){
    Equipo_id = EquipoData?.id_equipo
    equipoId = EquipoData?.id
  }


//1.- Procesar Entrenador
  let acompañante_nombre = "";
  let acompañante_curso = "";
  let acompañante_1r_apellido = "";
  let acompañante_2n_apellido = "";
  let acompañante_genero = "";
  let acompañante_email = "";

  let acompañante = "";
  const acompañante_foto = formData.get('entrenador_img')  as File;
  acompañante_nombre = formData.get("entrenador_name")?.toString().trim() || "";
  if(acompañante_nombre !== "") {
   acompañante_curso = formData.get(`entrenador_curso`)?.toString().trim() || "";
   acompañante_1r_apellido = formData.get(`entrenador_1r_apellido`)?.toString().trim() || "";
   acompañante_2n_apellido = formData.get(`entrenador_2n_apellido`)?.toString().trim() || "";
   acompañante_genero = formData.get(`genero_entrenador`)?.toString().trim() || "";
   acompañante_email = formData.get(`entrenador_email`)?.toString().trim() || "";
   

   acompañante = acompañante_nombre + " " + acompañante_1r_apellido;
    console.log(acompañante_nombre, acompañante_1r_apellido, acompañante_2n_apellido, acompañante_curso, acompañante_email)
    console.log("Tipo de archivo:", acompañante_foto?.name);
    console.log("Tipo de archivo:", acompañante_foto?.type);
    console.log("Tamaño de archivo:", acompañante_foto?.size);
  if (acompañante_email) { 
    const dominio = acompañante_email.split('@')[1]; // Esto te dará 'gmail.com'
    const dominioConArroba = '@' + dominio;
    if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
      console.log(`El email de l'entrenador ha de ser del centre`)
      return new Response(
            `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">El email de l'entrenador ha de ser del centre</p>
        </div>`, 
            { status: 401, headers: { "Content-Type": "text/html" } }
        );
  }
} 
console.log("Tabla de jugadores:", TablaJugadores);
// const { data: existingCoach, error: checkError } = await supabaseAdmin
//   .from(TablaJugadores)
//   .select("id") // Seleccionar un campo mínimo
//   .eq("email", acompañante_email);


let { data: Usuarios, error } = await supabaseAdmin
    .from(TablaJugadores)
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
      `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Seleccioni el gènere de l'entrenador</p>
        </div>`, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }
}

//2.- Procesar Profesor
let profesor_nombre = "";
let profesor_curso = "";
let profesor_1r_apellido = "";
let profesor_2n_apellido = "";
let profesor_genero = "";
let profesor_email = "";


let profesor = "";
const profesor_foto = formData.get('profesor_img')  as File;
profesor_nombre = formData.get("profesor_name")?.toString().trim() || "";
if(profesor_nombre !== "") {
 profesor_curso = formData.get(`profesor_curso`)?.toString().trim() || "";
 profesor_1r_apellido = formData.get(`profesor_1r_apellido`)?.toString().trim() || "";
 profesor_2n_apellido = formData.get(`profesor_2n_apellido`)?.toString().trim() || "";
 profesor_genero = formData.get(`genero_profesor`)?.toString().trim() || "";
 profesor_email = formData.get(`profesor_email`)?.toString().trim() || "";

 profesor = profesor_nombre + " " + profesor_1r_apellido;

 console.log(profesor_nombre, profesor_1r_apellido, profesor_2n_apellido, profesor_curso, profesor_email)
 console.log("Tipo de archivo:", profesor_foto?.name);
 console.log("Tipo de archivo:", profesor_foto?.type);
 console.log("Tamaño de archivo:", profesor_foto?.size);
if (profesor_email) { 
  const dominio = profesor_email.split('@')[1]; // Esto te dará 'gmail.com'
  const dominioConArroba = '@' + dominio;
  if (dominioConArroba !== "@a.iescalvia.com" && dominioConArroba !== "@iescalvia.com") {
    console.log(`El email del professor ha de ser del centre`)
    return new Response(
          `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">El email del professor ha de ser del centre</p>
        </div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
}
}
// const { data: existingCoach, error: checkError } = await supabaseAdmin
// .from(TablaJugadores)
// .select("id") // Seleccionar un campo mínimo
// .eq("email", profesor_email);

// if(existingCoach){
//  return new Response(
//    `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
//         <span>
//       <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
//         <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
//       </svg>
//         </span>
//         <p class="text-[#640404]">El professor ja està inscript en un altre Equip</p>
//         </div>`, 
//    { status: 401, headers: { "Content-Type": "text/html" } }
// );
// }
// if(checkError){
//  console.log("Entrenador no inscrito en otro equipo")
// }
let { data: Usuarios, error } = await supabaseAdmin
  .from(TablaJugadores)
  .select('email')

  if (Usuarios) {
  
    
    // Verificar si ya existe un usuario con el mismo email
    const userExistsByEmail = Usuarios.some(usuario => usuario.email === acompañante_email);
    
    if (userExistsByEmail) {
      return new Response(
        `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Del professor ja es troba inscrit.</p>
        </div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }
  }

if (!acompañante_genero) {
  return new Response(
    `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Seleccioni el gènere del professor</p>
        </div>`, 
    { status: 401, headers: { "Content-Type": "text/html" } }
);
}
}


//3.- Subir Imagen Entrenador
  //Llama a la función para subir el escudo
  let publicCoachUrl ="";
  if(acompañante_foto?.size > 0){
    const CoachPath = await uploadFileCoach(acompañante_foto, acompañante_email);

    
    //Obtener la URL pública del escudo subido
    const { data: urlDataCoach } = supabaseAdmin.storage
        .from('JugadoresIMG')
        .getPublicUrl(CoachPath); // Usa el escudoPath que se generó al subir el archivo

    //Verifica si urlData contiene la propiedad publicUrl
    
    if (urlDataCoach) {
      publicCoachUrl = urlDataCoach.publicUrl;
    }
  }
  

  //4.- Subir Imagen Profesor
  let publicProfesorhUrl ="";
  if(profesor_foto?.size > 0){
    const CoachPath = await uploadFileCoach(profesor_foto, profesor_email);
      
      //Obtener la URL pública del escudo subido
      const { data: urlDataCoach } = supabaseAdmin.storage
          .from('EquiposIMG')
          .getPublicUrl(CoachPath); // Usa el escudoPath que se generó al subir el archivo
      
      // Verifica si urlData contiene la propiedad publicUrl
      
      if (urlDataCoach) {
        publicCoachUrl = urlDataCoach.publicUrl;
      }
  }
  

  //5.- Subir datos a la db
  //5.1- Actualizar datos de Equipo
              const { data: datosEquipos, error: equipoError } = await supabaseAdmin
              .from(TablaEquipos)
              .update([
                  {   
                    entrenador: acompañante,
                  },
              ])
              .eq('id_equipo', equipoId)
              .select()

  //5.2.- Datos Entrenador
    if(acompañante_foto?.size <= 0){
    const { error: jugadorExtraError } = await supabaseAdmin
      .from(TablaJugadores)
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
  } else {
    const { error: jugadorExtraError } = await supabaseAdmin
      .from(TablaJugadores)
      .insert([
        { nombre: acompañante_nombre, 
          _1r_apellido: acompañante_1r_apellido,
          _2n_apellido: acompañante_2n_apellido,
          curso: acompañante_curso,
          genero: acompañante_genero,
          email: acompañante_email,
          pertenece_equipo: equipoId,
          img: publicCoachUrl,
          ficha: 'entrenador',
        },
    ]).select()

    if (jugadorExtraError) {
      console.error("Error insertando jugador extra:", jugadorExtraError.message);
      
    }
  }

  //5.3.- Datos Profesor
 if(profesor_foto?.size > 0){
   
      const { error: jugadorError } = await supabaseAdmin
      .from(TablaJugadores)
      .insert([
        {   nombre: profesor_nombre, 
          _1r_apellido: profesor_1r_apellido,
          _2n_apellido: profesor_2n_apellido,
          curso: profesor_curso,
          genero: profesor_genero,
          pertenece_equipo: equipoId,
          email: profesor_email,
          ficha: 'profesor',
          img: publicCoachUrl,
          },
      ])
      .select()

  }else{
    const { error: jugadorError } = await supabaseAdmin
    .from(TablaJugadores)
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

 }


    return new Response(
      JSON.stringify({ success: true, }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
};


async function uploadFileCoach(file: File, email: string | undefined) {
  // Extraer la extensión del archivo
  const extension = file.name.split('.').pop(); // Obtiene la extensión
  const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
  const filePath = `torneo${ConfTorneo?.id_torneo}/${Equipo_id}/${uniqueFileName}`; // Define la ruta del archivo

  const { data, error } = await supabaseAdmin.storage
      .from('JugadoresIMG')
      .upload(filePath, file); // Sube el archivo

  if (error) {
      console.error("Error al subir imagen:", error.message);
      throw new Error("Error al subir imagen.");
  }

  console.log("Imagen subida correctamente:", data.path);
  return filePath; // Devuelve la ruta del archivo
}