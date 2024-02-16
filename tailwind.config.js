/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'background': '#f1eee7',
        'custom-green': '#263e3f',
        'custom-typo': '#ada79b',
      },
    },
  },
  plugins: [],
}

