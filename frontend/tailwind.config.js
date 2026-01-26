/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Original colors (kept for compatibility)
        bitcoin: '#F7931A',
        stacks: '#5546FF',
        
        // Wooden Theme Palette
        wood: {
          light: '#d4a574',
          medium: '#b8860b',
          dark: '#8b4513',
          darker: '#5d3a1a',
          darkest: '#3d2914',
        },
        mahogany: {
          light: '#c19a6b',
          DEFAULT: '#a0522d',
          dark: '#6b3a2e',
        },
        oak: {
          light: '#deb887',
          DEFAULT: '#cd853f',
          dark: '#a0522d',
        },
        walnut: {
          light: '#9c7653',
          DEFAULT: '#5d432c',
          dark: '#3d2b1f',
        },
        cream: '#f5f0e6',
        parchment: '#e8dcc8',
        aged: '#c4b69c',
        gold: {
          accent: '#daa520',
          light: '#ffd700',
        },
        copper: '#b87333',
        brass: '#b5a642',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        body: ['Crimson Pro', 'Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'carved': 'inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -1px -1px 2px rgba(255, 255, 255, 0.05)',
        'raised': '4px 4px 8px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 0.02)',
        'embossed': '0 2px 4px rgba(0, 0, 0, 0.3), 0 -1px 2px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'wood-grain': 'linear-gradient(135deg, #2c1810 0%, #3d2419 25%, #4a2c1c 50%, #3d2419 75%, #2c1810 100%)',
        'wood-vertical': 'linear-gradient(180deg, #3d2b1f 0%, #2c1810 10%, #3d2419 90%, #3d2b1f 100%)',
      },
    },
  },
  plugins: [],
}
