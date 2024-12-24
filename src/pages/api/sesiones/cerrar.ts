import type { APIRoute } from "astro";


export const GET: APIRoute = async ({ cookies, redirect }) => {

    cookies.delete('session', { path: '/' });
    // console.log("Sesión cerrada correctamente");
  

  // Redirige a la página de inicio de sesión
  return redirect("/");
};