/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red:   '#C8102E', // Kenyan flag red
          green: '#006600', // Kenyan flag green
          black: '#111111',
        },
        surface: '#F7F7F5',
        card:    '#FFFFFF',
        border:  '#E8E8E4',
        muted:   '#8A8A8A',
      },
    },
  },
  plugins: [],
}
