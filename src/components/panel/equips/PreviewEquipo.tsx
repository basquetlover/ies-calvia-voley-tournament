import { useEffect, useState } from "react";

type Props = {
torneoID?: string | null;
equipoID?: string | null;
};

interface EquipoData {
id: number,
nombre_equipo: string,
estado?: string,
id_equipo?: string,
aceptado?: string,
escudo?: string,
inscrito: number,
fecha_inscripcion: string,
fecha_modificacion: string,
fecha_revision: string,
siglas: string,
probl_tit_logo: null,
inscriptor_email?: string,
inscriptor_nombre?: string,
email_capitan: 'hhernandezutrera@alu.ibeducacio.eu',
jugadores: any[];
entrenador: any;
profesor: any;
cuerpo_tecnico: any[];
}

export default function PreviewEquipo({ torneoID, equipoID }: Props) {
    const [data, setData] = useState<EquipoData | null>(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        setError(false);

        fetch("/api/panel/InfoEquipo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ torneoID, equipoID }),
        })
            .then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                setError(true);
                return;
            }

            setData(data);
            })
            .catch(() => {
            setError(true);
            console.log("Error carregant dades");
            });
    }, [torneoID, equipoID]);

    // console.log(data)

    return(
        <>
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="w-full flex flex-row items-center place-content-between border-b border-gray-500 px-4 py-2 shrink-0">
                <a href={`/panel/equips?torneoID=${torneoID}`} className="flex items-center px-2 py-1 rounded-full hover:bg-gris-claro/50 duration-300 gap-x-1">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224z"/>
                        </svg>
                    </span>
                    Tancar
                </a>
                <div className="flex items-center gap-10">
                    <a href={`/panel/info/equip?torneoID=${torneoID}&equipoID=${equipoID}&accio=editar`} className="px-3 py-2 border border-gray-500 rounded-xl">
                        Editar equip
                    </a>
                    <a href={`/panel/info/equip?torneoID=${torneoID}&equipoID=${equipoID}&accio=evaluar`} className="px-3 py-2 rounded-xl bg-accent">
                        Avaluar equip
                    </a>
                </div>
            </div>
            {data ? (
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-6xl mx-auto mt-10 mb-10">

                        {/* Info General */}

                        <h3 className="flex items-center gap-x-2 font-semibold text-xl">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-azul-claro" viewBox="0 -960 960 960">
                                    <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                </svg>
                            </span>
                            Informació de l'equip
                        </h3>
                        <div className="w-full h-40 bg-gris-claro rounded-2xl border items-center px-4 border-gray-600 mt-5 grid grid-cols-[auto_1fr_1fr] gap-5">
                            <img src={data.escudo} className="w-32 h-32 rounded-lg"/>
                            <div className="flex flex-col gap-y-4">
                                <span className="flex flex-col">
                                    <p className="text-gray-400 text-sm">Nom de l'equip</p>
                                    <p className="font-semibold">{data.nombre_equipo}</p>
                                </span>
                                <span className="flex flex-col">
                                    <p className="text-gray-400 text-sm">Responsable del registre</p>
                                    <p className="font-semibold">{data.inscriptor_nombre}</p>
                                    <p className="text-sm">{data.inscriptor_email}</p>
                                </span>
                            </div>
                            <div className="flex flex-col gap-y-4">
                                <span className="flex flex-col">
                                    <p className="text-gray-400 text-sm">Estat</p>
                                    <div className="w-full flex items-center gap-x-4">
                                        {
                                            data.estado === "Acceptat" && (
                                                <p className="text-green-300 bg-green-600/60 rounded-full text-sm px-3 py-1">{data.estado}</p>
                                            )
                                        }
                                        {
                                            data.estado === "Denegat" && (
                                                <p className="text-red-300 bg-red-600/60 rounded-full text-sm px-3 py-1">{data.estado}</p>
                                            )
                                        }
                                        {
                                            data.estado === "Revisant" && (
                                                <p className="text-orange-300 bg-orange-600/60 rounded-full text-sm px-3 py-1">{data.estado}</p>
                                            )
                                        }

                                        {
                                            data.aceptado === "Inscrit" && (
                                                <p className="text-green-300 bg-green-600/60  rounded-full text-sm px-3 py-1">{data.aceptado}</p>
                                            )
                                        }
                                        {
                                            data.aceptado === "Llista d'espera" && (
                                                <p className="text-red-300 bg-red-600/60 rounded-full text-sm px-3 py-1">{data.aceptado}</p>
                                            )
                                        }
                                </div>
                                </span>
                                <div className="flex items-center gap-x-5">
                                    <span className="flex flex-col">
                                        <p className="text-gray-400 text-sm">Data d'inscripció</p>
                                        <p className="font-semibold">{data.fecha_inscripcion}</p>
                                    </span>
                                    {
                                        data.fecha_modificacion && (
                                            <span className="flex flex-col">
                                                <p className="text-gray-400 text-sm">Data de modificació</p>
                                                <p className="font-semibold">{data.fecha_modificacion}</p>
                                            </span>
                                        )
                                    }
                                </div>
                                
                            </div>
                        </div>

                        {/* Entrenador */}
                        <h3 className="flex items-center gap-x-2 font-semibold text-xl mt-10">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-azul-claro" viewBox="0 -960 960 960">
                                    <path d="M440-200q-100 0-170-70t-70-170q0-11 1-22t3-22q-5 2-12 3t-12 1q-42 0-71-29t-29-71 27.5-71 69.5-29q33 0 59.5 18.5T274-614q33-30 75.5-48t90.5-18h440v160H680v80q0 100-70 170t-170 70M208.5-551.5Q220-563 220-580t-11.5-28.5T180-620t-28.5 11.5T140-580t11.5 28.5T180-540t28.5-11.5M539-341q41-41 41-99t-41-99-99-41-99 41-41 99 41 99 99 41 99-41m-42.5-42.5Q520-407 520-440t-23.5-56.5T440-520t-56.5 23.5T360-440t23.5 56.5T440-360t56.5-23.5M440-440"/>
                                </svg>
                            </span>
                            Entrenador
                        </h3>
                        <div className="w-full  h-auto items-center   mt-5 flex flex-wrap gap-5">
                            {
                                data.entrenador ? (
                                    <div className="w-96 h-56 bg-gris-claro text-sm rounded-2xl p-5">
                                        <p className="font-semibold text-lg">{data.entrenador.nombre} {data.entrenador._1r_apellido} {data.entrenador._2n_apellido}</p>
                                        <p>{data.entrenador.email}</p>
                                        <div className="flex items-center gap-x-4 mt-1">
                                            <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">{data.entrenador.curso}</p>
                                            <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">
                                                { data.entrenador.genero === "mujer" && (
                                                    <span>Femení</span>
                                                )}
                                                { data.entrenador.genero === "hombre" && (
                                                    <span>Masculí</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-lg font-medium text-blue-300">Observacions</p>
                                            <textarea className="bg-gris w-full min-h-10 rounded-xl p-2 text-blanco resize-none" disabled placeholder="No hi ha observacions disponibles."/>
                                        </div>
                                    </div>    
                                ):(
                                    <div className="w-full px-8 py-5 bg-gris-claro flex items-center gap-x-2 border border-dashed border-gray-600 rounded-2xl">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-blanco w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="M234-276q51-39 114-61.5T480-360t132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800t-226.5 93.5T160-480q0 59 19.5 111t54.5 93m146.5-204.5Q340-521 340-580t40.5-99.5T480-720t99.5 40.5T620-580t-40.5 99.5T480-440t-99.5-40.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280t-100 15.5-86 44.5q39 29 86 44.5T480-160t100-15.5M523-537q17-17 17-43t-17-43-43-17-43 17-17 43 17 43 43 17 43-17m-43 317"/>
                                            </svg>
                                        </span>
                                        No s'ha assignat cap entrenador per a aquest equip.
                                    </div>
                                )
                            }
                        </div>

                        {/* Jugadors */}
                        <h3 className="flex items-center gap-x-2 font-semibold text-xl mt-10">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-azul-claro" viewBox="0 -960 960 960">
                                    <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65zm240 0v-65q0-32 17.5-58.5T307-410t76.5-30 96.5-10q53 0 97.5 10t76.5 30 49 46.5 17 58.5v65zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63zm-455-80h311q-10-20-55.5-35T480-370t-100.5 15-54.5 35M160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440m640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440m-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480m0-80q17 0 28.5-11.5T520-600t-11.5-28.5T480-640t-28.5 11.5T440-600t11.5 28.5T480-560m0-40"/>
                                </svg>
                            </span>
                            Jugadors ({data.jugadores.length})
                        </h3>
                        <div className="w-full  h-auto items-center grid grid-cols-3  mt-5 max-sm:flex max-sm:flex-wrap gap-5">
                            {
                                        data.jugadores.map((jugador, i) => (
                                            <div className="w-80 h-72 bg-gris-claro text-sm rounded-2xl p-5">
                                                <p className="text-xl text-azul-claro">Jugador {i+1}</p>
                                                <p className="font-semibold text-lg">{jugador.nombre} {jugador._1r_apellido} {jugador._2n_apellido}</p>
                                                <p>{jugador.email}</p>
                                                <div className="flex items-center gap-x-4 mt-1">
                                                    <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">{jugador.curso}</p>
                                                    <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">
                                                        { jugador.genero === "mujer" && (
                                                            <span>Femení</span>
                                                        )}
                                                        { jugador.genero === "hombre" && (
                                                            <span>Masculí</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-lg font-medium text-blue-300">Observacions</p>
                                                    <textarea className="bg-gris w-full min-h-10 rounded-xl p-2 text-blanco resize-none" disabled placeholder="No hi ha observacions disponibles.">{jugador.observaciones}</textarea>
                                                </div>
                                            </div>
                                        ))
                            }
                        </div>

                        {/* Professor Jugador */}
                        <h3 className="flex items-center gap-x-2 font-semibold text-xl mt-10">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-azul-claro" viewBox="0 -960 960 960">
                                    <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240zm0-332 274-148-274-148-274 148zm0 241 200-108v-151L480-360 280-470v151zm0-151"/>
                                </svg>
                            </span>
                            Professor Jugador
                        </h3>
                        
                        
                        <div className="w-full  h-auto items-center   mt-5 flex flex-wrap gap-5">
                            {
                                data.profesor ? (
                                    <div className="w-96 h-56 bg-gris-claro text-sm rounded-2xl p-5">
                                        <p className="font-semibold text-lg">{data.profesor.nombre} {data.profesor._1r_apellido} {data.profesor._2n_apellido}</p>
                                        <p>{data.profesor.email}</p>
                                        <div className="flex items-center gap-x-4 mt-1">
                                            <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">{data.profesor.curso}</p>
                                            <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">
                                                { data.profesor.genero === "mujer" && (
                                                    <span>Femení</span>
                                                )}
                                                { data.profesor.genero === "hombre" && (
                                                    <span>Masculí</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-lg font-medium text-blue-300">Observacions</p>
                                            <textarea className="bg-gris w-full min-h-10 rounded-xl p-2 text-blanco resize-none" disabled placeholder="No hi ha observacions disponibles."/>
                                        </div>
                                    </div>    
                                ):(
                                    <div className="w-full px-8 py-5 bg-gris-claro flex items-center gap-x-2 border border-dashed border-gray-600 rounded-2xl">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-blanco w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="M234-276q51-39 114-61.5T480-360t132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800t-226.5 93.5T160-480q0 59 19.5 111t54.5 93m146.5-204.5Q340-521 340-580t40.5-99.5T480-720t99.5 40.5T620-580t-40.5 99.5T480-440t-99.5-40.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280t-100 15.5-86 44.5q39 29 86 44.5T480-160t100-15.5M523-537q17-17 17-43t-17-43-43-17-43 17-17 43 17 43 43 17 43-17m-43 317"/>
                                            </svg>
                                        </span>
                                        No s'ha assignat cap professor jugador per a aquest equip.
                                    </div>
                                )
                            }
                        </div>

                        {/* Entrenador */}
                        <h3 className="flex items-center gap-x-2 font-semibold text-xl mt-10">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-azul-claro" viewBox="0 -960 960 960">
                                    <path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330t-43.5 4.5T276-312q-17 8-26.5 22.5T240-258zm320-60h160v-60H560zm-157.5-77.5Q420-395 420-420t-17.5-42.5T360-480t-42.5 17.5T300-420t17.5 42.5T360-360t42.5-17.5M560-420h160v-60H560zM440-600h80v-200h-80zm40 220"/>
                                </svg>
                            </span>
                            Cos Técnic ({data.cuerpo_tecnico.length})
                        </h3>
                        <div className="w-full  h-auto items-center grid grid-cols-3  mt-5 max-sm:flex max-sm:flex-wrap gap-5">
                            {
                                data.cuerpo_tecnico.length > 0 ? (
                                    
                                        data.cuerpo_tecnico.map((staff, i) => (
                                            <div className="w-80 h-72 bg-gris-claro text-sm rounded-2xl p-5">
                                                <p className="text-xl text-azul-claro">Cos Técnic {i+1}</p>
                                                <p className="font-semibold text-lg">{staff.nombre} {staff._1r_apellido} {staff._2n_apellido}</p>
                                                <p>{staff.email}</p>
                                                <div className="flex items-center gap-x-4 mt-1">
                                                    <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">{staff.curso}</p>
                                                    <p className="py-1 px-2 bg-azul-claro/10 rounded-lg">
                                                        { staff.genero === "mujer" && (
                                                            <span>Femení</span>
                                                        )}
                                                        { staff.genero === "hombre" && (
                                                            <span>Masculí</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-lg font-medium text-blue-300">Observacions</p>
                                                    <textarea className="bg-gris w-full min-h-10 rounded-xl p-2 text-blanco resize-none" disabled placeholder="No hi ha observacions disponibles."/>
                                                </div>
                                            </div>
                                        ))
                                    
                                ):(
                                    <div className="w-full px-8 py-5 bg-gris-claro flex items-center gap-x-2 border border-dashed border-gray-600 rounded-2xl">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-blanco w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="M234-276q51-39 114-61.5T480-360t132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800t-226.5 93.5T160-480q0 59 19.5 111t54.5 93m146.5-204.5Q340-521 340-580t40.5-99.5T480-720t99.5 40.5T620-580t-40.5 99.5T480-440t-99.5-40.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280t-100 15.5-86 44.5q39 29 86 44.5T480-160t100-15.5M523-537q17-17 17-43t-17-43-43-17-43 17-17 43 17 43 43 17 43-17m-43 317"/>
                                            </svg>
                                        </span>
                                        No s'ha assignat cap membre de cos técnic per a aquest equip.
                                    </div>
                                )
                            }
                        </div>


                    </div>
                </div>
            
            ):(
                <></>
            )}
            </div>
            {error && (
                <div className="w-full h-full flex flex-col items-center place-content-center text-center ">
                    <h1 className="text-4xl font-bold text-blanco">Equip no disponible</h1>
                    <div className="h-1 w-20 mt-4 rounded-full bg-accent">&nbsp;</div>

                    <div className="h-96 max-w-xl flex flex-col items-center bg-gris-claro px-10 py-5 rounded-xl border border-gray-400 gap-y-3 mt-10">
                        <span className="p-4  w-max h-max rounded-full flex items-center place-content-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 fill-red-600" viewBox="0 -960 960 960">
                                <path d="M508.5-291.5Q520-303 520-320t-11.5-28.5T480-360t-28.5 11.5T440-320t11.5 28.5T480-280t28.5-11.5M440-440h80v-240h-80zm40 360q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80"/>
                            </svg>
                        </span>
                        <p className="text-2xl font-bold text-blanco">No s’ha trobat l’equip</p>
                        <p>No s'ha pogut carregar la informació de l'equip sol·licitat. És possible que hagi estat eliminat o que l'enllaç sigui incorrecte.</p>
                        <a href="/panel/equips" className="flex items-center place-content-center w-full py-3 bg-azul-suave hover:bg-azul-suave/50 rounded-2xl text-blanco fill-blanco">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 -960 960 960">
                                    <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142z"/>
                                </svg>
                            </span>
                            Tornar a la llista
                        </a>
                        
                    </div>
                </div>
            )}
        </>
    )
};