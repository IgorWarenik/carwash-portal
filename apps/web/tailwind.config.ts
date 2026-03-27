import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A',
          50:  '#F9F9F9',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#C8C8C8',
          400: '#A0A0A0',
          500: '#6B6B6B',
          600: '#4A4A4A',
          700: '#2E2E2E',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
        accent: {
          DEFAULT: '#0057FF',
          50:  '#EFF4FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#0057FF',
          700: '#0041CC',
          800: '#002E99',
          900: '#001E66',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        border: '#E5E5E5',
        'border-strong': '#C8C8C8',
        muted: '#6B6B6B',
        faint: '#A0A0A0',
        canvas: '#F9F9F9',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        full: '9999px',
      },
      boxShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        inner: 'inset 0 1px 0 0 #E5E5E5',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease both',
        'slide-up': 'slideUp 0.6s ease both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
