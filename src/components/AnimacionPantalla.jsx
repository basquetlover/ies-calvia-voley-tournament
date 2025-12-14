import { useEffect, useRef, useState } from "react";
import ClasificacionReact from "./ClasificacionReact"; // ruta relativa al archivo
import MarcadorPabellon from "./MarcadorPabellon";
import ProximosPartidos from "./ProximosPartidos";

const Pantalla = ( )=>{
const PANTALLAS = ["marcador", "logo", "pistas", "marcador", "clasificacion", "marcador", "despues"];
const DURACIONES = {
  logo: 2000,
  pistas: 2500,
  clasificacion: 15000,
  marcador: 30000,
  despues: 15000,
};

 const [indice, setIndice] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hayPartidos, setHayPartidos] = useState(true); // estado global de partidos

  // 🚀 Interceptar cambio de pantalla
  useEffect(() => {
  if (isPaused) return;

  const timer = setTimeout(async () => {
    let siguiente = (indice + 1) % PANTALLAS.length;

    // ⚡ Si el siguiente es "marcador" y no hay partidos, saltamos al siguiente índice que no sea "marcador"
    if (PANTALLAS[siguiente] === "marcador") {
      try {
        const res = await fetch("/api/usuario/CargarMarcador", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!data || data.length === 0) {
          // Buscar el siguiente índice que no sea "marcador"
          let nuevoSiguiente = siguiente;
          do {
            nuevoSiguiente = (nuevoSiguiente + 1) % PANTALLAS.length;
          } while (PANTALLAS[nuevoSiguiente] === "marcador" && nuevoSiguiente !== siguiente);
          siguiente = nuevoSiguiente;
        }
      } catch (err) {
        console.error("Error comprobando partidos:", err);
      }
    }

    setIndice(siguiente);
  }, DURACIONES[PANTALLAS[indice]] ?? 10000);

  return () => clearTimeout(timer);
}, [indice, isPaused]);

  // Teclado
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === " ") {
        setIsPaused(prev => !prev);
        return;
      }

      const mapa = { m: "marcador", l: "logo", p: "pistas", c: "clasificacion", d: "despues" };
      const destino = mapa[key];
      if (destino) {
        const nuevo = PANTALLAS.findIndex((p) => p === destino);
        if (nuevo !== -1) setIndice(nuevo);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  let pantalla = PANTALLAS[indice];
 
  //pantalla = "despues"; // FORZAR PANTALLA PARA TESTING
  
  
 

    return(
        <div className="w-[1920px] h-[1080px] bg-gris  margin-y-auto relative">
            {/* Pantalla Logo */}

        <div className={`w-[1920px] h-[1080px]  top-0 left-0 min-h-screen flex gap-x-10 items-center justify-center ${
          pantalla === "logo" ? "flex" : "hidden"
        }`} >
            <img src="/img/team-teto.png" class="max-w-2xl h-auto w-auto" />
            <img src="/img/logo_torneo.png" alt="Logo tonerno" class="max-w-2xl h-auto w-auto" />
            <img src="/img/ies-calvia.png" class="max-w-2xl h-auto w-auto" />
        </div>

        {/* Distribución de pistas */}
          <div
        className={`w-[1920px] h-[1080px] bg-gris-claro  flex items-center justify-center ${
          pantalla === "pistas" ? "flex" : "hidden"
        }`}
      >
            <img src="/img/distribucion-pistas.png" alt="Distribucion Pistas" class="w-[1920px] h-[1080px]" />
        </div>

        {/* Clasificación */}
      <div
        className={`w-[1920px] h-[1080px] bg-gris-claro flex flex-col relative  items-center justify-center ${
          pantalla === "clasificacion" ? "flex" : "hidden"
        }`}
      >
        {/* <h1 className="text-7xl uppercase font-bold text-accent">Classificació</h1> */}
            <ClasificacionReact />
        </div>
        {/* Marcador */}
        <div
            className={`w-[1920px] h-[1080px]  relative top-0 left-0 min-h-screen flex flex-col items-center  ${
            pantalla === "marcador" ? "flex" : "hidden"
            }`}
        >
        
            <MarcadorPabellon 
              onSinPartidos={() => {
                console.log("No hay partidos → cambiar pantalla"); // debug
                const idx = PANTALLAS.findIndex(p => p === "despues");
                if (idx !== -1) setIndice(idx);
              }}
            />
        </div>
        {/* Despues */}
        <div
            className={`w-[1920px] h-[1080px] relative  top-0 left-0 min-h-screen flex flex-col items-center justify-center ${
            pantalla === "despues" ? "flex" : "hidden"
            }`}
        >
          <div className="w-48 h-49 absolute top-10 left-20">
            <img src="/favicon.svg" className="w-48 h-48" />
          </div>
          <div className="w-48 h-48 absolute top-10 right-32">
                <img src="/img/team-teto.png" className="w-48 h-48 team-teto absolute -top-3 -left-3" />
                <div className="w-[1px] rotate-45 rounded h-52 absolute -top-2 left-1/2 -translate-x-1/2 bg-accent -z-10 "> &nbsp; </div>
                <img src="/img/ies-calvia.png" className="w-48 h-48 ies-calvia absolute -bottom-3 -right-3" />
            </div>
          <div className="absolute top-10">
        <h1 className="text-7xl uppercase font-bold text-accent">Pròxims Partits</h1>
        <div className="flex gap-2 transform scale-150 my-5 justify-center items-center">
            <p className="px-4 py-2 border border-rojo bg-rojo bg-opacity-10 text-rojo font-semibold rounded-lg text-center">
                Jugant
            </p>
            <p className="px-4 py-2 bg-amarillo text-azul font-semibold rounded-lg text-center">
                Escalfant
            </p>
            <p className="px-4 py-2 bg-azul-suave text-blanco font-semibold rounded-lg text-center">
                Propers
            </p>
        </div>
        </div>
            <ProximosPartidos />
        </div>

        {/* Icono de pausa */}
        {isPaused && (
          <div className="fixed bottom-8 right-8 z-50 bg-black bg-opacity-50 p-4 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-12 h-12"
            >
              <path 
                fillRule="evenodd" 
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
        </div>
    );
}

export default Pantalla;