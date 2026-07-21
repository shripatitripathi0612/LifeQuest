/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030305',
          900: '#0a090d',
          800: '#131218',
          700: '#1b1a22',
          600: '#25232e',
        },
        electric: {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7e22ce',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        magenta: {
          400: '#f472e0',
          500: '#e026d0',
          600: '#c026d3',
        },
        neon: {
          blue: '#3b82f6',
        },
        xp: {
          from: '#22d3ee',
          to: '#a855f7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(168, 85, 247, 0.45)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.45)',
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.35)',
        card: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at 15% 0%, rgba(59,130,246,0.14), transparent 45%), radial-gradient(circle at 85% 10%, rgba(168,85,247,0.16), transparent 50%), radial-gradient(circle at 50% 100%, rgba(147,51,234,0.08), transparent 55%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.85, filter: 'brightness(1.3)' },
        },
        'fill-bar': {
          '0%': { width: '0%' },
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
