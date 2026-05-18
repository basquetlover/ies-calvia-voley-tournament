import React, { useEffect, useState } from 'react';

interface Actividad {
tipo: string;
accio: string;
referencia: string;
temps: string;
detalle?: string;
fecha_exacta: string;
}

interface Page {
num_pagina: number;
data: Actividad[];
}

interface Props {
torneoID: string;
}

export default function UltimaActividad({ torneoID }: Props) {
const [data, setData] = useState<Page[]>([]);
const [numPagina, setNumPagina] = useState(1);
const [listaPaginas, setListaPaginas] = useState<number[]>([]);
const [actividad, setActividad] = useState<Actividad[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

/**
 * 📡 FETCH API
 */
useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/panel/ActividadReciente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ torneoID }),
    })
    .then(res => res.json())
    .then((res: Page[]) => {
        setData(res);

        const paginas = res.map(p => p.num_pagina);
        setListaPaginas(paginas);

        setNumPagina(1);
    })
    .catch(() => setError('Error carregant dades'))
    .finally(() => setLoading(false));
}, [torneoID]);

/**
 * 🔄 ACTIVIDAD
 */
useEffect(() => {
    const paginaActual = data.find(p => p.num_pagina === numPagina);
    setActividad(paginaActual?.data ?? []);
}, [numPagina, data]);

/**
 * ⬅️➡️ CONTROLES
 */
const prevPage = () => {
    if (numPagina > 1) setNumPagina(numPagina - 1);
};

const nextPage = () => {
    if (numPagina < listaPaginas.length) setNumPagina(numPagina + 1);
};

/**
 * 🧠 PAGINACIÓN INTELIGENTE
 */
const getPaginasVisibles = () => {
    const total = listaPaginas.length;
    const rango = 2;

    let start = Math.max(1, numPagina - rango);
    let end = Math.min(total, numPagina + rango);

    const paginas: (number | string)[] = [];

    // inicio
    if (start > 1) {
    paginas.push(1);
    if (start > 2) paginas.push('...');
    }

    // centro
    for (let i = start; i <= end; i++) {
    paginas.push(i);
    }

    // final
    if (end < total) {
    if (end < total - 1) paginas.push('...');
    paginas.push(total);
    }

    return paginas;
};

const paginasVisibles = getPaginasVisibles();

if (loading) return <p>Carregant...</p>;
if (error) return <p>{error}</p>;

return (
    <div className='md:h-130 max-md:h-160 bg-gris-claro rounded-2xl overflow-y-hidden p-4'>

    {/* HEADER */}
    <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold">
        Activitat recent
        </h2>

        {/* PAGINACIÓN */}
        <div className="flex items-center gap-2 select-none">

        {/* ← */}
        <button
            onClick={prevPage}
            disabled={numPagina === 1}
            className="px-2 py-1 hover:bg-gray-700 rounded disabled:opacity-30"
        >
            {'<'}
        </button>

        {/* NÚMEROS INTELIGENTES */}
        {paginasVisibles.map((p, i) =>
            p === '...' ? (
            <span key={i} className="px-2">
                ...
            </span>
            ) : (
            <button
                key={p}
                onClick={() => setNumPagina(p as number)}
                className={`px-2 py-1 rounded ${
                p === numPagina
                    ? 'bg-azul-claro text-white'
                    : 'hover:bg-gray-700'
                }`}
            >
                {p}
            </button>
            )
        )}

        {/* → */}
        <button
            onClick={nextPage}
            disabled={numPagina === listaPaginas.length}
            className="px-2 py-1 hover:bg-gray-700 rounded disabled:opacity-30"
        >
            {'>'}
        </button>

        </div>
    </div>

    {/* LISTA */}
    <div className='flex flex-col gap-y-4'>
        {actividad.map((item, i) => (
        <div key={i} className="w-full px-4 py-3 max-md:px-1 grid grid-cols-[auto_1fr_auto] gap-x-2 items-center rounded-xl border border-transparent hover:border-azul-claro transition-colors">
            <span className="">
                {ICONS[item.tipo as keyof typeof ICONS]}
            </span>
            <span className='flex flex-col items-start'>
                <p><span className='font-semibold'>{item.accio}:</span> {item.referencia}</p>
                {item.detalle && <p className='text-sm text-gray-500'>{item.detalle}</p>}
            </span>
            
            <p className='text-gray-500 flex max-md:text-sm flex-col gap-y-1'>
                {/* <span>
                    {item.fecha_exacta}
                </span> */}
                {item.temps}
            </p>
        </div>
        ))}
    </div>

    </div>
);
}

