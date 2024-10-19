/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		colors: {
		  azul: '#0E347D',
		  accent: '#1666FF',
		  amarillo: '#FFC700',
		//   gris: '#383836',
		  gris: '#1B1D20',
		  blanco: '#FFFFFF',
		},
		screens: {
		  xs: '220px',  // Agrega un breakpoint para pantallas más pequeñas
		  sm: '640px',   // Pantallas pequeñas
		  md: '768px',   // Pantallas medianas
		  lg: '1024px',  // Pantallas grandes
		  xl: '1280px',  // Pantallas extra grandes
		},
	  },
	},
	plugins: [],
  }
  