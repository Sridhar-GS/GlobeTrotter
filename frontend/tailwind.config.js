/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
        },
        secondary: '#10b981',
        accent: '#f59e0b',
        surface: '#ffffff',
        text: {
          DEFAULT: '#0f172a',
          light: '#64748b',
        },
        border: '#e2e8f0',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
