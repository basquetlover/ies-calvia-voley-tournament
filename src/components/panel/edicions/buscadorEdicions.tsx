import { useEffect, useState, useRef } from "react";

interface Edicions {
    id_torneo: string,
    nombre: string,
    estado: string,
    fecha: string,
    equipos: number,
    voluntarios: number,
    partidos: number
}

export default function BuscarEdiciones() {

    const [data, setData] = useState<Edicions[]>([]);

    const lastBlurTime = useRef<number>(0);

    // 🔥 fetch reutilizable
    const cargarDatos = () => {
        fetch("/api/panel/Ediciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch(() => console.log("Error carregant dades"));
    };

    // carga inicial
    useEffect(() => {
        cargarDatos();
    }, []);

    

    return (
        <div className="max-w-7xl mx-auto flex mt-10 gap-5 flex-wrap">
            {data.map((edicion) => (
                <div
                    key={edicion.id_torneo}
                    className="w-115 h-60 bg-gris-claro rounded-2xl p-4"
                >
                    <div className="w-full grid grid-cols-[1fr_auto]">
                        <p className="text-xl font-bold">{edicion.nombre}</p>
                        <p className={`text-xs uppercase w-max h-max px-2 py-1 border rounded-full ${edicion.estado === "Actual" ? " bg-green-400/30 border-green-500 text-green-400 ":""}`}>
                            {edicion.estado}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// {
//     id_torneo: 'SS',
//     nombre: 'Torneig Setmana Santa',
//     estado: 'Finalitzat',
//     fecha: '2025-04-16',
//     equipos: 16,
//     voluntarios: 177,
//     partidos: 23
//   }