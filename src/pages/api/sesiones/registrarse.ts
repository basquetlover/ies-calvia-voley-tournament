// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request, redirect }) => {

    const formData = await request.formData();
    const nombre = formData.get("nombre")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const curso = formData.get("curso")?.toString();

    if (nombre === "") {
      console.log("Es necesario un nombre de usuario");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">Es requereix un nom d'usuari</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }

  if (email === "" || !email) {
      console.log("Es necesario un email de usuario");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">És requereix un email de contacte</div>`, 
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
  }
  // Validar el formato del email
  const emailPattern = /^(.*@iescalvia.com|.*@a\.iescalvia.com)$/;
  if (!emailPattern.test(email)) {
      console.log("El email debe ser del centro: @iescalvia.com o @a.iescalvia.com");
      return new Response(
        `<div class="bg-red-600 bg-opacity-30 border-3 border-red-700 text-white rounded-lg p-2 my-2 flex items-center text-center">L'email ha de ser del centre @iescalvia o @a.iescalvia</div>`, 
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
    .select('nombre,email')

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
      const userExistsByEmail = Usuarios.some(usuario => usuario.email === email);
      
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
      { nombre: nombre, email: email, contraseña: hashedPassword, curso: curso, anyo: anyo_actual },
    ])

    if (ERRenviar) {
      return new Response(ERRenviar.message, { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
  );
  
  
};