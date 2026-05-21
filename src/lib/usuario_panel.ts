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

export async function verificarAdminSesionPorSessionId(sessionId: string) {
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
    console.log("Error al verificar sesión por sessionId:", error);
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

  // console.log("Usuario encontrado por sessionId:", usuarioFinal);

  return usuarioFinal;
}

export async function tieneAcceso(
    pagina: string,
    accion: string | null = null,
    usuario: any = null,
    sessionId?: string
): Promise<boolean> {

    let usuarioFinal = usuario;

    // Si no nos pasan usuario, lo buscamos por sessionId
    if (!usuarioFinal && sessionId?.trim()) {
        try {
            usuarioFinal = await verificarAdminSesionPorSessionId(sessionId);
        } catch (error) {
            console.error("Error al obtener usuario por sessionId:", error);
            return false;
        }
    }

    // Seguridad: si sigue sin usuario → acceso denegado
    if (!usuarioFinal) {
        return false;
    }

    console.log


    // buscar página
    const menuItem = Paginas.find(
        (item) => item.ruta === pagina
    );

    if (!menuItem) {
        console.warn("Ruta no encontrada:", pagina);
        return false;
    }

    // corregir JSONB string/objeto
    const permisos_panel =
        typeof usuarioFinal.permisos_panel === "string"
            ? JSON.parse(usuarioFinal.permisos_panel)
            : usuarioFinal.permisos_panel;

    // calcular nivel si no existe
    const nivelSeguridad =
        usuarioFinal.nivel_seguridad ??
        getNivelSeguridad(
            usuarioFinal.rango || usuarioFinal.staff || ""
        );

    console.log(
        "Nivel calculado:",
        nivelSeguridad
    );

    // bypass para owners
    // if (
    //     usuario.rango === "Owner" ||
    //     usuario.staff === "Owner"
    // ) {
    //     console.log("Bypass Owner");
    //     return true;
    // }

    // comprobar nivel
    const tieneNivel =
        nivelSeguridad >=
        (menuItem.nivel_seguridad ?? 0);

    console.log(
        "Nivel requerido:",
        menuItem.nivel_seguridad,
        "Tiene:",
        tieneNivel
    );

    // permisos página actual
    const permisosPagina =
        permisos_panel?.[menuItem.id] || {};

    // sin nivel → fuera
    if (!tieneNivel) {
        return false;
    }

    // acción específica
    if (accion) {

        // permiso explícito
        if (accion in permisosPagina) {
            return permisosPagina[accion] === true;
        }

        // si no existe la acción usar nivel
        return tieneNivel;
    }

    // acceso normal requiere ver
    return permisosPagina?.ver === true;
}