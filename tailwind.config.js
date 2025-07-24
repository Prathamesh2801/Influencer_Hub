/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode instead of media-based
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        interLight: ["Inter Light", "sans-serif"],
        OPTIWashington: ["OPTIWashington", "sans-serif"],
        Gabriella_Heavy: ["Gabriella_Heavy", "sans-serif"],
      },
    },
  },
  daisyui: {
    // List the themes you want to use in your project
    themes: [
      "light",
      "dark",
      "cupcake",
      // add other DaisyUI themes as needed
    ],
    // Set default theme to light
    defaultTheme: "light",
  },
  plugins: [require("daisyui")],
};
