import type { APIRoute } from "astro";


export const GET: APIRoute = async ({ cookies, redirect }) => {

  const user_session = cookies.get("session");
  if(user_session){
    cookies.delete('session', { path: '/' });
  }
    // console.log("Sesión cerrada correctamente");
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