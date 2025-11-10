import { useEffect, useRef, useState } from "react";
import ClasificacionReact from "./ClasificacionReact"; // ruta relativa al archivo
import MarcadorPabellon from "./MarcadorPabellon";
import ProximosPartidos from "./ProximosPartidos";

const Pantalla = ( )=>{
    const PANTALLAS = ["marcador", "logo", "pistas","marcador", "clasificacion", "marcador", "despues"];
const DURACIONES = {
  logo: 5000,
  pistas: 10000,
  clasificacion: 30000,
  marcador: 30000, // mucho más tiempo
  despues: 20000,
};

      const [indice, setIndice] = useState(0); // índice en PANTALLAS
  const [isPaused, setIsPaused] = useState(false); // estado para controlar la pausa

  useEffect(() => {
    // Si está pausado, no configurar el temporizador
    if (isPaused) return;

    // decide cuánto esperar según pantalla actual
    const actual = PANTALLAS[indice];
    const delay = DURACIONES[actual] ?? 10000;

    const timer = setTimeout(() => {
      // avanzar al siguiente índice en bucle
      setIndice((prev) => (prev + 1) % PANTALLAS.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [indice, isPaused]);

  // 🔑 Escuchar teclado
useEffect(() => {
  const handleKey = (e) => {
    const key = e.key.toLowerCase();

    // Manejar la tecla espaciadora para pausar/reanudar
    if (key === " ") {
      setIsPaused(prev => !prev);
      return;
    }

    // definimos inicial -> nombre pantalla
    const mapa = {
      m: "marcador",
      l: "logo",
      p: "pistas",
      c: "clasificacion",
      d: "despues"
    };

    const destino = mapa[key];
    if (destino) {
      // busca el primer índice en PANTALLAS que coincida
      const nuevo = PANTALLAS.findIndex((p) => p === destino);
      if (nuevo !== -1) {
        setIndice(nuevo);
      }
    }
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, []);

  let pantalla = PANTALLAS[indice];
  //pantalla = "marcador"; // FORZAR PANTALLA PARA TESTING
  
  
 

    return(
        <div className="w-[1920px] h-[1080px]  margin-y-auto relative">
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
        className={`w-[1920px] h-[1080px] bg-gris-claro flex flex-col   items-center justify-center ${
          pantalla === "clasificacion" ? "flex" : "hidden"
        }`}
      >
        {/* <h1 className="text-7xl uppercase font-bold text-accent">Classificació</h1> */}
            <ClasificacionReact />
        </div>
        {/* Marcador */}
        <div
            className={`w-[1920px] h-[1080px]  relative top-0 left-0 min-h-screen flex flex-col items-center place-content-center ${
            pantalla === "marcador" ? "flex" : "hidden"
            }`}
        >
        {/* <h1 className="text-7xl uppercase absolute top-10 font-bold text-accent">Marcador</h1> */}
            <MarcadorPabellon />
        </div>
        {/* Despues */}
        <div
            className={`w-[1920px] h-[1080px] relative  top-0 left-0 min-h-screen flex flex-col items-center justify-center ${
            pantalla === "despues" ? "flex" : "hidden"
            }`}
        >
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