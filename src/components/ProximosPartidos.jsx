import React, { useEffect, useState } from "react";
import './EstilosReact.css';

import { createClient } from "@supabase/supabase-js";


export default function BracketAutoRefresh() {

        const supabaseUrl = "https://aimtsdmsojunxazbxfue.supabase.co";
        const supabaseAnonKey = "sb_publishable_JVARTG3Ed4c6FHr0BtMYAw_cUSnTrg7";
      
        const supabaseReact = createClient(
        supabaseUrl,
        supabaseAnonKey
      );
      

const [partidos, setPartidos] = useState([]);
useEffect(() => {
  async function cargarPartidos() {
    //setLoading(true);
    try {
    //   const res = await fetch('/api/usuario/CargarBracket');
            const res = await fetch('/api/usuario/ProximosPartidos',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log("Partidos en directo", data);
      setPartidos(data);
      

    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      //setLoading(false);
    }
  }


   cargarPartidos();
    const channel = supabaseReact
    .channel('realtime-marcador')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: "PartidosSS26",
    }, cargarPartidos)
    .subscribe();

  return () => {
    supabaseReact.removeChannel(channel);
  };
  //const intervalo = setInterval(cargarPartidos, 60 *1000); // cada 5 minutos
    const handleKeyPress = (event) => {
    if (event.key.toLowerCase() === 'r') {
      cargarPartidos();
    }
  };
  window.addEventListener('keydown', handleKeyPress);

  return () => clearInterval(intervalo);
}, []);


  return (
    
   <div className="grid grid-flow-col transform  mt-20 gap-40 ">
    {partidos.map((p) => (
  <div key={p.id_partido} className={`${p.proximos.length === 0 ? "hidden" : "w-max flex flex-col items-center gap-5"}`}>
    <h2 className="text-7xl uppercase font-bold text-amarillo">
      {p.pista}
    </h2>
    {p.enDirecte?.id_partido && (
      <div
      className={`w-[500px] mb-5 scale-125 transform  flex flex-col items-center place-content-center border-2 border-blanco rounded-md p-2 ${p.enDirecte?.estado === "En Directe" ? "border-rojo bg-rojo bg-opacity-10" : " hidden"
      }`}
    >
      <div className="w-full h-auto grid grid-cols-3 place-items-center text-lg text-blanco">
        <p>{p.enDirecte.id_partido}</p>
        <p
          className={`${
            p.enDirecte.estado === "En Directe" ? "text-red-600 flex flex-row gap-x-2 items-center place-content-center" : " "
          }`}
        >
          <span className={`${p.enDirecte.estado === "En Directe" ? "redondo " : " "}`}></span>
          {p.enDirecte.estado}
        </p>
        <p>{p.enDirecte.tipo}</p>
      </div>

      <div className="w-full text-center grid grid-cols-[max-content_1fr_max-content_30px_max-content_1fr_max-content] items-center px-2 py-1 gap-2 text-blanco">
        <div>
          {p.enDirecte.escudo_equipo_local?.trim() ? (
            <img src={p.enDirecte.escudo_equipo_local} className="w-10 h-10" alt={p.enDirecte.equipo_local} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-w-10" fill="none" viewBox="0 0 650 650">
              <circle cx="325" cy="325" r="315" stroke="#fff" strokeWidth="20" />
              <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10" />
            </svg>
          )}
        </div>
        <p>{p.enDirecte.equipo_local}</p>
     <p className="text-3xl font-semibold">{p.enDirecte.marcador.global.local}</p>
        <p>VS</p>
        <p className="text-3xl font-semibold">{p.enDirecte.marcador.global.visitante}</p>
        <p>{p.enDirecte.equipo_visitante}</p>
        <div>
          {p.enDirecte.escudo_equipo_visitante?.trim() ? (
            <img src={p.enDirecte.escudo_equipo_visitante} className="w-10 h-10" alt={p.enDirecte.equipo_visitante} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-w-10" fill="none" viewBox="0 0 650 650">
              <circle cx="325" cy="325" r="315" stroke="#fff" strokeWidth="20" />
              <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10" />
            </svg>
          )}
        </div>
      </div>

      <div className="w-full grid grid-cols-2 place-items-center gap-x-1">
        <div className="w-full grid grid-cols-3 place-items-center">
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Set 1</p>
            <p className="text-blanco">{p.enDirecte.marcador.set1.local}</p>
          </div>
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Set 2</p>
            <p className="text-blanco">{p.enDirecte.marcador.set2.local}</p>
          </div>
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Extra Set</p>
            <p className="text-blanco">{p.enDirecte.marcador.set3.local}</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 place-items-center">
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Extra Set</p>
            <p className="text-blanco">{p.enDirecte.marcador.set3.visitante}</p>
          </div>
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Set 2</p>
            <p className="text-blanco">{p.enDirecte.marcador.set2.visitante}</p>
          </div>
          <div className="flex flex-col items-center place-content-center">
            <p className="text-blanco font-medium">Set 1</p>
            <p className="text-blanco">{p.enDirecte.marcador.set1.visitante}</p>
          </div>
        </div>
      </div>
    </div>
    )}

    {p.proximos.map((prox, index) => (
    <div className={`w-[500px] h-32 mb-2 scale-110 px-2  gap-2 rounded-lg flex flex-col  place-content-center  text-center ${index === 0 ? "bg-amarillo text-azul font-semibold" : "bg-azul-suave text-blanco"}`}>
        <p className="text-2xl font-semibold">{prox.tipo}</p>
    <div class={`grid grid-cols-[60px_1fr_30px_1fr_60px] mx-4 items-center  text-xl `}> 
      <div>
        {prox.escudo_equipo_local?.trim() ? (
              <img src={prox.escudo_equipo_local} class="w-20 h-auto aspect-square object-cover" alt={prox.equipo_local} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-w-10" fill="none" viewBox="0 0 650 650">
                <circle cx="325" cy="325" r="315" stroke="#fff" strokeWidth="20" />
                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10" />
              </svg>
            )}
                
        </div>
        <p>{prox.equipo_local} </p>
        <p>VS</p>
        <p>{prox.equipo_visitante}</p>
        <div>
            {prox.escudo_equipo_visitante?.trim() ? (
              <img src={prox.escudo_equipo_visitante} class="w-20 h-auto aspect-square object-cover" alt={prox.equipo_visitante} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-w-10" fill="none" viewBox="0 0 650 650">
                <circle cx="325" cy="325" r="315" stroke="#fff" strokeWidth="20" />
                <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10" />
              </svg>
            )}
                
        </div>
    </div>
    </div>
      ))}




  </div>
))}
    
   </div>
    
  );
}
