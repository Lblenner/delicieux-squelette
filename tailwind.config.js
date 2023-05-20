/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'primary': '#57962c',
        'primary-light': '#bcdc9f',
        'secondary': '#550060',  
        'secondary-light': '#ba5da5',  
        'secondary-medium': '#824173'

      },
    },
  },
  plugins: [],
}
 //https://materialpalettes.com/