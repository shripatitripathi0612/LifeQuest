/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matte black scale — precise spec: background #0B0B0D, card surface
        // #111214. Key name kept as `navy` so every existing
        // bg-navy-*/border-navy-* class across the app (not just Dashboard)
        // picks up the calmer tone for free, without touching each file.
        navy: {
          950: '#0B0B0D',
          900: '#111113',
          800: '#111214',
          700: '#1A1B1E',
          600: '#232427',
        },
        // Restrained sunrise gold/amber — replaces purple as the app's
        // single accent. Key name kept as `electric` so every existing
        // text-electric-*/bg-electric-*/border-electric-* class inherits
        // the new color everywhere, without touching each file.
        electric: {
          400: '#e0b374',
          500: '#cf9a4c',
          600: '#a97a35',
        },
        // Muted, desaturated — no longer a competing neon accent, just a
        // quiet cool-neutral tone for the rare spot that needs a second,
        // non-amber note (e.g. a chart line).
        cyan: {
          300: '#b7c4c9',
          400: '#9db4c0',
          500: '#7e97a3',
        },
        // Muted warm clay — replaces bright magenta in gradients (e.g.
        // quest progress fills) so they read as warm and calm, not neon.
        magenta: {
          400: '#cf9f74',
          500: '#b8875a',
          600: '#9c6f47',
        },
        xp: {
          from: '#e0b374',
          to: '#a97a35',
        },
        // Soft semantic states — desaturated so they read as calm signals,
        // not alarms or arcade colors.
        success: {
          400: '#7dcca6',
          500: '#5fb890',
        },
        danger: {
          400: '#e08787',
          500: '#d16b6b',
        },
      },
      fontFamily: {
        // Space Grotesk is reserved for exactly three things per the brand
        // guidelines: the hero headline, the Standing name, and the streak
        // number. Everything else — including section headers — uses Inter.
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        // Softer, much lower-opacity glows in the new amber tone — "clean
        // shadows" and "less visual noise" rather than a neon aura.
        glow: '0 0 24px rgba(207, 154, 76, 0.22)',
        'glow-cyan': '0 0 20px rgba(158, 180, 192, 0.18)',
        'glow-sm': '0 0 12px rgba(207, 154, 76, 0.18)',
        card: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        // "Almost invisible" — a single, extremely faint warm-neutral
        // vignette. No grid, no colored glow blobs, no purple.
        'radial-glow':
          'radial-gradient(120% 100% at 50% -10%, rgba(255,255,255,0.035), transparent 60%)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.85, filter: 'brightness(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        float: 'float 3.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
