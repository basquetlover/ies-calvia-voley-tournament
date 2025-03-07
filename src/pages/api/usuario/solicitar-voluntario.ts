
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
  const descripcion = formData.get("descripcion")?.toString().trim() || "";
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

let { data: Usuarios, error } = await supabaseAdmin
    .from('Voluntarios')
    .select('email')
    
    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === voluntario_email);
      
      if (userExistsByEmail) {
        return new Response(
          `
          <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p>El voluntari ja es troba inscrit.</p>
        </div>
          `, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }

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
   
async function uploadFile(file: File, email: string) {
  // Extraer la extensión del archivo
  const extension = file.name.split('.').pop(); // Obtiene la extensión
  const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
  const filePath = `${uniqueFileName}`; // Define la ruta del archivo

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

// Llama a la función para subir el escudo
const escudoPath = await uploadFile(escudo, voluntario_email);

//Obtener la URL pública del escudo subido
const { data: urlData } = supabaseAdmin.storage
    .from('JugadoresIMG')
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


// Ahora puedes usar urlData.publicUrl para insertar en la base de datos

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
    .from('Voluntarios')
    .insert([
        { nombre: voluntario_nombre ,
          _1r_apellido: voluntario_1r_apellido ,
          _2n_apellido: voluntario_2n_apellido,
          curso: voluntario_curso,
          genero: voluntario_genero,
          email: voluntario_email,
          tipo: tipo,
          descripcion: descripcion,
          estado: `Revisant`,
          img: publicUrl,
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


const emailBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="ca">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="telephone=no" name="format-detection">
  <title>Nuevo mensaje</title><!--[if (mso 16)]>
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
  <style type="text/css">.rollover:hover .rollover-first {
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
.b {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
}
@media only screen and (max-width:600px) {     }
@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
 </head>
 <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="ca" style="background-color:#F6F6F6"><!--[if gte mso 9]>
 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
   <v:fill type="tile"  color="#e0dfdf" origin="0.5, 0" position="0.5, 0"></v:fill>
 </v:background>
<![endif]-->
   <table cellpadding="0" cellspacing="0" width="100%" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table align="center" cellpadding="0" cellspacing="0" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" role="none">
             <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:10px;Margin:0;background-color:#1B1D20">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/webappmanifest192x192.png" width="84" class="img-6730" height="84" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
                      <td align="left" class="es-text-3268" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:40px;font-style:normal;font-weight:normal;line-height:48px;color:#FFC700"><strong class="es-override-size es-text-mobile-size-18" style="font-size:22px">IES Calvià Voley Tournament</strong></h1></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" style="padding:20px;Margin:0">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" width="100%" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:32px;font-style:normal;font-weight:normal;line-height:38.4px;color:#1666FF"><strong>La teva sol·licitud ha estat rebuda correctament<br></strong></h2></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;font-size:0">
                       <table height="100%" width="10%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td style="padding:0;Margin:0;margin:0px;border-bottom:3px solid #FFC700;background:none;height:0px;width:100%"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Benvolgut/a,</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">El nostre equip ha revisat la teva sol·licitud i ens agrada a informar-lo que aviat serà revisada per un dels nostres staffs. Agraïm la teva participació i espera per a formar part de l'IES Calvià Voley Tournament.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">En cas de qualsevol pregunta no dubti en contactar-nos en la secció de contactes de la nostra web.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">&nbsp;Consulta els detalls a la pàgina d’inscripció del teu compte per obtenir més informació.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#31cb4b" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#31cb4b;width:600px" role="none">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#2cb543" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2cb543;width:600px" role="none">
             <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:20px"></td><td style="width:290px" valign="top"><![endif]-->
               <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:300px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:0px"></td><td style="width:300px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" align="center" bgcolor="#ffffff" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
               <table cellspacing="0" cellpadding="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                 <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellspacing="0" align="left" cellpadding="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:57px">
                       <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Estat:</h4></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:81px">
                       <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" bgcolor="#FFBF65" class="es-text-9857" style="Margin:0;padding-top:4px;padding-right:8px;padding-bottom:4px;padding-left:8px"><p class="es-text-mobile-size-18" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#13702c;font-size:18px"><strong style="color:#d27c2c">Revisant</strong><strong><br></strong></p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:402px">
                       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:170px" valign="top"><![endif]-->
               <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:170px">
                   <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Data inscripció:</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td><td style="width:390px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:390px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" class="es-text-2569" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#FFFFFF;font-size:14px"><span class="es-text-mobile-size-18" style="font-size:18px">${currentDate}</span></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p20l es-m-p20r" style="Margin:0;padding-top:10px;padding-right:40px;padding-bottom:10px;padding-left:40px;border-radius:10px">
               <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:520px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td bgcolor="#313131" align="left" class="es-text-4830" style="padding:10px;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><strong>${voluntario_nombre} ${voluntario_1r_apellido} ${voluntario_2n_apellido}</strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Curs: ${voluntario_curso}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Email: ${voluntario_email}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" bgcolor="#0E347D" style="Margin:0;padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;background-color:#0E347D">
               <table cellspacing="0" width="100%" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:580px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Aquest és un correu generat automàticament, per la qual cosa no podem respondre els missatges enviats a aquesta adreça. Si necessiteu ajuda o teniu algun dubte, si us plau, poseu-vos en contacte amb nosaltres a través del correu voley_tournament@iescalvia.com.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:463px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h3 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:28px;font-style:normal;font-weight:normal;line-height:33.6px;color:#333333"><strong style="color:#1666ff">Organitzat per</strong></h3></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:463px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:560px">
                       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" style="padding:0;Margin:0;font-size:0"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/organizadores.png" width="250" height="100" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
             <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:20px;Margin:0;background-color:#1B1D20">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_246.png" width="560" class="adapt-img" height="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td bgcolor="#0E347D" align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;background-color:#0E347D">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff">Heu rebut aquest correu perquè heu realitzat la preinscripció al torneig des de la nostra web</span> <a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px"><strong>iescalvia-voley.com</strong></a> <span style="color:#ffffff">utilitzant el compte de correu</span> <strong style="color:#FFC700"><a style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px" target="_blank" href="">${usuario_email}</a></strong>.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff"> Per a més informació sobre com tractem les vostres dades, podeu consultar el nostre</span> <a href="https://iescalvia-voley.com/aviso-legal" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Avís Legal</a> i <a href="https://iescalvia-voley.com/cookies" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Política de Cookies</a>.&nbsp;</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table>
  </div>
 </body>
</html>
`;

//Realizador Inscripcion
const organizadores = "voley_tournament@iescalvia.com";
try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [organizadores], // Asegúrate de que esta variable tenga el valor correcto
    subject: `Nova Sol·licitud voluntari ${voluntario_nombre}`,
    html: emailBody,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
  let asunto = `Nova Sol·licitud voluntari ${voluntario_nombre}`
  const { data: Emails, error: EmailsError } = await supabaseAdmin
  .from('Emails')
  .insert([
    { destinatario: organizadores, asunto: asunto, contenido: emailBody, id_resend: data?.id },
  ])
  .select()
} catch (error) {
  console.error("Error al enviar el correo:", error);
}


try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
    to: [voluntario_email], // Asegúrate de que esta variable tenga el valor correcto
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
    { destinatario: voluntario_email, asunto: asunto, contenido: emailBody, id_resend: data?.id },
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
