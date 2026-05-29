import { supabase, supabaseAdmin } from "src/lib/supabase";
import { tieneAcceso } from "src/lib/usuario_panel";

export async function POST({ request }: { request: Request }) {

const { data, url, accion, usuario } = await request.json();
  console.log("Datos recibidos en API:", { data, url, accion, usuario });
  const sessionId = usuario; // Asumiendo que 'usuario' es el sessionId
  const permitido = await tieneAcceso(
                url,
                accion,
                null,
                sessionId
            );
    
    if (!permitido) {
        return new Response(JSON.stringify({ok: false, error: { seccion: "general", mensaje: "Els permisos per a realitzar aquesta acció no estan habilitats" } }), { status: 401 });
    }

    if(!data){
        return new Response(JSON.stringify({ok: false, error: { seccion: "general", mensaje: "Error inesperat, torna-ho a intentar més tard" } }), { status: 400 });
    }

    let { data: Configuracion, error } = await supabaseAdmin
    .from('Configuracion')
    .select('*')
    .neq('id', data.id)

    let { data: ConfiguracionActual, error: error2 } = await supabaseAdmin
    .from('Configuracion')
    .select('*')
    .eq('id', data.id)
    .single();

    console.log("Configuracion actual:", ConfiguracionActual);

    if(error){
        console.log("Error al obtener configuraciones:", error);
        return new Response(JSON.stringify({ok: false, error: { seccion: "general", mensaje: "Error al obtener configuraciones" } }), { status: 500 });
    }

    if(!data.id_torneo || !data.nombre || !data.fecha){
      return new Response(JSON.stringify({ok: false, error: { seccion: "info", mensaje: "Falten dades per omplir" } }), { status: 400 });
    }

    const duplicat = Configuracion?.some((c) =>
      c.id !== data.id &&
      (
        c.id_torneo === data.id_torneo ||
        c.nombre === data.nombre
      )
    );

    if (duplicat) {
      return new Response(JSON.stringify({
        ok: false, error: {
          seccion: "info",
          mensaje: "Ja existeix una edició amb aquest torneig o nom"
        }
      }), { status: 409 });
    }

    const actual = Configuracion?.some((c) =>
      c.id !== data.id &&
      (
        c.estado === "Actual" && data.estado === "Actual"
      )
    );
    if (actual) {
      console.log("Ja existe una edicion activa")
      return new Response(JSON.stringify({
        ok: false, error: {
          seccion: "general",
          mensaje: "Ja hi ha una edició activa"
        }
      }), { status: 400 });
    }

    if(data.estado === "Finalitzat"){
        return new Response(JSON.stringify({
        ok: false, error: {
          seccion: "general",
          mensaje: "No es pot crear una edició com a finalitzada."
        }
      }), { status: 400 });
    }

    if(!data.in_inicio || !data.in_inicio){
      return new Response(JSON.stringify({ok: false, error: { seccion: "equipos", mensaje: "Falten dades per omplir" } }), { status: 400 });
    }
    if(!data.vo_inicio || !data.vo_inicio){
      return new Response(JSON.stringify({ok: false, error: { seccion: "voluntarios", mensaje: "Falten dades per omplir" } }), { status: 400 });
    }

    const dataEntrada = new Date(data.fecha);
    // const fechaActual = new Date(ConfiguracionActual?.fecha);
    const ara = new Date();

    if (dataEntrada < ara ) {
      return new Response(JSON.stringify({
        ok: false, error: {
          seccion: "info",
          mensaje: "La data no pot ser del passat"
        }
      }), { status: 400 });
    }

    const inInicio = new Date(data.in_inicio);
  const inFin = new Date(data.in_fin);

  if (!data.in_inicio || !data.in_fin || inInicio >= inFin) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "reglas",
        mensaje: "Les dates d'inscripció d'equips no són vàlides"
      }
    }), { status: 400 });
  }

    const voInicio = new Date(data.vo_inicio);
  const voFin = new Date(data.vo_fin);

  if (!data.vo_inicio || !data.vo_fin || voInicio >= voFin) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "voluntarios",
        mensaje: "Les dates d'inscripció de voluntaris no són vàlides"
      }
    }), { status: 400 });
  }

      //Jugadors
      if (
        data.min_jugadores == null ||
        data.max_jugadores == null ||
        data.min_jugadores < 0 ||
        data.max_jugadores < data.min_jugadores
      ) {
        return new Response(JSON.stringify({
          ok: false, error: {
            seccion: "equipos",
            mensaje: "Configuració de jugadors incorrecta"
          }
        }), { status: 400 });
      }

      //Voluntaris
      if (
        data.min_staff == null ||
        data.max_staff == null ||
        data.min_staff < 0 ||
        data.max_staff < data.min_staff
      ) {
        return new Response(JSON.stringify({
          ok: false, error: {
            seccion: "reglas",
            mensaje: "Configuració de voluntaris incorrecta"
          }
        }), { status: 400 });
      }

      if(data.equipo_mixto === "Permitido"){
        if(data.min_masc < 1 || data.min_fem < 1){
          return new Response(JSON.stringify({
          ok: false, error: {
            seccion: "reglas",
            mensaje: "Configuració de equips mixtes incorrecta"
          }
        }), { status: 400 });
        }
      }

      if (!data.entrenador) {
        return new Response(JSON.stringify({
          ok: false, error: {
            seccion: "entrenador",
            mensaje: "Has d'especificar si es permet entrenador"
          }
        }), { status: 400 });
      }

      if (!data.profesor) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "profesores",
        mensaje: "Has d'especificar si es permet professor"
      }
    }), { status: 400 });
  }

  const cursosData =
    data?.cursos?.cursos || data?.cursos;

  if (!cursosData || cursosData.length === 0) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "cursos",
        mensaje: "Has d'afegir almenys un curs"
      }
    }), { status: 400 });
  }

  const cursSenseGrups = cursosData.some((c: any) =>
    !c.grupos || c.grupos.length === 0
  );

  if (cursSenseGrups) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "cursos",
        mensaje: "Tots els cursos han de tenir almenys un grup"
      }
    }), { status: 400 });
  }

  if (!data.dom_alumnos || !data.dom_profesores) {
    return new Response(JSON.stringify({
      ok: false, error: {
        seccion: "dominios",
        mensaje: "Has d'especificar els dominis"
      }
    }), { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("Configuracion")
    .insert({
        id_torneo: data.id_torneo,
        nombre: data.nombre,
        fecha: data.fecha,
        estado: data.estado,
        in_inicio: data.in_inicio,
        in_fin: data.in_fin,
        vo_inicio: data.vo_inicio,
        vo_fin: data.vo_fin,
        min_jugadores: data.min_jugadores,
        max_jugadores: data.max_jugadores,
        min_staff: data.min_staff,
        max_staff: data.max_staff,
        entrenador: data.entrenador,
        profesor: data.profesor,
        cursos: data.cursos,
        dom_alumnos: data.dom_alumnos,
        dom_profesores: data.dom_profesores,
        equipo_mixto: data.equipo_mixto,
        min_masc: data.min_masc,
        min_fem: data.min_fem,
      
    })
    .select();



  if (updateError) {
    console.log("Error al guardar configuración:", updateError);
  return new Response(JSON.stringify({
    ok: false, error: {
      seccion: "general",
      mensaje: "Error al guardar la configuració"
    }
  }), { status: 500 });

}
if(updated){
    
        const { data:aa, error } = await supabase.rpc("create_equipos_tables", {
        torneoid: data.id_torneo, // 👈 el parámetro debe coincidir con el de la función
    });
        const { data: a, error: b } = await supabase.rpc("create_historial_tables", {
        torneoid: data.id_torneo, // 👈 el parámetro debe coincidir con el de la función
    });
        const { data: ab, error: bb } = await supabase.rpc("create_jugadores_tables", {
        torneoid: data.id_torneo, // 👈 el parámetro debe coincidir con el de la función
    });
        const { data: ac, error:bc } = await supabase.rpc("create_partidos_tables", {
        torneoid: data.id_torneo, // 👈 el parámetro debe coincidir con el de la función
    });
        const { data: ad, error: bd } = await supabase.rpc("create_voluntarios_tables", {
        torneoid: data.id_torneo, // 👈 el parámetro debe coincidir con el de la función
    });
    
    if(error || b || bb || bc || bd){
        console.log("Error al crear tablas:", { error, b, bb, bc, bd });
        return new Response(JSON.stringify({
            ok: false, error: {
              seccion: "general",
              mensaje: "Error al configurar la edició després de crear-la"
            }
          }), { status: 500 });
        }

}

    return new Response(JSON.stringify({ok:true, data: "Edició actualizada correctament"  }), { status: 200 });
}
