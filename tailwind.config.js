const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Josefin Sans"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'base-400': 'oklch(var(--primary-muted)/<alpha-value>)',
        // 'base-400': 'oklch(66.28% .24 151.4)',
        // theme: {
        //   primary: 'var(--color-primary)',
        //   // secondary: 'var(--color-secondary)',
        //   // buttons: 'var(--color-buttons)',
        //   texts: 'var(--color-texts)',
        //   // typography: 'var(--color-typography)',
        //   // primary: '#0069fe',
        //   // light: '#f7f7f7',
        //   // dark: '#151622',
        //   // 'dark-container': '#232734',
        // },
        // primary: 'var(--color-primary)',
      },
    },
  },
  important: true,
  // darkMode: 'class',
  /**
   * @see https://www.tailwindcss-animated.com/configurator.html
   */
  plugins: [require('tailwindcss-animated'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          '--primary-muted': '259 94% 71%',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '--primary-muted': '66.28% .24 151.4',
        },
      },
      {
        bumblebee: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
          '--primary-muted': '262 80% 30%',
        },
      },
      // 'dark',
      'cupcake',
      // 'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
    ],
  },
};
