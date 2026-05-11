import { supabaseAdmin } from "./supabase";

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