import { useEffect, useState, useRef } from "react";
import { useToast } from '@components/panel/Toast';
type Props = {
torneoID?: string | null;
voluntariID?: string | null;
};

interface VoluntariData {
    id: number,
    nombre: string, 
    _1r_apellido: string,
    _2n_apellido: string, 
    curso: string, 
    tipo:string,
    descripcion:string,
    email: string,
    estado: string,
    observacion: string, 
    fecha_inscripcion:string, 
    fecha_revision:string,
    ficha?:string | null,
    nombre_equipo?:string | null,
    escudo?:string,
    estado_equipo?:string | null,
    aceptado_equipo?:string | null
}

type Seccion =
    | "nombre"
    | "apellidos"
    | "curso"
    | "tipo"
    | "descripcion"
    | "email"
    | "estado"
    | "observacion"
    ;

type ErrorData = {
    seccion: Seccion;
    mensaje: string;
};

export default function PreviewVoluntari({ torneoID, voluntariID }: Props) {
    const [data, setData] = useState<VoluntariData | null>(null);
    const [error, setError] = useState<ErrorData | null>(null);
    const [enviando, setEnviando] = useState(false)
    const { addToast } = useToast();
    const [observaciones,setObservaciones] = useState("")

    useEffect(() => {
        

        fetch("/api/panel/InfoVoluntario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ torneoID, voluntariID }),
        })
            .then(async (res) => {
            const data = await res.json();

            if (!res.ok) {

                return;
            }

            setData(data);
            })
            .catch(() => {
            console.log("Error carregant dades");
            });
    }, [torneoID, voluntariID]);

    // const refs: Record<Seccion, React.RefObject<HTMLDivElement | null>> = {
    //     observacion: useRef<HTMLDivElement>(null),
    // };
    
    type ApiResponse = {
        ok: boolean;
        data?: string;
        error?: ErrorData;
    };
    const AceptarVol = async () => {
        setEnviando(true)
        try {
            setError(null);

            const res = await fetch("/api/panel/voluntaris/Aceptar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    observaciones, torneoID, data
                })
            });

            const result: ApiResponse = await res.json();

            // error de API
            if (!res.ok || !result.ok) {

                if (result.error) {

                    setError(result.error);

                    // refs[result.error.seccion]
                    //     ?.current
                    //     ?.scrollIntoView({
                    //         behavior: "smooth",
                    //         block: "center"
                    //     });
                }
                setEnviando(false)
                return;
            }

            // éxito
            
            addToast({
            type: 'success',
            message: 'Configuració actualitzada correctament',
            duration: 5000,
            });
            setError(null);
            setEnviando(false)
            window.location.replace(`/panel/voluntaris?torneoID=${torneoID}`);
            console.log(result.data);

        } catch (e) {
            console.error(e);

            setError({
                seccion: "observacion",
                mensaje: "Error del servidor"
            });
        }
    };

    const DenegarVol = async () => {
        setEnviando(true)
        try {
            setError(null);

            const res = await fetch("/api/panel/voluntaris/Denegar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    observaciones, torneoID, data
                })
            });

            const result: ApiResponse = await res.json();

            // error de API
            if (!res.ok || !result.ok) {

                if (result.error) {

                    setError(result.error);

                    // refs[result.error.seccion]
                    //     ?.current
                    //     ?.scrollIntoView({
                    //         behavior: "smooth",
                    //         block: "center"
                    //     });
                }
                setEnviando(false)
                return;
            }

            // éxito
            
            addToast({
            type: 'success',
            message: 'Configuració actualitzada correctament',
            duration: 5000,
            });
            setError(null);
            setEnviando(false)
            window.location.replace(`/panel/voluntaris?torneoID=${torneoID}`);
            console.log(result.data);

        } catch (e) {
            console.error(e);

            setError({
                seccion: "observacion",
                mensaje: "Error del servidor"
            });
        }
    };

    return(
        <>
        <div className="w-full">
            <div className="w-full flex flex-row items-center place-content-between border-b border-gray-500 px-4 py-2 shrink-0">
                        <a href={`/panel/voluntaris?torneoID=${torneoID}`} className="flex items-center px-2 py-1 rounded-full hover:bg-gris-claro/50 duration-300 gap-x-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224z"/>
                                </svg>
                            </span>
                            Tancar
                        </a>
                        <div className="flex items-center gap-10">
                            <a href={`/panel/info/voluntari?torneoID=${torneoID}&voluntarioID=${voluntariID}&accio=editar`} className="px-3 py-2 border border-gray-500 rounded-xl">
                                Editar voluntari
                            </a>
                            {/* <div className="px-3 py-2 rounded-xl flex flex-row items-center gap-x-2 bg-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blanco" viewBox="0 -960 960 960">
                                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480zm-80 34L646-760H200v560h560zM565-275q35-35 35-85t-35-85-85-35-85 35-35 85 35 85 85 35 85-35M240-560h360v-160H240zm-40-86v446-560z"/>
                                </svg>
                                Guardar canvis
                            </div> */}
                        </div>
                    </div>

                    {
                        data && (
                            <>
                            {
                                data.ficha && (
                                    <div className="max-w-150 rounded-2xl flex flex-col p-4 border border-orange-700 bg-gris-claro mx-auto mt-10 font-light mb-10">
                                        <p className="text-2xl text-orange-600 flex flex-row gap-x-2 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-orange-600" viewBox="0 -960 960 960">
                                                <path d="m40-120 440-760 440 760zm138-80h604L480-720zm330.5-51.5Q520-263 520-280t-11.5-28.5T480-320t-28.5 11.5T440-280t11.5 28.5T480-240t28.5-11.5M440-360h80v-200h-80zm40-100"/>
                                            </svg>
                                            Participació duplicada detectada
                                        </p>
                                        <p className="text-sm">Aquest voluntari també està inscrit en un equip del torneig. Revisa possibles incompatibilitats horàries o de funcions.</p>

                                        <div className="w-full grid grid-cols-[auto_1fr] gap-2 mt-2">
                                            <img src={data.escudo} className="w-14 h-14" />
                                            <div>
                                                <p><span className="font-medium text-primary">Nom de l'equip:</span> {data.nombre_equipo}</p>
                                                <p><span className="font-medium text-primary">Tipus de fitxa:</span> {data.ficha === "profesor" && "Professor"} {data.ficha === "jugador" && "Jugador"} {data.ficha === "entrenador" && "Entrenador"} {data.ficha === "cuerpo_tecnico" && "Cos Tècnic"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            
                            <div className="max-w-150 rounded-2xl flex flex-col gap-y-5 p-4 bg-gris-claro mx-auto mt-10 font-light">
                                    <div className="w-full flex flex-wrap place-content-between gap-x-4">
                                        <div className="flex flex-col gap-y-1">
                                            <p>Nom</p>
                                            <p className="w-65 px-2 py-1 bg-gris/40 rounded border border-gray-600">{data.nombre}</p>
                                        </div>
                                        <div className="flex flex-col gap-y-1">
                                            <p>Curs</p>
                                            <p className="w-65 px-2 py-1 bg-gris/40 rounded border border-gray-600">{data.curso}</p>
                                        </div>
                                        
                                    </div>
                                    <div className="w-full flex flex-col gap-y-1">
                                        <p>Cognoms</p>
                                        <p className="w-full px-2 py-1 bg-gris/40 rounded border border-gray-600">{data._1r_apellido} {data._2n_apellido}</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-y-1">
                                        <p>Correu electrònic</p>
                                        <p className="w-full px-2 py-1 bg-gris/40 rounded border border-gray-600">{data.email}</p>
                                    </div>

                                    <div>
                                        <p>Tipus de voluntari</p>
                                        <div className="grid md:grid-cols-3 max-md:grid-cols-2 max-md:grid-rows-2 md:gap-10 max-md:h-40  mt-2 place-items-center w-full">
                                            <div className={`w-40 aspect-square bg-gris/40 rounded border flex flex-col items-center place-content-center gap-y-5 ${data.tipo === "Arbitro" ? 'fill-accent border-accent max-md:row-span-2 max-md:col-start-1 max-md:row-start-1':'fill-blanco border-gray-600 max-md:col-start-2 max-md:scale-45'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 -960 960 960">
                                                    <path d="M440-200q-100 0-170-70t-70-170q0-11 1-22t3-22q-5 2-12 3t-12 1q-42 0-71-29t-29-71 27.5-71 69.5-29q33 0 59.5 18.5T274-614q33-30 75.5-48t90.5-18h440v160H680v80q0 100-70 170t-170 70M208.5-551.5Q220-563 220-580t-11.5-28.5T180-620t-28.5 11.5T140-580t11.5 28.5T180-540t28.5-11.5M539-341q41-41 41-99t-41-99-99-41-99 41-41 99 41 99 99 41 99-41m-42.5-42.5Q520-407 520-440t-23.5-56.5T440-520t-56.5 23.5T360-440t23.5 56.5T440-360t56.5-23.5M440-440"/>
                                                </svg>
                                                <p className="text-center">Àrbitre</p>
                                            </div>
                                            <div className={`w-40 aspect-square bg-gris/40 rounded border flex flex-col items-center place-content-center gap-y-5 ${data.tipo === "Oficial de Mesa" ? 'fill-accent border-accent max-md:row-span-2 max-md:col-start-1 max-md:row-start-1':'fill-blanco border-gray-600 max-md:col-start-2 max-md:scale-45'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 -960 960 960">
                                                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22 68.5 22 43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120zm0-80h560v-560H200zm80-80h280v-80H280zm0-160h400v-80H280zm0-160h400v-80H280zm221.5-198.5Q510-807 510-820t-8.5-21.5T480-850t-21.5 8.5T450-820t8.5 21.5T480-790t21.5-8.5M200-200v-560z"/>
                                                </svg>
                                                <p className="text-center">Oficial de taula</p>
                                            </div>
                                            <div className={`w-40 aspect-square bg-gris/40 rounded border flex flex-col items-center place-content-center gap-y-5 ${data.tipo === "Arbitro o Oficial de Mesa" ? 'fill-accent border-accent max-md:row-span-2 max-md:col-start-1 max-md:row-start-1':'fill-blanco border-gray-600 max-md:col-start-2 max-md:scale-45'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 -960 960 960">
                                                    <path d="M220-260q-92 0-156-64T0-480t64-156 156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99 41 99 99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156-64 156-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99-41-99-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13"/>
                                                </svg>
                                                <p className="text-center">Qualsevol</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col gap-y-1">
                                        <p>Breu Presentació</p>
                                        <p className="w-full min-h-20 px-2 py-1 bg-gris/40 rounded border border-gray-600">{data.descripcion}</p>
                                    </div>

                                    <div className={`w-full flex flex-col gap-y-1 `}>
                                        <p className={`${error?.seccion === "observacion" && "text-red-400"}`}>Observacions <span className="text-xs">( Visible per a l'usuari )</span></p>
                                        <textarea onChange={(e) => setObservaciones(e.target.value)} placeholder="Afegeix qualsevol informació addicional o comentari rellevant..." className={`w-full min-h-20 px-2 py-1 bg-gris/40 rounded border border-gray-600 ${error?.seccion === "observacion" && "border-red-400"}`}>{data.observacion}</textarea>
                                        {
                                            error?.seccion === "observacion" && (
                                                <p className="text-sm text-red-400">{error.mensaje}</p>
                                            )
                                        }
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-5">
                                        <div onClick={() => AceptarVol()} className="w-full h-16 cursor-pointer rounded px-3 bg-primary text-azul-suave fill-azul-suave flex hover:bg-accent duration-300 items-center place-content-center gap-x-2 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="m424-296 282-282-56-56-226 226-114-114-56 56zm56 216q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                            </svg>
                                            <p className="uppercase text-center">Acceptar Voluntari</p>
                                        </div>
                                        <div onClick={() => DenegarVol()} className="w-full h-16 cursor-pointer rounded px-3 flex hover:bg-red-600/30 duration-300 border border-red-400 text-red-400 fill-red-400 items-center place-content-center gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
                                                <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144zM480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                                            </svg>
                                            <p className="uppercase text-center">Denegar Voluntari</p>
                                        </div>
                                    </div>
                                    
                            </div>
                            </>
                        )
                    }

                    {
            enviando && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-lg glass-overlay bg-gris/60">
                    <div className="w-full max-w-100 bg-gris p-10 dark:bg-gris rounded-xl p-xl shadow-xxl border border-primary/30 flex flex-col gap-y-3 items-center text-center animate-in fade-in zoom-in duration-300">
                    {/* <!-- Loading Illustration/Animation Container --> */}
                    <div className="relative w-20 h-20 mb-lg">
                    {/* <!-- Circular Spinner Base --> */}
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                    {/* <!-- Spinning Top Part --> */}
                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    {/* <!-- Icon in the middle --> */}
                    <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined fill-primary text-4xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 -960 960 960">
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71-29-71-71-29h-60v-80q0-83-58.5-141.5T480-720t-141.5 58.5T280-520h-20q-58 0-99 41t-41 99 41 99 99 41h100v80zm220-280"/>
                        </svg>
                    </span>
                    </div>
                    </div>
                    {/* <!-- Text Content --> */}
                    <h3 className="text-lg font-semibold mb-sm">Enviant dades...</h3>
                    <p className="text-gray-300 font-light mb-xl px-md">
                                    Si us plau, espera mentre s'actualitza la configuració del torneig. No tanquis aquesta finestra.
                                </p>
                    {/* <!-- Custom Progress Bar --> */}
                    <div className="loading-progress-bar">
                    <div className="loading-progress-fill"></div>
                    </div>
                    {/* <!-- Footer Help Text --> */}
                    <div className="mt-lg flex items-center gap-xs text-primary/60">
                    <span className="fill-primary" >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960">
                            <path d="m438-338 226-226-57-57-169 169-84-84-57 57zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80m0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132m0-316"/>
                        </svg>
                    </span>
                    <span className="font-ajuda-text text-ajuda-text">Connexió segura establerta</span>
                    </div>
                    </div>
                </div>
            )
        }
            
        </div>
        </>
    )
};