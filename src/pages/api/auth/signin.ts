// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }
  
  const user_session = cookies.get("session_id");
  let id_session = "";
  const secretKey = "8a0a6b86ab0faebd915652fb11a5b4131e76849c7403d93756f677a4b1a85714"; 
  
  // function encrypt(text: string) {
  //     return CryptoJS.AES.encrypt(text, secretKey).toString();
  //   }

      function encryptAlfaNum(text: string) {
        // Encriptar el texto
        const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    
        // Codificar en Base64
        const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    
        // Reemplazar caracteres no alfanuméricos
        const alphanumeric = base64Encoded.replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres no alfanuméricos
    
        return alphanumeric;
    }
  // const encrypted = encrypt(password);
  if(!user_session){
    const { data: Usuarios } = await supabaseAdmin
        .from('Usuarios') // Especifica el tipo aquí
        .select('*')
        .eq('email', email)
        .single();

        if(!Usuarios){
          console.log("El administrador ", email, " no tiene cuenta de usuario")
        }

        if(!Usuarios.session_id){
          const session_id = encryptAlfaNum(Usuarios.nombre);
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
         
          cookies.set('session_id', id_session, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 días
          });
      }
        
  
  }
  
  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  return redirect("/admin");
};