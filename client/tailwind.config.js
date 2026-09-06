/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0d1f18",
          900: "#143026",
          800: "#1b3d30",
          700: "#245c45",
          600: "#2f7a58",
          500: "#3d9a6c",
        },
        moss: {
          500: "#6b9a3a",
          400: "#7aad45",
          300: "#8fbf55",
        },
        cream: {
          50: "#fbf8f1",
          100: "#f4efe4",
          200: "#e8dfcc",
        },
      },
      fontFamily: {
        display: ["IBM Plex Sans", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        arabic: ["Noto Sans Arabic", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};
