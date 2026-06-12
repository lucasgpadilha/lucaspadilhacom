/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: '#050508',
        'dark-surface': '#0a0b10',
        accent: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        terminal: {
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
          cyan: '#06b6d4',
          dim: '#52525b',
        },
        aws: {
          orange: '#FF9900',
          blue: '#527FFF',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'scan': 'scan 8s linear infinite',
        'pulse-status': 'pulse-status 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'flow': 'flow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-status': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 4px currentColor' },
          '50%': { opacity: '0.5', boxShadow: '0 0 12px currentColor' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flow: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};
