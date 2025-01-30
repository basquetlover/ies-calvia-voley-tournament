// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Elimina cookies si existen
  const user_session = cookies.get("session_id");
  if(user_session){
    cookies.delete('session_id', { path: '/' });
  }
  
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (accessToken || refreshToken) {
    cookies.delete("sb-access-token", { path: "/", secure: true, sameSite: "strict" });
    cookies.delete("sb-refresh-token", { path: "/", secure: true, sameSite: "strict" });
    console.log("Sesión terminada. Cookies eliminadas.");
  } else {
    console.log("No se encontraron cookies de sesión.");
  }

  // Redirige a la página de inicio de sesión
  return redirect("/");
};

