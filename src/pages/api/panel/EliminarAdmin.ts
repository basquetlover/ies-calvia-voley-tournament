import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {
  const { usuarioSeleccionado, } = await request.json();

  

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("Usuarios")
        .update({
                rango: null,
                permisos_panel: null,
                panel_concedido: "bloqueado"
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

