import type { Config } from 'tailwindcss'

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          50: '#f0f0f7',
          100: '#d4d4eb',
          500: '#3a3a6e',
          900: '#1a1a2e',
        },
        accent: {
          DEFAULT: '#e94560',
          50: '#fef0f3',
          100: '#fdd4db',
          500: '#e94560',
          600: '#c73650',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
}

export default config
