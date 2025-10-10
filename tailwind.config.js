/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Ensure dynamic accent classes like text-${accentColor}-400 and bg-${accentColor}-600 are generated
    {
      pattern: /(bg|text|border)-(sky|blue|red)-(300|400|500|600|700)/,
    },
    // Note: Removed hover pattern as it wasn't matching any actual classes
    // If you need hover variants, use them explicitly in your components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

