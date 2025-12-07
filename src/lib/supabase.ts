import { createClient } from "@supabase/supabase-js";

// Cliente público (se puede usar en el navegador)
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = "https://aimtsdmsojunxazbxfue.supabase.co";
const supabaseAnonKey = "sb_publishable_JVARTG3Ed4c6FHr0BtMYAw_cUSnTrg7";
if (!supabaseUrl ) {
  throw new Error("Faltan variables de entorno VITE_SUPABASE_URL ");
}
if (!supabaseAnonKey) {
  throw new Error("Faltan variables de entorno  VITE_SUPABASE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// export const supabase = createClient(
  
  
//   {
//     auth: {
//       flowType: "pkce",
//     },
//   },
// );

// export const supabase = createClient(
//   import.meta.env.SUPABASE_URL,
//   import.meta.env.SUPABASE_SERVICE_ROLE_KEY // Asegúrate de definir esta variable en tu entorno
// );

export const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY // Asegúrate de definir esta variable en tu entorno
);
