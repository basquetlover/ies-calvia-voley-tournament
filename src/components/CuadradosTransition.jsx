import { useEffect, useState, useMemo } from "react";

const FILAS = 12;
const COLUMNAS = 20;

const COLORES = [
  "bg-azul",
  "bg-azul-suave",
  "bg-accent",
  "bg-amarillo",
];

export default function CuadradosTransition({ active, onMidpoint }) {
  const [faseSalida, setFaseSalida] = useState(false);

  const totalCuadrados = FILAS * COLUMNAS;

  const orden = useMemo(() => {
    // efecto diagonal
    const arr = [];
    for (let fila = 0; fila < FILAS; fila++) {
      for (let col = 0; col < COLUMNAS; col++) {
        arr.push({
          index: fila * COLUMNAS + col,
          delay: (fila + col) * 40,
        });
      }
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!active) return;

    setFaseSalida(false);

    const tiempoMitad = 900;

    const midpoint = setTimeout(() => {
      onMidpoint?.(); // 🔥 aquí cambia la pantalla
      setFaseSalida(true);
    }, tiempoMitad);

    return () => clearTimeout(midpoint);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-[9999] grid grid-cols-20 grid-rows-12 pointer-events-none">
      {orden.map(({ index, delay }) => {
        const color = COLORES[index % COLORES.length];

        return (
          <div
            key={index}
            className={`${color} ${
              faseSalida ? "animate-cuadrado-out" : "animate-cuadrado-in"
            }`}
            style={{
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}