import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
//import { Resend } from 'resend';


let Equipo_id = "sin_equipo"
let equipoId = "";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();


  let TablaJugadores = `Jugadores${ConfTorneo?.id_torneo}`
  let TablaEquipos = `Equipos${ConfTorneo?.id_torneo}`


export const POST: APIRoute = async ({ request }) => {
  
console.log("Datos a cuerpo-tecnico")



    //Recoger la informacion del staff del equipo
     const formData = await request.formData();
      const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";

      const { data: EquipoData, error: checkError } = await supabaseAdmin
      .from(TablaEquipos)
      .select("id, id_equipo") // Seleccionar un campo mínimo
      .eq("nombre_equipo", nombre_equipo)
      .single();
    
      if(EquipoData){
        Equipo_id = EquipoData?.id
        equipoId = EquipoData?.id_equipo
      }

  const staff = [];
  let index = 0;
  while (formData.has(`staff_player_${index}_name`)) {
    const nombre = formData.get(`staff_player_${index}_name`)?.toString().trim();
    if(nombre !== ""){
      const _1r_apellido = formData.get(`staff_player_${index }_1r_apellido`)?.toString().trim();
      const _2n_apellido = formData.get(`staff_player_${index}_2n_apellido`)?.toString().trim();
      const genero_staff = formData.get(`staff_genero_${index}`)?.toString().trim();
      const curso = formData.get(`staff_player_${index}_curso`)?.toString().trim();
      const email = formData.get(`staff_player_${index}_email`)?.toString().trim();
      const img = formData.get(`staff_player_${index}_img`) as File;
      const numero = index + 1;
      if (email) { 
        const dominio = email.split('@')[1]; // Esto te dará 'gmail.com'
        const dominioConArroba = '@' + dominio;
        if (dominioConArroba !== "@alu.ibeducacio.eu" && dominioConArroba !== "@ibeducacio.eu") {
          console.log(`El email del ${index + 7}. Jugador ha de ser del centre`)
          return new Response(
                `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">El email del ${index + 7}. Jugador ha de ser del centre</p>
        </div>`, 
                { status: 401, headers: { "Content-Type": "text/html" } }
            );
      }
    } else {
        // Manejo del caso en que email es undefined o vacío
        console.error("El email no es válido.");
    }
      if(!genero_staff) {
        return new Response(
          `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Seleccioni el gènere del ${index + 7}. Jugador ${nombre}</p>
        </div>`, 
          { status: 401, headers: { "Content-Type": "text/html" } }
      );
      
      }
      let { data: Usuarios, error } = await supabaseAdmin
    .from(TablaJugadores)
    .select('email')

    if (Usuarios) {
  
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">El jugador Nº${index +7} ja es troba inscrit</p>
        </p>
        </div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }
    staff.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_staff, email, numero, img });
    }
    index++;
  }


  //3.- Introducir datos a db
  const { data: datosEquipos, error: equipoError } = await supabaseAdmin
            .from(TablaEquipos)
            .update([
                { 
                  estado: 'Revisant',
                 
                },
            ])
            .eq('id_equipo', equipoId)
            .select()
 if (equipoError) {
               return new Response(
                  `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
        <span>
      <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
        <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
      </svg>
        </span>
        <p class="text-[#640404]">Ha ocorregut un error inesperat, torna a intentar-ho més tard.</p>
        </div>`, 
                  { status: 401, headers: { "Content-Type": "text/html" } }
              );
            }

            
    for (const jugador of staff) {
    if(jugador.img.size <= 0){
    const { error: jugadorError } = await supabaseAdmin
      .from(TablaJugadores)
      .insert([
        {   nombre: jugador.nombre, 
            _1r_apellido: jugador._1r_apellido,
            _2n_apellido: jugador._2n_apellido,
            curso: jugador.curso,
            genero: jugador.genero_staff,
            pertenece_equipo: Equipo_id,
            email: jugador.email,
            ficha: 'cuerpo_tecnico',
            
          },
      ]).select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  } else {
    let publicIMGurl = "";
    // Llama a la función para subir el escudo
  const JugadorIMGPath = await uploadJugadorIMG(jugador.img, jugador.email);
  
  //Obtener la URL pública del escudo subido
  const { data: urlIMGData } = supabaseAdmin.storage
      .from('JugadoresIMG')
      .getPublicUrl(JugadorIMGPath); // Usa el escudoPath que se generó al subir el archivo
  
  // Verifica si urlData contiene la propiedad publicUrl

  if (urlIMGData) {
    publicIMGurl = urlIMGData.publicUrl;
  }

    const { error: jugadorError } = await supabaseAdmin
      .from(TablaJugadores)
      .insert([
        {   nombre: jugador.nombre, 
            _1r_apellido: jugador._1r_apellido,
            _2n_apellido: jugador._2n_apellido,
            curso: jugador.curso,
            genero: jugador.genero_staff,
            pertenece_equipo: Equipo_id,
            email: jugador.email,
            ficha: 'cuerpo_tecnico',
            img: publicIMGurl,
          },
      ]).select()

    if (jugadorError) {
      console.error("Error insertando jugador principal:", jugadorError.message);
      // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
    }
  }
    
  }

  
    return new Response(
      JSON.stringify({ success: true, }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
};


//Subir Imagen de Jugadores
  async function uploadJugadorIMG(file: File, email: string | undefined) {
    // Extraer la extensión del archivo
    const extension = file.name.split('.').pop(); // Obtiene la extensión
    const uniqueFileName = `${email}_${Date.now()}.${extension}`; // Combina id_equipo con la extensión
    const filePath = `torneo${ConfTorneo?.id_torneo}/${equipoId}/${uniqueFileName}`; // Define la ruta del archivo
  
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