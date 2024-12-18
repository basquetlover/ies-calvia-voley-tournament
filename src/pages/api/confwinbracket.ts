import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  //Octavos Der
  //Partido 1
  const partido1_pista = formData.get("partido1_pista")?.toString().trim() || "";
  const partido1_e1 = formData.get("partido1_e1")?.toString().trim() || "";
  const partido1_e2 = formData.get("partido1_e2")?.toString().trim() || "";
  //Partido 2
  const partido2_pista = formData.get("partido2_pista")?.toString().trim() || "";
  const partido2_e1 = formData.get("partido2_e1")?.toString().trim() || "";
  const partido2_e2 = formData.get("partido2_e2")?.toString().trim() || "";
  //Partido 3
  const partido3_pista = formData.get("partido3_pista")?.toString().trim() || "";
  const partido3_e1 = formData.get("partido3_e1")?.toString().trim() || "";
  const partido3_e2 = formData.get("partido3_e2")?.toString().trim() || "";
  //Partido 4
  const partido4_pista = formData.get("partido4_pista")?.toString().trim() || "";
  const partido4_e1 = formData.get("partido4_e1")?.toString().trim() || "";
  const partido4_e2 = formData.get("partido4_e2")?.toString().trim() || "";
  //Cuartos Der
  //Partido 9
  const partido9_pista = formData.get("partido9_pista")?.toString().trim() || "";
  const partido9_e1 = formData.get("partido9_e1")?.toString().trim() || "";
  const partido9_e2 = formData.get("partido9_e2")?.toString().trim() || "";
  //Partido 10
  const partido10_pista = formData.get("partido10_pista")?.toString().trim() || "";
  const partido10_e1 = formData.get("partido10_e1")?.toString().trim() || "";
  const partido10_e2 = formData.get("partido10_e2")?.toString().trim() || "";

  //Octavos Izq
  //Partido 5
  const partido5_pista = formData.get("partido5_pista")?.toString().trim() || "";
  const partido5_e1 = formData.get("partido5_e1")?.toString().trim() || "";
  const partido5_e2 = formData.get("partido5_e2")?.toString().trim() || "";
  //Partido 6
  const partido6_pista = formData.get("partido6_pista")?.toString().trim() || "";
  const partido6_e1 = formData.get("partido6_e1")?.toString().trim() || "";
  const partido6_e2 = formData.get("partido6_e2")?.toString().trim() || "";
  //Partido 7
  const partido7_pista = formData.get("partido7_pista")?.toString().trim() || "";
  const partido7_e1 = formData.get("partido7_e1")?.toString().trim() || "";
  const partido7_e2 = formData.get("partido7_e2")?.toString().trim() || "";
  //Partido 8
  const partido8_pista = formData.get("partido8_pista")?.toString().trim() || "";
  const partido8_e1 = formData.get("partido8_e1")?.toString().trim() || "";
  const partido8_e2 = formData.get("partido8_e2")?.toString().trim() || "";
   //Cuartos Izq
  //Partido 11
  const partido11_pista = formData.get("partido11_pista")?.toString().trim() || "";
  const partido11_e1 = formData.get("partido11_e1")?.toString().trim() || "";
  const partido11_e2 = formData.get("partido11_e2")?.toString().trim() || "";
  //Partido 12
  const partido12_pista = formData.get("partido12_pista")?.toString().trim() || "";
  const partido12_e1 = formData.get("partido12_e1")?.toString().trim() || "";
  const partido12_e2 = formData.get("partido12_e2")?.toString().trim() || "";

  //Semi 1
  const semi1_pista = formData.get("semi1_pista")?.toString().trim() || "";
  const semi1_e1 = formData.get("semi1_e1")?.toString().trim() || "";
  const semi1_e2 = formData.get("semi1_e2")?.toString().trim() || "";
   //Semi 2
   const semi2_pista = formData.get("semi2_pista")?.toString().trim() || "";
   const semi2_e1 = formData.get("semi2_e1")?.toString().trim() || "";
   const semi2_e2 = formData.get("semi2_e2")?.toString().trim() || "";

   //Final
   const final_pista = formData.get("final_pista")?.toString().trim() || "";
   const final_e1 = formData.get("final_e1")?.toString().trim() || "";
   const final_e2 = formData.get("final_e2")?.toString().trim() || "";

  //console.log("Datos recibidos",partido1_e1, partido1_e2, partido1_pista, partido2_e1, partido2_e1, partido2_e2, partido2_pista);
  
  //P1
  const { data: rp1, error: ep1 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido1_pista,
     equipo_a: partido1_e1,
     equipo_b: partido1_e2,
  }
  )
  .eq('numero_partido', 'partido_1')
  .select()

  //P2
  const { data: rp2, error: ep2 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido2_pista,
     equipo_a: partido2_e1,
     equipo_b: partido2_e2,
  }
  )
  .eq('numero_partido', 'partido_2')
  .select()

  //P3
  const { data: rp3, error: ep3 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     pista: partido3_pista,
     equipo_a: partido3_e1,
     equipo_b: partido3_e2,
  }
  )
  .eq('numero_partido', 'partido_3')
  .select()

   //P4
   const { data: rp4, error: ep4 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido4_pista,
      equipo_a: partido4_e1,
      equipo_b: partido4_e2,
   }
   )
   .eq('numero_partido', 'partido_4')
   .select()

   //P5
   const { data: rp5, error: ep5 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido5_pista,
      equipo_a: partido5_e1,
      equipo_b: partido5_e2,
   }
   )
   .eq('numero_partido', 'partido_5')
   .select()

   //P6
   const { data: rp6, error: ep6 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido6_pista,
      equipo_a: partido6_e1,
      equipo_b: partido6_e2,
   }
   )
   .eq('numero_partido', 'partido_6')
   .select()

   //P7
   const { data: rp7, error: ep7 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido7_pista,
      equipo_a: partido7_e1,
      equipo_b: partido7_e2,
   }
   )
   .eq('numero_partido', 'partido_7')
   .select()

   //P8
   const { data: rp8, error: ep8 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido8_pista,
      equipo_a: partido8_e1,
      equipo_b: partido8_e2,
   }
   )
   .eq('numero_partido', 'partido_8')
   .select()

   //P9
   const { data: rp9, error: ep9 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido9_pista,
      equipo_a: partido9_e1,
      equipo_b: partido9_e2,
   }
   )
   .eq('numero_partido', 'partido_9')
   .select()

   //P10
   const { data: rp10, error: ep10 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido10_pista,
      equipo_a: partido10_e1,
      equipo_b: partido10_e2,
   }
   )
   .eq('numero_partido', 'partido_10')
   .select()

   //P11
   const { data: rp11, error: ep11 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido11_pista,
      equipo_a: partido11_e1,
      equipo_b: partido11_e2,
   }
   )
   .eq('numero_partido', 'partido_11')
   .select()

   //P12
   const { data: rp12, error: ep12 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: partido12_pista,
      equipo_a: partido12_e1,
      equipo_b: partido12_e2,
   }
   )
   .eq('numero_partido', 'partido_12')
   .select()

   //S1
   const { data: rs1, error: es1 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: semi1_pista,
      equipo_a: semi1_e1,
      equipo_b: semi1_e2,
   }
   )
   .eq('numero_partido', 'semi_1')
   .select()

   //S2
   const { data: rs2, error: es2 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: semi2_pista,
      equipo_a: semi2_e1,
      equipo_b: semi2_e2,
   }
   )
   .eq('numero_partido', 'semi_2')
   .select()

   //Final
   const { data: rfi, error: efi } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      pista: final_pista,
      equipo_a: final_e1,
      equipo_b: final_e2,
   }
   )
   .eq('numero_partido', 'final')
   .select()
  

  console.log("Equipo actualizado correctamente");
  return redirect("/admin/configurar-bracket");
};