const ICONS = {
  "equip_inscripcio": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-azul-suave/40'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' viewBox="0 -960 960 960">
            <path d="M500-482q29-32 44.5-73t15.5-85-15.5-85-44.5-73q60 8 100 53t40 105-40 105-100 53m220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80zm-593-87q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440t130 15.5T576-378q29 15 46.5 43.5T640-272v112zm320-400q33 0 56.5-23.5T400-640t-23.5-56.5T320-720t-56.5 23.5T240-640t23.5 56.5T320-560M80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360t-111 13.5T100-306q-9 5-14.5 14T80-272zm240 0"/>
        </svg>
    </span>
    
  ),
  "equip_modificacio": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-orange-500/40'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' fill="none">
            <path d="M12.5 11.95a5.7 5.7 0 0 0 1.113-1.825A6 6 0 0 0 14 8q0-1.1-.387-2.125A5.7 5.7 0 0 0 12.5 4.05q1.5.2 2.5 1.325T16 8t-1 2.625a3.94 3.94 0 0 1-2.5 1.325M18 20v-3q0-.9-.4-1.713a5.1 5.1 0 0 0-1.05-1.437q1.275.45 2.363 1.162Q20 15.725 20 17v3zM5.175 10.825Q4 9.65 4 8t1.175-2.825T8 4t2.825 1.175T12 8t-1.175 2.825T8 12t-2.825-1.175M0 20v-2.8q0-.85.438-1.562.437-.713 1.162-1.088a14.8 14.8 0 0 1 3.15-1.163A13.8 13.8 0 0 1 8 13q1.65 0 3.25.387 1.6.388 3.15 1.163.724.375 1.162 1.087Q16 16.35 16 17.2V20zm8-10q.825 0 1.412-.588Q10 8.826 10 8q0-.824-.588-1.412A1.93 1.93 0 0 0 8 6q-.824 0-1.412.588A1.93 1.93 0 0 0 6 8q0 .825.588 1.412Q7.175 10 8 10m-6 8h12v-.8a.973.973 0 0 0-.5-.85q-1.35-.675-2.725-1.012a11.6 11.6 0 0 0-5.55 0Q3.85 15.675 2.5 16.35a.97.97 0 0 0-.5.85zM19.518 12.95l.997-.989-.998-.989-.367.368.376.376a1.2 1.2 0 0 1-.477-.079 1.2 1.2 0 0 1-.682-.674 1.156 1.156 0 0 1-.053-.752 1.5 1.5 0 0 1 .11-.289l-.385-.385q-.15.219-.219.464-.07.246-.07.499 0 .332.131.656.132.324.385.578.255.254.569.38.315.127.648.136l-.333.332zm1.443-1.487q.15-.219.219-.464a1.8 1.8 0 0 0-.057-1.16 1.7 1.7 0 0 0-.38-.582q-.254-.253-.574-.376a1.8 1.8 0 0 0-.652-.122l.333-.341-.367-.368-.998.989.998.989.367-.368-.385-.385q.236 0 .481.092a1.16 1.16 0 0 1 .687.67q.092.226.092.454 0 .15-.04.298a1.5 1.5 0 0 1-.109.289zM19.5 14q-.727 0-1.365-.276a3.5 3.5 0 0 1-1.111-.748 3.5 3.5 0 0 1-.748-1.111A3.4 3.4 0 0 1 16 10.5q0-.727.276-1.365.275-.639.748-1.111a3.5 3.5 0 0 1 1.111-.748Q18.773 7 19.5 7t1.365.276 1.111.748.748 1.111Q23 9.773 23 10.5t-.276 1.365a3.5 3.5 0 0 1-.748 1.111 3.5 3.5 0 0 1-1.111.748Q20.227 14 19.5 14m0-.7q1.173 0 1.986-.814.814-.813.814-1.986t-.814-1.986T19.5 7.7t-1.986.814q-.814.813-.814 1.986t.814 1.986q.813.814 1.986.814"/>
        </svg>
    </span>
  ),
  "equip_revisio_denegat": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-red-500/40'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' fill="none">
            <g clip-path="url(#a)"><path d="M11.5 11.95a5.7 5.7 0 0 0 1.113-1.825A6 6 0 0 0 13 8q0-1.1-.387-2.125A5.7 5.7 0 0 0 11.5 4.05q1.5.2 2.5 1.325T15 8t-1 2.625a3.94 3.94 0 0 1-2.5 1.325M17 20v-3q0-.9-.4-1.713a5.1 5.1 0 0 0-1.05-1.437q1.275.45 2.363 1.162Q19 15.725 19 17v3zM4.175 10.825Q3 9.65 3 8t1.175-2.825T7 4t2.825 1.175T11 8t-1.175 2.825T7 12t-2.825-1.175M-1 20v-2.8q0-.85.438-1.562.437-.713 1.162-1.088a14.8 14.8 0 0 1 3.15-1.163A13.8 13.8 0 0 1 7 13q1.65 0 3.25.387 1.6.388 3.15 1.163.724.375 1.162 1.087Q15 16.35 15 17.2V20zm8-10q.824 0 1.412-.588Q9 8.826 9 8q0-.824-.588-1.412A1.93 1.93 0 0 0 7 6q-.824 0-1.412.588A1.93 1.93 0 0 0 5 8q0 .825.588 1.412Q6.175 10 7 10m-6 8h12v-.8a.973.973 0 0 0-.5-.85q-1.35-.675-2.725-1.012a11.6 11.6 0 0 0-5.55 0Q2.85 15.675 1.5 16.35a.97.97 0 0 0-.5.85zM16.75 10.85h3.5v-.7h-3.5zM18.5 14q-.727 0-1.365-.276a3.5 3.5 0 0 1-1.111-.748 3.5 3.5 0 0 1-.748-1.111A3.4 3.4 0 0 1 15 10.5q0-.727.276-1.365.275-.639.748-1.111a3.5 3.5 0 0 1 1.111-.748Q17.773 7 18.5 7t1.365.276 1.111.748.748 1.111Q22 9.773 22 10.5t-.276 1.365a3.5 3.5 0 0 1-.748 1.111 3.5 3.5 0 0 1-1.111.748Q19.227 14 18.5 14m0-.7q1.173 0 1.986-.814.814-.813.814-1.986t-.814-1.986Q19.673 7.7 18.5 7.7t-1.986.814q-.814.813-.814 1.986t.814 1.986 1.986.814"/></g><defs><clipPath id="a"><path  d="M0 0h24v24H0z"/></clipPath></defs>
        </svg>
    </span>
  ),
  "equip_revisio_acceptat_inscrit": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-green-500/40'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' fill="none">
        <g clip-path="url(#a)"><path d="M11.5 11.95a5.7 5.7 0 0 0 1.113-1.825A6 6 0 0 0 13 8q0-1.1-.387-2.125A5.7 5.7 0 0 0 11.5 4.05q1.5.2 2.5 1.325T15 8t-1 2.625a3.94 3.94 0 0 1-2.5 1.325M17 20v-3q0-.9-.4-1.713a5.1 5.1 0 0 0-1.05-1.437q1.275.45 2.363 1.162Q19 15.725 19 17v3zM4.175 10.825Q3 9.65 3 8t1.175-2.825T7 4t2.825 1.175T11 8t-1.175 2.825T7 12t-2.825-1.175M-1 20v-2.8q0-.85.438-1.562.437-.713 1.162-1.088a14.8 14.8 0 0 1 3.15-1.163A13.8 13.8 0 0 1 7 13q1.65 0 3.25.387 1.6.388 3.15 1.163.724.375 1.162 1.087Q15 16.35 15 17.2V20zm8-10q.824 0 1.412-.588Q9 8.826 9 8q0-.824-.588-1.412A1.93 1.93 0 0 0 7 6q-.824 0-1.412.588A1.93 1.93 0 0 0 5 8q0 .825.588 1.412Q6.175 10 7 10m-6 8h12v-.8a.973.973 0 0 0-.5-.85q-1.35-.675-2.725-1.012a11.6 11.6 0 0 0-5.55 0Q2.85 15.675 1.5 16.35a.97.97 0 0 0-.5.85zM17.448 13 15 10.63l.612-.593 1.836 1.778L21.388 8l.612.593z"/></g><defs><clipPath id="a"><path d="M0 0h24v24H0z"/></clipPath></defs>
        </svg>
    </span>
  ),
  "equip_revisio_acceptat_espera": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-yellow-500/40'>
       <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' viewBox="0 -960 960 960">
        <path d="M280-600v-80h560v80zm0 160v-80h560v80zm0 160v-80h560v80zM160-600q-17 0-28.5-11.5T120-640t11.5-28.5T160-680t28.5 11.5T200-640t-11.5 28.5T160-600m0 160q-17 0-28.5-11.5T120-480t11.5-28.5T160-520t28.5 11.5T200-480t-11.5 28.5T160-440m0 160q-17 0-28.5-11.5T120-320t11.5-28.5T160-360t28.5 11.5T200-320t-11.5 28.5T160-280"/>
       </svg>
    </span>
  ),
  "voluntari_inscripcio": (
    <span className='p-3 w-max h-max flex items-center place-content-center rounded-full bg-azul-suave/40'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 fill-blanco' viewBox="0 -960 960 960">
            <path d="M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5zM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64zM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58zm80-80h80v-280h-80zm520-546"/>
        </svg>
    </span>
  ),
  
};