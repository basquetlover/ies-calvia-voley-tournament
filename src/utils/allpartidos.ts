import { supabaseAdmin } from "src/lib/supabase";

let pista_p1 = 'Sin Pista';
let partido1_e1 = "";
let partido1_e1_e = "";
let partido1_e2 = "";
let partido1_e2_e = "";
let partido1_ra = "-";
let partido1_rb = "-";
let estado_p1 = "Por Jugar";

let pista_p2 = 'Sin Pista';
let partido2_e1 = "";
let partido2_e1_e = "";
let partido2_e2 = "";
let partido2_e2_e = "";
let partido2_ra = "-";
let partido2_rb = "-";
let estado_p2 = "Por Jugar";

let pista_p3 = 'Sin Pista';
let partido3_e1 = "";
let partido3_e1_e = "";
let partido3_e2 = "";
let partido3_e2_e = "";
let partido3_ra = "-";
let partido3_rb = "-";
let estado_p3 = "Por Jugar";

let pista_p4 = 'Sin Pista';
let partido4_e1 = "";
let partido4_e1_e = "";
let partido4_e2 = "";
let partido4_e2_e = "";
let partido4_ra = "-";
let partido4_rb = "-";
let estado_p4 = "Por Jugar";

let pista_p5 = 'Sin Pista';
let partido5_e1 = "";
let partido5_e1_e = "";
let partido5_e2 = "";
let partido5_e2_e = "";
let partido5_ra = "-";
let partido5_rb = "-";
let estado_p5 = "Por Jugar";

let pista_p6 = 'Sin Pista';
let partido6_e1 = "";
let partido6_e1_e = "";
let partido6_e2 = "";
let partido6_e2_e = "";
let partido6_ra = "-";
let partido6_rb = "-";
let estado_p6 = "Por Jugar";

let pista_p7 = 'Sin Pista';
let partido7_e1 = "";
let partido7_e1_e = "";
let partido7_e2 = "";
let partido7_e2_e = "";
let partido7_ra = "-";
let partido7_rb = "-";
let estado_p7 = "Por Jugar";

let pista_p8 = 'Sin Pista';
let partido8_e1 = "";
let partido8_e1_e = "";
let partido8_e2 = "";
let partido8_e2_e = "";
let partido8_ra = "-";
let partido8_rb = "-";
let estado_p8 = "Por Jugar";

