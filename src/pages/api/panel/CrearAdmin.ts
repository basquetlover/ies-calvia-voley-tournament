import { supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {
  const { usuarioSeleccionado, menuPermisos, nuevoRango } = await request.json();
  console.log("Datos recibidos en API:", { usuarioSeleccionado, nuevoRango });

  const permisosFormateados = Object.fromEntries(
    menuPermisos.map((item: any) => [item.id, item.permisos])
  );

  let panel_concedido = usuarioSeleccionado.panel_concedido


  if(!panel_concedido || panel_concedido === "" || panel_concedido === "bloqueado"){
    panel_concedido = "manual"
  }
  

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("Usuarios")
        .update({
                rango: nuevoRango,
                permisos_panel: permisosFormateados,
                panel_concedido: panel_concedido
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

