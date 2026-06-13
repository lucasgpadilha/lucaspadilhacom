/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        night: '#0a0b0d',
        graphite: '#101113',
        ink: '#08090a',
        signal: {
          DEFAULT: '#f5a524',
          soft: 'rgba(245,165,36,0.10)',
        },
        cloud: {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
        },
        success: {
          200: '#a7f3d0',
          300: '#6ee7b7',
        },
      },
    },
  },
  plugins: [],
};
