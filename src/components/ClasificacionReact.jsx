import React, { useEffect, useState } from "react";
// Si EquipoBoxIzq/EquipoBoxDer los conviertes a componentes React:
import EquipoBoxIzq from "./EquipoBoxIzq";
import EquipoBoxDer from "./EquipoBoxDer";


const traducirPartido = (str) => {
  const match = str.match(/\d+$/);
  return `Partit ${match ? match[0] : ""}`;
};

export default function BracketAutoRefresh() {
const [partidos, setPartidos] = useState([]);
const [loading, setLoading] = useState(true);
const [partidosObj, setPartidosObj] = useState({});

useEffect(() => {
  async function cargarPartidos() {
    setLoading(true);
    try {
    //   const res = await fetch('/api/usuario/CargarBracket');
            const res = await fetch('/api/usuario/CargarBracket',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log("Partidos cargados", data);
      setPartidos(data);
      
        const obj = data.reduce((acc, partido) => {
        acc[partido.bracket] = partido;
        return acc;
        }, {});

    setPartidosObj(obj);
    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      setLoading(false);
    }
  }

  cargarPartidos();
  const intervalo = setInterval(cargarPartidos, 3 * 60 *1000); // cada 3 minutos
    const handleKeyPress = (event) => {
    if (event.key.toLowerCase() === 'r') {
      cargarPartidos();
    }
  };
  window.addEventListener('keydown', handleKeyPress);

  return () => clearInterval(intervalo);
}, []);

  if (loading && !partidos) return <p>Cargando...</p>;

  return (

     <div class="grid grid-cols-6 grid-rows-4  w-[1920px] bg-cyan-400 mx-auto place-items-center ">
{/* <!-- Octavo 1 --> */}
 {partidosObj["octavos_1"] && (
<div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
    {/* <!-- Equipo 1 --> */}
    <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavos_1"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_1"]?.estado}</h5>
        <h4 id="pista_p1" class="text-sm">{partidosObj["octavos_1"]?.pista}</h4>
    </div>
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavos_1"]?.escudo_local ? (
                <img id=".escudo_local" src={partidosObj["octavos_1"]?.escudo_local} alt={`Escudo ${partidosObj["octavos_1"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
            
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavos_1"]?.equipo_local}</p>
        <div>
            <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_1"]?.resultado_local}</p>
        </div>
    </EquipoBoxIzq>

    {/* <!-- Equipo 2 --> */}
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavos_1"]?.escudo_visitante ? (
                <img  src={partidosObj["octavos_1"]?.escudo_visitante} alt={`Escudo ${partidosObj["octavos_1"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavos_1"]?.equipo_visitante}</p>
        <div>
            <div>
                <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_1"]?.resultado_visitante}</p>
            </div>
        </div>
    </EquipoBoxIzq>
</div>
)}

{/* <!-- Octavo 2 --> */}
 {partidosObj["octavo_2"] && (
<div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 col-start-1 row-start-2">
    {/* {/* <!-- Equipo 1 --> */} 
    <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavo_2"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavo_2"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavo_2"]?.estado}</h5>
        <h4 id="pista_p1" class="text-sm">{partidosObj["octavo_2"]?.pista}</h4>
    </div>
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavo_2"]?.escudo_local ? (
                <img  src={partidosObj["octavo_2"]?.escudo_local} alt={`Escudo ${partidosObj["octavo_2"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
            
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavo_2"]?.equipo_local}</p>
        <div>
            <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavo_2"]?.resultado_local}</p>
        </div>
    </EquipoBoxIzq>

    {/* {/* <!-- Equipo 2 --> */} 
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavo_2"]?.escudo_visitante ? (
                <img  src={partidosObj["octavo_2"]?.escudo_visitante} alt={`Escudo ${partidosObj["octavo_2"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavo_2"]?.equipo_visitante}</p>
        <div>
            <div>
                <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavo_2"]?.resultado_visitante}</p>
            </div>
        </div>
    </EquipoBoxIzq>
</div>
)}
{/* <!-- Octavo 3 --> */}
{partidosObj["octavos_3"] && (
<div class="col-start-1 row-start-3"> 
<div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 ">
    {/* {/* <!-- Equipo 1 --> */} 
    <div class="grid grid-cols-3 place-items-center text-blanco">
        <h4 class="text-sm">{partidosObj["octavos_3"]?.numero}</h4>
        <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_3"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_3"]?.estado}</h5>
        <h4 class="text-sm">{partidosObj["octavos_3"]?.pista}</h4>
    </div>
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavos_3"]?.escudo_local ? (
                <img  src={partidosObj["octavos_3"]?.escudo_local} alt={`Escudo ${partidosObj["octavos_3"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
            
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavos_3"]?.equipo_local}</p>
        <div>
            <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_3"]?.resultado_local}</p>
        </div>
    </EquipoBoxIzq>

    {/* {/* <!-- Equipo 2 --> */}
    <EquipoBoxIzq>
        <div class="w-full h-full flex items-center place-content-center">
            {
                partidosObj["octavos_3"]?.escudo_visitante ? (
                <img  src={partidosObj["octavos_3"]?.escudo_visitante} alt={`Escudo ${partidosObj["octavos_3"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                )
            }
        </div>
        <p class="text-blanco text-base text-center">{partidosObj["octavos_3"]?.equipo_visitante}</p>
        <div>
            <div>
                <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_3"]?.resultado_visitante}</p>
            </div>
        </div>
    </EquipoBoxIzq>
</div>
</div>
)}
{/* <!-- Octavo 4 --> */}
{partidosObj["octavos_4"] && (
<div class="col-start-1 row-start-4">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 ">
        {/* {/* <!-- Equipo 1 --> */} 
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_4"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_4"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_4"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["octavos_4"]?.pista}</h4>
        </div>
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["octavos_4"]?.escudo_local ? (
                    <img  src={partidosObj["octavos_4"]?.escudo_local} alt={`Escudo ${partidosObj["octavos_4"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
                
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_4"]?.equipo_local}</p>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_4"]?.resultado_local}</p>
            </div>
        </EquipoBoxIzq>
    
        {/* {/* <!-- Equipo 2 --> */} 
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["octavos_4"]?.escudo_visitante ? (
                    <img  src={partidosObj["octavos_4"]?.escudo_visitante} alt={`Escudo ${partidosObj["octavos_4"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_4"]?.equipo_visitante}</p>
            <div>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_4"]?.resultado_visitante}</p>
                </div>
            </div>
        </EquipoBoxIzq>
    </div>
</div>
)}
{partidosObj["octavos_5"] && (
<div class="col-start-6 row-start-1">
     <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_5"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_5"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_5"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_5"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_5"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_5"]?.equipo_local}</p>
            <div>
                {partidosObj["octavos_5"]?.escudo_local && partidosObj["octavos_5"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["octavos_5"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_5"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_5"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_5"]?.equipo_visitante}</p>
            <div>
                {partidosObj["octavos_5"]?.escudo_visitante && partidosObj["octavos_5"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["octavos_5"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_5"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}
{/* <!-- Octavo 6 --> */}
 {partidosObj["octavos_6"] && (
<div class="col-start-6 row-start-2">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_6"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_6"]?.estado=== "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_6"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_6"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_6"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_6"]?.equipo_local}</p>
            <div>
                {partidosObj["octavos_6"]?.escudo_local && partidosObj["octavos_6"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["octavos_6"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_6"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_6"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_6"]?.equipo_visitante}</p>
            <div>
                {partidosObj["octavos_6"]?.escudo_visitante && partidosObj["octavos_6"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["octavos_6"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_6"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}

{/* <!-- Octavo 7 --> */}
 {partidosObj["octavos_7"] && (
<div class="col-start-6 row-start-3">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_7"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_7"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_7"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_7"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_7"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_7"]?.equipo_local}</p>
            <div>
                {partidosObj["octavos_7"]?.escudo_local && partidosObj["octavos_7"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["octavos_7"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_7"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_7"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_7"]?.equipo_visitante}</p>
            <div>
                {partidosObj["octavos_7"]?.escudo_visitante && partidosObj["octavos_7"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["octavos_7"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_7"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}
{/* <!-- Octavo 8 --> */}
 {partidosObj["octavos_8"] && (
<div class="col-start-6 row-start-4">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["octavos_8"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["octavos_8"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["octavos_8"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["octavos_8"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_8"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_8"]?.equipo_local}</p>
            <div>
                {partidosObj["octavos_8"]?.escudo_local && partidosObj["octavos_8"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["octavos_8"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_8"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["octavos_8"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["octavos_8"]?.equipo_visitante}</p>
            <div>
                {partidosObj["octavos_8"]?.escudo_visitante && partidosObj["octavos_8"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["octavos_8"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["octavos_8"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}

{/* <!-- Quartos 1 --> */}
 {partidosObj["quartos_1"] && (
<div class="row-span-2 col-start-2 row-start-1">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 ">
        {/* <!-- Equipo 1 --> */}
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_1"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_1"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["quartos_1"]?.pista}</h4>
        </div>
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["quartos_1"]?.escudo_local ? (
                    <img  src={partidosObj["quartos_1"]?.escudo_local} alt={`Escudo ${partidosObj["quartos_1"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
                
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_1"]?.equipo_local}</p>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_1"]?.resultado_local}</p>
            </div>
        </EquipoBoxIzq>
    
        {/* <!-- Equipo 2 --> */}
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["quartos_1"]?.escudo_visitante ? (
                    <img  src={partidosObj["quartos_1"]?.escudo_visitante} alt={`Escudo ${partidosObj["quartos_1"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_1"]?.equipo_visitante}</p>
            <div>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_1"]?.resultado_visitante}</p>
                </div>
            </div>
        </EquipoBoxIzq>
    </div>
</div>
)}

{/* <!-- Quartos 2--> */}
 {partidosObj["quartos_2"] && (
<div class="row-span-2 col-start-2 row-start-3">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 ">
        {/* <!-- Equipo 1 --> */}
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_2"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_2"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_2"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["quartos_2"]?.pista}</h4>
        </div>
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["quartos_2"]?.escudo_local ? (
                    <img src={partidosObj["quartos_2"]?.escudo_local} alt={`Escudo ${partidosObj["quartos_2"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
                
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_2"]?.equipo_local}</p>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_2"]?.resultado_local}</p>
            </div>
        </EquipoBoxIzq>
    
        {/* <!-- Equipo 2 --> */}
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["quartos_2"]?.escudo_visitante ? (
                    <img src={partidosObj["quartos_2"]?.escudo_visitante} alt={`Escudo ${partidosObj["quartos_2"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_2"]?.equipo_visitante}</p>
            <div>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_2"]?.resultado_visitante}</p>
                </div>
            </div>
        </EquipoBoxIzq>
    </div>
</div>
)}

{/* <!-- Quartos 3--> */}
 {partidosObj["quartos_3"] && (
<div class="row-span-2 col-start-5 row-start-1">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_3"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_3"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_3"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["quartos_3"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_3"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_3"]?.equipo_local}</p>
            <div>
                {partidosObj["quartos_3"]?.escudo_local && partidosObj["quartos_3"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["quartos_3"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["quartos_3"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_3"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_3"]?.equipo_visitante}</p>
            <div>
                {partidosObj["quartos_3"]?.escudo_visitante && partidosObj["quartos_3"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["quartos_3"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["quartos_3"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}

{/* <!-- Quartos 4--> */}
 {partidosObj["quartos_4"] && (
<div class="row-span-2 col-start-5 row-start-3">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["quartos_4"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["quartos_4"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["quartos_4"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["quartos_4"]?.pista}</h4>
        </div>
        {/* <!--Ganador P7--> */}
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_4"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_4"]?.equipo_local}</p>
            <div>
                {partidosObj["quartos_4"]?.escudo_local && partidosObj["quartos_4"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["quartos_4"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["quartos_4"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* <!--Ganador P8--> */}
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["quartos_4"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["quartos_4"]?.equipo_visitante}</p>
            <div>
                {partidosObj["quartos_4"]?.escudo_visitante && partidosObj["quartos_4"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["quartos_4"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["quartos_4"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}

{/* <!-- Semi 1--> */}
 {partidosObj["semi_1"] && (
<div class="row-span-2 col-start-3 row-start-2">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2 ">
        {/* <!-- Equipo 1 --> */}
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["semi_1"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["semi_1"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["semi_1"]?.estado}</h5>
            <h4  class="text-sm">{partidosObj["semi_1"]?.pista}</h4>
        </div>
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["semi_1"]?.escudo_local ? (
                    <img  src={partidosObj["semi_1"]?.escudo_local} alt={`Escudo ${partidosObj["semi_1"]?.equipo_local}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
                
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["semi_1"]?.equipo_local}</p>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["semi_1"]?.resultado_local}</p>
            </div>
        </EquipoBoxIzq>
    
        {/* <!-- Equipo 2 --> */}
        <EquipoBoxIzq>
            <div class="w-full h-full flex items-center place-content-center">
                {
                    partidosObj["semi_1"]?.escudo_visitante ? (
                    <img  src={partidosObj["semi_1"]?.escudo_visitante} alt={`Escudo ${partidosObj["semi_1"]?.equipo_visitante}`} class="w-10 h-10 rounded-sm" />
                    ): (
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                    )
                }
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["semi_1"]?.equipo_visitante}</p>
            <div>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["semi_1"]?.resultado_visitante}</p>
                </div>
            </div>
        </EquipoBoxIzq>
    </div>
</div>
)}

{/*  <!-- Semi 2--> */} 
 {partidosObj["semi_2"] && (
<div class="row-span-2 col-start-4 row-start-2">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["semi_2"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["semi_2"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["semi_2"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["semi_2"]?.pista}</h4>
        </div>
        {/*  <!--Ganador P7--> */} 
        <EquipoBoxDer>
            <div>
                <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["semi_2"]?.resultado_local}</p>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["semi_2"]?.equipo_local}</p>
            <div>
                {partidosObj["semi_2"]?.escudo_local && partidosObj["semi_2"]?.escudo_local.trim() !== "" ?  (
                    <img src={partidosObj["semi_2"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["semi_2"]?.equipo_local} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>

        {/* {/* <!--Ganador P8--> */} 
        <EquipoBoxDer>
            <div>
                <div>
                    <p  class="text-blanco text-2xl w-4 text-center bg-transparent border-none" >{partidosObj["semi_2"]?.resultado_visitante}</p>
                </div>
            </div>
            <p class="text-blanco text-base text-center">{partidosObj["semi_2"]?.equipo_visitante}</p>
            <div>
                {partidosObj["semi_2"]?.escudo_visitante && partidosObj["semi_2"]?.escudo_visitante.trim() !== "" ?  (
                    <img src={partidosObj["semi_2"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["semi_2"]?.equipo_visitante} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                            </svg>
                    )}
            </div>
        </EquipoBoxDer>
    </div>
</div>
)}

{/* {/* <!-- Final--> */} 
 {partidosObj["final"] && (
<div class="col-span-2 col-start-3 row-start-1">
    <div class="w-max flex flex-col gap-2 bg-gold rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-gris">
            <h4 class="text-sm">{partidosObj["final"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["final"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["final"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["final"]?.pista}</h4>
        </div>
        {/* {/* <!--Ganador octavo_2--> */}
        <div class="flex flex-row gap-2">
            <EquipoBoxIzq>
                <div>
                    {partidosObj["final"]?.escudo_local && partidosObj["final"]?.escudo_local.trim() !== "" ?  (
                        <img src={partidosObj["final"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["final"]?.equipo_local} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div>
                <p class="text-blanco text-base text-center">{partidosObj["final"]?.equipo_local}</p>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none">{partidosObj["final"]?.resultado_local}</p>
                </div>
            </EquipoBoxIzq>

            {/* {/* <!--Ganador P2--> */} 
            <EquipoBoxDer>
                <div>
                    <div>
                        <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none">{partidosObj["final"]?.resultado_visitante}</p>
                    </div>
                </div>
                <p class="text-blanco text-base text-center">{partidosObj["final"]?.equipo_visitante}</p>
                <div>
                    {partidosObj["final"]?.escudo_visitante && partidosObj["final"]?.escudo_visitante.trim() !== "" ?  (
                        <img src={partidosObj["final"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["final"]?.equipo_visitante} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div> 
            </EquipoBoxDer>
        </div>
    </div>
</div>
)}

{/* {/* <!-- 3/4 puesto--> */} 
 {partidosObj["tercer_quarto"] && (
<div class="col-span-2 col-start-3 row-start-4">
    <div class="w-max flex flex-col gap-2 bg-gris rounded-lg p-2">
        <div class="grid grid-cols-3 place-items-center text-blanco">
            <h4 class="text-sm">{partidosObj["tercer_quarto"]?.numero}</h4>
            <h5 class={`text-gray-500 text-xs  ${partidosObj["tercer_quarto"]?.estado === "En Directe" ? "text-red-600 flex flex-row items-center place-content-center":" " }`}>{partidosObj["tercer_quarto"]?.estado}</h5>
            <h4 class="text-sm">{partidosObj["tercer_quarto"]?.pista}</h4>
        </div>
        {/* {/* <!--Ganador octavo_2--> */}
        <div class="flex flex-row gap-2">
            <EquipoBoxIzq>
                <div>
                    {partidosObj["tercer_quarto"]?.escudo_local && partidosObj["tercer_quarto"]?.escudo_local.trim() !== "" ?  (
                        <img src={partidosObj["tercer_quarto"]?.escudo_local} class="w-10 h-10 rounded-sm" alt={partidosObj["tercer_quarto"]?.equipo_local} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div>
                <p class="text-blanco text-base text-center">{partidosObj["tercer_quarto"]?.equipo_local}</p>
                <div>
                    <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none">{partidosObj["tercer_quarto"]?.resultado_local}</p>
                </div>
            </EquipoBoxIzq>

            {/* {/* <!--Ganador P2--> */} 
            <EquipoBoxDer>
                <div>
                    <div>
                        <p class="text-blanco text-2xl w-4 text-center bg-transparent border-none">{partidosObj["tercer_quarto"]?.resultado_visitante}</p>
                    </div>
                </div>
                <p class="text-blanco text-base text-center">{partidosObj["tercer_quarto"]?.equipo_visitante}</p>
                <div>
                    {partidosObj["tercer_quarto"]?.escudo_visitante && partidosObj["tercer_quarto"]?.escudo_visitante.trim() !== "" ?  (
                        <img src={partidosObj["tercer_quarto"]?.escudo_visitante} class="w-10 h-10 rounded-sm" alt={partidosObj["tercer_quarto"]?.equipo_visitante} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-sm" fill="none" viewBox="0 0 650 650">
                                    <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                                    <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                                </svg>
                        )}
                </div> 
            </EquipoBoxDer>
        </div>
    </div>
</div>
)}
</div>
    // <div>

    // </div>
  );
}
