// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  site: 'https://ies-calvia-voley-tournament.vercel.app/',
  integrations: [tailwind(), db()],
  output: 'server',
  adapter: vercel()
});