import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const role = formData.get("rango")?.toString().trim();

  const navigationPermissions = [];
  const pagePermissions = [];

  // Recoger todos los permisos de navegación
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('nav_permiso_')) {
      navigationPermissions.push({ permission: value.toString().trim() });
    }
    if (key.startsWith('pag_permiso_')) {
      pagePermissions.push({ pagePermission: value.toString().trim() });
    }
  }

  console.log("Datos recibidos:", { role, navigationPermissions, pagePermissions });

  // Inserta los permisos de navegación
  for (const { permission } of navigationPermissions) {
    const { error: navPermissionError } = await supabaseAdmin
      .from('Whitelist')
      .insert([{ 
          pagina: permission,
          role: role, 
      }])
      .select();

      if (navPermissionError) {
        console.error("Error insertando permisos de navegación:", navPermissionError);
        console.error("Datos que intentabas insertar:", { 
          pagina: permission,
          role: role 
        });
      }
  }

  // Inserta los permisos de página
  for (const { pagePermission } of pagePermissions) {
    const { error: pagePermissionError } = await supabaseAdmin
      .from('Whitelist')
      .insert([{ 
          pagina: pagePermission,
          role: role, 
      }])
      .select();

    if (pagePermissionError) {
      console.error("Error insertando permisos de página:", pagePermissionError.message);
    }
  }

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