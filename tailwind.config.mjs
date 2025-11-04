/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					950: '#082f49',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'slide-left': 'slideLeft 0.5s ease-out',
				'slide-right': 'slideRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'spin-slow': 'spin 8s linear infinite',
				float: 'float 6s ease-in-out infinite',
				gradient: 'gradient 8s ease infinite',
				shimmer: 'shimmer 2s linear infinite',
				wiggle: 'wiggle 1s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideLeft: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				slideRight: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
			},
			backgroundSize: {
				'300%': '300%',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				glow: '0 0 20px rgba(14, 165, 233, 0.3)',
				'glow-lg': '0 0 40px rgba(14, 165, 233, 0.4)',
				'inner-glow': 'inset 0 0 20px rgba(14, 165, 233, 0.2)',
			},
			fontFamily: {
				'sf-pro': ['SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
