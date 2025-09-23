import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
//import { Resend } from 'resend';

let TablaEquipos = "Equipos";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();

if(ConfTorneo){
  TablaEquipos = `Equipos${ConfTorneo.id_torneo}`
}



export const POST: APIRoute = async ({ request }) => {
 
    //1.- Recopilar toda la informacion del formulario
      const formData = await request.formData();
      const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
      const capitan_edit = formData.get("capitan_edit")?.toString().trim();
      let publicUrl = "https://iescalvia-voley.com/img/escudos/sin-escudo.png";

      console.log(nombre_equipo,capitan_edit)
      const escudo = formData.get("foto") as File;
      console.log("Tipo de archivo:", escudo?.name);
      console.log("Tipo de archivo:", escudo?.type);
      console.log("Tamaño de archivo:", escudo?.size);

      const cookieHeader = request.headers.get('cookie');
  const cookies = new Map<string, string>();

  // Sacar la informacion del usuario realizador del formulario
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies.set(name, value);
    });
  }

   const sessionId = cookies.get('session_id');

   const { data: usuario, error } = await supabaseAdmin
    .from('Usuarios')
    .select('*')
    .eq('session_id', sessionId)
    .single();

    let usuario_id;
    let usuario_curso;
    let usuario_email;
    let usuario_nombre;
    if(usuario){
      usuario_id = usuario.id;
      usuario_curso = usuario.curso;
      usuario_email = usuario.email;
      usuario_nombre = usuario.nombre;
    }
      
   console.log(usuario_id, usuario_curso, usuario_email, usuario_nombre)
  
    
    //2.- Verificar nombre del equipo
      if(!nombre_equipo || nombre_equipo === "" || nombre_equipo === "Team Teto"){
        return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Es requereix el nom de l'equip</p>
        </div>
        `
, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      }
        const { data: existingEquipo, error: checkError } = await supabaseAdmin
        .from(TablaEquipos)
        .select("id") // Seleccionar un campo mínimo
        .eq("nombre_equipo", nombre_equipo);

      if (checkError) {
        console.error("Error al verificar la existencia:", checkError.message);
        return new Response(
          `
          <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Error: Torna-ho a intentar més tard.</p>
        </div>
        `
, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      }


      if (existingEquipo && existingEquipo.length > 0) {
        console.log("El equipo ya esta inscrito.")
        return new Response(
          ` <div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Ja existeix un equip amb aquest nom.</p>
        </div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      }

      //3.- Generar id del equipo
      let id_equipo = nombre_equipo.toLowerCase().replace(/\s+/g, '-');
      id_equipo = removeAccents(id_equipo)

      //4.- Escudo Equipo
      if(escudo?.size > 0){
        const escudoPath = await uploadFile(escudo, id_equipo);

        //Obtener la URL pública del escudo subido
        const { data: urlData } = supabaseAdmin.storage
            .from('EquiposIMG')
            .getPublicUrl(escudoPath); // Usa el escudoPath que se generó al subir el archivo

        // Verifica si urlData contiene la propiedad publicUrl 
        if (urlData) {
          publicUrl = urlData.publicUrl;
        }
      }

      //5.- Obtener fecha de inscripcion
      const currentDate = getCurrentDateInCatalan();
      

      //6.- Insertar informacion en db

       const { data: datosEquipos, error: equipoError } = await supabaseAdmin
        .from(TablaEquipos)
        .insert([
            { nombre_equipo: nombre_equipo ,
              id_equipo: id_equipo ,
              escudo: publicUrl,
              inscrito: usuario_id,
              capitan_edit: capitan_edit,
              fecha_inscripcion: currentDate,
            },
        ])
        .select()

      if (equipoError) {
        console.error("Error insertando en equipos:", equipoError.message);
        return new Response(
          `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Hi ha hagut un error error en afegir l'equip.. Torna-ho a intentar més tard.</p>
        </div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      }

    // Finalizar Api
    return new Response(
      JSON.stringify({ success: true, }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

};


//Remplazar Caracteres Extraños 
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

//Subir escudo a la db
async function uploadFile(file: File, id_equipo: string) {
  // Extraer la extensión del archivo
  const extension = file.name.split('.').pop(); // Obtiene la extensión
  const uniqueFileName = `${id_equipo}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
  const filePath = `escudos${ConfTorneo?.id_torneo}/${uniqueFileName}`; // Define la ruta del archivo

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

//Obtener fecha actual
const getCurrentDateInCatalan = () => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date();
  return new Intl.DateTimeFormat('ca-ES', options).format(date);
};