import { useEffect, useState } from "react";
import ClasificacionReact from "./ClasificacionReact";
import MarcadorPabellon from "./MarcadorPabellon";
import ProximosPartidos from "./ProximosPartidos";
import EscudosCarrusel from "./EscudosCarrusel.jsx";
import MiniMarcador from "./MiniMarcador.jsx";
// import CuadradosTransition from "./CuadradosTransition"; // TRANSICIÓN DESACTIVADA

const Pantalla = () => {
  setTimeout(() => location.reload(), 2 * 60 * 60 * 1000); // Recarga cada 2 horas para evitar problemas de memoria o errores inesperados
  const PANTALLAS = [
    "logo",
    "marcador",
    "pistas",
    "marcador",
    "clasificacion",
    "marcador",
    "despues"
  ];
  // const PANTALLAS = [
  //   "pistas",]

  const DURACIONES = {
    logo: 8000,
    pistas: 2500,
    clasificacion: 15000,
    marcador: 30000,
    despues: 15000,
  };

  const [indice, setIndice] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 🔥 TRANSICIÓN DESACTIVADA
  // const [isTransitioning, setIsTransitioning] = useState(false);
  // const [siguienteIndice, setSiguienteIndice] = useState(null);

  const pantalla = PANTALLAS[indice];

  // ----------------------------------------------------
  // CAMBIAR PANTALLA (SIN ANIMACIÓN)
  // ----------------------------------------------------

  const cambiarPantalla = (nuevoIndice) => {
    if (nuevoIndice === indice) return;
    setIndice(nuevoIndice);
  };

  // ----------------------------------------------------
  // CAMBIO AUTOMÁTICO
  // ----------------------------------------------------

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(async () => {
      let siguiente = (indice + 1) % PANTALLAS.length;

      if (PANTALLAS[siguiente] === "marcador") {
        try {
          const res = await fetch("/api/usuario/CargarMarcador", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();

          if (!data || data.length === 0) {
            let nuevoSiguiente = siguiente;

            do {
              nuevoSiguiente =
                (nuevoSiguiente + 1) % PANTALLAS.length;
            } while (
              PANTALLAS[nuevoSiguiente] === "marcador" &&
              nuevoSiguiente !== siguiente
            );

            siguiente = nuevoSiguiente;
          }
        } catch (err) {
          console.error("Error comprobando partidos:", err);
        }
      }

      cambiarPantalla(siguiente);

    }, DURACIONES[pantalla] ?? 10000);

    return () => clearTimeout(timer);

  }, [indice, isPaused]);

  // ----------------------------------------------------
  // TECLADO
  // ----------------------------------------------------

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();

      if (key === " ") {
        setIsPaused((prev) => !prev);
        return;
      }

      const mapa = {
        m: "marcador",
        l: "logo",
        p: "pistas",
        c: "clasificacion",
        d: "despues",
      };

      const destino = mapa[key];

      if (destino) {
        const nuevo = PANTALLAS.findIndex((p) => p === destino);
        if (nuevo !== -1) {
          cambiarPantalla(nuevo);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [indice]);

  // ----------------------------------------------------
  // Equipos Inscritos
  // ----------------------------------------------------

  const [equiposInscritos, setEquiposInscritos] = useState([]);
  const [equiposTop, setEquiposTop] = useState([]);
  const [equiposBottom, setEquiposBottom] = useState([]);
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await fetch("/api/usuario/EquiposInscritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setEquiposInscritos(data);
        data.forEach((equipo, index) => {
          if (equipo.id % 2 === 0) {
            setEquiposTop((prev) => [...prev, equipo]);
          } else {
            setEquiposBottom((prev) => [...prev, equipo]);
          }
        });
      } catch (err) {
        console.error("Error fetching equipos:", err);
      }
    };
    fetchEquipos();
  }, []);

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="w-full  h-screen flex items-center place-content-center">

    
    {/* <div className="w-[1920px] h-[1080pxg] bg-gris mx-auto my-auto relative overflow-hidden"> */}

      {/* {pantalla === "logo" && ( */}
        <div className={`${pantalla === "logo"? "": "hidden"} w-full h-screen grid grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center overflow-hidden`}>
          <EscudosCarrusel equipos={equiposTop} sentido={"izquierda"} />
          <div className="inset-0 w-full g-full grid grid-cols-3 gap-4 items-center justify-items-center">
            <img src="/img/team-teto.png" className="max-w-2xl" />
            <img src="/img/logo_torneo.png" className="max-w-2xl" />
            <img src="/img/ies-calvia.png" className="max-w-2xl" />
          </div>
          <EscudosCarrusel equipos={equiposBottom} sentido={"derecha"} />

        </div>
      {/* // )} */}

      {/* {pantalla === "pistas" && ( */}
        <div className={`${pantalla === "pistas" ? "absolute" : "hidden"}  inset-0 flex items-center justify-center`}>
          <div className="w-screen h-screen  grid grid-rows-[auto_1fr] overflow-hidden items-start justify-items-center">
            <MiniMarcador />
            <img
              src="/img/distribucion-pistas.png"
              className="h-full w-max object-cover  rounded"
            />
          </div>
        </div>
      {/* )} */}

      {/* {pantalla === "clasificacion" && ( */}
        <div className={`${pantalla === "clasificacion" ? "absolute" : "hidden"} inset-0 flex items-center justify-center`}> 
          <ClasificacionReact />
        </div>
      {/* )} */}

      {/* {pantalla === "marcador" && ( */}
        <div className={`${pantalla === "marcador" ? "absolute" : "hidden"} inset-0 flex items-center justify-center`}>
          <MarcadorPabellon /> 
        </div>
      {/* )} */}

      {/* {pantalla === "despues" && ( */}
        <div className={`${pantalla === "despues" ? "absolute" : "hidden"} inset-0 flex items-center justify-center`}>
          <div className="w-screen h-screen  grid grid-rows-[auto_1fr] overflow-hidden items-start justify-items-center">
            <MiniMarcador />
            <div className="relative border-t border-amarillo w-[95%] mx-auto flex items-center justify-center inset-0  h-full">
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
          </div>
        </div>
      {/* )} */}

      {/* 🔥 TRANSICIÓN DESACTIVADA */}
      {/*
      <CuadradosTransition
        active={isTransitioning}
        onMidpoint={handleMidpoint}
      />
      */}

      {isPaused && (
        <div className="fixed bottom-8 right-8 z-50 bg-black/50 p-4 rounded-full">
          ⏸
        </div>
      )}

    {/* </div> */}
    </div>
  );
};

export default Pantalla;