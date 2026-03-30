/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem',   { lineHeight: '1.1',  fontWeight: '700' }],
        'display-lg': ['3rem',     { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['2.25rem',  { lineHeight: '1.2',  fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-lg': ['1.5rem',   { lineHeight: '1.3',  fontWeight: '600' }],
        'heading-md': ['1.25rem',  { lineHeight: '1.35', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.7'  }],
        'body-md':    ['1rem',     { lineHeight: '1.6'  }],
        'body-sm':    ['0.875rem', { lineHeight: '1.5'  }],
        'label':      ['0.75rem',  { lineHeight: '1.4',  fontWeight: '500', letterSpacing: '0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.14)',
        'btn':        '0 2px 8px rgba(79,123,68,0.30)',
        'btn-orange': '0 2px 8px rgba(214,103,15,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
