import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {
    const { observaciones, torneoID, data } = await request.json();

    const estado = "Acceptar"

    console.log(data)

    let { data: usuario, error } = await supabaseAdmin
        .from('Usuarios')
        .select('*')
        .eq('email_microsoft', data.email)
        .single();
    
    console.log(usuario)

    if(!usuario.rango){
        console.log("Usuari sense acces al panell")
    }

  return new Response(JSON.stringify({ok:true, data: "Edició actualizada correctament"  }), { status: 200 });
}

