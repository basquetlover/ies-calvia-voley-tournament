import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY);
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
