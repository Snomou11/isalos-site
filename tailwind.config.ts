import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        isalos: {
          blue:      '#2B6CB0',
          lightblue: '#90CDF4',
          sand:      '#F5E6C8',
          white:     '#FAFAF8',
          stone:     '#8B7355',
          dark:      '#1A365D',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
