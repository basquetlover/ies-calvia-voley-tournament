const urlActual = window.location.href;

// Extraer una parte de la URL (por ejemplo, el pathname)
const parteDeLaUrl = window.location.pathname;

console.log('URL actual:', urlActual);
console.log('Parte de la URL:', parteDeLaUrl);

// Importar WebSocket
import { WebSocketServer } from 'ws';
import { supabaseAdmin } from "src/lib/supabase";

const wss = new WebSocketServer({ port: 8080 });

async function obtenerDatos() {
    const { data: historial, error: errorHistorial } = await supabaseAdmin
        .from('Historial')
        .select('*');

    const { data: jugadores, error: errorJugadores } = await supabaseAdmin
        .from('JugadoresSS')
        .select('*');

    const { data: partidos, error: errorPartidos } = await supabaseAdmin
        .from('PartidosSS')
        .select('*');

    if (errorHistorial || errorJugadores || errorPartidos) {
        console.error('Error al obtener datos:', errorHistorial, errorJugadores, errorPartidos);
        return null;
    }

    return { historial, jugadores, partidos };
}

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    const interval = setInterval(async () => {
        const datosActualizados = await obtenerDatos();
        if (datosActualizados) {
            ws.send(JSON.stringify(datosActualizados));
        }
    }, 15000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket escuchando en ws://localhost:8080');
