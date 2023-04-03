/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        link: '#69b1ff'
      }
    },
  },
  corePlugins: {
    preflight: false
  },
  plugins: [],
}