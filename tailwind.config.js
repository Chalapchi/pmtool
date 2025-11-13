/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#ff8c42',
          light: '#ff9966',
        },
        dark: {
          900: '#0d0d0d',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#333333',
          500: '#404040',
          400: '#666666',
          300: '#999999',
          200: '#b3b3b3',
          100: '#e5e5e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
