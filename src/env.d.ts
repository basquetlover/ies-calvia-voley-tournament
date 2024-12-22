/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
// /// <reference path="../.astro/types.d.ts" />
// /// <reference path=".astro/client" />
// declare namespace App {
// 	interface Locals {
// 		session: import("lucia").Session | null;
// 		user: import("lucia").User | null;
// 	}
// }

// declare namespace App {
//   interface Locals {
//     user?: {
//       id: string | undefined;
//       email: string | undefined;
//     } | null;
//   }
// }

declare namespace App {
  interface Locals {
    StaffUser: {
      id: string;
      email: string;
    } | null;
    session: {
      access_token: string;
      refresh_token: string;
    } | null;
  }
}


interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}