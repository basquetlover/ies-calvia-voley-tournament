import { useState, useEffect } from "react";

type Props = {
torneoID?: string | null;
};

interface Edicio {
  id: number,
  id_torneo: string,
  nombre: string,
  fecha: string,
  estado: string,
  in_inicio: string,
  in_fin: string,
  vo_inicio: string,
  cursos: any,
  vo_fin: string,
  min_jugadores: number,
  max_jugadores: number,
  min_staff: number,
  max_staff: number,
  entrenador: string,
  profesor: string,
  dom_alumnos: string,
  dom_profesores: string,
}

export default function PreviewEdicion({ torneoID }: Props){

    const [data, setData] = useState<Edicio | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);

        fetch("/api/panel/InfoEdicion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ torneoID }),
        })
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    setError(true);
                    return;
                }

                setData(json); // 👈 FIX IMPORTANTE
            })
            .catch(() => {
                setError(true);
            });

    }, [torneoID]);

    return(
        <>
        {
            data ? (
                <div className="max-w-7xl mx-auto flex flex-col gap-10 items-center mb-10">
                    <div className="w-full flex flex-row items-center place-content-between border-b border-gray-500 px-4 py-2 shrink-0">
                        <a href={`/panel/edicions?torneoID=${torneoID}`} className="flex items-center px-2 py-1 rounded-full hover:bg-gris-claro/50 duration-300 gap-x-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224z"/>
                                </svg>
                            </span>
                            Tancar
                        </a>
                        <div className="flex items-center gap-10">
                            <a href={`/panel/info/edicio?torneoID=${torneoID}&accio=editar`} className="px-3 py-2 border border-gray-500 rounded-xl">
                                Editar edició
                            </a>
                            {/* <div className="px-3 py-2 rounded-xl flex flex-row items-center gap-x-2 bg-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480zm-80 34L646-760H200v560h560zM565-275q35-35 35-85t-35-85-85-35-85 35-35 85 35 85 85 35 85-35M240-560h360v-160H240zm-40-86v446-560z"/>
                                </svg>
                                Guardar canvis
                            </div> */}
                        </div>
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <div className="flex flex-wrap place-content-between">
                            <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                </svg>
                                Informació bàsica
                            </p>
                            <p
                                    className={`text-xs justify-end uppercase w-max h-max px-2 py-1 border rounded-full ${
                                        data.estado === "Actual"
                                        ? "bg-green-400/30 border-green-500 text-green-400"
                                        : data.estado === "En Preparació"
                                        ? "bg-azul-claro/30 border-azul-claro text-azul-claro"
                                        : "bg-gray-600/30 border-gray-500 text-gray-500"
                                    }`}
                                >
                                    {data.estado}
                                </p>
                            </div>
                        <div className="mt-5">
                            <p>Tournament ID</p>
                            <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{data.id_torneo}</p>
                        </div>
                        <div className="mt-5">
                            <p>Nom del torneig</p>
                            <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{data.nombre}</p>
                        </div>
                        <div className="mt-5">
                            <p>Data del torneig</p>
                            <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{new Date(data.fecha).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M500-482q29-32 44.5-73t15.5-85-15.5-85-44.5-73q60 8 100 53t40 105-40 105-100 53m220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80zm-593-87q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440t130 15.5T576-378q29 15 46.5 43.5T640-272v112zm320-400q33 0 56.5-23.5T400-640t-23.5-56.5T320-720t-56.5 23.5T240-640t23.5 56.5T320-560M80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360t-111 13.5T100-306q-9 5-14.5 14T80-272zm240 0"/>
                            </svg>
                            Inscripció equips
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 mt-5">
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data inici</p>
                                <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{new Date(data.in_inicio).toLocaleString("ca-ES")}</p>
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data fi</p>
                                <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{new Date(data.in_fin).toLocaleString("ca-ES")}</p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5zM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64zM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58zm80-80h80v-280h-80zm520-546"/>
                            </svg>
                            Inscripció voluntaris
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 mt-5">
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data inici</p>
                                <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{new Date(data.vo_inicio).toLocaleString("ca-ES")}</p>
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                                <p>Data fi</p>
                                <p className="w-full rounded-xl items-center flex px-2 py-1 mt-2 h-10 bg-gris">{new Date(data.vo_fin).toLocaleString("ca-ES")}</p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="max-w-150 w-full border-l-4 border-primary p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="m576-160-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104-56 56-104-104zm79-360L513-662l56-56 85 85 170-170 56 57zM80-280v-80h360v80zm0-320v-80h360v80z"/>
                            </svg>
                            Regla d'equips
                        </p>

                        <div className="w-full gap-x-4 grid grid-cols-2 text-blanco max-md:text-sm mt-5">
                            <div className="grid grid-cols-[1fr_auto]  items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim  jugadors</p>
                                <p className="text-primary px-2 py-1 mt-2 h-10">
                                    {data.min_jugadores}
                                </p>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Máxim  jugadors</p>
                                <p className="text-primary px-2 py-1 mt-2 h-10">
                                    {data.max_jugadores}
                                </p>
                            </div>
                        </div>

                        <div className="w-full gap-x-4 grid grid-cols-2 text-blanco max-md:text-sm mt-5">
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Mínim  staff</p>
                                <p className="text-primary px-2 py-1 mt-2 h-10">
                                    {data.min_staff}
                                </p>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                                <p>Máxim  staff</p>
                                <p className="text-primary px-2 py-1 mt-2 h-10">
                                    {data.max_staff}
                                </p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240zm0-332 274-148-274-148-274 148zm0 241 200-108v-151L480-360 280-470v151zm0-151"/>
                            </svg>
                            Entrenador
                        </p>

                        <div className="w-full gap-x-4  mt-5">
                            <div className="w-full grid grid-cols-[1fr_auto] items-center gap-x-4 bg-gris rounded-xl p-4">
                                <div>
                                    <p className="text-lg">Permetre entrenador</p>
                                    <p className="font-light text-gray-300">Permet incloure un entrenador</p>
                                </div>
                                <button className={`w-12 h-6  cursor-pointer rounded-full p-1 flex items-center ${data.entrenador === "Permitido" ? "justify-end bg-primary":"justify-start bg-primary/50"}`}>
                                    <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                                </button>
                            </div>
                        </div>

                        
                        
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240zm0-332 274-148-274-148-274 148zm0 241 200-108v-151L480-360 280-470v151zm0-151"/>
                            </svg>
                            Professors
                        </p>

                        <div className="w-full gap-x-4  mt-5">
                            <div className="w-full grid grid-cols-[1fr_auto] items-center gap-x-4 bg-gris rounded-xl p-4">
                                <div>
                                    <p className="text-lg">Permetre professor</p>
                                    <p className="font-light text-gray-300">Permet incloure docents a l'equip</p>
                                </div>
                                <button className={`w-12 h-6  cursor-pointer rounded-full p-1 flex items-center ${data.profesor === "Permitido" ? "justify-end bg-primary":"justify-start bg-primary/50"}`}>
                                    <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                                </button>
                            </div>
                        </div>

                        
                    </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564m0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27m0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6m260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59M280-494"/>
                            </svg>
                            Cursos permesos
                        </p>

                        <div className="mt-5 flex flex-col gap-4">

                            {data?.cursos?.cursos?.length ? (
                                data.cursos.cursos.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-gris rounded-xl p-3 border border-gray-700">
                                    
                                    <p className="text-primary font-semibold mb-2">
                                        {item.curso}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {item.grupos?.map((grupo: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-sm bg-gris-claro border border-gray-600 rounded-full"
                                        >
                                            {grupo}
                                        </span>
                                        ))}
                                    </div>

                                    </div>
                                ))
                                ) : (
                                <p className="text-gray-400 text-sm">No hi ha cursos assignats</p>
                                )}

                        </div>
                        </div>

                    <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                        <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                                <path d="M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480t58.5-141.5T480-680t141.5 58.5T680-480v58q0 26 17 44t43 18 43-18 17-44v-58q0-134-93-227t-227-93-227 93-93 227 93 227 227 93h200v80zm85-315q35-35 35-85t-35-85-85-35-85 35-35 85 35 85 85 35 85-35"/>
                            </svg>
                            Dominis de correu
                        </p>

                        <div className="w-full h-20 grid grid-cols-[auto_1fr] items-center gap-x-4 bg-gris p-4 rounded-xl my-5">
                            <span className="w-max h-max p-2 flex items-center place-content-center bg-orange-700/60 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-orange-400" viewBox="0 -960 960 960">
                                    <path d="M367-527q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440t130 15.5T736-378q29 15 46.5 43.5T800-272v112zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360t-111 13.5T260-306q-9 5-14.5 14t-5.5 20zm296.5-343.5Q560-607 560-640t-23.5-56.5T480-720t-56.5 23.5T400-640t23.5 56.5T480-560t56.5-23.5M480-240"/>
                                </svg>
                            </span>
                            <div>
                                <p>Alumnes</p>
                                <p>{data.dom_alumnos}</p>
                            </div>
                        </div>

                        <div className="w-full h-20 grid grid-cols-[auto_1fr] gap-x-4 bg-gris p-4 rounded-xl">
                            <span className="w-max h-max p-2 flex items-center place-content-center bg-azul-claro/50 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-primary" viewBox="0 -960 960 960">
                                    <path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330t-43.5 4.5T276-312q-17 8-26.5 22.5T240-258zm320-60h160v-60H560zm-157.5-77.5Q420-395 420-420t-17.5-42.5T360-480t-42.5 17.5T300-420t17.5 42.5T360-360t42.5-17.5M560-420h160v-60H560zM440-600h80v-200h-80zm40 220"/>
                                </svg>
                            </span>
                            <div>
                                <p>Professors</p>
                                <p>{data.dom_profesores}</p>
                            </div>
                        </div>
                        
                        
                    </div>


                </div>
            ):(
                <></>
            )
        }
        </>
        
    )
}