
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
  const usuario_nombre = formData.get("usuario_nombre")?.toString().trim() || "";
  const usuario_email = formData.get("usuario_email")?.toString().trim() || "";
  const usuario_curso = formData.get("usuario_curso")?.toString().trim() || "";
  const usuario_id = formData.get("usuario_id")?.toString().trim() || "";
  const capitan = formData.get("capitan")?.toString().trim();

  let publicUrl = "https://iescalvia-voley.com/img/escudos/sin-escudo.png";
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
  

//   // Verificar si el equipo ya existe en la tabla 'EquiposSS'
//   const { data: existingEquipo, error: checkError } = await supabaseAdmin
//   .from("EquiposSS")
//   .select("id") // Seleccionar un campo mínimo
//   .eq("nombre_equipo", nombre_equipo);

// if (checkError) {
//   console.error("Error al verificar la existencia:", checkError.message);
//   return new Response(
//     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Error: Torna-ho a intentar més tard.</div>`, 
//     { status: 401, headers: { "Content-Type": "text/html" } }
// );
// }


// if (existingEquipo && existingEquipo.length > 0) {
//   console.log("El equipo ya esta inscrito.")
//   return new Response(
//     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ja existeix un equip amb aquest nom</div>`, 
//     { status: 401, headers: { "Content-Type": "text/html" } }
// );
// }
   
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
// const escudoPath = await uploadFile(escudo, id_equipo);

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
    
    
//   // Insertar los datos en la tabla 'administradores'
//    const { data: datosEquipos, error: equipoError } = await supabaseAdmin
//     .from('EquiposSS')
//     .insert([
//         { nombre_equipo: nombre_equipo ,
//           id_equipo: id_equipo ,
//           capitan: capitan,
//           entrenador: acompañante,
//           escudo: publicUrl,
//           inscrito: usuario_id,
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

  // const { data: equipoData, error: busquedaError } = await supabaseAdmin
  //   .from('EquiposSS')
  //   .select('id')
  //   .eq('nombre_equipo', nombre_equipo)
  //   .single();

  // if (busquedaError || !equipoData) {
  //   console.error("Error buscando el ID del equipo:", busquedaError?.message);
  //   return new Response(
  //     `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Hi ha hagut un error error en processar l'equip.. Torna-ho a intentar més tard.</div>`, 
  //     { status: 401, headers: { "Content-Type": "text/html" } }
  // );
  // }

  // const equipoId = equipoData.id;

  // for (const jugador of jugadores) {
  //   const { error: jugadorError } = await supabaseAdmin
  //     .from('JugadoresSS')
  //     .insert([
  //       {   nombre: jugador.nombre, 
  //           _1r_apellido: jugador._1r_apellido,
  //           _2n_apellido: jugador._2n_apellido,
  //           curso: jugador.curso,
  //           genero: jugador.genero,
  //           pertenece_equipo: equipoId,
  //           email: jugador.email,
  //           ficha: 'jugador',
  //         },
  //     ]).select()

  //   if (jugadorError) {
  //     console.error("Error insertando jugador principal:", jugadorError.message);
  //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
  //   }
  // }

  // for (const jugador of jugadores_extra) {
  //   const { error: jugadorExtraError } = await supabaseAdmin
  //     .from('JugadoresSS')
  //     .insert([
  //       { nombre: jugador.nombre, 
  //         _1r_apellido: jugador._1r_apellido,
  //         _2n_apellido: jugador._2n_apellido,
  //         curso: jugador.curso,
  //         genero: jugador.genero_extra,
  //         pertenece_equipo: equipoId,
  //         email: jugador.email,
  //         ficha: 'jugador',
  //       },
  //   ]).select()

  //   if (jugadorExtraError) {
  //     console.error("Error insertando jugador extra:", jugadorExtraError.message);
  //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
  //   }
  // }

  // const { error: jugadorExtraError } = await supabaseAdmin
  //     .from('JugadoresSS')
  //     .insert([
  //       { nombre: acompañante_nombre, 
  //         _1r_apellido: acompañante_1r_apellido,
  //         _2n_apellido: acompañante_2n_apellido,
  //         curso: acompañante_curso,
  //         genero: acompañante_genero,
  //         email: acompañante_email,
  //         pertenece_equipo: equipoId,
  //         ficha: 'entrenador',
  //       },
  //   ]).select()

  //   if (jugadorExtraError) {
  //     console.error("Error insertando jugador extra:", jugadorExtraError.message);
  //     // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
  //   }


  console.log("Equipo añadido correctamente");


  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const emailContent = `
<!DOCTYPE html>
<html>
  <head>
      <meta charset="UTF-8" />
      <title>IES Calvià Voley Tournament</title>
  </head>
  <body>
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <a href="https://iescalvia-voley.com" style="display: flex; align-items: center; gap: 4px; text-decoration: none;">
            <img src="https://iescalvia-voley.com/web-app-manifest-192x192.png" alt="Logo IES Calvia voley tournament" style="width: 60px; height:60px;"/>
            <h1 style="color: #ffc107; font-size:20px; font-weight:bold;">IES Calvià Voley Tournament</h1>
        </a>
        <hr style="border: 1px solid #333; border-radius: 10px; margin: 30px 0" />
        <div style="margin-bottom: 16px; font-family:Roboto Condensed, sans-serif;font-size:32px; font-weight:bold; line-height:38px;text-align:center; color: #1666FF;">
            Equip inscrit correctament al torneig de Setmana Santa
        </div>
        <h2 style="color: #FFC107; font-size: 24px; margin-bottom: 16px;">Equip Inscrit Per:</h2>
        <div style="display: grid; grid-template-columns: max-content 1fr max-content; align-items: center; place-items: center; text-lg; color: #ffffff; margin-bottom: 20px;">
        <table style="width: 100%;">
          <tr>
            <th>
              <p style="margin: 0;">${usuario_nombre}</p>
            </th>
            <th>
              <p style="margin: 0;">${usuario_email}</p>
            </th>
            <th>
              <p style="margin: 0;">${usuario_curso}</p>
            </th>
          </tr>
        </table>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <h3 style="font-size: 32px; background-color: transparent; color: #FFC107; padding: 10px; border-radius: 5px;">IES Calvià Voley Team</h3>
        </div>
        <div style="width: 240px; height: 240px; margin: auto; border-radius: 10px; overflow: hidden;">
          <img src=${publicUrl} alt="Logo equipo" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="display: flex; align-items: center; margin-top: 16px;">
          <label style="color: #FFC107; font-size: 20px; margin-right: 8px;">Capità: <span style="color: #fff;">${capitan}</span></label>
          <p style="background-color: transparent; color: #ffffff; padding: 8px; border-radius: 5px;"></p>
        </div>
        
        <h4 style="margin-top: 20px; font-size: 24px; color: #FFC107;">Entrenador</h4>
        <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <div style="display: flex; flex-direction: column; margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${acompañante_nombre} ${acompañante_1r_apellido} ${acompañante_2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${acompañante_curso} </p>
              </tr>
              <tr>
                <p style="color: #ffffff; text-decoration:none;">Email: ${acompañante_email}</p>
              </tr>
            </table>
            </div>
        </div>
        
        <h4 style="margin-top: 20px; font-size: 24px; color: #FFC107;">Alumnes Jugadors</h4>
        ${jugadores.map(jugador => `
          <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
                <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${jugador.curso}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Email: ${jugador.email}</p>
              </tr>
            </table>
            
          </div>
        `).join('')}
        ${jugadores_extra.map(jugador => `
          <div style="margin-bottom: 10px; padding: 10px; background-color: #333; border-radius: 5px;">
            <table>
              <tr>
                <p style="margin: 0; font-weight: bold; color: #ffffff;">${jugador.nombre} ${jugador._1r_apellido} ${jugador._2n_apellido}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Curs: ${jugador.curso}</p>
              </tr>
              <tr>
                <p style="color: #ffffff;">Email: ${jugador.email}</p>
              </tr>
            </table>
            
          </div>
        `).join('')}

        <hr style="border: 1px solid #ffc107; border-radius: 10px; margin: 30px 0" />
        <div style="width: 100%;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <table style="width: 100%;">
            <tr>
              <h4 style="color: #1666FF; font-size: 22px; white-space: nowrap; font-weight: 600; text-transform: uppercase; text-align: center;">Organitzat per</h4>
            </tr>
            <tr>
              <th>
                  <a>
                      <img src="https://iescalvia-voley.com/img/team-teto.png" style="width: 175px; height: 175px;" alt="TEAM Teto" />
                  </a>
              </th>
              <th>
                  <a href="https://sites.google.com/iescalvia.com/iescalvia/inici" target="_blank">
                      <img src="https://iescalvia-voley.com/img/ies-calvia.png" style="width: 175px; height: 175px;" alt="IES Calvi=C3=A0" />
                  </a>
                </th>
            </tr>
          </table>
              
          </div>
          
          <div style="display: flex; flex-direction: row; justify-items: center; align-items: center; font-size: 16px;">
              <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
                <img src="https://iescalvia-voley.com/img/licencia/cc.png" style="width: 20px; height:20px; margin: 0 4px;" alt="Creative Comons"/>
                2024 - IES Calvià Voley Tournament
              </div>
              <span style="margin: 0 4px;">|</span>
              <span>
              <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/?refselecter-v1" style="display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 16px; color: #fff;" target="_blank" rel="licencia noopener noreferrer">Tots els drets reservats.
                <img src="https://iescalvia-voley.com/img/licencia/attribution.png" style="width: 20px; height:20px; margin: 0 4px;" alt="Attribution"/>
                <img src="https://iescalvia-voley.com/img/licencia/nc.png" style="width: 20px; height:20px; margin: 0 4px;" alt="NonCommercial"/>
                <img src="https://iescalvia-voley.com/img/licencia/nd.png" style="width: 20px; height:20px; margin: 0 4px;" alt="NoDerivatives"/>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
try {
  const { data, error } = await resend.emails.send({
    from: 'IES Calvià Voley Tournament <onboarding@resend.dev>',
    to: [usuario_email], // Asegúrate de que esta variable tenga el valor correcto
    subject: `Inscripció Completada de ${nombre_equipo}`,
    html: emailContent,
  });

  if (error) {
    throw new Error(error.message); // Lanza un error si hay un problema
  }

  console.log("Correo enviado correctamente", data);
} catch (error) {
  console.error("Error al enviar el correo:", error);
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
