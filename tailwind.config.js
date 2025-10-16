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
        // Professional color palette - Blues, Teals, Purples, Grays
        'gradient-blue': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',           // Deep blue to medium blue
        'gradient-sky': 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',            // Deep sky to bright sky
        'gradient-cyan': 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',           // Deep cyan to bright cyan
        'gradient-teal': 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',           // Deep teal to bright teal
        'gradient-purple': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',         // Deep purple to medium purple
        'gradient-indigo': 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',         // Deep indigo to medium indigo
        'gradient-violet': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',         // Deep violet to light violet
        'gradient-slate': 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',          // Deep slate to medium slate
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',           // Very dark to dark slate
        'gradient-navy': 'linear-gradient(135deg, #172554 0%, #1e40af 100%)',           // Deep navy to blue
      },
      textGradient: theme => theme('backgroundImage'),
    },
  },
  plugins: [],
}

