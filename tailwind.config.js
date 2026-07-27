/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean:   { DEFAULT: '#0E5E8C', dark: '#0A4A6E', light: '#1a7ab8', pale: '#E8F4F8' },
        forest:  { DEFAULT: '#2E8B57', dark: '#1d6b40', light: '#3daa6e', pale: '#E8F5EE' },
        sand:    { DEFAULT: '#F5E6D3', dark: '#E8C9A0', light: '#FAF2E8' },
        navy:    { DEFAULT: '#0A2540', light: '#0f3460' },
        gold:    { DEFAULT: '#D4A843', light: '#F5C842' },
      },
      fontFamily: {
        sans:    ['Poppins', 'system-ui', 'sans-serif'],
        serif:   ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'ocean':  '0 8px 32px rgba(14,94,140,0.25)',
        'forest': '0 8px 32px rgba(46,139,87,0.25)',
        'xl2':    '0 24px 80px rgba(10,37,64,0.18)',
        'glass':  '0 8px 32px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-ocean':  'linear-gradient(135deg, #0A2540 0%, #0E5E8C 100%)',
        'gradient-forest': 'linear-gradient(135deg, #1d6b40 0%, #2E8B57 100%)',
        'gradient-hero':   'linear-gradient(135deg, rgba(10,37,64,0.85) 0%, rgba(14,94,140,0.55) 100%)',
        'gradient-card':   'linear-gradient(to top, rgba(10,37,64,0.9) 0%, transparent 60%)',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      spacing: { '18': '4.5rem', '22': '5.5rem', '30': '7.5rem', '36': '9rem' },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
};
