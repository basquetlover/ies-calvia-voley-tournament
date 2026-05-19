import { supabaseAdmin } from "./supabase";
import { Paginas } from "src/const/menuPanel";

function getNivelSeguridad(rango: string): number {
  const map: Record<string, number> = {
    Owner: 3,
    "Co-Owner": 3,
    Admin: 3,
    Staff: 2,
    Voluntari: 1,
  };

  return map[rango] ?? 0;
}

export async function verificarAdminSesion(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = new Map<string, string>();

  // Parsear cookies
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      cookies.set(name, value);
    });
  }

  const sessionId = cookies.get("session_id");

  if (!sessionId) {
    return null;
  }

  // Buscar usuario en Supabase
  const { data: usuario, error } = await supabaseAdmin
    .from("Usuarios")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error || !usuario) {
    console.log(error);
    return null;
  }

  // Nivel de seguridad derivado del rango
  const nivel_seguridad = getNivelSeguridad(usuario.rango);

  // Sustituir email por email_microsoft
  const { email, email_microsoft, ...rest } = usuario;

  const usuarioFinal = {
    ...rest,
    email: email_microsoft ?? email,
    nivel_seguridad,
  };

//   console.log("Usuario encontrado:", usuarioFinal);

  return usuarioFinal;
}



export function tieneAcceso(
    pagina: string,
    accion: string | null,
    usuario: any
): boolean {

    // buscar página
    const menuItem = Paginas.find(
        (item) => item.ruta === pagina
    );

    if (
    !usuario ||
    !usuario.permisos_panel
){
  console.log("falta usuario o permisos_panel")
    return false;
}

    if (!menuItem) {
        console.warn("Ruta no encontrada:", pagina);
        return false;
    }

    // corregir JSONB string/objeto
    const permisos_panel =
        typeof usuario.permisos_panel === "string"
            ? JSON.parse(usuario.permisos_panel)
            : usuario.permisos_panel;

    // comprobar nivel seguridad
    const tieneNivel =
        usuario.nivel_seguridad >=
        (menuItem.nivel_seguridad ?? 0);

    // permisos de esta página
    const permisosPagina =
        permisos_panel?.[menuItem.id] || {};

    // sin nivel -> fuera
    if (!tieneNivel) {
        return false;
    }

    // acción específica
    if (accion) {

        // existe permiso explícito
        if (accion in permisosPagina) {
            return permisosPagina[accion] === true;
        }

        // si no existe la acción → usar nivel seguridad
        return tieneNivel;
    }

    // acceso normal -> requiere permiso ver
    return permisosPagina?.ver === true;
}