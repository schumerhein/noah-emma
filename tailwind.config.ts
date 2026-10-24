
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        // Warme aubergine-grijzen uit de website (tekst #241A2E, subtekst
        // #5B4F63) in plaats van Tailwinds koele blauwgrijze "slate". Zo
        // krijgen alle bestaande slate-klassen in de app vanzelf de huisstijl.
        slate: {
          50: '#FAF7F9',
          100: '#F4EEF2',
          200: '#E8E0E7',
          300: '#D3C8D3',
          400: '#A99DAC',
          500: '#7D7083',
          600: '#5B4F63',
          700: '#463B4F',
          800: '#33293C',
          900: '#241A2E',
          950: '#170F1F',
        },
        // Merkkleuren van de website: Emma-roze en Noah-blauw.
        roze: {
          50: '#FFF4F8',
          100: '#FFEAF1',
          400: '#FF8FB3',
          500: '#FF6F9C',
          600: '#D63D74',
          700: '#B42F60',
        },
        blauw: {
          50: '#F2FAFD',
          100: '#E4F4FB',
          400: '#3FA9DB',
          600: '#1C7FA8',
          700: '#16698B',
        },
        inkt: '#241A2E',
        'background-light': 'hsl(var(--background))',
        'background-dark': 'hsl(var(--background))',
        'primary-dark': 'hsl(var(--primary-dark))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        // De zachte schaduwen van de website (kaarten en knoppen).
        zacht: '0 12px 30px -14px rgba(36, 26, 46, 0.28)',
        kaart: '0 30px 60px -28px rgba(36, 26, 46, 0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'swipe-right': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(200%) rotate(20deg)', opacity: '0' },
        },
        'swipe-left': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(-200%) rotate(-20deg)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'swipe-right': 'swipe-right 0.5s ease-out forwards',
        'swipe-left': 'swipe-left 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
