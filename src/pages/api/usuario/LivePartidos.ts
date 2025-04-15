
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  interface Equipo {
    nombre_equipo: string;
    escudo: string;
  }
  
  interface Partido {
    equipo_local: string;
    equipo_visitante: string;
    estado: string;
    pista: string;
    id_partido: string;
    LocGlobal: string;
    VisGlobal: string;
    LocSet1: string;
    VisSet1: string;
    LocSet2: string;
    VisSet2: string;
    LocSet3: string;
    VisSet3: string;
  }
  
  let pista1: Partido[] = [];
  let escudosMapPista1: Record<string, string> = {}; // Mapa para guardar escudos por nombre de equipo
  
  try {
    // Obtener partidos de la pista 1
    const { data, error } = await supabaseAdmin
      .from('PartidosSS')
      .select('equipo_local, equipo_visitante, estado, pista, id_partido, LocGlobal, VisGlobal, LocSet1, VisSet1, LocSet2, VisSet2, LocSet3, VisSet3')
      //.in('estado', ['Per Jugar', 'Finalitzat'])
      .neq('id_partido', 'partido_prueba')
      .order('id', {ascending: true});
  
    if (error) {
      console.error(`Error al buscar partido 1`, error.message);
    } else {
      pista1 = data || []; // Asignar data a pista1
    }
  
    // Obtener todos los nombres de los equipos
    const equiposNombres = [...new Set(pista1.flatMap(partido => [partido.equipo_local, partido.equipo_visitante]))];
  
    // Obtener escudos de los equipos
    const { data: equipos, error: errorEquipos } = await supabaseAdmin
      .from('EquiposSS')
      .select('nombre_equipo, escudo')
      .in('nombre_equipo', equiposNombres);
  
    if (errorEquipos) {
      console.error(`Error al buscar escudos de equipos`, errorEquipos.message);
    } else {
      // Crear un mapa de escudos
      escudosMapPista1 = equipos.reduce((acc: Record<string, string>, equipo: Equipo) => {
        acc[equipo.nombre_equipo] = equipo.escudo;
        return acc;
      }, {});
    }
  } catch (err) {
    console.error('Error al obtener rango:', err);
  }
  

    // Generar el HTML dinámicamente
    const partidosHTML = pista1.map(partido => `
      <div class="max-w-[500px] w-full flex flex-col items-center place-content-center border-2 border-blanco rounded-md p-2 ${partido.estado === "En Directe" ? "border-rojo-claro" : ""}">
          <div class="w-full h-auto grid grid-cols-3 place-items-center text-base text-blanco">
              <p>${partido.id_partido}</p>
              <p class="${partido.estado === "En Directe" ? "text-red-600 flex flex-row gap-x-2 items-center place-content-center" : ""}">
                  <span class="${partido.estado === "En Directe" ? "redondo" : ""}"></span>
                  ${partido.estado}
              </p>
              <p>${partido.pista}</p>
          </div>
          <div class="w-full text-center grid grid-cols-[max-content_1fr_max-content_30px_max-content_1fr_max-content] items-center px-2 py-1 gap-2 text-blanco"> 
              <div>
                  ${escudosMapPista1[partido.equipo_local] && escudosMapPista1[partido.equipo_local].trim() !== "" ?  
                      `<img src="${escudosMapPista1[partido.equipo_local]}" class="w-10 h-10" alt="${partido.equipo_local}" />` : 
                      `<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 650 650">
                          <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                          <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                      </svg>`
                  }
              </div>
              <p>${partido.equipo_local}</p>
              <p class="text-2xl font-semibold">${partido.LocGlobal}</p>
              <p>VS</p>
              <p class="text-2xl font-semibold">${partido.VisGlobal}</p>
              <p>${partido.equipo_visitante}</p>
              <div>
                  ${escudosMapPista1[partido.equipo_visitante] && escudosMapPista1[partido.equipo_visitante].trim() !== "" ?  
                      `<img src="${escudosMapPista1[partido.equipo_visitante]}" class="w-10 h-10" alt="${partido.equipo_visitante}" />` : 
                      `<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 650 650">
                          <circle cx="325" cy="325" r="315" stroke="#fff" stroke-width="20"/>
                          <rect width="450" height="20" x="100" y="315" fill="#fff" rx="10"/>
                      </svg>`
                  }
              </div>
          </div>
          <div class="w-full grid grid-cols-2 place-items-center gap-x-1">
              <div class="w-full grid grid-cols-3 place-items-center">
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Set 1</p>
                      <p class="text-blanco">${partido.LocSet1}</p>
                  </div>
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Set 2</p>
                      <p class="text-blanco">${partido.LocSet2}</p>
                  </div>
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Extra Set</p>
                      <p class="text-blanco">${partido.LocSet3}</p>
                  </div>
              </div>
              <div class="w-full grid grid-cols-3 place-items-center">
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Extra Set</p>
                      <p class="text-blanco">${partido.VisSet3}</p>
                  </div>
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Set 2</p>
                      <p class="text-blanco">${partido.VisSet2}</p>
                  </div>
                  <div class="flex flex-col items-center place-content-center">
                      <p class="text-blanco font-medium">Set 1</p>
                      <p class="text-blanco">${partido.VisSet1}</p>
                  </div>
              </div>
          </div>
          <div class="flex items-center place-content-center">
              <a class="text-blanco" href="/partidosSS/${partido.id_partido}">Estadística</a>

          </div>
      </div>
  `).join('');
    
      return new Response(
        `
        <div id="ArrayPartidos" class="flex flex-col items-center gap-y-4 p-1">
          ${partidosHTML}
        </div>
        `, 
        { status: 200, headers: { "Content-Type": "text/html" } }
      );



return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
}