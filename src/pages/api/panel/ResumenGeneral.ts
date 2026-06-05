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

    /**
     * TORNEO ACTUAL
     */
    const { data: torneoActual, error: errorActual } = await supabaseAdmin
      .from("Configuracion")
      .select("id_torneo, fecha")
      .eq("id_torneo", torneoID)
      .single();

    if (errorActual || !torneoActual) {
      return new Response(JSON.stringify({ error: 'Torneo no encontrado' }), {
        status: 404
      });
    }

    /**
     * TORNEO ANTERIOR
     */
    const { data: torneoAnterior } = await supabaseAdmin
      .from('Configuracion')
      .select('id_torneo, fecha')
      .lt('fecha', torneoActual.fecha)
      .order('fecha', { ascending: false })
      .limit(1)
      .single();

    /**
     * Utils
     */
    const Tabla = (base: string, id: string | number) => `${base}${id}`;

    const getCount = async (tabla: string, filtroEmail = false) => {
      let query = supabaseAdmin
        .from(tabla)
        .select('id', { count: 'exact', head: true });

      if (filtroEmail) {
        query = query
          .not('email', 'is', null)
          .neq('email', '');
      }

      const { count } = await query;
      return count ?? 0;
    };

    const calcularVariacion = (actual: number, anterior: number) => {
      if (!anterior) return 0;
      return ((actual - anterior));
    };

    /**
     * ENTIDADES
     */
    const entidades = [
      { base: "Equipos", nombre: "Equips", email: false },
      { base: "Voluntarios", nombre: "Voluntaris", email: false },
      { base: "Partidos", nombre: "Partits", email: false },
      { base: "Jugadores", nombre: "Jugadors", email: true }
    ];

    /**
     * DATOS EN PARALELO
     */
    const [actual, anterior] = await Promise.all([
      Promise.all(
        entidades.map(e =>
          getCount(Tabla(e.base, torneoActual.id_torneo), e.email)
        )
      ),
      torneoAnterior
        ? Promise.all(
            entidades.map(e =>
              getCount(Tabla(e.base, torneoAnterior.id_torneo), e.email)
            )
          )
        : Promise.resolve(entidades.map(() => 0))
    ]);

    /**
     * RESULTADO FINAL
     */
    const secciones = entidades.map((e, i) => {
      const cantidadActual = actual[i];
      const cantidadAnterior = anterior[i];

      const variacion = calcularVariacion(cantidadActual, cantidadAnterior);

      return {
        nombre: e.nombre,
        cantidad: cantidadActual,
        variacion: Number(variacion.toFixed(1)),
        positivo: variacion >= 0
      };
    });

    return new Response(JSON.stringify(secciones), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500
    });
  }
};