/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          dark: '#0c0c0e',
          card: '#16161a',
          surface: '#1d1d22',
          border: '#2a2a32',
          gold: {
            light: '#F3E5AB',
            DEFAULT: '#D4AF37',
            hover: '#C29B27',
            deep: '#9A7B1C',
          },
          ivory: {
            DEFAULT: '#FAF8F5',
            soft: '#F3EFEA',
            muted: '#E5DFD7',
          },
          champagne: '#E8D8C8',
          sand: '#D8CBBF',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.15em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.05)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
