// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request, redirect }) => {

    const formData = await request.formData();
    const nombre = formData.get("nombre")?.toString();
    let nombre_real = formData.get("nombre_real")
    let apellidos = formData.get("apellidos")
    let email = formData.get("email");
    const password = formData.get("password")?.toString();
    const curso = formData.get("curso")?.toString();

    if (nombre === "") {
      console.log("Es necesario un nombre de usuario");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix un nom d'usuari</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }

  if(!nombre_real || nombre_real ===""){
     const nombre_google = formData.get("nombre_google");

     if(!nombre_google || nombre_google ===""){
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix el nom de l'usuari</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
     } else{
      nombre_real = nombre_google
     }
  }

  if(!apellidos || apellidos ===""){
     const apellidos_google = formData.get("apellidos_google");

     if(!apellidos_google || apellidos_google ===""){
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix els llinatges de l'usuari</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
     } else{
      apellidos = apellidos_google
     }
  }

  if (email === "" || !email) {
    const email_google = formData.get("email_google");

    if(!email_google || email_google ===""){
      console.log("Es necesario un email de usuario");
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">És requereix un email de contacte</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
    } else{
      email = email_google
    }
      
  }
  // Validar el formato del email
  const emailPattern = /^(.*@ibeducacio.eu|.*@alu\.ibeducacio.eu)$/;
  if (!emailPattern.test(String((email)))) {
      console.log("El email debe ser del centro: @ibeducacio.eu o @alu.ibeducacio.eu");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'email ha de ser del centre @ibeducacio.eu o @alu.ibeducacio.eu</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }
  console.log(password)
  if (password === "") {
      console.log("Es necesario una contraseña de usuario");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix una contrasenya</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }
  if (curso === "" || !curso) {
      console.log("Es necesario un curso de usuario");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix un curs seleccionat</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }
    if (!nombre || !email || !password || !curso) {
      return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
    }
    async function hashPassword(password: string) {
      const saltRounds = 10; // Número de rondas de sal recomendado
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    }

    // Esperar el resultado de hashPassword
    const hashedPassword = await hashPassword(password);

    function obtenerAñosEscolares(fecha = new Date()) {
      const año = fecha.getFullYear();
      const mes = fecha.getMonth(); // enero = 0, diciembre = 11

      let inicio;
      if (mes >= 8) {
        // Si estamos en septiembre (8) o después, el curso actual empieza este año
        inicio = año;
      } else {
        // Si estamos antes de septiembre, el curso actual empezó el año anterior
        inicio = año - 1;
      }

      const actual = `${inicio}-${inicio + 1}`;

      return actual;
    }

// Ejemplo de uso

const anyo_actual = obtenerAñosEscolares();

    let { data: Usuarios, error } = await supabaseAdmin
    .from('Usuarios')
    .select('nombre,email_microsoft')

    if (Usuarios) {
      // Verificar si ya existe un usuario con el mismo nombre
      const userExistsByName = Usuarios.some(usuario => usuario.nombre === nombre);
      
      if (userExistsByName) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ja existeix un usuari amb aquest nom</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    
      // Verificar si ya existe un usuario con el mismo email
      const userExistsByEmail = Usuarios.some(usuario => usuario.email_microsoft === email);
      
      if (userExistsByEmail) {
        return new Response(
          `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Ja existeix un usuari amb aquest email</div>`, 
          { status: 400, headers: { "Content-Type": "text/html" } }
        );
      }
    }


      
    const { data, error: ERRenviar } = await supabaseAdmin
    .from('Usuarios')
    .insert([
      { nombre: nombre, email_microsoft: email, contraseña: hashedPassword, curso: curso, anyo: anyo_actual, nombre_real: nombre_real, apellidos: apellidos },
    ])

    if (ERRenviar) {
      return new Response(ERRenviar.message, { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
  
  
};