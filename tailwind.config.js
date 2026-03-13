/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        '3xl': '64px',
      },
      colors: {
        brand: {
          gold: '#c5a059',
          dark: '#0f172a',
          darker: '#020617',
        }
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'ripple': 'ripple 3s linear infinite',
        'shine': 'shine 1s linear infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'shine': {
          'from': { left: '-100%' },
          'to': { left: '100%' }
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        }
      }
    }
  },
  plugins: [],
}
