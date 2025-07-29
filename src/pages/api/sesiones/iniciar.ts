import type { APIRoute } from "astro";
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { supabase, supabaseAdmin } from "../../../lib/supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase
import { setSourceMapRange } from "typescript";

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    contraseña: string; // Asegúrate de que este campo sea el correcto
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const politica_cookies = cookies.get("all_cookies");

    if(politica_cookies){
        const formData = await request.formData();
        const nombre = formData.get("nombre")?.toString(); // <input name="nombre" id="4584" />
        const password = formData.get("password")?.toString(); // <input name="password" id="4684" />
        let id_session = "";
     

    // Validar que se proporcionen nombre y contraseña
    if (!nombre || !password) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario y contraseña obligatorios</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    // Consultar el usuario en la base de datos
    let { data: Usuarios, error } = await supabaseAdmin
        .from('Usuarios') // Especifica el tipo aquí
        .select('*')
        .eq('nombre', nombre)
        .single();

    // Manejar el error si el usuario no se encuentra
    if (error || !Usuarios) {
        const { data: UsuariosPorEmail, error: errorEmail } = await supabaseAdmin
                .from('Usuarios')
                .select('*')
                .eq('email', nombre) // Usamos el nombre como email
                .single();

            if (errorEmail || !UsuariosPorEmail) {
                return new Response(
                    `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario no encontrado</div>`,
                    { status: 401, headers: { "Content-Type": "text/html" } }
                );
            }

            Usuarios = UsuariosPorEmail;
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, Usuarios.contraseña);
    if (!isPasswordValid) {
        return new Response(
            `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Usuario o contraseña inválido</div>`, 
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    



const secretKey = "8a0a6b86ab0faebd915652fb11a5b4131e76849c7403d93756f677a4b1a85714"; 

function encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  }

function encryptAlfaNum(text: string) {
    // Encriptar el texto
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();

    // Codificar en Base64
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));

    // Reemplazar caracteres no alfanuméricos
    const alphanumeric = base64Encoded.replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres no alfanuméricos

    return alphanumeric;
}
const encrypted = encrypt(password);

// Ejemplo de uso

    if(!Usuarios.session_id){
        const session_id = encryptAlfaNum(nombre);
        const { data, error } = await supabaseAdmin
        .from('Usuarios')
        .update({ session_id: session_id })
        .eq('id', Usuarios.id)
        .select();

        
        id_session = session_id;
    }

    if(Usuarios.session_id){
        id_session = Usuarios.session_id
    }
    // Si la contraseña es válida, establecer la cookie de sesión

    if(id_session !== ""){
        
        cookies.set('session_id', id_session, { path: '/', httpOnly: true, secure: true });
    }
    
    
    function obtenerColor() {
        const opciones = [
            'bg-red-500',
            'bg-cyan-500',
            'bg-orange-600',
            'bg-yellow-400',
            'bg-fuchsia-500',
            'bg-lime-600'
        ];
    
        // Selecciona un índice aleatorio de las opciones
        const indiceAleatorio = Math.floor(Math.random() * opciones.length);
        
        // Devuelve el párrafo correspondiente
        return opciones[indiceAleatorio];
    }
    
    // Ejemplo de uso
    const color = obtenerColor();
    const { data } = await supabaseAdmin
    .from('Usuarios')
    .update({ logo: color })
    .eq('id', Usuarios.id)
    .select()

    
    let { data: Administradores } = await supabaseAdmin
    .from('Administradores')
    .select('id')
    .eq('user_email', Usuarios.email)
    .select();

    if(Administradores){
        console.log("El usuario es un admin")
        const email = Usuarios.email
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
        
          if (error) {
            console.error("La contraseña de admin no es la misma que la de user");
            return new Response(
                JSON.stringify({ success: true }), 
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
            // return new Response(error.message, { status: 500 });
          }
        
          const { access_token, refresh_token } = data.session;
          cookies.set("sb-access-token", access_token, {
            path: "/",
          });
          cookies.set("sb-refresh-token", refresh_token, {
            path: "/",
          });
          
    }





//     // Redirigir a la página principal
//     return new Response(
//       JSON.stringify({ success: true }), 
//       { status: 200, headers: { "Content-Type": "application/json" } }
//   );
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );

    }

    return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">No s'han acceptat les cookies necessàries.</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
    );
    
};