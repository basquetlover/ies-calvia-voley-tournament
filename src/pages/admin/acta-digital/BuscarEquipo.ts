import { supabaseAdmin } from "src/lib/supabase";

type Jugador = {
    nombre: string;
    _1r_apellido: string;
    img: string;
};

export async function BuscarEquipo(id_equipo: string){
    let referencia_equipo = "";
    let jugadores: Jugador[] = [];
    let { data: Equipo, error: EquipoLocaleError } = await supabaseAdmin
    .from('EquiposSS')
    .select('id')
    .eq('nombre_equipo', id_equipo)
    .single();
    if(Equipo){
       
        referencia_equipo = Equipo.id;
    }
    
    let { data: Jugadores, error: JugadoresError } = await supabaseAdmin
    .from('JugadoresSS')
    .select('nombre, _1r_apellido, img')
    .in('ficha', ['jugador'])
    .eq('pertenece_equipo', referencia_equipo)
    .order('id', { ascending: true });

if (Jugadores) {
    // Filtrar jugadores con nombre no nulo o vacío
    Jugadores.forEach(jugador => {
        if (jugador.nombre && jugador.nombre.trim() !== '') {
            jugadores.push(jugador);
        }
    });
 
}
return jugadores
}
