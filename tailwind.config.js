/** @type {import('tailwindcss').Config} */
export default {
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

theme: {
	extend: {
	colors: {
		azul: '#0E347D',
		'azul-suave': '#0140B9',
		'azul-claro': '#3C81F6',
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
		magenta: '#c23a97',
	},

	screens: {
		xs: '250px',
		sm: '720px',
		md: '800px',
	},

	keyframes: {
		'cuadrado-in': {
		'0%': { opacity: '0', transform: 'scale(0)' },
		'100%': { opacity: '1', transform: 'scale(1)' },
		},

		'cuadrado-out': {
		'0%': { opacity: '1', transform: 'scale(1)' },
		'100%': { opacity: '0', transform: 'scale(0)' },
		},

		'infinite-scroll': {
		from: { transform: 'translateX(0)' },
		to: { transform: 'translateX(-100%)' },
		},

		pulsar: {
		'0%': { boxShadow: '0 0 0 rgba(255, 0, 0, 0)' },
		'50%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)' },
		'100%': { boxShadow: '0 0 0 rgba(255, 0, 0, 0)' },
		},
	},

	animation: {
		'cuadrado-in': 'cuadrado-in 0.3s ease-out both',
		'cuadrado-out': 'cuadrado-out 0.3s ease-in both',
		'infinite-scroll': 'infinite-scroll 20s linear infinite',
		pulsar: 'pulsar 1.5s infinite',
	},
	},
},

plugins: [
	function ({ addUtilities }) {
	addUtilities({
		'.no-scrollbar': {
		'-ms-overflow-style': 'none',
		'scrollbar-width': 'none',
		},
		'.no-scrollbar::-webkit-scrollbar': {
		display: 'none',
		},
		'.espacio': {
		'border-collapse': 'separate',
		'border-spacing': '5px',
		},
		'.espacio th, .espacio td': {
		padding: '2px',
		},
	});
	},
],
};