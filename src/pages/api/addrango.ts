import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

// Función para generar un ID aleatorio de 8 caracteres


export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const user_email = formData.get("user_email")?.toString().trim(); // Usamos .trim() para eliminar espacios
  const rango = formData.get("rango")?.toString().trim(); // Lo mismo para el rango

  // Validación: asegurarse de que ambos campos no estén vacíos
  if (!user_email || !rango) {
    return new Response("Correo electrónico y rango son obligatorios", { status: 400 });
  }
  console.log(user_email, rango)

  // Verificar si el correo electrónico ya existe en la tabla 'administradores'
  // const { data: existingAdmin, error: checkError } = await supabase
  //   .from('Administradores')
  //   .select('id')
  //   .eq('user_email', user_email)
  //   .single(); // Usamos .single() para obtener un solo resultado

  // if (checkError) {
  //   console.error('Error al verificar la existencia:', checkError.message);
  //   return new Response("Hubo un error al verificar el correo electrónico.", { status: 500 });
  // }

  // // Si ya existe un administrador con ese correo electrónico
  // if (existingAdmin) {
  //   return new Response("El usuario ya tiene un rango asignado.", { status: 400 });
  // }


  // Aquí insertamos los datos en la tabla 'administradores'
  const { error: adminError } = await supabase
    .from('Administradores')
    .insert([
      {
        user_email: user_email, // Correo del usuario
        rango: rango, // Rango asignado al usuario
      },
    ]);

  if (adminError) {
    console.error('Error insertando en administradores:', adminError.message);
    return new Response("Hubo un error al asignar el rango.", { status: 500 });
  } else {
    console.log('Rango asignado correctamente');
  }

  return redirect("/admin/lista-administradores");
};


// import type { APIRoute } from "astro";
// import { supabase } from "../../lib/supabase";

// function generateRandomId() {
//   return Math.random().toString(36).substr(2, 8); // Genera una cadena aleatoria de 8 caracteres
// }

// export const POST: APIRoute = async ({ request, redirect }) => {
//   const formData = await request.formData();
//   const user_email = formData.get("user_email")?.toString();
//   const rango = formData.get("rango")?.toString();


//   if (!user_email || !rango) {
//     return new Response("Correo electrónico y rango", { status: 400 });
//   }
//   const randomId = generateRandomId();

//   const { error: adminError } = await supabase
//     .from('administradores')
//     .insert([
//       {
//         id: randomId, // ID aleatorio de 8 caracteres
//         user_email: user_email, // Correo del usuario
//         rango: rango, // Rango asignado al usuario
//       },
//     ]);

//     if (adminError) {
//         console.error('Error insertando en administradores:', adminError.message);
//       } else {
//         console.log('Rango asignado correctamente');
//       }

//   return redirect("/admin/lista-administradores");
// };