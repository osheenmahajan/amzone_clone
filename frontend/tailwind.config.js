/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          light_navy: '#232f3e',
          orange: '#f2a900',
          yellow: '#f0c14b',
          bright_yellow: '#ffd814',
          bg: '#eaeded',
        }
      }
    },
  },
  plugins: [],
}
