// partidos.js
import { supabaseAdmin } from "src/lib/supabase";

async function obtenerPartido(numero) {
  let partido = {
    pista: 'Sin Pista',
    equipo_a: '',
    escudo_a: '',
    equipo_b: '',
    escudo_b: '',
    resultado_a: '-',
    resultado_b: '-',
    estado: 'Por Jugar'
  };

  try {
    const { data, error } = await supabaseAdmin
      .from('ResultadoNavidad')
      .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
      .eq('numero_partido', `partido_${numero}`)
      .single();

    if (error) {
      console.error(`Error al buscar partido ${numero}`, error.message);
    } else if (data) {
      partido.pista = data.pista;
      partido.equipo_a = data.equipo_a;
      partido.equipo_b = data.equipo_b;
      partido.resultado_a = data.resultado_a;
      partido.resultado_b = data.resultado_b;
      partido.estado = data.estado;

      // Obtener escudos
      if (partido.equipo_a) {
        const { data: escudo_a_data } = await supabaseAdmin
          .from('Equipos')
          .select('escudo')
          .eq('nombre_equipo', partido.equipo_a)
          .single();
        partido.escudo_a = escudo_a_data ? escudo_a_data.escudo : '';
      }

      if (partido.equipo_b) {
        const { data: escudo_b_data } = await supabaseAdmin
          .from('Equipos')
          .select('escudo')
          .eq('nombre_equipo', partido.equipo_b)
          .single();
        partido.escudo_b = escudo_b_data ? escudo_b_data.escudo : '';
      }
    }
  } catch (err) {
    console.error(`Error al obtener el partido ${numero}:`, err);
  }

  return partido;
}

export async function obtenerPartidos() {
  const partidos = [];
  partidos.push(await obtenerPartido(1));
  partidos.push(await obtenerPartido(2));
  partidos.push(await obtenerPartido(3));
  partidos.push(await obtenerPartido(4));
  partidos.push(await obtenerPartido(5));
  partidos.push(await obtenerPartido(6));
  partidos.push(await obtenerPartido(7));
  partidos.push(await obtenerPartido(8));
  
  return partidos;
}