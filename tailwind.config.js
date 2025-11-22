/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `app.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`,
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        python: {
          blue: {
            50: '#e8f4f8',
            100: '#d1e9f1',
            200: '#a3d3e3',
            300: '#75bdd5',
            400: '#47a7c7',
            500: '#3776ab', // Main Python blue
            600: '#2c5e89',
            700: '#214767',
            800: '#162f45',
            900: '#0b1823',
          },
          yellow: {
            50: '#fffbeb',
            100: '#fff6d6',
            200: '#ffedad',
            300: '#ffe485',
            400: '#ffdb5c',
            500: '#ffd43b', // Main Python yellow
            600: '#e6bf35',
            700: '#b39529',
            800: '#806b1d',
            900: '#4d4011',
          },
        },
        primary: {
          50: '#e8f4f8',
          100: '#d1e9f1',
          200: '#a3d3e3',
          300: '#75bdd5',
          400: '#47a7c7',
          500: '#3776ab',
          600: '#2c5e89',
          700: '#214767',
          800: '#162f45',
          900: '#0b1823',
        }
      }
    }
  },
  plugins: []
}