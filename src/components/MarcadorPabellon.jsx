import React, { useEffect, useState } from "react";
import './EstilosReact.css';




export default function BracketAutoRefresh() {
const [partidos, setPartidos] = useState([]);
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
      setPartidos(data);
      

    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      //setLoading(false);
    }
  }

   cargarPartidos();
  const intervalo = setInterval(cargarPartidos, 3 *1000); // cada 5 minutos
  return () => clearInterval(intervalo);
}, []);

    

    let estado = "En Directe"
    let LocSet = 1
    let VisSet = 1
    let SetActual = String(LocSet + VisSet)

  return (

   <div className="grid grid-flow-col gap-20">
    {/* <div className="w-max flex flex-col items-center">
        <h2 className="text-7xl uppercase font-bold text-amarillo">Pista 1</h2>
            <div class="w-full grid grid-cols-1 place-items-center mt-8">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                <div class="flex items-center place-content-center">
                    <p class="text-4xl text-accent font-semibold">Equipo 1</p>
                </div>
                <div class="w-max h-max">
                    <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                </div>

                <input id="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value={ `${estado === "En Directe" ? `${LocSet}`: `${LocSet}`} `} />
            </div>
        </div>

        <div class="w-full grid grid-cols-1 place-items-center mt-10">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                    <input id="resultado_set1_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "0" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `10`: `-`}`} />
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                    <input id="resultado_set2_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "1" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `6`: `-`}`} />
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                    <input id="resultado_set3_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "2" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `-`: `-`}`} />
                </div>
            </div>
            </div>

        <div className="w-80 rounded h-1 relative bg-amarillo">
            &nbsp;
            <span className="absolute w-10 h-10 -top-4 left-36 bg-gris">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10  stroke-accent" viewBox="0 0 24 24">
                    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/>
                        <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6"/>
                    </g>
                </svg>
            </span>
        </div>

            <div class="w-full grid grid-cols-1 place-items-center mt-8">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                <div class="flex items-center place-content-center">
                    <p class="text-4xl text-accent font-semibold">Equipo 2</p>
                </div>
                <div class="w-max h-max">
                    <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                </div>

                <input id="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value={ `${estado === "En Directe" ? `${VisSet}`: `${VisSet}`} `} />
            </div>

        </div>

        <div class="w-full grid grid-cols-1 place-items-center mt-10">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "0" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>8</p> 
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "1" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>8</p>
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "2" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>-</p>
                </div>
            </div>
            </div>

    </div>
    <div className="w-max flex flex-col items-center">
        <h2 className="text-7xl uppercase font-bold text-amarillo">Pista 2</h2>
            <div class="w-full grid grid-cols-1 place-items-center mt-8">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                <div class="flex items-center place-content-center">
                    <p class="text-4xl text-accent font-semibold">Equipo 1</p>
                </div>
                <div class="w-max h-max">
                    <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                </div>

                <input id="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value={ `${estado === "En Directe" ? `${LocSet}`: `${LocSet}`} `} />
            </div>
        </div>

        <div class="w-full grid grid-cols-1 place-items-center mt-10">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                    <input id="resultado_set1_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "0" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `10`: `-`}`} />
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                    <input id="resultado_set2_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "1" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `6`: `-`}`} />
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                    <input id="resultado_set3_local" class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "2" ? `text-rojo-claro pulso-texto` : `text-blanco`}`} disabled value={`${estado === "En Directe" ? `-`: `-`}`} />
                </div>
            </div>
            </div>

        <div className="w-80 rounded h-1 relative bg-amarillo">
            &nbsp;
            <span className="absolute w-10 h-10 -top-4 left-36 bg-gris">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10  stroke-accent" viewBox="0 0 24 24">
                    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/>
                        <path d="M14 14.25c0 .414.336.75.75.75H16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75M7 9l2 6 2-6"/>
                    </g>
                </svg>
            </span>
        </div>

            <div class="w-full grid grid-cols-1 place-items-center mt-8">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
                <div class="flex items-center place-content-center">
                    <p class="text-4xl text-accent font-semibold">Equipo 2</p>
                </div>
                <div class="w-max h-max">
                    <img src="/img/escudos/sin-escudo.png" class="w-16 h-16" />
                </div>

                <input id="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value={ `${estado === "En Directe" ? `${VisSet}`: `${VisSet}`} `} />
            </div>

        </div>

        <div class="w-full grid grid-cols-1 place-items-center mt-10">
            <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 1</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "0" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>8</p> 
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Set 2</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "1" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>8</p>
                </div>
                <div class={`w-max flex flex-col items-center place-content-center gap-y-2 `}>
                    <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
                    <p class={`w-16 h-auto text-center text-6xl bg-transparent ${SetActual === "2" ? `text-rojo-claro pulso-texto` : `text-blanco`}`}>-</p>
                </div>
            </div>
            </div>

    </div> */}
    {partidos.map((p) => (
  <div key={p.id_partido} className={`w-max flex flex-col items-center ${
    p.pista === "Pista 2" ? "col-start-2" : "col-start-1"
  }`}>
    <h2 className="text-7xl uppercase font-bold text-amarillo">
      {p.pista}
    </h2>

    <div className="w-full grid grid-cols-1 place-items-center mt-8">
      <div className="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
        <div className="flex items-center place-content-center">
          <p className="text-4xl text-accent font-semibold">{p.equipo_local}</p>
        </div>
        <div className="w-max h-max">
          <img src={p.escudo_equipo_local} className="w-16 h-16" />
        </div>
        <input
          id="resultado_final_local"
          className="w-10 h-auto text-center text-6xl bg-transparent text-blanco"
          disabled
          value={p.marcador.global.local}
        />
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
          <p className="text-4xl text-accent font-semibold">{p.equipo_visitante}</p>
        </div>
        <div className="w-max h-max">
          <img src={p.escudo_equipo_visitante} className="w-16 h-16" />
        </div>
        <input
          id="resultado_final_visitante"
          className="w-10 h-auto text-center text-6xl bg-transparent text-blanco"
          disabled
          value={p.marcador.global.visitante}
        />
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
    
  );
}
