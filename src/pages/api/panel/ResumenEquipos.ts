import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { torneoID } = await request.json();

    if (!torneoID) {
      return new Response(JSON.stringify({ error: 'torneoID requerido' }), {
        status: 400
      });
    }

    const TablaEquipos = `Equipos${torneoID}`

    const { data: equips } = await supabaseAdmin
      .from(TablaEquipos)
      .select(
        "id,nombre_equipo, estado, id_equipo, aceptado, escudo, inscrito, fecha_inscripcion, fecha_modificacion, fecha_revision, capitan"
      )
      .order('id', {ascending: false});
  

    return new Response(JSON.stringify(equips), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500
    });
  }
};