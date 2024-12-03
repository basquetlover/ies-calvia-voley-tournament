import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  //Octavos Der
  //Partido 13
  const partido13_pista = formData.get("partido13_pista")?.toString().trim() || "";
  const partido13_e1 = formData.get("partido13_e1")?.toString().trim() || "";
  const partido13_e2 = formData.get("partido13_e2")?.toString().trim() || "";
  //Partido 14
  const partido14_pista = formData.get("partido14_pista")?.toString().trim() || "";
  const partido14_e1 = formData.get("partido14_e1")?.toString().trim() || "";
  const partido14_e2 = formData.get("partido14_e2")?.toString().trim() || "";

  //Cuartos Der
  //Partido 17
  const partido17_pista = formData.get("partido17_pista")?.toString().trim() || "";
  const partido17_e1 = formData.get("partido17_e1")?.toString().trim() || "";
  const partido17_e2 = formData.get("partido17_e2")?.toString().trim() || "";


  //Octavos Izq
  //Partido 15
  const partido15_pista = formData.get("partido15_pista")?.toString().trim() || "";
  const partido15_e1 = formData.get("partido15_e1")?.toString().trim() || "";
  const partido15_e2 = formData.get("partido15_e2")?.toString().trim() || "";
  //Partido 16
  const partido16_pista = formData.get("partido16_pista")?.toString().trim() || "";
  const partido16_e1 = formData.get("partido16_e1")?.toString().trim() || "";
  const partido16_e2 = formData.get("partido16_e2")?.toString().trim() || "";

   //Cuartos Izq
  //Partido 18
  const partido18_pista = formData.get("partido18_pista")?.toString().trim() || "";
  const partido18_e1 = formData.get("partido18_e1")?.toString().trim() || "";
  const partido18_e2 = formData.get("partido18_e2")?.toString().trim() || "";

  //Extra consolacion
//Partido 19
  const partido19_pista = formData.get("partido19_pista")?.toString().trim() || "";
  const partido19_e1 = formData.get("partido19_e1")?.toString().trim() || "";
  const partido19_e2 = formData.get("partido19_e2")?.toString().trim() || "";
//Partido 20
    const partido20_pista = formData.get("partido20_pista")?.toString().trim() || "";
    const partido20_e1 = formData.get("partido20_e1")?.toString().trim() || "";
    const partido20_e2 = formData.get("partido20_e2")?.toString().trim() || "";
//Partido 21
  const partido21_pista = formData.get("partido21_pista")?.toString().trim() || "";
  const partido21_e1 = formData.get("partido21_e1")?.toString().trim() || "";
  const partido21_e2 = formData.get("partido21_e2")?.toString().trim() || "";
//Partido 22
    const partido22_pista = formData.get("partido22_pista")?.toString().trim() || "";
    const partido22_e1 = formData.get("partido22_e1")?.toString().trim() || "";
    const partido22_e2 = formData.get("partido22_e2")?.toString().trim() || "";
  
  
  
  //P13
  const { data: rp13, error: ep13 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido13_pista,
     equipo_a: partido13_e1,
     equipo_b: partido13_e2,
  }
  )
  .eq('numero_partido', 'partido_13')
  .select()

  //P14
  const { data: rp14, error: ep14 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido14_pista,
     equipo_a: partido14_e1,
     equipo_b: partido14_e2,
  }
  )
  .eq('numero_partido', 'partido_14')
  .select()

  //P15
  const { data: rp15, error: ep15 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido15_pista,
     equipo_a: partido15_e1,
     equipo_b: partido15_e2,
  }
  )
  .eq('numero_partido', 'partido_15')
  .select()

   //P16
   const { data: rp16, error: ep16 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido16_pista,
      equipo_a: partido16_e1,
      equipo_b: partido16_e2,
   }
   )
   .eq('numero_partido', 'partido_16')
   .select()

   //P17
   const { data: rp17, error: ep17 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido17_pista,
      equipo_a: partido17_e1,
      equipo_b: partido17_e2,
   }
   )
   .eq('numero_partido', 'partido_17')
   .select()

   //P18
   const { data: rp18, error: ep18 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido18_pista,
      equipo_a: partido18_e1,
      equipo_b: partido18_e2,
   }
   )
   .eq('numero_partido', 'partido_18')
   .select()

   //P19
   const { data: rp19, error: ep19 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido19_pista,
      equipo_a: partido19_e1,
      equipo_b: partido19_e2,
   }
   )
   .eq('numero_partido', 'partido_19')
   .select()

   //P20
   const { data: rp20, error: ep20 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido20_pista,
      equipo_a: partido20_e1,
      equipo_b: partido20_e2,
   }
   )
   .eq('numero_partido', 'partido_20')
   .select()

   //P21
   const { data: rp21, error: ep21 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido21_pista,
      equipo_a: partido21_e1,
      equipo_b: partido21_e2,
   }
   )
   .eq('numero_partido', 'partido_21')
   .select()

   //P22
   const { data: rp22, error: ep22 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido22_pista,
      equipo_a: partido22_e1,
      equipo_b: partido22_e2,
   }
   )
   .eq('numero_partido', 'partido_22')
   .select()

  

  console.log("Equipo actualizado correctamente");
  return redirect("/admin/configurar-bracket");
};