try {
  // Buscar el rango correspondiente al email en la tabla Administradores
  const { data: partido1, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_1')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido1) {
    pista_p1 = partido1.pista;
    partido1_e1 = partido1.equipo_a;
    if (partido1_e1){
        const { data: escudo_e1_p1, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido1_e1)
        .single();

        if (escudo_e1_p1){
            partido1_e1_e = escudo_e1_p1.escudo;
        }
    }
    partido1_e2 = partido1.equipo_b;
    if (partido1_e2){
        const { data: escud_e2_p1, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido1_e2)
        .single();

        if (escud_e2_p1){
            partido1_e2_e = escud_e2_p1.escudo;
        }
    }
    partido1_ra = partido1.resultado_a;
    partido1_rb = partido1.resultado_b;
    estado_p1 = partido1.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}

try {
 //P2
  const { data: partido2, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_2')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido2) {
    pista_p2 = partido2.pista;
    partido2_e1 = partido2.equipo_a;
    if (partido2_e1){
        const { data: escudo_e1_p2, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido2_e1)
        .single();

        if (escudo_e1_p2){
            partido2_e1_e = escudo_e1_p2.escudo;
        }
    }
    partido2_e2 = partido2.equipo_b;
    if (partido2_e2){
        const { data: escud_e2_p2, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido2_e2)
        .single();

        if (escud_e2_p2){
            partido2_e2_e = escud_e2_p2.escudo;
        }
    }
    partido2_ra = partido2.resultado_a;
    partido2_rb = partido2.resultado_b;
    estado_p2 = partido2.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}

try {
 //P3
  const { data: partido3, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_3')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido3) {
    pista_p3 = partido3.pista;
    partido3_e1 = partido3.equipo_a;
    if (partido3_e1){
        const { data: escudo_e1_p3, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido3_e1)
        .single();

        if (escudo_e1_p3){
            partido3_e1_e = escudo_e1_p3.escudo;
        }
    }
    partido3_e2 = partido3.equipo_b;
    if (partido3_e2){
        const { data: escud_e2_p3, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido3_e2)
        .single();

        if (escud_e2_p3){
            partido3_e2_e = escud_e2_p3.escudo;
        }
    }
    partido3_ra = partido3.resultado_a;
    partido3_rb = partido3.resultado_b;
    estado_p3 = partido3.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}

try {
 //P4
  const { data: partido4, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_4')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido4) {
    pista_p4 = partido4.pista;
    partido4_e1 = partido4.equipo_a;
    if (partido4_e1){
        const { data: escudo_e1_p4, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido4_e1)
        .single();

        if (escudo_e1_p4){
            partido4_e1_e = escudo_e1_p4.escudo;
        }
    }
    partido4_e2 = partido4.equipo_b;
    if (partido4_e2){
        const { data: escud_e2_p4, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido4_e2)
        .single();

        if (escud_e2_p4){
            partido4_e2_e = escud_e2_p4.escudo;
        }
    }
    partido4_ra = partido4.resultado_a;
    partido4_rb = partido4.resultado_b;
    estado_p4 = partido4.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}
//P5
try {
 
  const { data: partido5, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_5')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido5) {
    pista_p5 = partido5.pista;
    partido5_e1 = partido5.equipo_a;
    if (partido5_e1){
        const { data: escudo_e1_p5, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido5_e1)
        .single();

        if (escudo_e1_p5){
            partido5_e1_e = escudo_e1_p5.escudo;
        }
    }
    partido5_e2 = partido5.equipo_b;
    if (partido5_e2){
        const { data: escud_e2_p5, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido5_e2)
        .single();

        if (escud_e2_p5){
            partido5_e2_e = escud_e2_p5.escudo;
        }
        if(error){
            partido5_e2_e = "https://aimtsdmsojunxazbxfue.supabase.co/storage/v1/object/public/EquiposIMG/escudos/las-campeonas.png";
        }
    }
    partido5_ra = partido5.resultado_a;
    partido5_rb = partido5.resultado_b;
    estado_p5 = partido5.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}
 //P6
try {

  const { data: partido6, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_6')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido6) {
    pista_p6 = partido6.pista;
    partido6_e1 = partido6.equipo_a;
    if (partido6_e1){
        const { data: escudo_e1_p6, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido6_e1)
        .single();

        if (escudo_e1_p6){
            partido6_e1_e = escudo_e1_p6.escudo;
        }
    }
    partido6_e2 = partido6.equipo_b;
    if (partido6_e2){
        const { data: escud_e2_p6, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido6_e2)
        .single();

        if (escud_e2_p6){
            partido6_e2_e = escud_e2_p6.escudo;
        }
    }
    partido6_ra = partido6.resultado_a;
    partido6_rb = partido6.resultado_b;
    estado_p6 = partido6.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}
//P7
try {
 
  const { data: partido7, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_7')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido7) {
    pista_p7 = partido7.pista;
    partido7_e1 = partido7.equipo_a;
    if (partido7_e1){
        const { data: escudo_e1_p7, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido7_e1)
        .single();

        if (escudo_e1_p7){
            partido7_e1_e = escudo_e1_p7.escudo;
        }
    }
    partido7_e2 = partido7.equipo_b;
    if (partido7_e2){
        const { data: escud_e2_p7, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido7_e2)
        .single();

        if (escud_e2_p7){
            partido7_e2_e = escud_e2_p7.escudo;
        }
    }
    partido7_ra = partido7.resultado_a;
    partido7_rb = partido7.resultado_b;
    estado_p7 = partido7.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}
//P8
try {
 
  const { data: partido8, error } = await supabaseAdmin
    .from('ResultadoNavidad')
    .select('pista, equipo_a, equipo_b, resultado_a, resultado_b, estado')
    .eq('numero_partido', 'partido_8')
    .single();

  if (error) {
    console.error(`Error al buscar partido 1`, error.message);
  } else if (partido8) {
    pista_p8 = partido8.pista;
    partido8_e1 = partido8.equipo_a;
    if (partido8_e1){
        const { data: escudo_e1_p8, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido8_e1)
        .single();

        if (escudo_e1_p8){
            partido8_e1_e = escudo_e1_p8.escudo;
        }
    }
    partido8_e2 = partido8.equipo_b;
    if (partido8_e2){
        const { data: escud_e2_p8, error } = await supabaseAdmin
        .from('Equipos')
        .select('escudo')
        .eq('nombre_equipo', partido8_e2)
        .single();

        if (escud_e2_p8){
            partido8_e2_e = escud_e2_p8.escudo;
        }
    }
    partido8_ra = partido8.resultado_a;
    partido8_rb = partido8.resultado_b;
    estado_p8 = partido8.estado;
  }

} catch (err) {
  console.error('Error al obtener rango:', err);
}
