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

  useEffect(() => {
    // decide cuánto esperar según pantalla actual
    const actual = PANTALLAS[indice];
    const delay = DURACIONES[actual] ?? 10000;

    const timer = setTimeout(() => {
      // avanzar al siguiente índice en bucle
      setIndice((prev) => (prev + 1) % PANTALLAS.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [indice]);

  // 🔑 Escuchar teclado
useEffect(() => {
  const handleKey = (e) => {
    const key = e.key.toLowerCase();

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
  //pantalla = "logo"; // FORZAR PANTALLA PARA TESTING
  
  
 

    return(
        <div className="w-[1920px] h-[1080px] bg-lime-400 margin-y-auto relative">
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
        className={`w-[1920px] h-[1080px]  flex items-center justify-center ${
          pantalla === "pistas" ? "flex" : "hidden"
        }`}
      >
            <img src="/img/distribucion-pistas.png" alt="Distribucion Pistas" class="w-[1920px] h-[1080px]" />
        </div>

        {/* Clasificación */}
      <div
        className={`w-[1920px] h-[1080px] bg-red-500 flex flex-col  items-center justify-center ${
          pantalla === "clasificacion" ? "flex" : "hidden"
        }`}
      >
        {/* <h1 className="text-7xl uppercase font-bold text-accent">Classificació</h1> */}
            <ClasificacionReact />
        </div>
        {/* Marcador */}
        <div
            className={`w-[1920px] h-[1080px]  top-0 left-0 min-h-screen flex flex-col items-center justify-center ${
            pantalla === "marcador" ? "flex" : "hidden"
            }`}
        >
        <h1 className="text-7xl uppercase font-bold text-accent">Marcador</h1>
            <MarcadorPabellon />
        </div>
        {/* Despues */}
        <div
            className={`w-[1920px] h-[1080px]  top-0 left-0 min-h-screen flex flex-col items-center justify-center ${
            pantalla === "despues" ? "flex" : "hidden"
            }`}
        >
        <h1 className="text-7xl uppercase font-bold text-accent">Pròxims Partits</h1>
        <div className="flex gap-2 justify-center items-center">
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
            <ProximosPartidos />
        </div>
        </div>
    );
}

export default Pantalla;