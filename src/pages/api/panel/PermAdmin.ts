import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {
  const { usuarioSeleccionado} = await request.json();
  console.log("Datos recibidos en API:", { usuarioSeleccionado });


  

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("Usuarios")
        .update({
                panel_concedido: "manual"
        })
        .eq("id", usuarioSeleccionado.id)
        .select()
        .single();

    if (updateError) {
    return new Response(JSON.stringify({
        ok: false, error: {
        seccion: "general",
        mensaje: "Error al guardar la configuració"
        }
    }), { status: 500 });
    }

  return new Response(JSON.stringify({ok:true, data: "Edició actualizada correctament"  }), { status: 200 });
}

