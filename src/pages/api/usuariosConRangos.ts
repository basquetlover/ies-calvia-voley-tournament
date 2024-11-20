import { supabaseAdmin } from "../../lib/supabase";
import type { APIRoute } from "astro";

// Define una estructura para los usuarios con rango
interface UserWithRango {
    email: string;
    rango: string;
}

export const get: APIRoute = async ({}) => {
    try {
        // Paso 1: Obtener los correos electrónicos desde auth.users
        const { data: userData, error: fetchUsersError } = await supabaseAdmin.auth.admin.listUsers();

        if (fetchUsersError) {
            return new Response(
                JSON.stringify({ error: "Error al obtener usuarios", details: fetchUsersError.message }),
                { status: 500 }
            );
        }

        const users = userData?.users
            ?.map((user) => user.email)
            .filter((email): email is string => email !== undefined); // Filtrar emails undefined

        // Paso 2: Obtener los rangos desde la tabla Administradores
        const { data: administradoresData, error: fetchAdminError } = await supabaseAdmin
            .from("Administradores")
            .select("rango, user_email");

        if (fetchAdminError) {
            return new Response(
                JSON.stringify({ error: "Error al obtener rangos", details: fetchAdminError.message }),
                { status: 500 }
            );
        }

        // Paso 3: Crear un mapa para asociar emails con sus rangos
        const rangosMap = new Map(
            administradoresData?.map((admin) => [admin.user_email, admin.rango])
        );

        // Paso 4: Combinar los usuarios con sus rangos
        const usersWithRangos: UserWithRango[] = users.map((email) => ({
            email,
            rango: rangosMap.get(email) || "Sin Rango", // "Sin Rango" si no está en la tabla Administradores
        }));

        // Devolver los datos como JSON
        return new Response(JSON.stringify(usersWithRangos), { status: 200 });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor", details: error }),
            { status: 500 }
        );
    }
};
