import type { APIRoute } from 'astro';
import { supabaseAdmin } from 'src/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
try {
    const { torneoID, equipoID } = await request.json();

    if (!torneoID || !equipoID) {
        console.log("Error constantes")
    return new Response(JSON.stringify({ error: 'torneoID requerido' }), {
        status: 400
    });
    }

    const TablaEquipos = `Equipos${torneoID}`
    const TablaJugadores = `Jugadores${torneoID}`

    const { data: equips, error: errorEquips } = await supabaseAdmin
    .from(TablaEquipos)
    .select("id, nombre_equipo, estado, id_equipo, aceptado, escudo, inscrito, fecha_inscripcion, fecha_modificacion, fecha_revision, probl_tit_logo, email_capitan")
    .eq('id_equipo', equipoID)
    .single();

    if(errorEquips){
        console.log(errorEquips)
        return new Response(JSON.stringify({ error: `No s'ha trobat cap equip` }), {
        status: 400
    });
    }

    let inscriptor_nombre;
    let inscriptor_email;

    const { data: usuario, error: errorUsuario } = await supabaseAdmin
        .from("Usuarios")
        .select("nombre_real, apellidos, email, email_microsoft")
        .eq('id', equips.inscrito)
        .single();
    
    if(usuario){
        inscriptor_nombre = `${usuario.nombre_real} ${usuario.apellidos}`
        if(usuario.email_microsoft){
            inscriptor_email = usuario.email_microsoft
        } else {
            inscriptor_email = usuario.email
        }
    }

    const { data: jugadors, error: errorJugadors } = await supabaseAdmin
        .from(TablaJugadores)
        .select("id, nombre, _1r_apellido, _2n_apellido, curso, genero, email, observaciones")
        .eq('pertenece_equipo', equips.id)
        .eq('ficha', 'jugador');

    let { data: entrenador, error: errorEntrenador } = await supabaseAdmin
        .from(TablaJugadores)
        .select("id, nombre, _1r_apellido, _2n_apellido, curso, genero, email, observaciones")
        .eq('pertenece_equipo', equips.id)
        .eq('ficha', 'entrenador')
        .single();

    if(entrenador){
        if(!entrenador.email){
            entrenador = null
        }
    }

    let { data: profesor, error: errorProfesor } = await supabaseAdmin
        .from(TablaJugadores)
        .select("id, nombre, _1r_apellido, _2n_apellido, curso, genero, email, observaciones")
        .eq('pertenece_equipo', equips.id)
        .eq('ficha', 'profesor')
        .single();

    if(profesor){
        if(!profesor.email){
            profesor = null
        }
    }

    const { data: satff, error: errorSatff } = await supabaseAdmin
        .from(TablaJugadores)
        .select("id, nombre, _1r_apellido, _2n_apellido, curso, genero, email, observaciones")
        .eq('pertenece_equipo', equips.id)
        .eq('ficha', 'cuerpo_tecnico');



    // añadir campo capitan a jugadores
    const jugadoresConCapitan =
    (jugadors || []).map((jugador) => ({
        ...jugador,
        capitan:
        jugador.email?.toLowerCase() ===
        equips.email_capitan?.toLowerCase()
    }));

    // respuesta final
    const respuesta = {
        ...equips,

        inscriptor_email,
        inscriptor_nombre,

        jugadores: jugadoresConCapitan,

        entrenador: entrenador || null,

        profesor: profesor || null,

        cuerpo_tecnico: satff
    };

    // console.log(respuesta)

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