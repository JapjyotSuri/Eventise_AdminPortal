/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'merri-weather': ['"Merriweather"', 'serif'],
        'mont-serrat': ['"Montserrat"', 'sans-serif'],
        'anonymous-pro': ['"Anonymous Pro"', 'monospace'],
      },
    },
  },
  plugins: [],
}

