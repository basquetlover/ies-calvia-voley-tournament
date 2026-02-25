import { useEffect, useState, useMemo } from "react";

const COLUMNAS = Math.floor(1920 / 60); // 24
const FILAS = Math.floor(1080 / 60);   // 13

const COLORES = [
  "bg-azul",
  "bg-azul-suave",
  "bg-accent",
  "bg-amarillo",
];


export default function CuadradosTransition({ active, onMidpoint }) {
  const [faseSalida, setFaseSalida] = useState(false);
  const [entradaKey, setEntradaKey] = useState(0);

  const totalCuadrados = FILAS * COLUMNAS;
    function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORES.length);
  return COLORES[randomIndex];
}
function getRandomDelay() {
  return Math.random() * 50; // máximo 500ms
}

  const orden = useMemo(() => {
    // efecto diagonal
    const arr = [];
    for (let fila = 0; fila < FILAS; fila++) {
      for (let col = 0; col < COLUMNAS; col++) {
        arr.push({
          index: fila * COLUMNAS + col,
          color: getRandomColor(),
          delay: getRandomDelay() + (fila + col) * 50, // retraso basado en la posición para efecto diagona
        });
      }
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!active) return;

    setFaseSalida(false);
    setEntradaKey((k) => k + 1); // Fuerza reinicio de animación de entrada

    const tiempoMitad = 2500;

    const midpoint = setTimeout(() => {
      onMidpoint?.(); // 🔥 aquí cambia la pantalla
      setFaseSalida(true);
    }, tiempoMitad);

    return () => clearTimeout(midpoint);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="absolute inset-0 z-[9999] grid pointer-events-none"
      style={{
        width: `${COLUMNAS * 60}px`,
        height: `${FILAS * 60}px`,
        gridTemplateColumns: `repeat(${COLUMNAS}, 60px)`,
        gridTemplateRows: `repeat(${FILAS}, 60px)`
      }}
    >
      {orden.map(({ index, delay, color }) => {
        //const color = COLORES[index % COLORES.length];

        return (
          <div
            key={entradaKey + '-' + index}
            className={`${color} ${faseSalida ? "animate-cuadrado-out" : "animate-cuadrado-in"}`}
            style={{
              width: '60px',
              height: '60px',
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}