/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // scan all React files
  theme: {
    extend: {
       colors: {
        customBlue: '#5470a9',
        hoverYellow : '#ff9b20',
         hoverYellowLight : '#ffb84d',
         customGreyLight : '#f7f7f7'
      }
    },
  },
  plugins: [],
};