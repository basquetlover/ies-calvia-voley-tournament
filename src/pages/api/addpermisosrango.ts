import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const rango = formData.get("rango")?.toString().trim();

  const permisosNAV = [];
  
  let index = 1;
  while (formData.has(`nav-permiso-${index}`)) { // Usar comillas para crear la cadena
    const permiso = formData.get(`nav-permiso-${index}`)?.toString().trim();
    
    if (permiso) {
      permisosNAV.push({ permiso });
    }
    index++;
  }

  const permisosPAG = [];
  index = 1;
  while (formData.has(`pag-permiso-${index}`)) { // Usar comillas para crear la cadena
    const permisopag = formData.get(`pag-permiso-${index}`)?.toString().trim();
    
    if (permisopag) {
      permisosPAG.push({ permisopag });
    }
    index++;
  }
 
  console.log("Datos recibidos:", { rango, permisosNAV, permisosPAG });

  // Permisos Nav
//   for (const permiso of permisosNAV) {
//     const { error: permisonavrError } = await supabaseAdmin
//       .from('Whitlist')
//       .insert([
//         { 
//             pagina: permiso.permiso,
//             role: rango, 
//         },
//       ]).select()

//     if (permisonavrError) {
//       console.error("Error insertando permisos nav:", permisonavrError.message);
//     }
//   }

  // Permisos Pag
//   for (const permiso of permisosPAG) {
//     const { error: permisopagrError } = await supabaseAdmin
//       .from('Whitlist')
//       .insert([
//         { 
//             pagina: permiso.permisopag,
//             role: rango, 
//         },
//       ]).select()

//     if (permisopagrError) {
//       console.error("Error insertando permisos pag:", permisopagrError.message);
//     }
//   }

  console.log("Permisos asignados correctamente");
  return redirect("/admin/permisos");
};

// import type { APIRoute } from "astro";
// import { supabase, supabaseAdmin } from "../../lib/supabase";

// export const POST: APIRoute = async ({ request, redirect }) => {
//   const formData = await request.formData();
//   const rango = formData.get("rango")?.toString().trim();

//   const permisosNAV = [];

//   let index = 1;
//   while (formData.has(`nav-permiso-${index}`)) {
//     const permiso = formData.get(`nav-permiso-${index}`)?.toString().trim();
    
//     if (permiso) {
//       permisosNAV.push({ permiso });
//     }
//     index++;
//   }

//   const permisosPAG = [];
//   index = 0;
//   while (formData.has(`pag-permiso-${index}`)) {
//     const permisopag = formData.get(`pag-permiso-${index}`)?.toString().trim();
    
//     if (permisopag) {
//       permisosPAG.push({ permisopag });
//     }
//     index++;
//   }
 

//   console.log("Datos recibidos:", { rango, permisosNAV, permisosPAG });
// //Permisos Nav

// //   for (const permiso of permisosNAV) {
// //     const { error: permisonavrError } = await supabaseAdmin
// //       .from('Whitlist')
// //       .insert([
// //         { 
// //             pagina: permiso.permiso,
// //             role: rango, 
 
// //           },
// //       ]).select()

// //     if (permisonavrError) {
// //       console.error("Error insertando permisos nav:", permisonavrError.message);
// //       // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
// //     }
// //   }

// //   for (const permiso of permisosPAG) {
// //     const { error: permisopagrError } = await supabaseAdmin
// //       .from('Whitlist')
// //       .insert([
// //         { 
// //             pagina: permiso.permisopag,
// //             role: rango, 
 
// //           },
// //       ]).select()

// //     if (permisopagrError) {
// //       console.error("Error insertando permisos nav:", permisopagrError.message);
// //       // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
// //     }
// //   }

//   console.log("Permisos asignado correctamente");
//   return redirect("/admin/permisos");
// };