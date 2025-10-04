/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-blue": "#00f5ff",
        "neon-purple": "#bf00ff",
        "neon-green": "#00ff88",
        "neon-orange": "#ff8800",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.953rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.441rem", { lineHeight: "2.75rem" }],
        "5xl": ["3.052rem", { lineHeight: "3.25rem" }],
        "6xl": ["3.815rem", { lineHeight: "4rem" }],
        "7xl": ["4.768rem", { lineHeight: "5rem" }],
        "8xl": ["5.96rem", { lineHeight: "6rem" }],
        "9xl": ["7.451rem", { lineHeight: "7rem" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
    },
  },
  plugins: [],
};
