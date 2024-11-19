// import type { APIContext } from "astro";
// import {db, eq, User} from "astro:db";
// import { lucia } from '../../auth';

// export async function POST(context:APIContext):Promise<Response> {
//     //Parse the form data
//     const formData = await context.request.formData();
//     const username = formData.get("username");
//     const password = formData.get("password");

//     //Validarlos
//     if(!username || !password){
//         return new Response("Nombre de usuario y contraseña son requeridos", { status: 400});
//     }
//     if(typeof username !== 'string'){
//         return new Response("El nombre de usuario debe ser un string", {status:404});
//     }
//     if(typeof password !== 'string' || password.length < 4){
//         return new Response("El nombre de usuario debe ser un string y debe ser almenos de 4 caracteres", {status:404});
//     }

//     //Buscar usuario en db
//     const foundUsers = (await db.select().from(User).where(eq(User.username, username))).at(0);

//     //si no encuentro usuario
//     if(!foundUsers){
//         return new Response("Incorrect username or password", {status: 400});
//     }

//     //Verificar contraseña
//     const validPassword = (await db.select().from(User).where(eq(User.password, password))).at(0);
//     if(!validPassword){
//         return new Response("Incorrect username or password", {status: 400});
//     }

//     //Contraseña valida
//     const session = await lucia.createSession(foundUsers.id, {});
//     const sessionCookie = lucia.createSessionCookie(session.id);
//     context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

//     return context.redirect("/admin")

    
    
// }