/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0f0f4',
          100: '#d8d8e8',
          200: '#b0b0d0',
          300: '#8888b8',
          400: '#6060a0',
          500: '#383888',
          600: '#2c2c70',
          700: '#202058',
          800: '#141440',
          900: '#0a0a28',
        },
        gold: {
          300: '#f5d07a',
          400: '#f0c040',
          500: '#e8a800',
        },
        sage: {
          300: '#a8c4a0',
          400: '#7aaa70',
          500: '#4a8a40',
        },
      },
    },
  },
  plugins: [],
}
