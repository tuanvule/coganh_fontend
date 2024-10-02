/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'emoji': ['"Segoe UI Emoji"', 'sans-serif'],
    },
    extend: {
      keyframes: {
        deleteChessAnimation: {
          "0%": { transform: "translate(0.1px,0.1px) rotate(0deg);"},
          "10%": { transform: "translate(-0.1px,-0.2px) rotate(-1deg);" },
          "20%": { transform: "translate(-0.3px,0.0px) rotate(1deg);" },
          "30%": { transform: "translate(0.3px,0.2px) rotate(0deg);" },
          "40%": { transform: "translate(0.1px,-0.1px) rotate(1deg);" },
          "50%": { transform: "translate(-0.1px,0.2px) rotate(-1deg);" },
          "60%": { transform: "translate(-0.3px,0.1px) rotate(0deg);" },
          "70%": { transform: "translate(0.3px,0.1px) rotate(-1deg);" },
          "80%": { transform: "translate(-0.1px,-0.1px) rotate(1deg);" },
          "90%": { transform: "translate(0.1px,0.2px) rotate(0deg);" },
          "100%": { transform: "translate(0.1px,-0.2px) rotate(-1deg);", display: "none;"}
      },
        close_code: {
          '0%': { height: 'auto' },
          '100%': { height: '0' },
        },
        open_code: {
          '0%': { height: '0' },
          '100%': { height: '400px' },
        },
        moveIn: {
          '0%': { right: '-24rem' },
          '100%': { right: '3.5rem' },
        },
        moveNotification: {
          '0%': { right: '-13rem', opcity: '1' },
          '20%': { right: '-0.25rem', opacity: '1'},
          '100%': { opacity: '0', display: 'none'}
        },
        moveSigninModalToLeft: {
          '0%': { margin: 'auto 5rem auto 52%', width: '40%'},
          '100%': { margin: 'auto 52% auto 5rem', width: '40%'},
        },
        moveSignupModalToLeft: {
          '0%': { margin: 'auto 52% auto 5rem', width: '40%'},
          '100%': { margin: 'auto 5rem auto 53.9%', width: '40%'},
        },
        enlarge: {
          '0%': { transform: 'scale(0,0)' },
          '100%': { transform: 'scale(1,1)' }
        },  
        
        informationAppears: {
          '0%': { translate : '0 -100%', scale: '0.6' },
          '100%': { translate : '0 0', scale: '1' }
        }
      },
      textShadow: {
        sm: '1px 1px 2px var(--tw-shadow-color)',
        DEFAULT: '2px 2px 4px var(--tw-shadow-color)',
        lg: '4px 4px 8px var(--tw-shadow-color)',
        xl: '4px 4px 16px var(--tw-shadow-color)',
      },
      animation: {
        close_code: 'close_code .5s ease-in-out',
        open_code: 'open_code .5s ease-in-out',
        moveIn: 'moveIn 0.5s ease-in-out',
        moveNotification: 'moveNotification 2s ease-in',
        moveSigninModalToLeft: 'moveSigninModalToLeft .6s ease-in-out forwards',
        moveSignupModalToLeft: 'moveSignupModalToLeft .6s ease-in-out forwards',
        enlarge: 'enlarge .3s ease-in-out',
        informationAppears: 'informationAppears .25s ease-in-out',
        deleteChessAnimation: "deleteChessAnimation 0.5s linear forwards"
      },
    },
  },
  plugins: [],
}
