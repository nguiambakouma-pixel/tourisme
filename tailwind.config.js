/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Charte StayEatSee+ (extraite du logo) ──────────────────────────
        brand:  { DEFAULT: '#1A3C7A', dark: '#122C5E', light: '#254FA3', pale: '#EBF0FA' },
        accent: { DEFAULT: '#D4572A', dark: '#B04520', light: '#E87A50', pale: '#FCF0EB' },
        sky:    { DEFAULT: '#3EABD4', dark: '#2A87AD', light: '#6DC4E4', pale: '#E8F5FB' },
        // ── Neutres ────────────────────────────────────────────────────────
        sand:   { DEFAULT: '#F5E6D3', dark: '#E8C9A0', light: '#FAF2E8' },
      },
      fontFamily: {
        sans:  ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'brand':  '0 8px 32px rgba(26,60,122,0.28)',
        'accent': '0 8px 32px rgba(212,87,42,0.30)',
        'sky':    '0 8px 32px rgba(62,171,212,0.25)',
        'xl2':    '0 24px 80px rgba(26,60,122,0.18)',
        'glass':  '0 8px 32px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #122C5E 0%, #1A3C7A 100%)',
        'gradient-sky':    'linear-gradient(135deg, #2A87AD 0%, #3EABD4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #B04520 0%, #D4572A 100%)',
        'gradient-hero':   'linear-gradient(135deg, rgba(26,60,122,0.88) 0%, rgba(62,171,212,0.50) 100%)',
        'gradient-card':   'linear-gradient(to top, rgba(26,60,122,0.90) 0%, transparent 60%)',
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
