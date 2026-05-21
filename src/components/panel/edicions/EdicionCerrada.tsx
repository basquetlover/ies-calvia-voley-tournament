type Props = {
    data: any;
}
export default function EdicionCerrada({ data }:Props){

    return(
        <>
        <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl border-l-5 border-primary gap-x-2 items-center grid grid-cols-[auto_1fr]">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-primary" viewBox="0 -960 960 960">
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920t141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80zm0-80h480v-400H240zm296.5-143.5Q560-327 560-360t-23.5-56.5T480-440t-56.5 23.5T400-360t23.5 56.5T480-280t56.5-23.5M360-640h240v-80q0-50-35-85t-85-35-85 35-35 85zM240-160v-400z"/>
                </svg>
            </span>
            <div>
                <p className="text-lg font-medium text-primary">Edició finalitzada</p>
                <p>Aquesta edició ja ja finalitzat i no es poden modificar les seves dades.</p>
            </div>
        </div>
        <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl flex flex-col gap-y-2 ">
            <p className="flex items-center gap-x-1 text-xl text-primary h-max">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-primary" >
                    <path d="m18.525 9-1.1-2.4-2.4-1.1 2.4-1.1 1.1-2.4 1.1 2.4 2.4 1.1-2.4 1.1zm2 7-.8-1.7-1.7-.8 1.7-.8.8-1.7.8 1.7 1.7.8-1.7.8zm-13 6-.3-2.35q-.2-.075-.387-.2t-.313-.25l-2.2.95-2.5-4.35 1.9-1.4v-.8l-1.9-1.4 2.5-4.35 2.2.95q.125-.125.313-.25t.387-.2l.3-2.35h5l.3 2.35q.2.075.388.2t.312.25l2.2-.95 2.5 4.35-1.9 1.4v.8l1.9 1.4-2.5 4.35-2.2-.95q-.125.125-.312.25t-.388.2l-.3 2.35zm2.5-5q1.25 0 2.125-.875T13.025 14t-.875-2.125T10.025 11t-2.125.875T7.025 14t.875 2.125 2.125.875"/>
                </svg>
                Configuració de l'Edició
            </p>

            <div>
                <p className="ml-1.5 my-1">Nom de l'Edició</p>
                <p className="w-full h-max px-3 py-2 bg-gris rounded-xl">{data.nombre}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-4">
                <div>
                <p className="ml-1.5 my-1">Data de l'Edició</p>
                <p className="w-full h-max px-3 py-2 bg-gris rounded-xl">{data.fecha}</p>
            </div>
            <div>
                <p className="ml-1.5 my-1">ID de l'Edició</p>
                <p className="w-full h-max px-3 py-2 bg-gris rounded-xl">{data.id_torneo}</p>
            </div>
            </div>

            <div className="w-full border border-primary/40 p-4 rounded-2xl">
                <p className="uppercase text-primary ">Resum de tancament</p>
                <div className="w-full my-2 grid grid-cols-[1fr_auto]">
                    <p>Data de tancament</p>
                    <p>{new Date(data.fecha_cierre).toLocaleString("ca-ES", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>
            </div>

            <a href={`/panel/info/edicio?torneoID=${data.id_torneo}&accio=ver`} className="mx-auto my-5 text-azul-claro hover:underline">
                Veure totes les dades
            </a>
            
        </div>
        </>
    )
}