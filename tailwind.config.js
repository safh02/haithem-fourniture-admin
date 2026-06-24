/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#008E47', dark: '#007a3d', light: '#e6f5ed' },
        cream: '#EDE8D0',
        brand: { gray: '#757575' }
      }
    }
  },
  plugins: []
}
