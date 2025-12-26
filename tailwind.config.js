/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0F8FF",
          100: "#E0F1FF",
          200: "#B8E2FF",
          300: "#90D2FF",
          400: "#74ACDF",
          500: "#5A94CB",
          600: "#407CB7",
          700: "#336399",
          800: "#264B7A",
          900: "#19325C",
        },
        secondary: "#AED6F1",
      },
    },
  },
  plugins: [],
};