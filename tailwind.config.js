/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#C8B6DB',
        'primary-dark': '#9D7DB8',
        'primary-light': '#E8DDEF',
        'secondary': '#D4C5E2',
        'accent': '#A78BCC',
        'dark': '#2D1B4E',
        'light': '#F5F3F8',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(205, 180, 219, 0.1)',
        'soft-lg': '0 4px 16px rgba(205, 180, 219, 0.15)',
      },
    },
  },
  plugins: [],
}