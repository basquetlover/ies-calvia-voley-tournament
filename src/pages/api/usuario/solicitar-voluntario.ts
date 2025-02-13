
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const tipo = formData.get("tipo")?.toString().trim() || "";
  const usuario_nombre = formData.get("usuario_nombre")?.toString().trim() || "";
  const usuario_email = formData.get("usuario_email")?.toString().trim() || "";
  const usuario_curso = formData.get("usuario_curso")?.toString().trim() || "";
  const usuario_id = formData.get("usuario_id")?.toString().trim() || "";

  const condiciones = formData.get("condiciones")?.toString().trim();


  if(!condiciones){
    console.log(condiciones)
    return new Response(
      `
      <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p>És necessari acceptar les condicions d'inscripció, l'avís legal i la política de privacitat per continuar amb el procés</p>
        </div>
      `, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }

  let publicUrl = "https://iescalvia-voley.com/img/escudos/sin-escudo.png";
  let voluntario_nombre = "";
  let voluntario_curso = "";
  let voluntario_1r_apellido = "";
  let voluntario_2n_apellido = "";
  let voluntario_genero = "";
  let voluntario_email = "";

  let voluntario = "";

   voluntario_nombre = formData.get("voluntario_name")?.toString().trim() || "";
   voluntario_curso = formData.get(`voluntario_curso`)?.toString().trim() || "";
   voluntario_1r_apellido = formData.get(`voluntario_1r_apellido`)?.toString().trim() || "";
   voluntario_2n_apellido = formData.get(`voluntario_2n_apellido`)?.toString().trim() || "";
   voluntario_genero = formData.get(`genero_voluntario`)?.toString().trim() || "";
   voluntario_email = formData.get(`voluntario_email`)?.toString().trim() || "";

   voluntario = voluntario_nombre + " " + voluntario_1r_apellido;
  if (voluntario_email) { 
    const dominio = voluntario_email.split('@')[1]; // Esto te dará 'gmail.com'
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

// let { data: Usuarios, error } = await supabaseAdmin
//     .from('JugadoresSS')
//     .select('email')

//     if (Usuarios) {
  
    
//       // Verificar si ya existe un usuario con el mismo email
//       const userExistsByEmail = Usuarios.some(usuario => usuario.email === voluntario_email);
      
//       if (userExistsByEmail) {
//         return new Response(
//           `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'entrenador ja es troba inscrit.</div>`, 
//           { status: 400, headers: { "Content-Type": "text/html" } }
//         );
//       }
//     }

  if (!voluntario_genero) {
    return new Response(
      `
      <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p>Seleccioni el gènere del voluntari</p>
        </div>
      `, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
  }

  if (!tipo) {
    return new Response(
      `
      <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p>Seleccioni el tipus de voluntari</p>
        </div>
      `, 
      { status: 401, headers: { "Content-Type": "text/html" } }
  );
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
  


  // Recoger la información del escudo (imagen)
  const escudo = formData.get("voluntario_img") as File;
  console.log("Tipo de archivo:", escudo.name);
  console.log("Tipo de archivo:", escudo.type);
  console.log("Tamaño de archivo:", escudo.size);
   
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

// // Llama a la función para subir el escudo
// const escudoPath = await uploadFile(escudo, voluntario_email);

// //Obtener la URL pública del escudo subido
// const { data: urlData } = supabaseAdmin.storage
//     .from('EquiposIMG')
//     .getPublicUrl(escudoPath); // Usa el escudoPath que se generó al subir el archivo

// // Verifica si urlData contiene la propiedad publicUrl
// if (!urlData || !urlData.publicUrl) {
//   //   console.error("No se pudo obtener la URL pública del escudo.");
//   //   return new Response(
//   //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error en processar l'escut. Torna-ho a intentar més tard.</div>`, 
//   //     { status: 401, headers: { "Content-Type": "text/html" } }
//   // );
// }
// if (urlData) {
//   publicUrl = urlData.publicUrl;
// }


// // Ahora puedes usar urlData.publicUrl para insertar en la base de datos

// console.log("URL pública del escudo:", publicUrl);

const getCurrentDateInCatalan = () => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date();
  return new Intl.DateTimeFormat('ca-ES', options).format(date);
};

const currentDate = getCurrentDateInCatalan();
console.log(currentDate);

    
//   // Insertar los datos en la tabla 'administradores'
//    const { data: datosEquipos, error: equipoError } = await supabaseAdmin
//     .from('')
//     .insert([
//         { nombre_equipo: nombre_equipo ,
//           id_equipo: id_equipo ,
//           capitan: capitan,
//           entrenador: acompañante,
//           escudo: publicUrl,
//           inscrito: usuario_id,
//           estado: 'Revisant',
//           aceptado: `Llista d'espera`,
//           fecha_inscripcion: currentDate,
//         },
//     ])
//     .select()

//   if (equipoError) {
//     console.error("Error insertando en equipos:", equipoError.message);
//     return new Response(
//       `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error error en afegir l'equip.. Torna-ho a intentar més tard.</div>`, 
//       { status: 401, headers: { "Content-Type": "text/html" } }
//   );
//   }




  console.log("Equipo añadido correctamente");


  //Enviar Email
  const acceso_emails = "email-voluntarios";
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


const emailBody = ``;

//Realizador Inscripcion
try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [usuario_email], // Asegúrate de que esta variable tenga el valor correcto
    subject: `Sol·licitud voluntari ${voluntario_nombre}`,
    html: emailBody,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
  let asunto = `Sol·licitud voluntari ${voluntario_nombre}`
  const { data: Emails, error: EmailsError } = await supabaseAdmin
  .from('Emails')
  .insert([
    { destinatario: usuario_email, asunto: asunto, contenido: emailBody, id_resend: data?.id },
  ])
  .select()
} catch (error) {
  console.error("Error al enviar el correo:", error);
}







  }else{
    console.log("No se envian emails");
  }



  return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
};
