import { supabase } from "./supabase"; // Asegúrate de que esté correctamente configurado

/**
 * Obtiene información del usuario autenticado usando el token de acceso.
 * @param cookies - Las cookies de la solicitud.
 * @returns El usuario autenticado o `null` si no está autenticado.
 */
export async function getUser(cookies: any) {
  const accessToken = cookies.get("sb-access-token");

  if (!accessToken) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error) {
    console.error("Error al obtener usuario:", error.message);
    return null;
  }

  return user;
}

// export async function getUser(cookies: any) {
//   const accessToken = cookies.get("sb-access-token");

//   if (!accessToken) {
//     return null;
//   }

//   const { data: { user }, error } = await supabase.auth.getUser(accessToken);

//   if (error) {
//     console.error("Error al obtener usuario:", error.message);
//     return null;
//   }

//   return user;
// }
