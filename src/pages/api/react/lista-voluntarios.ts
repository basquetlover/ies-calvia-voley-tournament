
import { supabaseAdmin } from "src/lib/supabase";


export async function POST({ request }: { request: Request }) {

    let { data: Voluntarios, error: AdminError } = await supabaseAdmin
        .from('Administradores')
        .select('nombre')
        .neq('rango', 'Professor')
        .order('id', { ascending: true });

    if(AdminError){
        console.log("Error al obtener Voluntarios:", AdminError);
    }

    return new Response(JSON.stringify({ Voluntarios }), { status: 200 });
}