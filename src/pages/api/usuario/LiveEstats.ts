
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();

    
    const id_partido = formData.get("id_partido")?.toString().trim() || "";
  
    type JugadorConPuntos = {
        nombre: string;
        total_jugadas: number;
        punto_directo: number;
        punto_remate: number;
        punto_bloqueo: number;
        punto_error: number;
      };
      
      type Jugador = {
          nombre: string;
          _1r_apellido: string;
          punto_directo: string;
          punto_remate: string;
          punto_bloqueo: string;
          punto_error: string;
      };
      
      
      let estado = "";
      
      let nombre_equipo_local = "";
      let nombre_equipo_visitante = "";
      let pista = "";
      let arbitro = "";
      let oficial_1 = "";
      let oficial_2 = "";
      
      let LocGlobal = "";
      let VisGlobal = "";
      let LocSet1 = "";
      let VisSet1 = "";
      let LocSet2 = "";
      let VisSet2 = "";
      let LocSet3 = "";
      let VisSet3 = "";
      
      let jugadoresLocal: Jugador[] = [];
      let id_equipo_local = "";
      let escudo_equipo_local = "";
      let referencia_EL = "";
      
      let jugadoresVisitante: Jugador[] = [];
      let id_equipo_visitante = "";
      let escudo_equipo_visitante = "";
      let referencia_EV = "";
      const { data, error } = await supabaseAdmin
          .from('PartidosSS')
          .select('equipo_local, equipo_visitante, estado, pista, id_partido, LocGlobal, VisGlobal, LocSet1, VisSet1, LocSet2, VisSet2, LocSet3, VisSet3')
          .eq('id_partido', id_partido)
          .single();
      
        if (error) {
          console.error(`Error al buscar partido 1`, error.message);
        } else {
          nombre_equipo_local = data.equipo_local;
          nombre_equipo_visitante = data.equipo_visitante;
          pista = data.pista
          // arbitro = data.arbitro;
          // oficial_1 = data.oficial_1;
          // oficial_2 = data.oficial_2;
          LocGlobal = data.LocGlobal;
          VisGlobal = data.VisGlobal;
          LocSet1 = data.LocSet1;
          VisSet1 = data.VisSet1;
          LocSet2 = data.LocSet2;
          VisSet2 = data.VisSet2;
          LocSet3 = data.LocSet3;
          VisSet3 = data.VisSet3;
          estado = data.estado;
        }
      
        if(estado === "Per Jugar"){
          const { data: EquipoLocale, error: EquipoLocaleError } = await supabaseAdmin
          .from('PartidosSS')
          .update({
              estado: "En Directe"
          })
          .eq('id_partido', id_partido)
          .single();
          
        }
        let { data: EquipoLocale, error: EquipoLocaleError } = await supabaseAdmin
          .from('EquiposSS')
          .select('id, escudo')
          .eq('nombre_equipo', nombre_equipo_local)
          .single();
          if(EquipoLocale){
              id_equipo_local = EquipoLocale.id;
              escudo_equipo_local = EquipoLocale.escudo;
              referencia_EL = EquipoLocale.id;
          }
          
          let { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
          .from('JugadoresSS')
          .select('nombre, _1r_apellido, punto_directo, punto_remate, punto_bloqueo, punto_error')
          .in('ficha', ['jugador'])
          .eq('pertenece_equipo', id_equipo_local)
          .order('id', { ascending: true });
      
      if (JugadoresLocales) {
          // Filtrar jugadores con nombre no nulo o vacío
          JugadoresLocales.forEach(jugador => {
              if (jugador.nombre && jugador.nombre.trim() !== '') {
                  jugadoresLocal.push(jugador);
              }
          });
       
      }
      
      if (JugadoresLocalesError) {
         // console.log(JugadoresLocalesError);
      }
      
      // Buscar entrenador
      let { data: Entrenador, error: EntrenadorError } = await supabaseAdmin
          .from('JugadoresSS')
          .select('nombre, _1r_apellido, punto_directo, punto_remate, punto_bloqueo, punto_error')
          .eq('ficha', 'profesor')
          .eq('pertenece_equipo', id_equipo_local)
          .single(); // Asumiendo que solo hay un entrenador
      
      if (Entrenador) {
          // Verificar si el nombre del entrenador no es nulo o vacío
          if (Entrenador.nombre && Entrenador.nombre.trim() !== '') {
              jugadoresLocal.push(Entrenador);
          }
         // console.log(Entrenador);
      }
      
      if (EntrenadorError) {
          console.log(EntrenadorError);
      }
          
          let { data: EquipoVisitante, error: EquipoVisitanteError } = await supabaseAdmin
          .from('EquiposSS')
          .select('id, escudo')
          .eq('nombre_equipo', nombre_equipo_visitante)
          .single();
          if(EquipoVisitante){
              id_equipo_visitante = EquipoVisitante.id;
              escudo_equipo_visitante = EquipoVisitante.escudo;
              referencia_EV = EquipoVisitante.id;
          }
          
          let { data: JugadoresVisitantes, error: JugadoresVisitantesError } = await supabaseAdmin
          .from('JugadoresSS')
          .select('nombre, _1r_apellido, punto_directo, punto_remate, punto_bloqueo, punto_error')
          .in('ficha', ['jugador']) // Solo buscamos jugadores primero
          .eq('pertenece_equipo', id_equipo_visitante)
          .order('id', { ascending: true });
      
      if (JugadoresVisitantes) {
          // Filtrar jugadores con nombre no nulo o vacío
          JugadoresVisitantes.forEach(jugador => {
              if (jugador.nombre && jugador.nombre.trim() !== '') {
                  jugadoresVisitante.push(jugador);
              }
          });
        
      }
      
      if (JugadoresVisitantesError) {
         // console.log(JugadoresVisitantesError);
      }
      
      // Buscar entrenador
      let { data: EntrenadorVisitante, error: EntrenadorVisitanteError } = await supabaseAdmin
          .from('JugadoresSS')
          .select('nombre, _1r_apellido, punto_directo, punto_remate, punto_bloqueo, punto_error')
          .eq('ficha', 'profesor') // Buscamos al entrenador
          .eq('pertenece_equipo', id_equipo_visitante)
          .single(); // Asumiendo que solo hay un entrenador
      
      if (EntrenadorVisitante) {
          // Verificar si el nombre del entrenador no es nulo o vacío
          if (EntrenadorVisitante.nombre && EntrenadorVisitante.nombre.trim() !== '') {
              jugadoresVisitante.push(EntrenadorVisitante);
          }
         // console.log(EntrenadorVisitante);
      }
      
      let { data: Historial, error: HistorialError } = await supabaseAdmin
          .from('HistorialSS')
          .select('nombre, id_equipo, locPuntos, locSet, orden, tiempo, tipoPunto, visPuntos, visSet')
          //.eq('ficha', 'profesor') // Buscamos al entrenador
          .eq('id_partido', id_partido)
          .order('id', {ascending: false});
      
          if(HistorialError){
              console.log("Error Busqueda historial", HistorialError)
          }
      
          let DirectoLocGlobal = "-";
          let DirectoVisGlobal = "-";
          let DirectoLocSet1 = "-";
          let DirectoVisSet1 = "-";
          let DirectoLocSet2 = "-";
          let DirectoVisSet2 = "-";
          let DirectoLocSet3 = "-";
          let DirectoVisSet3 = "-";
      
          if (estado === "En Directe") {
            // Obtener todas las jugadas FinSet
            const finSets = Historial?.filter(j => j.tipoPunto === "FinSet");
        
            if (finSets && finSets.length > 0) {
                // Ordenarlas por la propiedad 'orden' (asumimos que existe)
                const finSetsOrdenados = finSets.slice().sort((a, b) => a.orden - b.orden);
        
                // Asignar cada FinSet a su set correspondiente
                finSetsOrdenados.forEach((jugada, index) => {
                    const { locSet, visSet, locPuntos, visPuntos } = jugada;
        
                    // Asignar al global los sets jugados (último FinSet)
                    if (index === finSetsOrdenados.length - 1) {
                        DirectoLocGlobal = locSet;
                        DirectoVisGlobal = visSet;
        
                        console.log("Último FinSet encontrado:", jugada);
                        console.log("Actualizando LocSet y VisSet a:", locSet, visSet, locPuntos, visPuntos);
                    }
        
                    // Guardar los puntos por set
                    const totalSets = Number(locSet) + Number(visSet);
                    if (totalSets === 1) {
                        DirectoLocSet1 = locPuntos;
                        DirectoVisSet1 = visPuntos;
                    } else if (totalSets === 2) {
                        DirectoLocSet2 = locPuntos;
                        DirectoVisSet2 = visPuntos;
                    } else if (totalSets === 3) {
                        DirectoLocSet3 = locPuntos;
                        DirectoVisSet3 = visPuntos;
                    }
                });
            } else {
                console.log("No se encontró ningún FinSet en el historial.");
            }
        }
      let jugadoresLocalStats: JugadorConPuntos[] = [];
      let jugadoresVisitanteStats: JugadorConPuntos[] = [];
      
      if (Historial) {
        // === EQUIPO LOCAL ===
        const jugadasLocal = Historial.filter(j => j.id_equipo === "equipo-local");
        const contadorLocal: Record<string, JugadorConPuntos> = {};
      
        for (const jugada of jugadasLocal) {
          const key = jugada.nombre;
          if (!contadorLocal[key]) {
            contadorLocal[key] = {
              nombre: jugada.nombre,
              punto_directo: 0,
              punto_remate: 0,
              punto_bloqueo: 0,
              punto_error: 0,
              total_jugadas: 0
            };
          }
      
          if (jugada.tipoPunto === 'Directo') contadorLocal[key].punto_directo += 1;
          if (jugada.tipoPunto === 'Remate') contadorLocal[key].punto_remate += 1;
          if (jugada.tipoPunto === 'Bloqueo') contadorLocal[key].punto_bloqueo += 1;
          if (jugada.tipoPunto === 'Error') contadorLocal[key].punto_error += 1;
      
          contadorLocal[key].total_jugadas += 1;
        }
      
        jugadoresLocalStats = jugadoresLocal.map(jugador => {
          return contadorLocal[jugador.nombre] ?? {
            nombre: jugador.nombre,
            punto_directo: 0,
            punto_remate: 0,
            punto_bloqueo: 0,
            punto_error: 0,
            total_jugadas: 0
          };
        });
      
        //console.log("Local:", jugadoresLocalStats);
      
        // === EQUIPO VISITANTE ===
        const jugadasVisitante = Historial.filter(j => j.id_equipo === "equipo-visitante");
        const contadorVisitante: Record<string, JugadorConPuntos> = {};
      
        for (const jugada of jugadasVisitante) {
          const key = jugada.nombre;
          if (!contadorVisitante[key]) {
            contadorVisitante[key] = {
              nombre: jugada.nombre,
              punto_directo: 0,
              punto_remate: 0,
              punto_bloqueo: 0,
              punto_error: 0,
              total_jugadas: 0
            };
          }
      
          if (jugada.tipoPunto === 'Directo') contadorVisitante[key].punto_directo += 1;
          if (jugada.tipoPunto === 'Remate') contadorVisitante[key].punto_remate += 1;
          if (jugada.tipoPunto === 'Bloqueo') contadorVisitante[key].punto_bloqueo += 1;
          if (jugada.tipoPunto === 'Error') contadorVisitante[key].punto_error += 1;
      
          contadorVisitante[key].total_jugadas += 1;
        }
      
        jugadoresVisitanteStats = jugadoresVisitante.map(jugador => {
          return contadorVisitante[jugador.nombre] ?? {
            nombre: jugador.nombre,
            punto_directo: 0,
            punto_remate: 0,
            punto_bloqueo: 0,
            punto_error: 0,
            total_jugadas: 0
          };
        });
      
       // console.log("Visitante:", jugadoresVisitanteStats);
      }
    // Generar el HTML dinámicamente
    const partidosHTML = `
  <div class="w-full h-auto flex flex-col ">
    <a href="/clasificacion" class="w-max h-max px-3 py-2 bg-amarillo rounded-full">Tornar a la classificació</a>
    <div class="w-[90%] mx-auto h-auto grid grid-cols-3 place-items-center my-5">
      <p class="text-xl font-bold text-blanco">${id_partido}</p>
      <p class="${estado === "En Directe" ? "text-red-600 flex flex-row gap-x-2 items-center place-content-center" : "text-blanco"}">
        <span class="${estado === "En Directe" ? "redondo" : ""}"></span>${estado}
      </p>
      <p class="text-xl text-blanco">${pista}</p>
    </div>

    <div class="w-full grid grid-cols-2 place-items-center mt-8">
      <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
        <div class="flex items-center place-content-center">
          <p class="text-4xl text-accent font-semibold">${nombre_equipo_local}</p>
        </div>
        <div class="w-max h-max">
          <img src="${escudo_equipo_local}" class="w-16 h-16" />
        </div>
        <input id="resultado_final_local" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoLocGlobal : LocGlobal}" />
      </div>

      <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-4">
        <input id="resultado_final_visitante" class="w-10 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoVisGlobal : VisGlobal}" />
        <div class="w-max h-max">
          <img src="${escudo_equipo_visitante}" class="w-16 h-16" />
        </div>
        <div class="flex items-center place-content-center">
          <p class="text-4xl text-accent font-semibold">${nombre_equipo_visitante}</p>
        </div>
      </div>
    </div>

    <div class="w-full grid grid-cols-2 place-items-center mt-10">
      <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Set 1</p>
          <input id="resultado_set1_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoLocSet1 : LocSet1}" />
        </div>
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Set 2</p>
          <input id="resultado_set2_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoLocSet2 : LocSet2}" />
        </div>
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
          <input id="resultado_set3_local" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoLocSet3 : LocSet3}" />
        </div>
      </div>

      <div class="w-max h-auto grid grid-cols-[max-content_max-content_max-content] grid-rows-1 p-2 gap-x-5">
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Extra Set</p>
          <input id="resultado_set3_visitante" class="w-16 h-auto text -center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoVisSet3 : VisSet3}" />
        </div>
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Set 2</p>
          <input id="resultado_set2_visitante" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoVisSet2 : VisSet2}" />
        </div>
        <div class="w-max flex flex-col items-center place-content-center gap-y-2">
          <p class="text-3xl font-semibold text-amarillo">Set 1</p>
          <input id="resultado_set1_visitante" class="w-16 h-auto text-center text-6xl bg-transparent text-blanco" disabled value="${estado === "En Directe" ? DirectoVisSet1 : VisSet1}" />
        </div>
      </div>
    </div>

    <div class="w-full flex flex-wrap items-center place-content-center gap-2">
      <table class="text-blanco espacio">
        <thead>
          <tr class="text-center">
            <th>Jugador</th>
            <th>Directes</th>
            <th>Remat</th>
            <th>Bloqueig</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          ${jugadoresLocalStats.map((jugador) => `
            <tr>
              <td>${jugador.nombre}</td>
              <td class="text-center">${jugador.punto_directo} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_remate} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_bloqueo} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_error} / ${jugador.total_jugadas}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="w-64 h-64 rounded-md bg-gris overflow-y-scroll no-scrollbar flex flex-col gap-y-2 border-2 border-gris">
        <div id="historial" class="w-full h-auto rounded-md bg-gris flex flex-col gap-y-2 border-2 border-gris">
          ${Historial?.map((jugada) => `
            ${jugada.tipoPunto === "FinSet" ? `
              <div class="w-full h-16 bg-gris-claro text-blanco grid grid-rows-1 border-blanco border-[1px] items-center">
                <div class="flex flex-row items-center justify-center">
                  <div class="flex items-center justify-center h-full">
                    <p class="text-xl font-semibold">Fin Set ${jugada.locSet + jugada.visSet}</p>
                  </div>
                </div>
              </div>
            ` : `
              <div class="w-full h-16 bg-gris-claro text-blanco grid grid-rows-1 border-blanco border-[1px] items-center ${jugada.id_equipo === "equipo-local" ? "grid-cols-[1fr_max-content]" : "grid-cols-[max-content_1fr]" }">
                <div class="${jugada.id_equipo === "equipo-local" ? "" : "col-start-2 row-start-1"}">
                  <div class="flex flex-row items-center ${jugada.id_equipo === "equipo-local" ? "" : "place-content-end"}">
                    <input type="text" id="jugada_nombre_${jugada.orden}" disabled class="text-lg w-24 font-semibold bg-transparent ${jugada.id_equipo === "equipo-local" ? "ml-2" : "text-end mr-6"}" value="${jugada.nombre}" />
                  </div>
                  <div class="flex flex-row items-center px-2 gap-x-1">
                    <input type="text" id="jugada_tipoPunto_${jugada.orden}" class="bg-transparent min-w-14 w-max max-w-16 h-max" value="${jugada.tipoPunto}" disabled />
                    <span>|</span>
                    <input type="text" id="jugada_tiempo_${jugada.orden}" class="bg-transparent w-12 h-max" value="${jugada.tiempo}" disabled />
                  </div>
                </div>
                <div class="flex flex-row items-center place-content-center h-full w-full text-blanco text-4xl font-semibold ${jugada.id_equipo === "equipo-local" ? "" : "col-start-1 row-start-1"}">
                  <input type="text" id="LocPuntos_${jugada.orden}" class="bg-transparent w-10 text-center h-max" value="${jugada.locPuntos}" disabled />
                  <span>-</span>
                  <input type="text" id="VisPuntos_${jugada.orden}" class="bg-transparent w-10 text-center h-max" value="${jugada.visPuntos}" disabled />
                </div>
              </div>
            `}
          `).join('')}
        </div>
      </div>

      <table class="text-blanco espacio">
        <thead>
          <tr class="text-center">
            <th>Jugador</th>
            <th>Directes</th>
            <th>Remat</th>
            <th>Bloqueig</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          ${jugadoresVisitanteStats.map((jugador) => `
            <tr>
              <td>${jugador.nombre}</td>
              <td class="text-center">${jugador.punto_directo} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_remate} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_bloqueo} / ${jugador.total_jugadas}</td>
              <td class="text-center">${jugador.punto_error} / ${jugador.total_jugadas}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
`;
    
      return new Response(
        `
        <div id="ArrayEstats">
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