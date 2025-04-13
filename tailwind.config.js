/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		colors: {
		  azul: '#0E347D',
		  'azul-suave': '#0140B9',
		  accent: '#1666FF',
		  amarillo: '#FFC700',
		  'gris-claro': '#313131',
		  gris: '#1B1D20',
		  blanco: '#FFFFFF',
		  cancelar: '#A83434',
		  aceptar: '#34A853',
		  gold: '#EFBF04',
		  naranja: '#D27C2C',
		  'naranja-claro': '#FFBF65',
		  rojo: '#A83434',
		  'rojo-claro': '#E63946',
		  verde: '#13702C',
		  'verde-claro': '#50C878',

		},
		screens: {
		  xs: '250px',  // Agrega un breakpoint para pantallas más pequeñas
		  sm: '720px',   // Pantallas pequeñas
		  md: '800px',   // Pantallas medianas
		//   lg: '1024px',  // Pantallas grandes
		//   xl: '1280px',  // Pantallas extra grandes
		},
	  },
	},
	plugins: [
		function({ addUtilities }) {
		  addUtilities({
			'.no-scrollbar': {
			  /* Ocultar scrollbar en navegadores modernos */
			  '-ms-overflow-style': 'none', // Para Internet Explorer y Edge
			  'scrollbar-width': 'none', // Para Firefox
			},
			'.no-scrollbar::-webkit-scrollbar': {
			  display: 'none', // Para Chrome, Safari y Opera
			},
			'.scrollbar-fina': {
			  /* Ocultar scrollbar en navegadores modernos */
			  '-ms-overflow-style': 'none', // Para Internet Explorer y Edge
			  'scrollbar-width': 'none', // Para Firefox
			},
			'.espacio': {
			  'border-collapse': 'separate', /* Necesario para que funcione border-spacing */
			  'border-spacing': '5px', /* Espacio entre columnas y filas */
			},
			'.espacio th, .espacio td': {
			  padding: '2px', /* Espacio interno en las celdas */
			},
			'.redondo': {
			  width: '10px', /* Ancho del span */
			  height: '10px', /* Alto del span */
			  backgroundColor: 'red', /* Color de fondo */
			  borderRadius: '50%', /* Hace que el span sea redondo */
			  position: 'relative', /* Necesario para el efecto de sombra */
			  animation: 'pulsar 1.5s infinite', /* Animación que se repite infinitamente */
			},
			'@keyframes pulsar': {
			  '0%': {
				boxShadow: '0 0 0 rgba(255, 0, 0, 0)',
			  },
			  '50%': {
				boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)', /* Sombra más intensa */
			  },
			  '100%': {
				boxShadow: '0 0 0 rgba(255, 0, 0, 0)',
			  },
			},
		  });
		},
	  ],
  }
  