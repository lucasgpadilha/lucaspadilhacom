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
        night: '#05080d',
        graphite: '#0b1118',
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
