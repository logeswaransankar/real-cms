/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#07090e',
          800: '#0b0f17',
          700: '#131924',
          600: '#1c2536',
          500: '#28344a',
        },
        champagne: {
          50: '#fbf9f5',
          100: '#f5f0e6',
          200: '#ebdfc8',
          300: '#dec7a3',
          400: '#c5a880',
          500: '#b49363',
          600: '#9b7a4d',
        },
        marble: '#faf9f6',
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
        'glow-gold': '0 0 25px rgba(197, 168, 128, 0.25)',
      }
    },
  },
  plugins: [],
}
