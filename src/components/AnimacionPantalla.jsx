import { useEffect, useState } from "react";
import ClasificacionReact from "./ClasificacionReact";
import MarcadorPabellon from "./MarcadorPabellon";
import ProximosPartidos from "./ProximosPartidos";
// import CuadradosTransition from "./CuadradosTransition"; // TRANSICIÓN DESACTIVADA

const Pantalla = () => {

  const PANTALLAS = [
    "marcador",
    "logo",
    "pistas",
    "marcador",
    "clasificacion",
    "marcador",
    "despues"
  ];

  const DURACIONES = {
    logo: 2000,
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
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="w-[1920px] h-[1080px] bg-gris relative overflow-hidden">

      {pantalla === "logo" && (
        <div className="absolute inset-0 flex gap-x-10 items-center justify-center">
          <img src="/img/team-teto.png" className="max-w-2xl" />
          <img src="/img/logo_torneo.png" className="max-w-2xl" />
          <img src="/img/ies-calvia.png" className="max-w-2xl" />
        </div>
      )}

      {pantalla === "pistas" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/img/distribucion-pistas.png"
            className="w-full h-full"
          />
        </div>
      )}

      {pantalla === "clasificacion" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ClasificacionReact />
        </div>
      )}

      {pantalla === "marcador" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <MarcadorPabellon />
        </div>
      )}

      {pantalla === "despues" && (
        <div className="absolute inset-0 flex items-center justify-center">
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
      )}

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

    </div>
  );
};

export default Pantalla;