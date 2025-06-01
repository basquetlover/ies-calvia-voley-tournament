
//Mi codigo
import { ActionError, defineAction } from 'astro:actions';
import type { APIRoute } from "astro";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { Resend } from 'resend';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const nuevo_estado = formData.get("nuevo_estado")?.toString().trim() || "";
  const equipo_id = formData.get("equipo_id")?.toString().trim() || "";
  const fecha_inscripcion = formData.get("fecha_inscripcion")?.toString().trim() || "";

  const emailBodyAceptado =`
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="ca">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="telephone=no" name="format-detection">
  <title>Nuevo mensaje</title><!--[if (mso 16)]>
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
  <div dir="ltr" class="es-wrapper-color" lang="ca" style="background-color:#F6F6F6"><!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile"  color="#e0dfdf" origin="0.5, 0" position="0.5, 0"></v:fill>
  </v:background>
  <![endif]-->
  <table cellpadding="0" cellspacing="0" width="100%" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6">
      <tr>
      <td valign="top" style="padding:0;Margin:0">
      <table align="center" cellpadding="0" cellspacing="0" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" role="none">
              <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:10px;Margin:0;background-color:#1B1D20">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/webappmanifest192x192.png" width="84" class="img-6730" height="84" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
                      <td align="left" class="es-text-3268" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:40px;font-style:normal;font-weight:normal;line-height:48px;color:#FFC700"><strong class="es-override-size es-text-mobile-size-18" style="font-size:22px">IES Calvià Voley Tournament</strong></h1></td>
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
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" style="padding:20px;Margin:0">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" width="100%" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:32px;font-style:normal;font-weight:normal;line-height:38.4px;color:#1666FF"><b>Ja està inscrit i llest per participar en el torneig com a voluntari!</b></h2></td>
                      </tr>
                      <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;font-size:0">
                      <table height="100%" width="10%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td style="padding:0;Margin:0;margin:0px;border-bottom:3px solid #FFC700;background:none;height:0px;width:100%"></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">El nostre equip ha revisat la teva sol·licitud i ens complau informar-te que compleix tots els requisits necessaris. La teva inscripció ja està confirmada i registrada correctament.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">Consulta els detalls a la pàgina d’inscripció del teu compte per obtenir més informació.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br></p></td>
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
          <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#31cb4b" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#31cb4b;width:600px" role="none">
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
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#2cb543" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2cb543;width:600px" role="none">
              <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
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
      <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:300px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                  <tr>
                  </tr>
              </table><!--[if mso]></td><td style="width:0px"></td><td style="width:300px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
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
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellspacing="0" align="center" bgcolor="#ffffff" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
              <table cellspacing="0" cellpadding="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                  <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table cellspacing="0" align="left" cellpadding="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:57px">
                      <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Estat:</h4></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:81px">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td align="left" bgcolor="#50C878" class="es-text-9857" style="Margin:0;padding-top:4px;padding-right:8px;padding-bottom:4px;padding-left:8px"><p class="es-text-mobile-size-18" style="border-radius:10px;Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#13702c;font-size:18px"><strong>Acceptat</strong></p></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:402px">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:170px" valign="top"><![endif]-->
              <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:170px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Data inscripció:</h4></td>
                      </tr>
                  </table></td>
                  </tr>
              </table><!--[if mso]></td><td style="width:390px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:390px">
                  <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" class="es-text-2569" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#FFFFFF;font-size:14px"><span class="es-text-mobile-size-18" style="font-size:18px">${fecha_inscripcion}</span></p></td>
                      </tr>
                  </table></td>
                  </tr>
              </table><!--[if mso]></td></tr></table><![endif]--></td>
              </tr>
              <tr>
              <td align="left" class="es-m-p10t" style="padding:20px;Margin:0">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table width="100%" role="presentation" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" bgcolor="#FFC700" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#0E347D;background:#1666FF;border-width:0px 0px 2px 0px;display:inline-block;border-radius:15px;width:auto"><a href="https://iescalvia-voley.com/usuario" target="_blank" class="es-button" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#1666FF;border-radius:15px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:21.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #1666FF"> Anar a la web</a></span></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td align="left" bgcolor="#0E347D" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-right:10px;padding-left:10px;background-color:#0E347D">
              <table cellspacing="0" width="100%" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
              <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
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
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
          <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
              <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:20px;Margin:0;background-color:#1B1D20">
              <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_246.png" width="560" class="adapt-img" height="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td bgcolor="#0E347D" align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;background-color:#0E347D">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff">Heu rebut aquest correu perquè heu realitzat la sol·licitud al torneig des de la nostra web</span> <a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px"><strong>iescalvia-voley.com</strong></a>.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff"> Per a més informació sobre com tractem les vostres dades, podeu consultar el nostre</span> <a href="https://iescalvia-voley.com/aviso-legal" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Avís Legal</a> i <a href="https://iescalvia-voley.com/cookies" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Política de Cookies</a>.&nbsp;</p></td>
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

  const emailBodyDenegado =`
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="ca">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="telephone=no" name="format-detection">
  <title>Nuevo mensaje</title><!--[if (mso 16)]>
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
  <div dir="ltr" class="es-wrapper-color" lang="ca" style="background-color:#F6F6F6"><!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile"  color="#e0dfdf" origin="0.5, 0" position="0.5, 0"></v:fill>
  </v:background>
  <![endif]-->
  <table cellpadding="0" cellspacing="0" width="100%" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6">
      <tr>
      <td valign="top" style="padding:0;Margin:0">
      <table align="center" cellpadding="0" cellspacing="0" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" role="none">
              <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:10px;Margin:0;background-color:#1B1D20">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/webappmanifest192x192.png" width="84" class="img-6730" height="84" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
                      <td align="left" class="es-text-3268" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:40px;font-style:normal;font-weight:normal;line-height:48px;color:#FFC700"><strong class="es-override-size es-text-mobile-size-18" style="font-size:22px">IES Calvià Voley Tournament</strong></h1></td>
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
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" style="padding:20px;Margin:0">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" width="100%" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:32px;font-style:normal;font-weight:normal;line-height:38.4px;color:#1666FF"><b>Has de corregir alguns problemes perquè puguis participar en el torneig com a voluntari.</b></h2></td>
                      </tr>
                      <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;font-size:0">
                      <table height="100%" width="10%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td style="padding:0;Margin:0;margin:0px;border-bottom:3px solid #FFC700;background:none;height:0px;width:100%"></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">El nostre equip ha revisat la teva sol·licitud i, malauradament, en aquest moment no compleix els requisits necessaris. Per completar la inscripció, primer has de solucionar aquests problemes.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"><br>Consulta els detalls a la pàgina d’inscripció del teu compte per obtenir més informació.<br><br></p></td>
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
          <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#31cb4b" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#31cb4b;width:600px" role="none">
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
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#2cb543" cellpadding="0" cellspacing="0" align="center" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2cb543;width:600px" role="none">
              <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
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
      <table cellspacing="0" align="center" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" bgcolor="#2cb543" style="padding:0;Margin:0;background-color:#2cb543"><!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:300px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                  <tr>
                  </tr>
              </table><!--[if mso]></td><td style="width:0px"></td><td style="width:300px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
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
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table align="center" cellpadding="0" cellspacing="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellspacing="0" align="center" bgcolor="#ffffff" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
          </table></td>
          </tr>
      </table>
      <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
          <tr>
          <td align="center" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1B1D20;width:600px">
              <tr>
              <td align="left" class="es-m-p10t" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
              <table cellspacing="0" cellpadding="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                  <tr>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table cellspacing="0" align="left" cellpadding="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:57px">
                      <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Estat:</h4></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:81px">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                          <td align="left" bgcolor="#E63946" class="es-text-9857" style="Margin:0;padding-top:4px;padding-right:8px;padding-bottom:4px;padding-left:8px"><p class="es-text-mobile-size-18" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#A83434;font-size:18px"><strong>Denegat</strong></p></td>
                          </tr>
                      </table></td>
                      </tr>
                  </table></td>
                  <td class="es-m-w0 es-m-p10r" style="padding:0;Margin:0;width:10px"></td>
                  <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                      <tr>
                      <td align="left" style="padding:0;Margin:0;width:402px">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
              <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:170px" valign="top"><![endif]-->
              <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:170px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#1666ff">Data inscripció:</h4></td>
                      </tr>
                  </table></td>
                  </tr>
              </table><!--[if mso]></td><td style="width:390px" valign="top"><![endif]-->
              <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:390px">
                  <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" class="es-text-2569" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;letter-spacing:0;color:#FFFFFF;font-size:14px"><span class="es-text-mobile-size-18" style="font-size:18px">${fecha_inscripcion}</span></p></td>
                      </tr>
                  </table></td>
                  </tr>
              </table><!--[if mso]></td></tr></table><![endif]--></td>
              </tr>
              <tr>
              <td align="left" class="es-m-p10t" style="padding:20px;Margin:0">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table width="100%" role="presentation" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" bgcolor="#FFC700" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#0E347D;background:#1666FF;border-width:0px 0px 2px 0px;display:inline-block;border-radius:15px;width:auto"><a href="https://iescalvia-voley.com/usuario" target="_blank" class="es-button" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#1666FF;border-radius:15px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:21.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #1666FF"> Anar a la web</a></span></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td align="left" bgcolor="#0E347D" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-right:10px;padding-left:10px;background-color:#0E347D">
              <table cellspacing="0" width="100%" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
              <table align="left" cellpadding="0" cellspacing="0" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
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
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
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
          <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
              <tr>
              <td align="left" bgcolor="#1B1D20" style="padding:20px;Margin:0;background-color:#1B1D20">
              <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0"><img alt="" src="https://epqqhnq.stripocdn.email/content/guids/CABINET_0cb0af73485e28aee9f8c657f4585c662890522ff24809cfe8f5a3e6e5f27897/images/group_246.png" width="560" class="adapt-img" height="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                      </tr>
                  </table></td>
                  </tr>
              </table></td>
              </tr>
              <tr>
              <td bgcolor="#0E347D" align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;background-color:#0E347D">
              <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                  <table cellspacing="0" role="presentation" width="100%" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff">Heu rebut aquest correu perquè heu realitzat la preinscripció al torneig des de la nostra web</span> <a href="https://iescalvia-coley.com" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px"><strong>iescalvia-voley.com</strong></a>.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="color:#ffffff"> Per a més informació sobre com tractem les vostres dades, podeu consultar el nostre</span> <a href="https://iescalvia-voley.com/aviso-legal" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Avís Legal</a> i <a href="https://iescalvia-voley.com/cookies" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFC700;font-size:14px">Política de Cookies</a>.&nbsp;</p></td>
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
    const getCurrentDateInCatalan = () => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date();
        return new Intl.DateTimeFormat('ca-ES', options).format(date);
      };
      
    const currentDate = getCurrentDateInCatalan();
    let voluntarios = [];
    let index = 0;
    while (formData.has(`voluntario_nuevo_estado_${index}`)) {
        const probl_img = formData.get(`img-voluntario_${index}`)?.toString().trim();
        const id = formData.get(`voluntario_id_${index}`)?.toString().trim();
        const id_torneo = formData.get(`voluntario_torneo_id_${index}`)?.toString().trim();
        const probl_player = formData.get(`probl_voluntario_${index}`)?.toString().trim();
        const nuevo_estado = formData.get(`voluntario_nuevo_estado_${index}`);
        const email = formData.get(`voluntario_email_${index}`)?.toString().trim() || "voley_tournament@iescalvia.com";
        const numero = index + 1;
        if(nuevo_estado){
            if(nuevo_estado === "Acceptat"){
                if(probl_img === ''){
                            return new Response(
                                `
                                <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
                                  <span>
                                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
                                  <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                                </svg>
                                  </span>
                                  <p>Es necesario indicar si la foto es valida del jugador ${numero}</p>
                                  </div>
                                `, 
                                { status: 401, headers: { "Content-Type": "text/html" } }
                            );
                }

                if(probl_img === 'foto-denegada'){
                    return new Response(
                        `
                        <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
                          <span>
                        <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
                          <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                        </svg>
                          </span>
                          <p>No se puede aceptar un voluntario con la foto rechazada ${numero}</p>
                          </div>
                        `, 
                        { status: 401, headers: { "Content-Type": "text/html" } }
                    );
        }
                const { error: jugadorError } = await supabaseAdmin
                .from(`Voluntarios${id_torneo}`)
                .update([
                    {   fecha_revision: currentDate,
                        estado: nuevo_estado,
                        observacion: probl_player,
                        validar_img: probl_img,
                    },
                ]).eq('id', id)
                .select();

            if (jugadorError) {
                    console.error("Error insertando jugador principal:", jugadorError.message);
                    // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
                }
            }
                
              //Enviar Email
                const acceso_emails = "email-revision-voluntarios";
                let accessibleBlocks = [];
                
                // Obtén las páginas a las que el usuario tiene acceso
                try {
                    const { data: pageAccess, error } = await supabaseAdmin
                        .from('AccesoUsuarios')
                        .select('pagina, acceso');
                
                    if (error) {
                        console.error("Error al obtener acceso:", error);
                    } else if (pageAccess) {
                        // Filtra las páginas a las que el usuario tiene acceso
                        accessibleBlocks = pageAccess
                            .filter(page => page.acceso === true) // Solo páginas con acceso true
                            .map(page => page.pagina); // Obtiene solo las páginas
                        // console.log(accessibleBlocks);
                    }
                } catch (err) {
                    console.error("Error al obtener acceso:", err);
                }
                
                // Verifica si el usuario tiene acceso a la página actual
                const userHasAccess = accessibleBlocks.includes(acceso_emails);
                if(userHasAccess){
                    console.log("Se envian emails");

                    const resend = new Resend(import.meta.env.RESEND_API_KEY);

                    
                        if(nuevo_estado === "Acceptat"){


                            //Realizador Inscripcion
                            try {
                            const { data, error } = await resend.emails.send({
                                from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
                                to: [email], // Asegúrate de que esta variable tenga el valor correcto
                                subject: `Revisió finalitzada del voluntari ${email}`,
                                html: emailBodyAceptado,
                            });
                        
                            if (error) {
                                throw new Error(error.message); // Lanza un error si hay un problema
                            }
                        
                            console.log("Correo enviado correctamente", data);
                            let asunto = `Revisió finalitzada de l'equip ${email}  | Versió Inscriptor`
                            const { data: Emails, error: EmailsError } = await supabaseAdmin
                            .from('Emails')
                            .insert([
                                { destinatario: email, asunto: asunto, contenido: emailBodyAceptado, id_resend: data?.id },
                            ])
                            .select()
                            } catch (error) {
                            console.error("Error al enviar el correo:", error);
                            }
                        
                        }

                    
                }else{
                    console.log("No se envian emails");
                }


            
            voluntarios.push({ id, id_torneo, probl_img, probl_player, numero, nuevo_estado, email });
        }

        if(nuevo_estado){
            if(nuevo_estado === "Denegat"){
                if(probl_img === ''){
                            return new Response(
                                `
                                <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
                                  <span>
                                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
                                  <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                                </svg>
                                  </span>
                                  <p>Es necesario indicar si la foto es valida del jugador Nº${numero}</p>
                                  </div>
                                `, 
                                { status: 401, headers: { "Content-Type": "text/html" } }
                            );
                }
                if(probl_player === ''){
                    return new Response(
                        `
                        <div class="w-[400px] min-h-20 h-max rounded-lg grid grid-rows-1 grid-cols-[max-content_1fr] items-center gap-2 py-1 px-3 border-solid border-2 border-[#A83434] bg-[#A83434] bg-opacity-60 text-base font-semibold">
                          <span>
                        <svg xmlns="http://www.w3.org/2000/svg"  class="fill-[#BA3A3A] w-16 h-16" viewBox="0 -960 960 960">
                          <path d="m332-285 148-148 148 148 47-47-148-148 148-148-47-47-148 148-148-148-47 47 148 148-148 148 47 47ZM480-80q-82 0-155-31-73-32-128-86-54-55-85-128T80-480q0-83 32-156t85-127q55-54 128-85t155-32q83 0 156 32t127 85q54 54 86 127t31 156q0 82-31 155-32 73-86 128-54 54-127 86T480-80Z"/>
                        </svg>
                          </span>
                          <p>Es necesario indicar los motivos por el que se rechaza un voluntario Nº ${numero}</p>
                          </div>
                        `, 
                        { status: 401, headers: { "Content-Type": "text/html" } }
                    );
        }
                const { error: jugadorError } = await supabaseAdmin
                .from(`Voluntarios${id_torneo}`)
                .update([
                    {   fecha_revision: currentDate,
                        estado: nuevo_estado,
                        observacion: probl_player,
                        validar_img: probl_img,
                    },
                ]).eq('id', id)
                .select();

            if (jugadorError) {
                    console.error("Error insertando jugador principal:", jugadorError.message);
                    // Considera si quieres detener todo el proceso o continuar con los siguientes jugadores
                }
            
                              //Enviar Email
                              const acceso_emails = "email-revision-voluntarios";
                              let accessibleBlocks = [];
                              
                              // Obtén las páginas a las que el usuario tiene acceso
                              try {
                                  const { data: pageAccess, error } = await supabaseAdmin
                                      .from('AccesoUsuarios')
                                      .select('pagina, acceso');
                              
                                  if (error) {
                                      console.error("Error al obtener acceso:", error);
                                  } else if (pageAccess) {
                                      // Filtra las páginas a las que el usuario tiene acceso
                                      accessibleBlocks = pageAccess
                                          .filter(page => page.acceso === true) // Solo páginas con acceso true
                                          .map(page => page.pagina); // Obtiene solo las páginas
                                      // console.log(accessibleBlocks);
                                  }
                              } catch (err) {
                                  console.error("Error al obtener acceso:", err);
                              }
                              
                              // Verifica si el usuario tiene acceso a la página actual
                              const userHasAccess = accessibleBlocks.includes(acceso_emails);
                              if(userHasAccess){
                                  console.log("Se envian emails");
              
                                  const resend = new Resend(import.meta.env.RESEND_API_KEY);
                                      
                                      if(nuevo_estado === "Denegat"){
                                      
                                      
                                          //Realizador Inscripcion
                                          try {
                                          const { data, error } = await resend.emails.send({
                                              from: 'IES Calvià Voley Tournament <hi@marketing.iescalvia-voley.com>',
                                              to: [email], // Asegúrate de que esta variable tenga el valor correcto
                                              subject: `Revisió finalitzada del voluntari ${email}`,
                                              html: emailBodyDenegado,
                                          });
                                      
                                          if (error) {
                                              throw new Error(error.message); // Lanza un error si hay un problema
                                          }
                                      
                                          console.log("Correo enviado correctamente", data);
                                          let asunto = `Revisió finalitzada de l'equip ${email}  | Versió Inscriptor`
                                          const { data: Emails, error: EmailsError } = await supabaseAdmin
                                          .from('Emails')
                                          .insert([
                                              { destinatario: email, asunto: asunto, contenido: emailBodyDenegado, id_resend: data?.id },
                                          ])
                                          .select()
                                          } catch (error) {
                                          console.error("Error al enviar el correo:", error);
                                          }
                                      
                                      
                                      }
                                  
                              }else{
                                  console.log("No se envian emails");
                              }
            
            voluntarios.push({ id, id_torneo, probl_img, probl_player, numero, nuevo_estado, email });
        }
    }
        
         index++;
    }
    console.log(voluntarios)






  return new Response(
    JSON.stringify({ success: true }), 
    { status: 200, headers: { "Content-Type": "application/json" } }
);
};
