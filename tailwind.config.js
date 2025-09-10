/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <-- This enables dark mode based on the 'dark' class
  content: [
    "./*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#2563eb', // <-- Your custom brand color
      }
    },
  },
  plugins: [],
}