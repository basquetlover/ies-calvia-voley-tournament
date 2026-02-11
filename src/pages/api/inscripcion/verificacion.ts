import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
//import { Resend } from 'resend';

let TablaEquipos = "Equipos";
let TablaJugadores = "Jugadores";
const { data: ConfTorneo, error } = await supabaseAdmin
    .from('Configuracion')
    .select('id_torneo, nombre')
    .eq('estado', 'Actual')
    .single();

if(ConfTorneo){
    TablaEquipos = `Equipos${ConfTorneo.id_torneo}`
    TablaJugadores = `Jugadores${ConfTorneo.id_torneo}`
}



export const POST: APIRoute = async ({ request }) => {

    //1.- Recopilar toda la informacion del formulario
    const formData = await request.formData();
    const nombre_equipo = formData.get("nombre_equipo")?.toString().trim() || "";
    const capitan_edit = formData.get("capitan_edit")?.toString().trim();

    let hombres = 0;
    let mujeres = 0;

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
    if(!nombre_equipo || nombre_equipo === ""){
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


    //2. Verificar entrenador y profesor

    //1.- Procesar Entrenador
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
        console.log(acompañante_nombre, acompañante_1r_apellido, acompañante_2n_apellido, acompañante_curso, acompañante_email)
        // console.log("Tipo de archivo:", acompañante_foto?.name);
        // console.log("Tipo de archivo:", acompañante_foto?.type);
        // console.log("Tamaño de archivo:", acompañante_foto?.size);
    if (acompañante_email) { 
        const dominio = acompañante_email.split('@')[1]; // Esto te dará 'gmail.com'
        const dominioConArroba = '@' + dominio;
        if (dominioConArroba !== "@alu.ibeducacio.eu" && dominioConArroba !== "@ibeducacio.eu") {
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
    //const profesor_foto = formData.get('profesor_img')  as File;
    profesor_nombre = formData.get("profesor_name")?.toString().trim() || "";
    if(profesor_nombre !== "") {
    profesor_curso = formData.get(`profesor_curso`)?.toString().trim() || "";
    profesor_1r_apellido = formData.get(`profesor_1r_apellido`)?.toString().trim() || "";
    profesor_2n_apellido = formData.get(`profesor_2n_apellido`)?.toString().trim() || "";
    profesor_genero = formData.get(`genero_profesor`)?.toString().trim() || "";
    profesor_email = formData.get(`profesor_email`)?.toString().trim() || "";
    
    profesor = profesor_nombre + " " + profesor_1r_apellido;
    
    console.log(profesor_nombre, profesor_1r_apellido, profesor_2n_apellido, profesor_curso, profesor_email)
    //  console.log("Tipo de archivo:", profesor_foto?.name);
    //  console.log("Tipo de archivo:", profesor_foto?.type);
    //  console.log("Tamaño de archivo:", profesor_foto?.size);
    if (profesor_email) { 
    const dominio = profesor_email.split('@')[1]; // Esto te dará 'gmail.com'
    const dominioConArroba = '@' + dominio;
    if (dominioConArroba !== "@alu.ibeducacio.eu" && dominioConArroba !== "@ibeducacio.eu") {
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
    
    if (!profesor_genero) {
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

    //4. Verificar Jugadores
    const capitan = formData.get("input_capitan_form")?.toString().trim();
    const capitan_email = formData.get("input_capitan_email_form")?.toString().trim() || "";
    console.log("Capitan:", capitan);
    console.log("Email Capitan:", capitan_email);

    //4.- Verificar existencia de capitan
            if (!capitan && capitan === "" && !capitan_email && capitan_email === ""  ) {
            
            return new Response(
                `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
                <span>
                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
                <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                </svg>
                </span>
                <p class="text-[#640404]">Ha de haber un capità a l'equip</p>
                </div>`, 
                { status: 401, headers: { "Content-Type": "text/html" } }
            );
            }

//2.- Recoger Información jugadores obligatorios
    const jugadores = [];
    const indices: number[] = Array.from({ length: 9 }, (_, i) => i);

    for (let index of indices) { // o el máximo esperado
        if (!formData.has(`player_${index}_name`)) continue;
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
            if (dominioConArroba !== "@alu.ibeducacio.eu" && dominioConArroba !== "@ibeducacio.eu") {
                console.log(`El email del ${index + 1}. Jugador ha de ser del centre`)
                return new Response(
                    `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
            <span>
        <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
            <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
        </svg>
            </span>
            <p class="text-[#640404]">El email del ${index + 1}. Jugador ha de ser del centre</p>
            </div>`, 
                    { status: 401, headers: { "Content-Type": "text/html" } }
                );
            }
        } else {
            // Manejo del caso en que email es undefined o vacío
            console.error("El email no es válido.");
        }
            if (!genero) {
            return new Response(
                `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
            <span>
        <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
            <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
        </svg>
            </span>
            <p class="text-[#640404]">Seleccioni el gènere del ${index +1}. Jugador</p>
            </div>`, 
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
            <p class="text-[#640404]">El jugador Nº${index +1} ja es troba inscrit</p>
            </div>`, 
                { status: 400, headers: { "Content-Type": "text/html" } }
                );
            }
            }
            jugadores.push({ nombre, curso, _1r_apellido, _2n_apellido, genero, email, numero });
            index++;
        }

        const jugadores_extra = [];
                let index = 0;
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
                    if(!genero_extra) {
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
                    if(genero_extra === "hombre"){
                        hombres++;
                    }
                    
                    if(genero_extra === "mujer"){
                        mujeres++;
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
                        </div>`, 
                        { status: 400, headers: { "Content-Type": "text/html" } }
                        );
                    }
                    }
                    jugadores_extra.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_extra, email, numero });
                    }
                    index++;
                }

            //5.- Verificar minimo de jugadores de cada genero
            if(hombres <2 || mujeres <2){
            console.log("Falta variedad de genero", hombres, mujeres)
            return new Response(
                `<div class="w-full h-full rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 mx-auto py-1 px-3 border-solid border-2 border-[#640404] bg-[#A83434] bg-opacity-100 text-sm font-semibold">
                <span>
                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#640404] w-10 h-10" viewBox="0 -960 960 960">
                <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                </svg>
                </span>
                <p class="text-[#640404]">Ha de haber un minim de 2 nins i 2 nines</p>
                </div>`, 
                { status: 401, headers: { "Content-Type": "text/html" } }
            );
            }

            const staff = [];
            // Genera automáticamente del 0 al 4
            const indicesStaff: number[] = Array.from({ length: 5 }, (_, i) => i);
            
            // 🔹 Recorrer solo esos índices
            for (let index of indicesStaff) { // o el máximo esperado
                if (!formData.has(`staff_player_${index}_name`)) continue;
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
                staff.push({ nombre, curso, _1r_apellido, _2n_apellido, genero_staff, email, numero });
                }
                index++;
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


