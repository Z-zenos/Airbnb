/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff385c",
        'gray-primary': "rgb(113, 113, 113)"
      },
      borderWidth: {
        1: "1px"
      }
    },
  },
  plugins: [],
}

