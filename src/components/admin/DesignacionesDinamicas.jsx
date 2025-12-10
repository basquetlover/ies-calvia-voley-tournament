import React, { useEffect, useState } from "react";


export default function BracketAutoRefresh() {
 const [partidos, setPartidos] = useState([]);


  useEffect(() => {
    let intervalo;

    async function cargarPartidos() {
      try {
        const res = await fetch('/api/admin/CargarDesignaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setPartidos(data);
        //console.log("Partidos designados cargados:", data);
      } catch (err) {
        console.error("Error cargando partidos:", err);
      }
    }

    // Cargar al inicio
    cargarPartidos();

    // Actualizar cada 5 segundos
    intervalo = setInterval(cargarPartidos, 5000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);

 // if (!partidos.length) return null;

  const partidos_designados = partidos[0] || [];
const escudosMap = partidos[1] || {};

  return (

    <div className="flex flex-col gap-2">

      {partidos_designados.map((partido) => (
        <div key={partido.id_partido} className="bg-amarillo h-auto w-[400px] rounded-lg">

          {/* Pista y ID */}
          <div className="text-gris w-full flex flex-row items-center place-content-around">
            <p>{partido.pista}</p>
            <p>{partido.id_partido}</p>
          </div>

          {/* Separador */}
          <div className="w-[95%] h-[2px] mx-auto my-1 rounded-full bg-accent" />

          {/* Equipos */}
          <div className="text-center grid grid-cols-[60px_1fr_30px_1fr_60px] items-center px-2 py-1 gap-2">

            {/* Escudo Local */}
            <div>
              {escudosMap[partido.equipo_local]?.trim() ? (
                <img
                  src={escudosMap[partido.equipo_local]}
                  className="w-14 h-14"
                  alt={partido.equipo_local}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 650 650">
                  <circle cx="325" cy="325" r="315" stroke="#313131" strokeWidth="20" />
                  <rect width="450" height="20" x="100" y="315" fill="#313131" rx="10" />
                </svg>
              )}
            </div>

            <p>{partido.equipo_local}</p>
            <p>VS</p>
            <p>{partido.equipo_visitante}</p>

            {/* Escudo Visitante */}
            <div>
              {escudosMap[partido.equipo_visitante]?.trim() ? (
                <img
                  src={escudosMap[partido.equipo_visitante]}
                  className="w-14 h-14"
                  alt={partido.equipo_visitante}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 650 650">
                  <circle cx="325" cy="325" r="315" stroke="#313131" strokeWidth="20" />
                  <rect width="450" height="20" x="100" y="315" fill="#313131" rx="10" />
                </svg>
              )}
            </div>

          </div>

          {/* Botones */}
          <div className="w-full h-auto flex flex-row items-center place-content-around">

            {/* Enlace lista equipos */}
            <a
              href={`/admin/partido/${partido.id_partido}`}
              className="w-max h-max px-2 py-2 rounded-md bg-azul-suave text-blanco mb-1"
            >
              Lista Equipos
            </a>

            {/* Acta Digital */}
            {partido.estado !== "Finalitzat" ? (
              <a
                href={`/admin/acta-digital/app?partidoID="${partido.id_partido}"`}
                className="w-max h-max px-2 py-2 rounded-md bg-azul-suave text-blanco mb-1"
              >
                Acta Digital
              </a>
            ) : (
              <div
                id={partido.id_partido}
                className={`w-max h-max px-2 py-2 rounded-md text-blanco mb-1 ${
                  partido.estado === "Finalitzat"
                    ? "bg-gray-500 cursor-pointer"
                    : "bg-azul-suave"
                }`}
              >
                Acta Digital
              </div>
            )}
          </div>

        </div>
      ))}

    </div>
  );
}
