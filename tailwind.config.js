/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11100f',
        paper: '#f7f3ea',
        // Five-element (오행) accent palette
        wood: '#2f7d52',
        fire: '#c4452f',
        earth: '#caa14a',
        metal: '#9aa3ad',
        water: '#2b3a67',
        hanji: '#efe7d4',
      },
      fontFamily: {
        serif: ['"Noto Serif KR"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        seal: '0 1px 0 rgba(0,0,0,0.04), 0 8px 30px rgba(17,16,15,0.08)',
      },
    },
  },
  plugins: [],
};
