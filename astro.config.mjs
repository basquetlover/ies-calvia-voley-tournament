// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

import partytown from '@astrojs/partytown'

import react from '@astrojs/react';

// import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  // site: 'https://ies-calvia-voley-tournament.vercel.app/',
  site: 'https://iescalvia-voley.com',
  integrations: [tailwind(), partytown({
      config: {
        forward: ["dataLayer.push"],
      },
  }), react()],
  output: 'server',
  adapter: vercel(),
  vite: {
    define: {
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
    },
  },
  // vite: {
    // 	optimizeDeps: {
    // 		exclude: ["astro:db"]
    // 	}
    // }
});

// "@astrojs/db": "^0.14.3",
// db()