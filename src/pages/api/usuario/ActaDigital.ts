//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';
import { jugadores } from '@sections/administracion/CrearEquipo.astro';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const FormAction = formData.get("FormAction")?.toString().trim() || "";
  const id_partido = formData.get("id_partido")?.toString().trim() || "";

  if(FormAction === "GuardarJugada"){
    const nombre_jugador = formData.get("nombre-jugador")?.toString().trim() || "";
    const id_equipo = formData.get("id-equipo")?.toString().trim() || "";
    const tipo_punto = formData.get("tipo-punto")?.toString().trim() || "";
    const tiempo = formData.get("tiempo")?.toString().trim() || "";
    const orden = formData.get("orden")?.toString().trim() || "";
    

    const FormLocPuntos = formData.get("FormLocPuntos")?.toString().trim() || "";
    const FormLocSet = formData.get("FormLocSet")?.toString().trim() || "";
    const FormVisPuntos = formData.get("FormVisPuntos")?.toString().trim() || "";
    const FormVisSet = formData.get("FormVisSet")?.toString().trim() || "";

    const referencia_equipo_local = formData.get("referencia_equipo_local")?.toString().trim() || "";
    const referencia_equipo_visitante = formData.get("referencia_equipo_visitante")?.toString().trim() || "";

    console.log("Datos recibidos en api", nombre_jugador, id_equipo, tipo_punto, tiempo, orden, id_partido, FormAction, FormLocPuntos, FormLocSet, FormVisPuntos, FormVisSet);

    if(id_equipo === "equipo-local"){
        const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
        .from('JugadoresSS')
        .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
        .eq('nombre', nombre_jugador)
        .eq('pertenece_equipo', referencia_equipo_local)
        .single();
    
        if(JugadoresLocales){
            let bloqueos = Number(JugadoresLocales.punto_bloqueo);
            let remates = Number(JugadoresLocales.punto_remate);
            let directos = Number(JugadoresLocales.punto_directo);
            let errores = Number(JugadoresLocales.punto_error);
            let id = JugadoresLocales.id
    
            if(tipo_punto === "Directo"){
                directos++
            }
            if(tipo_punto === "Remate"){
                remates++
            }
            if(tipo_punto === "Bloqueo"){
                bloqueos++
            }
            if(tipo_punto === "Error"){
                errores++
            }
    
            const { data, error } = await supabaseAdmin
            .from('JugadoresSS')
            .update({ 
                punto_bloqueo: bloqueos,
                punto_remate: remates,
                punto_directo: directos,
                punto_error: errores
             })
            .eq('id', id)
            .select()
    
        }
    }
    if(id_equipo === "equipo-visitante"){
        const { data: JugadoresLocales, error: JugadoresLocalesError } = await supabaseAdmin
        .from('JugadoresSS')
        .select('id, punto_error, punto_bloqueo, punto_directo, punto_remate')
        .eq('nombre', nombre_jugador)
        .eq('pertenece_equipo', referencia_equipo_visitante)
        .single();
    
        if(JugadoresLocales){
            let bloqueos = Number(JugadoresLocales.punto_bloqueo);
            let remates = Number(JugadoresLocales.punto_remate);
            let directos = Number(JugadoresLocales.punto_directo);
            let errores = Number(JugadoresLocales.punto_error);
            let id = JugadoresLocales.id
    
            if(tipo_punto === "Directo"){
                directos++
            }
            if(tipo_punto === "Remate"){
                remates++
            }
            if(tipo_punto === "Bloqueo"){
                bloqueos++
            }
            if(tipo_punto === "Error"){
                errores++
            }
    
            const { data, error } = await supabaseAdmin
            .from('JugadoresSS')
            .update({ 
                punto_bloqueo: bloqueos,
                punto_remate: remates,
                punto_directo: directos,
                punto_error: errores
             })
            .eq('id', id)
            .select()
    
        }
    }
    

    const { data: GuardarHistorial, error: ErrorGuardarHistorial } = await supabaseAdmin
    .from('HistorialSS')
    .insert([
    { id_partido: id_partido, 
      id_equipo: id_equipo,
      locPuntos: FormLocPuntos,
      locSet: FormLocSet,
      nombre: nombre_jugador,
      orden: orden,
      tiempo: tiempo,
      tipoPunto: tipo_punto,
      visPuntos: FormVisPuntos,
      visSet: FormVisSet
    },
    ])
    .select()

    if(ErrorGuardarHistorial){
        console.log("Error insertando datos", ErrorGuardarHistorial)
    }
  }

  if(FormAction === "EliminarJugada"){
    const modificar_reference = formData.get("modificar_reference")?.toString().trim() || "";
    console.log("Eliminando jugada", modificar_reference)

    const { data: EliminarJugada, error: ErrorEliminarJugada } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .select()

    console.log(EliminarJugada)
    const ordenMayor: any[] = EliminarJugada?.filter(jugada => jugada.orden > modificar_reference) || [];

    console.log("Jugadas con orden mayor:", ordenMayor);

    const jugadaAEliminar = EliminarJugada?.find(jugada => jugada.orden === modificar_reference);

// Verificar si la jugada a eliminar no es de tipo "Error" y es del equipo local
  if (jugadaAEliminar && jugadaAEliminar.id_equipo === 'equipo-local') {
    if(jugadaAEliminar.tipoPunto !== "Error"){
        // Restar 1 a locPuntos de todas las jugadas de orden mayor
        for (const jugada of ordenMayor) {
          // Actualizar locPuntos
          jugada.locPuntos -= 1;

          // Aquí puedes hacer la actualización en la base de datos si es necesario
          const { error: updateError } = await supabaseAdmin
              .from('HistorialSS')
              .update({ locPuntos: jugada.locPuntos })
              .eq('id_partido', jugada.id_partido)
              .eq('orden', jugada.orden);

          if (updateError) {
              console.error("Error actualizando locPuntos:", updateError);
          }
      }
    } else{
      for (const jugada of ordenMayor) {
        // Actualizar locPuntos
        jugada.visPuntos -= 1;

        // Aquí puedes hacer la actualización en la base de datos si es necesario
        const { error: updateError } = await supabaseAdmin
            .from('HistorialSS')
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.error("Error actualizando locPuntos:", updateError);
        }
    }
    }
      
      console.log(jugadaAEliminar, jugadaAEliminar.tipoPunto, jugadaAEliminar.id_equipo)
  } else{
    if(jugadaAEliminar.tipoPunto !== "Error"){
      // Restar 1 a locPuntos de todas las jugadas de orden mayor
      for (const jugada of ordenMayor) {
        // Actualizar locPuntos
        jugada.visPuntos -= 1;

        // Aquí puedes hacer la actualización en la base de datos si es necesario
        const { error: updateError } = await supabaseAdmin
            .from('HistorialSS')
            .update({ visPuntos: jugada.visPuntos })
            .eq('id_partido', jugada.id_partido)
            .eq('orden', jugada.orden);

        if (updateError) {
            console.error("Error actualizando locPuntos:", updateError);
        }
    }
  } else{
    for (const jugada of ordenMayor) {
      // Actualizar locPuntos
      jugada.locPuntos -= 1;

      // Aquí puedes hacer la actualización en la base de datos si es necesario
      const { error: updateError } = await supabaseAdmin
          .from('HistorialSS')
          .update({ locPuntos: jugada.locPuntos })
          .eq('id_partido', jugada.id_partido)
          .eq('orden', jugada.orden);

      if (updateError) {
          console.error("Error actualizando locPuntos:", updateError);
      }
  }
  }
    
    console.log(jugadaAEliminar, jugadaAEliminar.tipoPunto, jugadaAEliminar.id_equipo)
  }

  if(jugadaAEliminar.tipoPunto === "FinSet"){
    // Buscar la jugada anterior en la base de datos
    const { data: jugadaAnterior, error: ErrorJugadaAnterior } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .lt('orden', modificar_reference) // Buscar jugadas con orden menor
    .order('orden', { ascending: false }) // Ordenar de mayor a menor para obtener la más reciente
    .limit(1) // Limitar a 1 resultado
    .single(); // Obtener un solo resultado

if (ErrorJugadaAnterior) {
    console.error("Error buscando la jugada anterior:", ErrorJugadaAnterior);
} else if (jugadaAnterior) {
    // Eliminar la jugada anterior
    const { error: deleteError } = await supabaseAdmin
        .from('HistorialSS')
        .delete()
        .eq('id_partido', id_partido)
        .eq('orden', jugadaAnterior.orden);

    if (deleteError) {
        console.error("Error eliminando la jugada anterior:", deleteError);
    }
}

  }

    const { error } = await supabaseAdmin
    .from('HistorialSS')
    .delete()
    .eq('id_partido', id_partido)
    .eq('orden', modificar_reference)


    
  }
  
  if(FormAction === "ModificarJugada"){
    const modificar_reference = formData.get("modificar_reference")?.toString().trim() || "";
    console.log("Eliminando jugada", modificar_reference)

    const nombre_jugador = formData.get("nombre-jugador")?.toString().trim() || "";
    const id_equipo = formData.get("id-equipo")?.toString().trim() || "";
    const tipo_punto = formData.get("tipo-punto")?.toString().trim() || "";

    const { data: EliminarJugada, error: ErrorEliminarJugada } = await supabaseAdmin
    .from('HistorialSS')
    .select('*')
    .eq('id_partido', id_partido)
    .select()

    console.log(EliminarJugada)
    const ordenMayor: any[] = EliminarJugada?.filter(jugada => jugada.orden > modificar_reference) || [];

    console.log("Jugadas con orden mayor:", ordenMayor);

    const jugadaAEliminar = EliminarJugada?.find(jugada => jugada.orden === modificar_reference);

    
    let locPuntos = Number(jugadaAEliminar.locPuntos);
    let visPuntos = Number(jugadaAEliminar.visPuntos);
    let ModLoc = "No";
    let ModVis = "No";
    console.log(nombre_jugador, id_equipo, tipo_punto, visPuntos, locPuntos, jugadaAEliminar.id_equipo)
    if (jugadaAEliminar.id_equipo === id_equipo) {
      console.log("Ejecutando 5")
      if (tipo_punto === "Error" && jugadaAEliminar.tipoPunto !== "Error") {
          //if (jugadaAEliminar.tipoPunto !== tipo_punto) {
              if (id_equipo === "equipo-local") {
                console.log("Ejecutando 1")
                visPuntos = visPuntos + 1;
                if(locPuntos > 0){
                locPuntos = locPuntos - 1;
                }
                ModVis = "Si";
              } else {
                console.log("Ejecutando 2")
                if(visPuntos > 0){
                visPuntos = visPuntos - 1;
                }
                locPuntos = locPuntos + 1;
                ModLoc = "Si";
              }
          //}
      } else {
          if (jugadaAEliminar.tipoPunto === "Error") {
              if (id_equipo === "equipo-local") {
                console.log("Ejecutando 3")
                if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
                  }
                  ModLoc = "Si";
                locPuntos = locPuntos + 1;
                 
              } else {
                console.log("Ejecutando 4")
                visPuntos = visPuntos + 1;
                if(locPuntos > 0){
                  locPuntos = locPuntos - 1;
                  }
                  ModVis = "Si";
              }
          }
      }
  } else{
    if(id_equipo === "equipo-local"){
      if (tipo_punto === "Error") {
          if (jugadaAEliminar.tipoPunto !== tipo_punto) {
  
           } else {
              if(locPuntos > 0){                
                locPuntos = locPuntos - 1;
              }
              ModVis = "Si";
              visPuntos = visPuntos + 1;
      }
      } else {
          
                  locPuntos = locPuntos + 1;
                  if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
              }
              ModLoc = "Si";
                 
          
      }
  
  } else{
      if (tipo_punto === "Error") {
          if (jugadaAEliminar.tipoPunto !== tipo_punto) {
              
          }else {
              
              locPuntos = locPuntos + 1;
              if(visPuntos > 0){
                  visPuntos = visPuntos - 1;
              }
              ModLoc = "Si";
              
      }
      } else {
          
                  if(locPuntos > 0){
                  locPuntos = locPuntos - 1;
              }
              ModVis = "Si";
                  visPuntos = visPuntos + 1;
          
      }
  
  }
  }
   console.log(nombre_jugador, id_equipo, tipo_punto, visPuntos, locPuntos, jugadaAEliminar.id_equipo)
  
      const { error } = await supabaseAdmin
      .from('HistorialSS')
      .update({
        nombre: nombre_jugador,
        id_equipo: id_equipo,
        tipoPunto: tipo_punto,
        locPuntos: locPuntos,
        visPuntos: visPuntos,
      })
      .eq('id_partido', id_partido)
      .eq('orden', modificar_reference);
      console.log(locPuntos, visPuntos)
      console.log("Jugada modificada")


        for (const jugada of ordenMayor) {
          // Actualizar locPuntos
             console.log(jugada.locPuntos, jugada.visPuntos, jugada.orden)
          if(ModVis === "Si"){
            jugada.visPuntos = Number(jugada.visPuntos) + 1;
            if(Number(jugada.locPuntos) > 0){
                jugada.locPuntos = Number(jugada.locPuntos) - 1;
            }
            
        }
        if(ModLoc === "Si"){
            if(Number(jugada.visPuntos)){
                jugada.visPuntos = Number(jugada.visPuntos) - 1;
            }
            
            jugada.locPuntos = Number(jugada.locPuntos) + 1;
        }
        console.log(jugada.locPuntos, jugada.visPuntos, jugada.orden)
          //Aquí puedes hacer la actualización en la base de datos si es necesario
          const { error: updateError } = await supabaseAdmin
              .from('HistorialSS')
              .update({ 
                locPuntos: jugada.locPuntos,
                visPuntos: jugada.visPuntos
               })
              .eq('id_partido', jugada.id_partido)
              .eq('orden', jugada.orden);

          if (updateError) {
              console.error("Error actualizando locPuntos:", updateError);
          }
      }


  }

  if(FormAction === "CrearInforme"){
    const tipo_informe = formData.get("tipo_informe") ;
    const contenido_informe = formData.get("contenido_informe") ;
    const tipo_informe_suspender = formData.get("tipo_informe_suspender") ;
    const contenido_informe_sustipo_informe_suspender = formData.get("contenido_informe_sustipo_informe_suspender") ;
    const culpable_informe = formData.get("culpable_informe");


      const { data, error } = await supabaseAdmin
      .from('Informes')
      .insert([
        { tipo_informe: tipo_informe, 
          equipo_culpable: culpable_informe,
          id_partido: id_partido,
          contenido: contenido_informe

        },
      ])
      .select()
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const emailBody =`
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="es">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta name="format-detection" content="telephone=no">
  <title>Nuevo mensaje 4</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]--><!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
  <style type="text/css">.rollover:hover .rollover-first {
  max-height:0px!important;
  display:none!important;
}
.rollover:hover .rollover-second {
  max-height:none!important;
  display:block!important;
}
.rollover span {
  font-size:0px;
}
u + .body img ~ div div {
  display:none;
}
#outlook a {
  padding:0;
}
span.MsoHyperlink,
span.MsoHyperlinkFollowed {
  color:inherit;
  mso-style-priority:99;
}
a.es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
}
a[x-apple-data-detectors],
#MessageViewBody a {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
}
.b {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
}
@media only screen and (max-width:600px) {     }
@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
 </head>
 <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#F6F6F6"><!--[if gte mso 9]>
 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
   <v:fill type="tile"  color="#efefef" ></v:fill>
 </v:background>
<![endif]-->
   <table width="100%" cellpadding="0" cellspacing="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table align="center" cellpadding="0" cellspacing="0" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" role="none">
             <tr>
              <td bgcolor="#1B1D20" align="left" style="padding:10px;Margin:0;background-color:#1B1D20">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                   <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/webappmanifest192x192.png" width="84" alt="" class="img-6730" height="84" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
                      <td align="left" class="es-text-3268" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:40px;font-style:normal;font-weight:normal;line-height:48px;color:#FFC700"><strong class="es-override-size es-text-mobile-size-18" style="font-size:22px">IES Calvià Voley Tournament</strong></h1></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" style="padding:20px;Margin:0">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" width="100%" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:32px;font-style:normal;font-weight:normal;line-height:38.4px;color:#1666FF"><b>NUEVO INFORME CREADO ${id_partido}</b></h2></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;font-size:0">
                       <table height="100%" width="10%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td style="padding:0;Margin:0;border-bottom:3px solid #FFC700;background:none;height:0px;width:100%;margin:0px"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#31cb4b" cellpadding="0" cellspacing="0" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#31cb4b;width:600px" role="none">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" align="center" bgcolor="#2cb543" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2cb543;width:600px" role="none">
             <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
               <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:20px"></td><td style="width:290px" valign="top"><![endif]-->
               <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" align="center" bgcolor="#ffffff" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" align="center" bgcolor="#ffffff" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td bgcolor="#2cb543" align="left" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:300px" valign="top"><![endif]-->
               <table cellspacing="0" align="left" cellpadding="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                 </tr>
               </table><!--[if mso]></td><td style="width:0px"></td><td style="width:300px" valign="top"><![endif]-->
               <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
           </table></td>
         </tr>
       </table>
       <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
             <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
               <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                 <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:57px">
                       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Tipo:</h4></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:81px">
                       <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" class="es-text-9857" style="Margin:0;padding-top:4px;padding-right:8px;padding-bottom:4px;padding-left:8px"><p class="es-text-mobile-size-18" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#ffc700;font-size:18px"><strong>${tipo_informe}</strong></p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                   <table cellspacing="0" align="right" cellpadding="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:402px">
                       <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:180px" valign="top"><![endif]-->
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:180px">
                   <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Equipo culpable:</h4></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td><td style="width:380px" valign="top"><![endif]-->
               <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:380px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" class="es-text-2569" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#FFFFFF;font-size:14px"><span class="es-text-mobile-size-18" style="font-size:18px">${culpable_informe}</span></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
             <tr>
              <td align="left" class="es-m-p10t" style="padding:20px;Margin:0">
               <table cellspacing="0" width="100%" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">${contenido_informe}</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" bgcolor="#0E347D" style="Margin:0;padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;background-color:#0E347D">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:580px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Aquest és un correu generat automàticament, per la qual cosa no podem respondre els missatges enviats a aquesta adreça. Si necessiteu ajuda o teniu algun dubte, si us plau, poseu-vos en contacte amb nosaltres a través del correu voley_tournament@iescalvia.com.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
               <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:463px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0"><h3 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:28px;font-style:normal;font-weight:normal;line-height:33.6px;color:#333333"><strong style="color:#1666ff">Organitzat per</strong></h3></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:463px">
                   <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0;width:560px">
                       <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" style="padding:0;Margin:0;font-size:0"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/organizadores.png" width="250" height="100" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table cellspacing="0" align="center" cellpadding="0" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
             <tr>
              <td bgcolor="#1B1D20" align="left" style="padding:20px;Margin:0;background-color:#1B1D20">
               <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><img width="560" alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_246.png" class="adapt-img" height="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" bgcolor="#0E347D" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;background-color:#0E347D">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff">Heu rebut aquest correu perquè heu realitzat la preinscripció al torneig des de la nostra web</span> <a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px"><strong>iescalvia-voley.com</strong></a> <span style="color:#ffffff">utilitzant el compte de correu</span> <strong style="color:#FFC700"><a style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px" href="">ejemplo@gmail.com</a></strong>.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff"> Per a més informació sobre com tractem les vostres dades, podeu consultar el nostre</span> <a target="_blank" href="https://iescalvia-voley.com/aviso-legal" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Avís Legal</a> i <a href="https://iescalvia-voley.com/cookies" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Política de Cookies</a>.&nbsp;</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table>
  </div>
 </body>
</html>
      `;
const usuario_email = "voley_tournament@iescalvia.com"
      try {
        const { data, error } = await resend.emails.send({
            from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
            to: [usuario_email], // Asegúrate de que esta variable tenga el valor correcto
            subject: `Nou Informe ${id_partido}`,
            html: emailBody,
        });
    
        if (error) {
            throw new Error(error.message); // Lanza un error si hay un problema
        }
    
        console.log("Correo enviado correctamente", data);
        let asunto = `Nou Informe ${id_partido}  | Versió Inscriptor`
        const { data: Emails, error: EmailsError } = await supabaseAdmin
        .from('Emails')
        .insert([
            { destinatario: usuario_email, asunto: asunto, contenido: emailBody, id_resend: data?.id },
        ])
        .select()
        } catch (error) {
        console.error("Error al enviar el correo:", error);
        }
  }

  if(FormAction === "CerrarPartido"){
        let resultado_final_local = formData.get('resultado_final_local') ?.toString().trim() || "0";
        let resultado_final_visitante = formData.get('resultado_final_visitante') ?.toString().trim() || "0";
    
        const resultado_set1_local = formData.get('resultado_set1_local') ?.toString().trim() || "-";
        const resultado_set2_local = formData.get('resultado_set2_local') ?.toString().trim() || "-";
        const resultado_set3_local = formData.get('resultado_set3_local') ?.toString().trim() || "-";
        const resultado_set1_visitante = formData.get('resultado_set1_visitante') ?.toString().trim() || "-";
        const resultado_set2_visitante = formData.get('resultado_set2_visitante') ?.toString().trim() || "-";
        const resultado_set3_visitante = formData.get('resultado_set3_visitante') ?.toString().trim() || "-";

        resultado_final_local = "2";
        resultado_final_visitante = "1";
        let id_equipoG = "";
        let id_equipoP = "";
        if(Number(resultado_final_local) > Number(resultado_final_visitante)){
          const { data: EquipoLocal, error: EEquipoLocal } = await supabaseAdmin
        .from('PartidosSS') // Nombre de la tabla
        .select('equipo_local, equipo_visitante') // Selecciona todas las columnas
        .eq('id_partido', id_partido)
        .single(); // Filtra por equipo_local.
        if(EquipoLocal){
          id_equipoG = EquipoLocal.equipo_local;
          id_equipoP = EquipoLocal.equipo_visitante;
        } 

        } else{
          const { data: EquipoLocal, error: EEquipoLocal } = await supabaseAdmin
        .from('PartidosSS') // Nombre de la tabla
        .select('equipo_local, equipo_visitante') // Selecciona todas las columnas
        .eq('id_partido', id_partido)
        .single(); // Filtra por equipo_local.
        if(EquipoLocal){
          id_equipoG = EquipoLocal.equipo_visitante;
          id_equipoP = EquipoLocal.equipo_local;
        } 
        }

        console.log(id_equipoG, id_equipoP)
       

        const id_equipo = 'partido_2'; // Cambia esto al ID que necesites
        
        // Función para extraer el número del ID
        function extractPartidoNumber(id: string) {
            // Usamos una expresión regular para capturar el número
            const match = id.match(/partido_(\d+)/);
            return match ? match[1] : null; // Retorna el número o null si no hay coincidencia
        }
        
        // Extraer el número
        const numero_partido = extractPartidoNumber(id_equipo);
        // const numero_partido = 1;
        console.log(`El número extraído de ${id_partido} es: ${numero_partido}`);

        const equipoGanadorBuscado = `Guanyador P${numero_partido}`;

        let GanadorProximoPartido = "";
        const { data: GanadorLocal, error: EGanadorLocal } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_local', equipoGanadorBuscado)
        .single(); 

        if (EGanadorLocal) {
            //console.log('Error al buscar el partido:', EGanadorLocal);
        } else {
            console.log('Partidos encontrados:', GanadorLocal.id_partido);
            GanadorProximoPartido = GanadorLocal.id_partido;
            const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_local: id_equipoG })
            .eq('id_partido', GanadorProximoPartido)
            .select()
        }

        const { data: GanadorVisitante, error: EGanadorVisitante } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_visitante', equipoGanadorBuscado)
        .single(); 

        if (EGanadorVisitante) {
          //  console.error('Error al buscar el partido:', EGanadorVisitante);
        } else {
            console.log('Partidos encontrados:', GanadorVisitante.id_partido);
            // GanadorProximoPartido = GanadorVisitante.id_partido;
             const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_visitante: id_equipoG })
            .eq('id_partido', GanadorProximoPartido)
            .select()
        }

        const equipoPerdedorBuscado = `Perdedor P${numero_partido}`;
        
        let PerdedorProximoPartido = "";
        const { data: PerdedorLocal, error: EPerdedorLocal } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_local', equipoPerdedorBuscado)
        .single(); 

        if (EPerdedorLocal) {
            //console.log('Error al buscar el partido:', EPerdedorLocal);
        } else {
            console.log('Partidos encontrados:', PerdedorLocal.id_partido);
            PerdedorProximoPartido = PerdedorLocal.id_partido;
            // GanadorProximoPartido = GanadorVisitante.id_partido;
             const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_local: id_equipoP })
            .eq('id_partido', PerdedorProximoPartido)
            .select()
        }

        const { data: PerdedorVisitante, error: EPerdedorVisitante } = await supabaseAdmin
        .from('PartidosSS') 
        .select('id_partido') 
        .eq('equipo_visitante', equipoPerdedorBuscado)
        .single(); 

        if (EPerdedorVisitante) {
          //  console.error('Error al buscar el partido:', EPerdedorVisitante);
        } else {
            console.log('Partidos encontrados:', PerdedorVisitante.id_partido);
            PerdedorProximoPartido = PerdedorVisitante.id_partido;
            // GanadorProximoPartido = GanadorVisitante.id_partido;
             const { data: a, error: e } = await supabaseAdmin
            .from('PartidosSS')
            .update({ 
              equipo_visitante: id_equipoP })
            .eq('id_partido', PerdedorProximoPartido)
            .select()
        }



        const { data, error } = await supabaseAdmin
        .from('PartidosSS')
        .update({ 
          estado: 'Finalitzat',
          LocGlobal: resultado_final_local,
          VisGlobal: resultado_final_visitante,
          LocSet1: resultado_set1_local,
          VisSet1: resultado_set1_visitante,
          LocSet2: resultado_set2_local,
          VisSet2: resultado_set2_visitante,
          LocSet3: resultado_set3_local,
          VisSet3: resultado_set3_visitante,
        
        })
        .eq('id_partido', id_partido)
        .select()

  }


  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
