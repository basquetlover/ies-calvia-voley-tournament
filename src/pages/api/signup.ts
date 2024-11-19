// import type { APIContext } from "astro";
// import { generateId } from "lucia";
// import {db, User} from "astro:db";
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

//     //Insertar usuario en db
//     const userId = generateId(8);

//     await db.insert(User).values([
//         {
//             id: userId,
//             username,
//             password
//         }
//     ]);

//     //Generar session
//     const session = await lucia.createSession(userId, {});
//     const sessionCookie = lucia.createSessionCookie(session.id);
//     context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

//     return context.redirect("/admin")
// }