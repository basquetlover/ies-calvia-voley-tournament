import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";
const { data: ConfTorneo, error } = await supabaseAdmin
  .from('Configuracion')
  .select('id_torneo, nombre')
  .eq('estado', 'Actual')
  .single();

  let TablaPartidos = `Partidos${ConfTorneo?.id_torneo}`;
  let TablaEquipos = `Equipos${ConfTorneo?.id_torneo}`;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const designaciones1 = [];
    let index = 0; // Comienza en 0 para que coincida con el índice del frontend
    while (formData.has(`p1_id_${index}`)) {
        const arbitro = formData.get(`p1_arbitro_${index}`);
        const oficial_mesa = formData.get(`p1_oficial_${index}`);
        const oficial_mesa_2 = formData.get(`p1_oficial_2_${index}`)?.toString().trim();
        const id_partido = formData.get(`p1_id_${index}`); // Asegúrate de que el arbitro coincida

        
            designaciones1.push({ arbitro, oficial_mesa_2, id_partido, oficial_mesa });
        
        index++;
    }

    const designaciones2 = [];
    index = 0; // Comienza en 0 para que coincida con el índice del frontend
    while (formData.has(`p2_id_${index}`)) {
        const arbitro = formData.get(`p2_arbitro_${index}`);
        const oficial_mesa = formData.get(`p2_oficial_${index}`);
        const oficial_mesa_2 = formData.get(`p2_oficial_2_${index}`)?.toString().trim();
        const id_partido = formData.get(`p2_id_${index}`); // Asegúrate de que el arbitro coincida

        
            designaciones2.push({ arbitro, oficial_mesa_2, id_partido, oficial_mesa });
        
        index++;
    }

    const designaciones3 = [];
    index = 0; // Comienza en 0 para que coincida con el índice del frontend
    while (formData.has(`p_central_id_${index}`)) {
        const arbitro = formData.get(`p_central_arbitro_${index}`);
        const oficial_mesa = formData.get(`p_central_oficial_${index}`);
        const oficial_mesa_2 = formData.get(`p_central_oficial_2_${index}`)?.toString().trim();
        const id_partido = formData.get(`p_central_id_${index}`); // Asegúrate de que el arbitro coincida

        
            designaciones3.push({ arbitro, oficial_mesa_2, id_partido, oficial_mesa });
        
        index++;
    }

    //console.log(designaciones2)

    for (const partido of designaciones1) {
        const { error: partidoError } = await supabaseAdmin
          .from(TablaPartidos)
          .update([
            { 
                arbitro: partido.arbitro, 
                oficial_1: partido.oficial_mesa,
                oficial_2: partido.oficial_mesa_2,
              },
          ])
          .eq("id", partido.id_partido )
          .select()
    
        if (partidoError) {
          console.error("Error insertando partido principal:", partidoError.message);
          // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
        }
      }

    for (const partido of designaciones2) {
        const { error: partidoError } = await supabaseAdmin
          .from(TablaPartidos)
          .update([
            { 
                arbitro: partido.arbitro, 
                oficial_1: partido.oficial_mesa,
                oficial_2: partido.oficial_mesa_2,
              },
          ])
          .eq("id", partido.id_partido )
          .select()
    
        if (partidoError) {
          console.error("Error insertando partido principal:", partidoError.message);
          // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
        }
      }

      for (const partido of designaciones3) {
        const { error: partidoError } = await supabaseAdmin
          .from(TablaPartidos)
          .update([
            { 
                arbitro: partido.arbitro, 
                oficial_1: partido.oficial_mesa,
                oficial_2: partido.oficial_mesa_2,
              },
          ])
          .eq("id", partido.id_partido )
          .select()
    
        if (partidoError) {
          console.log("Error insertando partido principal:", partidoError.message);
          // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
        }
      }
    
  console.log("Equipo actualizado correctamente");
  return redirect("/admin/gestion-designaciones");
};
