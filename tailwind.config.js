/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        'pixel-primary': '#4a90e2',
        'pixel-secondary': '#7b68ee',
        'pixel-accent': '#ff6b6b',
        'pixel-success': '#51cf66',
        'pixel-warning': '#ffd43b',
        'pixel-danger': '#ff6b6b',
        'rarity-common': '#6b7280',
        'rarity-rare': '#3b82f6',
        'rarity-epic': '#8b5cf6',
        'rarity-legendary': '#f59e0b',
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.3)',
        'pixel-md': '4px 4px 0px 0px rgba(0,0,0,0.3)',
        'pixel-lg': '6px 6px 0px 0px rgba(0,0,0,0.3)',
      },
      animation: {
        'pixel-bounce': 'pixel-bounce 1s ease-in-out',
        'pixel-wiggle': 'pixel-wiggle 0.5s ease-in-out',
        'pixel-loading': 'pixel-loading 1s linear infinite',
      },
      keyframes: {
        'pixel-bounce': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            transform: 'translate3d(0, -4px, 0)',
          },
          '70%': {
            transform: 'translate3d(0, -2px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -1px, 0)',
          },
        },
        'pixel-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        'pixel-loading': {
          '0%': { content: '"⠋"' },
          '12.5%': { content: '"⠙"' },
          '25%': { content: '"⠹"' },
          '37.5%': { content: '"⠸"' },
          '50%': { content: '"⠼"' },
          '62.5%': { content: '"⠴"' },
          '75%': { content: '"⠦"' },
          '87.5%': { content: '"⠧"' },
          '100%': { content: '"⠇"' },
        },
      },
    },
  },
  plugins: [],
}
