/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    styled: false,
    themes: false,
    base: false,
    darkTheme: false,
    themes: [
      {
        mytheme: {
          primary: "#f0f0d8",

          secondary: "#474838",

          accent: "#80A2A2",

          neutral: "#27212C",

          "base-100": "#FDF4DC",

          info: "#8FC9DB",

          success: "#176459",

          warning: "#F89E20",

          error: "#dc2626",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        silk: ["SilkSerif", "serif"],
      },
      backgroundImage: {
        "login-pattern": "url('/image/topography.svg')",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
