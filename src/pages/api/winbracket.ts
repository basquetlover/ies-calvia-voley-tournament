import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  //Octavos Der
  //Partido 1
   const partido1_ra = formData.get("partido1_ra")?.toString().trim() || "";
  const partido1_rb = formData.get("partido1_rb")?.toString().trim() || "";
  //Partido 2
   const partido2_ra = formData.get("partido2_ra")?.toString().trim() || "";
  const partido2_rb = formData.get("partido2_rb")?.toString().trim() || "";
  //Partido 3
   const partido3_ra = formData.get("partido3_ra")?.toString().trim() || "";
  const partido3_rb = formData.get("partido3_rb")?.toString().trim() || "";
  //Partido 4
   const partido4_ra = formData.get("partido4_ra")?.toString().trim() || "";
  const partido4_rb = formData.get("partido4_rb")?.toString().trim() || "";
  //Cuartos Der
  //Partido 9
   const partido9_ra = formData.get("partido9_ra")?.toString().trim() || "";
  const partido9_rb = formData.get("partido9_rb")?.toString().trim() || "";
  //Partido 10
  const partido10_ra = formData.get("partido10_ra")?.toString().trim() || "";
  const partido10_rb = formData.get("partido10_rb")?.toString().trim() || "";

  //Octavos Izq
  //Partido 5
   const partido5_ra = formData.get("partido5_ra")?.toString().trim() || "";
  const partido5_rb = formData.get("partido5_rb")?.toString().trim() || "";
  //Partido 6
   const partido6_ra = formData.get("partido6_ra")?.toString().trim() || "";
  const partido6_rb = formData.get("partido6_rb")?.toString().trim() || "";
  //Partido 7
   const partido7_ra = formData.get("partido7_ra")?.toString().trim() || "";
  const partido7_rb = formData.get("partido7_rb")?.toString().trim() || "";
  //Partido 8
   const partido8_ra = formData.get("partido8_ra")?.toString().trim() || "";
  const partido8_rb = formData.get("partido8_rb")?.toString().trim() || "";
   //Cuartos Izq
  //Partido 11
  const partido11_ra = formData.get("partido11_ra")?.toString().trim() || "";
  const partido11_rb = formData.get("partido11_rb")?.toString().trim() || "";
  //Partido 12
  const partido12_ra = formData.get("partido12_ra")?.toString().trim() || "";
  const partido12_rb = formData.get("partido12_rb")?.toString().trim() || "";

  //Semi 1
  const semi1_ra = formData.get("semi1_ra")?.toString().trim() || "";
  const semi1_rb = formData.get("semi1_rb")?.toString().trim() || "";
   //Semi 2
   const semi2_ra = formData.get("semi2_ra")?.toString().trim() || "";
   const semi2_rb = formData.get("semi2_rb")?.toString().trim() || "";

   //Final
   const final_ra = formData.get("final_ra")?.toString().trim() || "";
   const final_rb = formData.get("final_rb")?.toString().trim() || "";

  
  //P1
  const { data: rp1, error: ep1 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido1_ra,
     resultado_b: partido1_rb,
  }
  )
  .eq('numero_partido', 'partido_1')
  .select()

  //P2
  const { data: rp2, error: ep2 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido2_ra,
     resultado_b: partido2_rb,
  }
  )
  .eq('numero_partido', 'partido_2')
  .select()

  //P3
  const { data: rp3, error: ep3 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido3_ra,
     resultado_b: partido3_rb,
  }
  )
  .eq('numero_partido', 'partido_3')
  .select()

   //P4
   const { data: rp4, error: ep4 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido4_ra,
      resultado_b: partido4_rb,
   }
   )
   .eq('numero_partido', 'partido_4')
   .select()

   //P5
   const { data: rp5, error: ep5 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido5_ra,
      resultado_b: partido5_rb,
   }
   )
   .eq('numero_partido', 'partido_5')
   .select()

   //P6
   const { data: rp6, error: ep6 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido6_ra,
      resultado_b: partido6_rb,
   }
   )
   .eq('numero_partido', 'partido_6')
   .select()

   //P7
   const { data: rp7, error: ep7 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido7_ra,
      resultado_b: partido7_rb,
   }
   )
   .eq('numero_partido', 'partido_7')
   .select()

   //P8
   const { data: rp8, error: ep8 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido8_ra,
      resultado_b: partido8_rb,
   }
   )
   .eq('numero_partido', 'partido_8')
   .select()

   //P9
   const { data: rp9, error: ep9 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido9_ra,
      resultado_b: partido9_rb,
   }
   )
   .eq('numero_partido', 'partido_9')
   .select()

   //P10
   const { data: rp10, error: ep10 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: partido10_ra,
      resultado_b: partido10_rb,
   }
   )
   .eq('numero_partido', 'partido_10')
   .select()

   //P11
   const { data: rp11, error: ep11 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: partido11_ra,
      resultado_b: partido11_rb,
   }
   )
   .eq('numero_partido', 'partido_11')
   .select()

   //P12
   const { data: rp12, error: ep12 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: partido12_ra,
      resultado_b: partido12_rb,
   }
   )
   .eq('numero_partido', 'partido_12')
   .select()

   //S1
   const { data: rs1, error: es1 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: semi1_ra,
      resultado_b: semi1_rb,
   }
   )
   .eq('numero_partido', 'semi_1')
   .select()

   //S2
   const { data: rs2, error: es2 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: semi2_ra,
      resultado_b: semi2_rb,
   }
   )
   .eq('numero_partido', 'semi_2')
   .select()

   //final
   const { data: rfinal, error: es2 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({

      resultado_a: final_ra,
      resultado_b: final_rb,
   }
   )
   .eq('numero_partido', 'final')
   .select()
  

  console.log("Resultado actualizado correctamente");
  return redirect("/admin/resultados");
};


