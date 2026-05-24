import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
try {
    const { torneoID, voluntariID } = await request.json();

    if (!torneoID || !voluntariID) {
        console.log("Error constantes")
    return new Response(JSON.stringify({ error: 'torneoID requerido' }), {
        status: 400
    });
    }

    const TablaVoluntarios = `Voluntarios${torneoID}`
    const TablaJugadores = `Jugadores${torneoID}`
    const TablaEquipos = `Equipos${torneoID}`

    let nombre_equipo
    let escudo
    let estado_equipo
    let aceptado_equipo

    const { data: Voluntari, error: errorVoluntari } = await supabaseAdmin
    .from(TablaVoluntarios)
    .select("id, nombre, _1r_apellido, _2n_apellido, curso, tipo, descripcion, email, estado, observacion, fecha_inscripcion, fecha_revision")
    .eq('email', voluntariID)
    .single();

    const { data: Jugador, error: errorJugador } = await supabaseAdmin
    .from(TablaJugadores)
    .select("pertenece_equipo, ficha")
    .eq('email', voluntariID)
    .single();

    if(Jugador){
        const { data: Equipo, error: errorEquipo } = await supabaseAdmin
            .from(TablaEquipos)
            .select("nombre_equipo, escudo, estado, aceptado")
            .eq('id', Jugador.pertenece_equipo)
            .single();

        if(Equipo){
            nombre_equipo = Equipo.nombre_equipo
            escudo = Equipo.escudo
            estado_equipo = Equipo.estado
            aceptado_equipo = Equipo.aceptado
        }
    }

    if(errorVoluntari){
        console.log(errorVoluntari)
        return new Response(JSON.stringify({ error: `No s'ha trobat cap equip` }), {
        status: 400
    });
    }

    const respuesta = {
        ...Voluntari,
        ficha: Jugador?.ficha,
        nombre_equipo,
        escudo,
        estado_equipo,
        aceptado_equipo
    };


    console.log(respuesta)

    return new Response(JSON.stringify(respuesta), {
    status: 200,
    headers: { "Content-Type": "application/json" }
    });

    

} catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
    status: 500
    });
}
};