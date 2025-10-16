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
    extend: {
      // Clean professional colors - minimal approach
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}

