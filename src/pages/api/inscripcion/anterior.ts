import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener session_id de las cookies
    const cookieHeader = request.headers.get('cookie');
    const cookies = new Map<string, string>();

    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies.set(name, value);
      });
    }

    const sessionId = cookies.get('session_id');

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'No session found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener información del usuario actual
    const { data: usuario, error: userError } = await supabaseAdmin
      .from('Usuarios')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (userError || !usuario) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener todas las configuraciones ordenadas por fecha
    const { data: configuraciones, error: confError } = await supabaseAdmin
      .from('Configuracion')
      .select('id_torneo, fecha, nombre')
      .eq('estado', 'Finalizado')
      .order('fecha', { ascending: false }) // ordenar por fecha más reciente
      .limit(1) // solo el primero
      .single(); // solo necesitamos la más reciente






      //.order('created_at', { ascending: false });
    
    if (confError || !configuraciones) {
      console.error('Error fetching configurations:', confError);
      return new Response(
        JSON.stringify({ error: 'No previous edition found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const edicionAnterior = configuraciones;

    // Encontrar la edición anterior (segunda más reciente)
    //const edicionAnterior = configuraciones?.reduce((prev, curr) => {
//   return curr.id_torneo > prev.id_torneo ? curr : prev;
// }, configuraciones[0]);
    console.log('Previous edition found:', edicionAnterior);
    const tablaNombreEquipos = `Equipos${edicionAnterior?.id_torneo}`;
    const tablaNombreJugadores = `Jugadores${edicionAnterior?.id_torneo}`;
    const tablaNombreStaff = `Jugadores${edicionAnterior?.id_torneo}`;

    // Buscar el equipo inscrito por el usuario en la edición anterior
    const { data: equipoAnterior, error: equipoError } = await supabaseAdmin
      .from(tablaNombreEquipos)
      .select('*')
      .eq('inscrito', usuario.id)
      .single();

    if (equipoError || !equipoAnterior) {
      return new Response(
        JSON.stringify({ success: false, message: 'No inscription found in previous edition' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener jugadores del equipo anterior
    const { data: jugadoresAnteriores, error: jugError } = await supabaseAdmin
      .from(tablaNombreJugadores)
      .select('*')
      .eq('pertenece_equipo', equipoAnterior.id)
      //.order('created_at', { ascending: true });

    if (jugError) {
      console.error('Error fetching players:', jugError);
    }

    // Obtener staff del equipo anterior
    const { data: staffAnterior, error: staffError } = await supabaseAdmin
      .from(tablaNombreStaff)
      .select('*')
      .eq('pertenece_equipo', equipoAnterior.id);

    if (staffError) {
      console.error('Error fetching staff:', staffError);
    }

    // Construir la respuesta con todos los datos de la inscripción anterior
    const datosInscripcionAnterior = {
      success: true,
      equipo: equipoAnterior,
      jugadores: jugadoresAnteriores || [],
      staff: staffAnterior || [],
      edicionAnterior: {
        id: edicionAnterior?.id_torneo,
        nombre: edicionAnterior?.nombre,
      }
    };

    return new Response(
      JSON.stringify(datosInscripcionAnterior),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recuperar-anterior:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
