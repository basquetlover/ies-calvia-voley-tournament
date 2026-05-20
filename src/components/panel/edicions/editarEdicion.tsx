type Props = {
torneoID?: string | null;
};

export default function EditarEdicion({ torneoID }: Props){

    return(
        <div className="max-w-7xl mx-auto mt-10 flex flex-col gap-10 items-center">
            <div className="max-w-150 w-full p-4 bg-gris-claro rounded-2xl">
                <p className="uppercase text-lg text-primary flex items-center gap-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-primary" viewBox="0 -960 960 960">
                        <path d="M440-280h80v-240h-80zm68.5-331.5Q520-623 520-640t-11.5-28.5T480-680t-28.5 11.5T440-640t11.5 28.5T480-600t28.5-11.5M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
                    </svg>
                    Informació bàsica
                </p>
                <div className="mt-5">
                    <p>Tournament ID</p>
                    <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
                </div>
                <div className="mt-5">
                    <p>Nom del torneig</p>
                    <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
                </div>
                <div className="mt-5">
                    <p>Data del torneig</p>
                    <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
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
                        <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
                    </div>
                    <div className="flex flex-col gap-y-0.5">
                        <p>Data fi</p>
                        <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
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
                        <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
                    </div>
                    <div className="flex flex-col gap-y-0.5">
                        <p>Data fi</p>
                        <p className="w-full rounded-xl px-2 py-1 mt-2 h-10 bg-gris"></p>
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

                <div className="w-full gap-x-4 grid grid-cols-2 text-blanco mt-5">
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                        <p>Mínim  jugadors</p>
                        <p className="text-primary px-2 py-1 mt-2 h-10">
                            6
                        </p>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                        <p>Máxim  jugadors</p>
                        <p className="text-primary px-2 py-1 mt-2 h-10">
                            9
                        </p>
                    </div>
                </div>

                <div className="w-full gap-x-4 grid grid-cols-2 text-blanco mt-5">
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                        <p>Mínim  staff</p>
                        <p className="text-primary px-2 py-1 mt-2 h-10">
                            0
                        </p>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 rounded-xl gap-x-0.5 bg-gris">
                        <p>Máxim  staff</p>
                        <p className="text-primary px-2 py-1 mt-2 h-10">
                            5
                        </p>
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
                        <button className="w-12 h-6 bg-primary/50 cursor-pointer active:bg-primary rounded-full p-1 flex items-center active:justify-end justify-start">
                            <div className="w-4 h-4 bg-azul-suave rounded-full"></div>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-y-0.5 mt-5">
                        <p>Límit de professors</p>
                        <p className="w-full items-center flex rounded-xl px-4 py-1 mt-2 h-10 bg-gris">1</p>
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
                        <p></p>
                    </div>
                </div>

                <div className="w-full h-20 grid grid-cols-[auto_1fr] gap-x-4 bg-gris p-4 rounded-xl">
                    <span className="w-max h-max p-2 flex items-center place-content-center bg-azul-claro/50 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-primary" viewBox="0 -960 960 960">
                            <path d="M367-527q-47-47-47-113t47-113 113-47 113 47 47 113-47 113-113 47-113-47M160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440t130 15.5T736-378q29 15 46.5 43.5T800-272v112zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360t-111 13.5T260-306q-9 5-14.5 14t-5.5 20zm296.5-343.5Q560-607 560-640t-23.5-56.5T480-720t-56.5 23.5T400-640t23.5 56.5T480-560t56.5-23.5M480-240"/>
                        </svg>
                    </span>
                    <div>
                        <p>Professors</p>
                        <p></p>
                    </div>
                </div>
                
                
            </div>


        </div>
    )
}