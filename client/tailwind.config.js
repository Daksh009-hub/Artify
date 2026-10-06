export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        artify: {
          terracotta: '#C85A32',
          clay: '#964B00',
          sand: '#F7F3E9',
          indigo: '#1E3A8A',
          marigold: '#F59E0B',
          sage: '#10B981',
          charcoal: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans Devanagari', 'Noto Sans Gurmukhi', 'Noto Sans Tamil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
