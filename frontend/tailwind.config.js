/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--app-bg)',
          surface: 'var(--app-surface)',
          'surface-muted': 'var(--app-surface-muted)',
          text: 'var(--app-text)',
          'text-muted': 'var(--app-text-muted)',
          border: 'var(--app-border)',
        },
      },
    },
  },
  plugins: [],
};
