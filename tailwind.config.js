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
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
        'gradient-green': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #a21caf 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f59e42 0%, #f43f5e 100%)',
        'gradient-pink': 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        'gradient-violet': 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      },
      textGradient: theme => theme('backgroundImage'),
    },
  },
  plugins: [],
}

