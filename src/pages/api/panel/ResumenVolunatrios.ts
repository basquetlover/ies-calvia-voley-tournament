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

    const TablaVoluntarios = `Voluntarios${torneoID}`

    const { data: voluntaris } = await supabaseAdmin
      .from(TablaVoluntarios)
      .select(
        "id, nombre, _1r_apellido, _2n_apellido, curso, tipo, descripcion, email, estado"
      )
      .order('id', {ascending: false});
  

    return new Response(JSON.stringify(voluntaris), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500
    });
  }
};