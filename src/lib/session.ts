// src/lib/session.ts
import { supabaseAdmin } from "./supabase"; // Asegúrate de que esto apunte a tu configuración de Supabase

export async function verificarSesion(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = new Map<string, string>();

  // Parsear las cookies
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies.set(name, value);
    });
  }

   const sessionId = cookies.get('session_id');

  
  if (!sessionId) {
    return null; // No hay sesión
  }

  // Aquí puedes buscar el usuario en la base de datos usando el sessionId
  const { data: usuario, error } = await supabaseAdmin
    .from('Usuarios')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error || !usuario) {
    console.log(error)
    return null; // Sesión no válida
  }
 

  return usuario; // Devuelve el usuario si la sesión es válida
}

// U2FsdGVkX1%2FYrCi4JtdxDACrmyTENAXEV23R5do0zoI%3D
//U2FsdGVkX1/YrCi4JtdxDACrmyTENAXEV23R5do0zoI=