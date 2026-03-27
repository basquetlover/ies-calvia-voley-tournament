import React, { useEffect, useState } from "react";
import './EstilosReact.css';
import { createClient } from "@supabase/supabase-js";



export default function BracketAutoRefresh({tipoMarcador, active}) {
  const supabaseUrl = "https://aimtsdmsojunxazbxfue.supabase.co";
  const supabaseAnonKey = "sb_publishable_JVARTG3Ed4c6FHr0BtMYAw_cUSnTrg7";

  const supabaseReact = createClient(
  supabaseUrl,
  supabaseAnonKey
);

if(active === false) return null;

const [partidos, setPartidos] = useState([]);
const [numPartidos, setNumPartidos] = useState(0);

async function cargarPartidos() {
    //setLoading(true);
    try {
    //   const res = await fetch('/api/usuario/CargarBracket');
            const res = await fetch('/api/usuario/CargarMarcador',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      //console.log("Partidos en directo", data);
      let numeroPartidos = data.length;
      console.log("Número de partidos en directo:", numeroPartidos);
      //numeroPartidos = 1
      // ⚠️ Si la API devuelve sin partidos
           if (!data || data.length === 0) {
              // ⚡ Lanzamos evento global
              window.dispatchEvent(new Event("sinPartidos"));
              return;
            }
      setNumPartidos(numeroPartidos);
      setPartidos(data);

      

    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      //setLoading(false);
    }
  }

useEffect(() => {
  
  cargarPartidos();

  const channel = supabaseReact
    .channel('realtime-marcador')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: "PartidosSS26",
    }, cargarPartidos)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: "HistorialSS26",
    }, cargarPartidos)
    .subscribe();

  return () => {
    supabaseReact.removeChannel(channel);
  };

  //  cargarPartidos();
  //const intervalo = setInterval(cargarPartidos, 3*1000); // cada 3 segundos
  //return () => clearInterval(intervalo);
}, []);

    

    // let estado = "En Directe"
    // let LocSet = 1
    // let VisSet = 1
    //let SetActual = String(LocSet + VisSet)

  return (
    <>
    {
      tipoMarcador === "Completo" && (
        <>
    {
      numPartidos === 2 ? (<>
          <div className="grid grid-cols-[1fr_max-content_1fr] grid-rows-1 absolute top-52 transform scale-[1.5] gap-4 p-5">
                {partidos.filter(p => p.pista !== "Pista 2").map((p) => (
              <div key={p.id_partido} className={`w-max flex flex-col items-center ${
                p.pista === "Pista 2" ? "col-start-3" : "col-start-1"
              }`}>
                <h2 className="text-7xl uppercase font-bold text-amarillo">
                  {p.pista}
                </h2>

                <div className="w-full grid grid-cols-1 place-items-center mt-8">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <div className="flex items-center place-content-center">
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_local} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_local"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}
                      
                    >
                      {p.marcador.global.local}
                      </p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-10">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                      <input
                        id="resultado_set1_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set1.local}
                      />
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                      <input
                        id="resultado_set2_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set2.local}
                      />
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                      <input
                        id="resultado_set3_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set3.local}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-80 rounded h-1 relative bg-amarillo">
                  &nbsp;
                  <span className="absolute w-10 h-10 -top-4 left-36 bg-gris">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-accent" viewBox="0 0 24 24">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                        <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                      </g>
                    </svg>
                  </span>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-8">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <div className="flex items-center place-content-center">
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_visitante"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}
                      
                    >
                      {p.marcador.global.visitante}
                      </p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-10">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set1.visitante}
                      </p>
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set2.visitante}
                      </p>
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set3.visitante}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-64 h-full  col-start-2 flex flex-col items-center justify-around">
              <img src="/favicon.svg" className="w-48 h-48" />
              <div className="w-48 h-48 relative z-0">
                <img src="/img/team-teto.png" className="w-48 h-48 team-teto absolute -top-3 -left-3" />
                <div className="w-[1px] rotate-45 rounded h-52 absolute -top-2 left-1/2 -translate-x-1/2 bg-accent -z-10 "> &nbsp; </div>
                <img src="/img/ies-calvia.png" className="w-48 h-48 ies-calvia absolute -bottom-3 -right-3" />
              </div>
            </div>

            {partidos.filter(p => p.pista === "Pista 2").map((p) => (
              <div key={p.id_partido} className={`w-max flex flex-col items-center ${
                p.pista === "Pista 2" ? "col-start-3" : "col-start-1"
              }`}>
                <h2 className="text-7xl uppercase font-bold text-amarillo">
                  {p.pista}
                </h2>

                <div className="w-full grid grid-cols-1 place-items-center mt-8">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <div className="flex items-center place-content-center">
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_local} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_local"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}
                    >
                      {p.marcador.global.local}
                      </p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-10">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                      <input
                        id="resultado_set1_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set1.local}
                      />
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                      <input
                        id="resultado_set2_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set2.local}
                      />
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                      <input
                        id="resultado_set3_local"
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                        disabled
                        value={p.marcador.set3.local}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-80 rounded h-1 relative bg-amarillo">
                  &nbsp;
                  <span className="absolute w-10 h-10 -top-4 left-36 bg-gris">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-accent" viewBox="0 0 24 24">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                        <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                      </g>
                    </svg>
                  </span>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-8">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                    <div className="flex items-center place-content-center">
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_visitante"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}
                    >
                      {p.marcador.global.visitante}
                      </p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 place-items-center mt-10">
                  <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set1.visitante}
                      </p>
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set2.visitante}
                      </p>
                    </div>
                    <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                      <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                      <p
                        className={`w-16 h-auto text-center text-6xl bg-transparent ${
                          p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                        }`}
                      >
                        {p.marcador.set3.visitante}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            
                
            </div>
        </>):(<>
        <div className="grid grid-rows-1 absolute top-52 transform scale-[1.5] gap-10 p-5">
          {partidos.map((p) => (
              <div key={p.id_partido} className={`w-max flex flex-col items-center ${
                p.pista === "Pista 2" ? "col-start-3" : "col-start-1"
              }`}>
                <h2 className="text-7xl uppercase font-bold text-amarillo">
                  {p.pista}
                </h2>
              <div className=" mt-5 grid grid-cols-2 place-content-center gap-x-36">

                <div className="flex flex-col transform scale-110">
                  <div className="w-full grid grid-cols-1 place-items-center mt-8">
                    <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                      <div className="flex items-center place-content-center">
                        <p className={`text-4xl text-accent font-semibol ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                      </div>
                      <div className="w-max h-max">
                        <img src={p.escudo_equipo_local} className="w-16 h-16" />
                      </div>
                      <p
                        id="resultado_final_local"
                        className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) > (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}
                        
                      >
                        {p.marcador.global.local}
                      </p>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-1 place-items-center mt-10">
                    <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                        <input
                          id="resultado_set1_local"
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                          disabled
                          value={p.marcador.set1.local}
                        />
                      </div>
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                        <input
                          id="resultado_set2_local"
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                          disabled
                          value={p.marcador.set2.local}
                        />
                      </div>
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                        <input
                          id="resultado_set3_local"
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                          disabled
                          value={p.marcador.set3.local}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="w-80 rounded h-1 relative bg-amarillo">
                  &nbsp;
                  <span className="absolute w-10 h-10 -top-4 left-36 bg-gris">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-accent" viewBox="0 0 24 24">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                        <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                      </g>
                    </svg>
                  </span>
                </div> */}
                <div className="flex flex-col transform scale-110">
                  <div className="w-full grid grid-cols-1 place-items-center mt-8">
                    <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                      <p
                        id="resultado_final_visitante"
                        className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''} `}
                        
                      >{p.marcador.global.visitante}</p>
                      <div className="w-max h-max">
                        <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                      </div>
                      <div className="flex items-center place-content-center">
                        <p className={`text-4xl text-accent font-semibold ${(p.marcador.puntos.local) < (p.marcador.puntos.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
                      </div>
                      
                      
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-1 place-items-center mt-10">
                    <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Extra Set</p>
                        <p
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 3 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                        >
                          {p.marcador.set3.visitante}
                        </p>
                      </div>
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Set 2</p>
                        <p
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 2 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                        >
                          {p.marcador.set2.visitante}
                        </p>
                      </div>
                      <div className={`w-max flex flex-col items-center place-content-center gap-y-2`}>
                        <p className="text-3xl font-semibold text-amarillo">Set 1</p>
                        <p
                          className={`w-16 h-auto text-center text-6xl bg-transparent ${
                            p.setActual === 1 ? "text-rojo-claro pulso-texto" : "text-blanco"
                          }`}
                        >
                          {p.marcador.set1.visitante}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                </div>

              </div>
            ))}

            
        </div>
        <div className="w-full h-auto  absolute bottom-10 z-30 left-0 flex flex-row items-center justify-evenly gap-x-20 p-4">
            <img src="/img/team-teto.png" class="w-48 h-48" />
            <img src="/favicon.svg" alt="Logo tonerno" class="w-64 h-64" />
            <img src="/img/ies-calvia.png" class="w-48 h-48" />
        </div>
        </>)
    }
    </>
      )
    }
    {
      tipoMarcador === "Mini" && (
        <>
            <div className="h-52 px-5 w-full flex items-center justify-center">
        {
            numPartidos === 2 && (
                <>
                <div className="w-full grid grid-cols-2 grid-rows-1 place-items-center ">

                
                <div>
        {
            partidos.filter(p => p.pista !== "Pista 2").map((partido, index) => (
                <div className={`flex flex-row items-center justify-center gap-6 ${partido.pista === "Pista 1" ? "col-start-1" : "col-start-2"}`} key={index}>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div>
                            <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] font-semibold text-accent`}>
                                {partido.siglas_equipo_local}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_local} className="w-32 h-32" />
                        </div>
                        
                        <div className="w-max h-max">
                            <p className="text-[80px] text-blanco font-bold">
                                {partido.marcador.global.local}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <p id="resultado_final_local" className={`w-10 h-auto text-center text-[120px] font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.local}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.local}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.local}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                            <span className=" w-10 h-10  bg-gris">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                    <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                </g>
                                </svg>
                            </span>
                        </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-max h-max">
                            <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-[120px]  font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.visitante}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.visitante}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.visitante}
                                </span>
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-[80px] font-bold bg-transparent text-blanco">
                                {partido.marcador.global.visitante}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_visitante} className="w-32 h-32" />
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] bg-transparent text-accent font-semibold`}>
                                {partido.siglas_equipo_visitante}
                            </p>
                        </div>
                    </div>
                </div>
            ))
        }
                </div>
                

                <div>
                    {
                    partidos.filter(p => p.pista !== "Pista 1").map((partido, index) => (
                        <div className={`flex flex-row items-center justify-center gap-6 ${partido.pista === "Pista 1" ? "col-start-1" : "col-start-2"}`} key={index}>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div>
                            <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] font-semibold text-accent`}>
                                {partido.siglas_equipo_local}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_local} className="w-32 h-32" />
                        </div>
                        
                        <div className="w-max h-max">
                            <p className="text-[80px] text-blanco font-bold">
                                {partido.marcador.global.local}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <p id="resultado_final_local" className={`w-10 h-auto text-center text-[120px] font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.local}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.local}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.local}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                            <span className=" w-10 h-10  bg-gris">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                    <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                </g>
                                </svg>
                            </span>
                        </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-max h-max">
                            <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-[120px]  font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.visitante}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.visitante}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.visitante}
                                </span>
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-[80px] font-bold bg-transparent text-blanco">
                                {partido.marcador.global.visitante}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_visitante} className="w-32 h-32" />
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] bg-transparent text-accent font-semibold`}>
                                {partido.siglas_equipo_visitante}
                            </p>
                        </div>
                    </div>
                </div>
                    ))
                }
                </div>

                </div>
                </>
            )
        }
        {
          numPartidos === 1 && (
                <>
                <div>
        {
            partidos.map((partido, index) => (
               <div className={`flex flex-row items-center justify-center gap-6 ${partido.pista === "Pista 1" ? "col-start-1" : "col-start-2"}`} key={index}>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div>
                            <p id="nombre_equipo_local" className={`${(partido.marcador.puntos.local) > (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] font-semibold text-accent`}>
                                {partido.siglas_equipo_local}
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_local} className="w-32 h-32" />
                        </div>
                        
                        <div className="w-max h-max">
                            <p className="text-[80px] text-blanco font-bold">
                                {partido.marcador.global.local}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <p id="resultado_final_local" className={`w-10 h-auto text-center text-[120px] font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.local}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.local}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.local}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                            <span className=" w-10 h-10  bg-gris">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-amarillo" viewBox="0 0 24 24">
                                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
                                    <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6" />
                                </g>
                                </svg>
                            </span>
                        </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-max h-max">
                            <p id="resultado_final_visitante" className={`w-10 h-auto text-center text-[120px]  font-semibold bg-transparent text-blanco `}>
                                <span className={`${partido.setActual === 1 ? '': 'hidden'}`}>
                                    {partido.marcador.set1.visitante}
                                </span>
                                <span className={`${partido.setActual === 2 ? '': 'hidden'}`}>
                                    {partido.marcador.set2.visitante}
                                </span>
                                <span className={`${partido.setActual === 3 ? '': 'hidden'}`}>
                                    {partido.marcador.set3.visitante}
                                </span>
                            </p>
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className="w-auto h-auto text-center text-[80px] font-bold bg-transparent text-blanco">
                                {partido.marcador.global.visitante}
                            </p>
                        </div>
                        
                        <div className="w-max h-max">
                            <img src={partido.escudo_equipo_visitante} className="w-32 h-32" />
                        </div>
                        <div className="w-max h-max">
                            <p id="nombre_equipo_visitante" className={`${(partido.marcador.puntos.local) < (partido.marcador.puntos.visitante) ? 'glow-gold': ''} w-40 h-auto text-center text-[70px] bg-transparent text-accent font-semibold`}>
                                {partido.siglas_equipo_visitante}
                            </p>
                        </div>
                    </div>
                </div>
            ))
        }
        </div>
                </>
            )
        }
        {
          numPartidos === 0 && (
            <>
            </>
          )
        }
       
    </div>
        </>
      )
    }

    
    </>
  );
}
