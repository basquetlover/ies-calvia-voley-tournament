import React, { useEffect, useState } from "react";
import './EstilosReact.css';




export default function BracketAutoRefresh() {
const [partidos, setPartidos] = useState([]);
const [numPartidos, setNumPartidos] = useState(0);
useEffect(() => {
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
           if (!data || data.length === 0 || data.sinPartidos) {
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

   cargarPartidos();
  const intervalo = setInterval(cargarPartidos, 3* 60 *1000); // cada 5 minutos
  return () => clearInterval(intervalo);
}, []);

    

    let estado = "En Directe"
    let LocSet = 1
    let VisSet = 1
    let SetActual = String(LocSet + VisSet)

  return (
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
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_local} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_local"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}
                      
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
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_visitante"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}
                      
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
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_local} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_local"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}
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
                      <p className={`text-4xl text-accent font-semibold ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
                    </div>
                    <div className="w-max h-max">
                      <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                    </div>
                    <p
                      id="resultado_final_visitante"
                      className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}
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
                        <p className={`text-4xl text-accent font-semibol ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_local}</p>
                      </div>
                      <div className="w-max h-max">
                        <img src={p.escudo_equipo_local} className="w-16 h-16" />
                      </div>
                      <p
                        id="resultado_final_local"
                        className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) > (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}
                        
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
                        className={`w-10 h-auto text-center text-6xl bg-transparent text-blanco ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''} `}
                        
                      >{p.marcador.global.visitante}</p>
                      <div className="w-max h-max">
                        <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
                      </div>
                      <div className="flex items-center place-content-center">
                        <p className={`text-4xl text-accent font-semibold ${(p.marcador.set1.local + p.marcador.set2.local + p.marcador.set3.local) < (p.marcador.set1.visitante + p.marcador.set2.visitante + p.marcador.set3.visitante) ? 'glow-gold': ''}`}>{p.equipo_visitante}</p>
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
        <div className="w-full h-auto b absolute bottom-32 z-30 left-0 flex flex-row items-center justify-evenly gap-x-20 p-4">
            <img src="/img/team-teto.png" class="w-48 h-48" />
            <img src="/favicon.svg" alt="Logo tonerno" class="w-64 h-64" />
            <img src="/img/ies-calvia.png" class="w-48 h-48" />
        </div>
        </>)
    }
    </>
  );
}
