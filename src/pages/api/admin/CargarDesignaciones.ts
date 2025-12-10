import { verificarSesion } from "src/lib/session";
import { supabaseAdmin } from "src/lib/supabase";

export async function POST({ request }: { request: Request }) {
    try {
        const usuario = await verificarSesion(request);

        const { data: ConfTorneo } = await supabaseAdmin
            .from('Configuracion')
            .select('id_torneo, nombre')
            .eq('estado', 'Actual')
            .single();

        let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
        let TablaEquipos = `Equipos${ConfTorneo?.id_torneo}`;

        

        interface Equipo {
            nombre_equipo: string;
            escudo: string;
        }

        interface Partido {
            equipo_local: string;
            equipo_visitante: string;
            arbitro: string;
            oficial_1: string;
            oficial_2: string;
            pista: string;
            id_partido: string;
            estado: string;
        }

        let partidos_designados: Partido[] = [];
        let escudosMappartidos_designados: Record<string, string> = {};

        const { data: Administradores } = await supabaseAdmin
            .from('Administradores')
            .select('nombre')
            .eq('user_email', usuario.email)
            .single();

        try {
            // Buscar partidos designados
            const { data } = await supabaseAdmin
                .from(TablaPartidos)
                .select('equipo_local, equipo_visitante, pista, id_partido, arbitro, oficial_1, oficial_2, estado')
                .or(`arbitro.eq.${Administradores?.nombre},oficial_1.eq.${Administradores?.nombre},oficial_2.eq.${Administradores?.nombre}`)
                .order('id', { ascending: true });

            partidos_designados = data || [];

            // Obtener nombres únicos de equipos
            const equiposNombres = [
                ...new Set(
                    partidos_designados.flatMap(p =>
                        [p.equipo_local, p.equipo_visitante]
                    )
                )
            ];

            // Buscar escudos
            const { data: equipos } = await supabaseAdmin
                .from(TablaEquipos)
                .select('nombre_equipo, escudo')
                .in('nombre_equipo', equiposNombres);

            escudosMappartidos_designados = equipos?.reduce(
                (acc: Record<string, string>, equipo: Equipo) => {
                    acc[equipo.nombre_equipo] = equipo.escudo;
                    return acc;
                },
                {}
            ) || {};

        } catch (err) {
            console.error('Error al obtener datos:', err);
        }

        // 👉 ÚNICO ARRAY FINAL
        const resultado = [
            partidos_designados,
            escudosMappartidos_designados
        ];
        //console.log("Resultado CargarDesignaciones:", resultado);

        return new Response(JSON.stringify(resultado), { status: 200 });

    } catch (error) {
        console.error("Error en CargarDesignaciones:", error);
        return new Response("Error en el servidor", { status: 401 });
    }
}
