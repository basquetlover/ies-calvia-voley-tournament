import { useEffect, useState } from "react";
import ClasificacionReact from "./ClasificacionReact";
import MarcadorPabellon from "./MarcadorPabellon";
import ProximosPartidos from "./ProximosPartidos";
import CuadradosTransition from "./CuadradosTransition";

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

  // 🔥 NUEVO: transición
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [siguienteIndice, setSiguienteIndice] = useState(null);

  const pantalla = PANTALLAS[indice];

  // ----------------------------------------------------
  // FUNCIÓN GLOBAL PARA CAMBIAR PANTALLA CON ANIMACIÓN
  // ----------------------------------------------------

  const cambiarPantalla = (nuevoIndice) => {
    if (nuevoIndice === indice || isTransitioning) return;

    setSiguienteIndice(nuevoIndice);
    setIsTransitioning(true);
  };

  // ----------------------------------------------------
  // CAMBIO AUTOMÁTICO
  // ----------------------------------------------------

  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const timer = setTimeout(async () => {
      let siguiente = (indice + 1) % PANTALLAS.length;

      // 🔥 Si siguiente es marcador, comprobar si hay partidos
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

  }, [indice, isPaused, isTransitioning]);

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
  }, [indice, isTransitioning]);

  // ----------------------------------------------------
  // PUNTO MEDIO DE TRANSICIÓN (cuando pantalla está cubierta)
  // ----------------------------------------------------

  const handleMidpoint = () => {
  if (siguienteIndice !== null) {
    requestAnimationFrame(() => {
      setIndice(siguienteIndice);
    });
  }
};

  // ----------------------------------------------------
  // FINALIZAR TRANSICIÓN
  // ----------------------------------------------------

  useEffect(() => {
    if (!isTransitioning) return;

    const finalizar = setTimeout(() => {
      setIsTransitioning(false);
      setSiguienteIndice(null);
    },5000); // duración total animación

    return () => clearTimeout(finalizar);
  }, [isTransitioning]);

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
          <ProximosPartidos />
        </div>
      )}

      {/* 🔥 OVERLAY DE TRANSICIÓN */}
      <CuadradosTransition
        active={isTransitioning}
        onMidpoint={handleMidpoint}
      />

      {/* ICONO PAUSA */}
      {isPaused && (
        <div className="fixed bottom-8 right-8 z-50 bg-black/50 p-4 rounded-full">
          ⏸
        </div>
      )}

    </div>
  );
};

export default Pantalla;