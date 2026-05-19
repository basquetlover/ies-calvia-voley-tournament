import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';

export const POST: APIRoute = async () => {
  try {

    // Obtener ediciones
    const { data: ConfTorneo, error } = await supabaseAdmin
      .from('Configuracion')
      .select('id_torneo, fecha, nombre, estado')
      .order('fecha', { ascending: false });

    if (error) {
      throw error;
    }

    const torneos = await Promise.all(
      (ConfTorneo || []).map(async (torneo) => {

        const tablaEquipos = `Equipos${torneo.id_torneo}`;
        const tablaJugadores = `Voluntarios${torneo.id_torneo}`;
        const tablaPartidos = `Partidos${torneo.id_torneo}`;

        // ejecutar en paralelo
        const [
          equiposResult,
          jugadoresResult,
          partidosResult
        ] = await Promise.all([

          supabaseAdmin
            .from(tablaEquipos)
            .select('*', {
              count: 'exact',
              head: true
            }),

          supabaseAdmin
            .from(tablaJugadores)
            .select('*', {
              count: 'exact',
              head: true
            }),

          supabaseAdmin
            .from(tablaPartidos)
            .select('*', {
              count: 'exact',
              head: true
            })

        ]);

        return {
          id_torneo: torneo.id_torneo,
          nombre: torneo.nombre,
          estado: torneo.estado,
          fecha: torneo.fecha,

          equipos:
            equiposResult.count ?? 0,

          voluntarios:
            jugadoresResult.count ?? 0,

          partidos:
            partidosResult.count ?? 0
        };
      })
    );
    
    return new Response(
      JSON.stringify(torneos),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {

    console.error(err);

    return new Response(
      JSON.stringify({
        error: 'Error interno'
      }),
      {
        status: 500
      }
    );
  }
};