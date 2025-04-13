import { useEffect, useState } from 'react';
import { supabase } from "src/lib/supabase";

interface Equipo {
  nombre_equipo: string;
  escudo: string;
}

interface Partido {
  equipo_local: string;
  equipo_visitante: string;
  estado: string;
}

export default function PartidosSS() {
  const [pista1, setPista1] = useState<Partido[]>([]);
  const [escudosMap, setEscudosMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('PartidosSS')
          .select('equipo_local, equipo_visitante, estado')
          .in('estado', ['Per Jugar', 'Finalitzat'])
          .order('id', { ascending: true });
        console.log(data)
        if (error) throw error;
        setPista1(data || []);

        const equiposNombres = [...new Set(data.flatMap(partido => [partido.equipo_local, partido.equipo_visitante]))];

        const { data: equipos, error: errorEquipos } = await supabase
          .from('EquiposSS')
          .select('nombre_equipo, escudo')
          .in('nombre_equipo', equiposNombres);

        if (errorEquipos) throw errorEquipos;

        const escudos = equipos.reduce((acc: Record<string, string>, equipo: Equipo) => {
          acc[equipo.nombre_equipo] = equipo.escudo;
          return acc;
        }, {});

        setEscudosMap(escudos);
      } catch (err) {
        console.error('Error al obtener datos de partidos o escudos:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // cada 20 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-4xl w-auto mx-auto h-auto flex flex-col items-center gap-y-4 mt-5">
      {pista1.map((partido) => (
        <li key={`${partido.equipo_local}-${partido.equipo_visitante}`} className="bg-amarillo max-w-[500px] w-full text-center grid grid-cols-[60px_1fr_30px_1fr_60px] items-center px-2 py-1 gap-2 rounded-lg"> 
          <div>
            {escudosMap[partido.equipo_local]?.trim() ? (
              <img src={escudosMap[partido.equipo_local]} className="w-14 h-14" alt={partido.equipo_local} />
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
          <div>
            {escudosMap[partido.equipo_visitante]?.trim() ? (
              <img src={escudosMap[partido.equipo_visitante]} className="w-14 h-14" alt={partido.equipo_visitante} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 650 650">
                <circle cx="325" cy="325" r="315" stroke="#313131" strokeWidth="20" />
                <rect width="450" height="20" x="100" y="315" fill="#313131" rx="10" />
              </svg>
            )}
          </div>
        </li>
      ))}
    </section>
  );
}
