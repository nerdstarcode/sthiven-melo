/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme'
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        '4xl': '1900px',
      },
      fontFamily: {
        mont: ['var(--font-mont)', ...fontFamily.sans]
      },
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#B63E96", // 240,86,199
        primaryDark: "#58E6D9", // 80,230,217
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      backgroundImage: {
        circularDark: 'repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #18181B 5px, #18181B 100px);',
        circularLight: 'repeating-radial-gradient(rgba(255,255,255,0.4) 2px, #fff 5px, #fff 100px);'
      }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    require('tailwind-scrollbar'),
  ],
}

