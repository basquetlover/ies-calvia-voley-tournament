import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  //Octavos Der
  //Partido 13
  const partido13_ra = formData.get("partido13_ra")?.toString().trim() || "";
  const partido13_rb = formData.get("partido13_rb")?.toString().trim() || "";
  //Partido 14
  const partido14_ra = formData.get("partido14_ra")?.toString().trim() || "";
  const partido14_rb = formData.get("partido14_rb")?.toString().trim() || "";

  //Cuartos Der
  //Partido 17
  const partido17_ra = formData.get("partido17_ra")?.toString().trim() || "";
  const partido17_rb = formData.get("partido17_rb")?.toString().trim() || "";


  //Octavos Izq
  //Partido 15
  const partido15_ra = formData.get("partido15_ra")?.toString().trim() || "";
  const partido15_rb = formData.get("partido15_rb")?.toString().trim() || "";
  //Partido 16
  const partido16_ra = formData.get("partido16_ra")?.toString().trim() || "";
  const partido16_rb = formData.get("partido16_rb")?.toString().trim() || "";

   //Cuartos Izq
  //Partido 18
  const partido18_ra = formData.get("partido18_ra")?.toString().trim() || "";
  const partido18_rb = formData.get("partido18_rb")?.toString().trim() || "";

  //Extra consolacion
//Partido 19
  const partido19_ra = formData.get("partido19_ra")?.toString().trim() || "";
  const partido19_rb = formData.get("partido19_rb")?.toString().trim() || "";
//Partido 20
    const partido20_ra = formData.get("partido20_ra")?.toString().trim() || "";
    const partido20_rb = formData.get("partido20_rb")?.toString().trim() || "";
//Partido 21
  const partido21_ra = formData.get("partido21_ra")?.toString().trim() || "";
  const partido21_rb = formData.get("partido21_rb")?.toString().trim() || "";
//Partido 22
    const partido22_ra = formData.get("partido22_ra")?.toString().trim() || "";
    const partido22_rb = formData.get("partido22_rb")?.toString().trim() || "";
  
  
  
  //P13
  const { data: rp13, error: ep13 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido13_ra,
     resultado_b: partido13_rb,
  }
  )
  .eq('numero_partido', 'partido_13')
  .select()

  //P14
  const { data: rp14, error: ep14 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido14_ra,
     resultado_b: partido14_rb,
  }
  )
  .eq('numero_partido', 'partido_14')
  .select()

  //P15
  const { data: rp15, error: ep15 } = await supabaseAdmin
  .from('ResultadoNavidad')
  .update({
     resultado_a: partido15_ra,
     resultado_b: partido15_rb,
  }
  )
  .eq('numero_partido', 'partido_15')
  .select()

   //P16
   const { data: rp16, error: ep16 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido16_ra,
      resultado_b: partido16_rb,
   }
   )
   .eq('numero_partido', 'partido_16')
   .select()

   //P17
   const { data: rp17, error: ep17 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido17_ra,
      resultado_b: partido17_rb,
   }
   )
   .eq('numero_partido', 'partido_17')
   .select()

   //P18
   const { data: rp18, error: ep18 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido18_ra,
      resultado_b: partido18_rb,
   }
   )
   .eq('numero_partido', 'partido_18')
   .select()

   //P19
   const { data: rp19, error: ep19 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido19_ra,
      resultado_b: partido19_rb,
   }
   )
   .eq('numero_partido', 'partido_19')
   .select()

   //P20
   const { data: rp20, error: ep20 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido20_ra,
      resultado_b: partido20_rb,
   }
   )
   .eq('numero_partido', 'partido_20')
   .select()

   //P21
   const { data: rp21, error: ep21 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido21_ra,
      resultado_b: partido21_rb,
   }
   )
   .eq('numero_partido', 'partido_21')
   .select()

   //P22
   const { data: rp22, error: ep22 } = await supabaseAdmin
   .from('ResultadoNavidad')
   .update({
      resultado_a: partido22_ra,
      resultado_b: partido22_rb,
   }
   )
   .eq('numero_partido', 'partido_22')
   .select()

  

  console.log("Resultado actualizado correctamente");
  return redirect("/admin/resultados");
};



