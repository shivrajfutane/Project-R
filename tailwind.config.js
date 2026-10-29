/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E40AF',       // Deep vibrant blue
          'blue-dark': '#1E3A8A',
          pink: '#EC4899',       // Vibrant pink for accents and close icon
          'pink-hover': '#DB2777',
          yellow: '#FBBF24',     // Reference yellow button color
          'yellow-hover': '#F59E0B',
          'yellow-dark': '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'modal': '0 20px 50px -10px rgba(0, 0, 0, 0.25), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'accent': '0 8px 24px -4px rgba(251, 191, 36, 0.35)',
      }
    },
  },
  plugins: [],
}
