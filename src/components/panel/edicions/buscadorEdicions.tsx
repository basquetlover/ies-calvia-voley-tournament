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

const formatearFecha = (fecha: string) => {
    const fechaFormateada = new Intl.DateTimeFormat("ca-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(fecha));

    return fechaFormateada.replace(
        /de (\w+)/,
        (_, mes) => `de ${mes.charAt(0).toUpperCase()}${mes.slice(1)}`
    );
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
                    className="w-115 h-62 bg-gris-claro rounded-2xl p-4"
                >
                    <div className="w-full grid grid-cols-[1fr_auto]">
                        <p className="text-2xl font-bold">{edicion.nombre}</p>
                        <p
                            className={`text-xs uppercase w-max h-max px-2 py-1 border rounded-full ${
                                edicion.estado === "Actual"
                                ? "bg-green-400/30 border-green-500 text-green-400"
                                : edicion.estado === "En Preparació"
                                ? "bg-azul-claro/30 border-azul-claro text-azul-claro"
                                : "bg-gray-600/30 border-gray-500 text-gray-500"
                            }`}
                        >
                            {edicion.estado}
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80zm0-80h560v-400H200zm0-480h560v-80H200zm0 0v-80z"/>
                        </svg>
                        {formatearFecha(edicion.fecha)}
                    </div>
                    <div className="grid grid-cols-3 text-gray-300 gap-4 my-5 place-items-center">
                        <div className="bg-gris w-full h-20 rounded-2xl py-2 flex flex-col items-center place-content-center">
                            <p className="text-2xl text-primary">{edicion.equipos}</p>
                            <p>Equips</p>
                        </div>
                        <div className="bg-gris w-full h-20 rounded-2xl py-2 flex flex-col items-center place-content-center">
                            <p className="text-2xl text-primary">{edicion.voluntarios}</p>
                            <p>Voluntaris</p>
                        </div> 
                        <div className="bg-gris w-full h-20 rounded-2xl py-2 flex flex-col items-center place-content-center">
                            <p className="text-2xl text-primary">{edicion.partidos}</p>
                            <p>Partits</p>
                        </div>     
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 font-light place-items-center">
                        {
                            edicion.estado === "Finalitzat" ? (
                                <a href={`/panel/info/edicio?torneoID=${edicion.id_torneo}&accio=editar`} className="bg-gray-200/10 w-full h-10 flex items-center place-content-center rounded-xl border border-transparent hover:border-red-400 hover:text-red-400 duration-300 cursor-not-allowed">
                                    Configurar
                                </a>
                            ):(
                                <a href={`/panel/info/edicio?torneoID=${edicion.id_torneo}&accio=editar`} className="bg-azul-suave w-full h-10 flex items-center place-content-center rounded-xl hover:bg-azul-claro duration-300 cursor-pointer">
                                    Configurar
                                </a>
                            )
                        }
                        
                        <a href={`/panel/info/edicio?torneoID=${edicion.id_torneo}&accio=ver`} className="border border-gray-500 w-full h-10 flex items-center place-content-center rounded-xl hover:bg-gray-200/10 duration-300 cursor-pointer">
                            Veure dades
                        </a>
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