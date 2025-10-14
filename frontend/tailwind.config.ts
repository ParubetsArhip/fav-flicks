export default {
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],


  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(-45deg, #000000, #1a0033, #330066, #000033, #000000)',
      },
      animation: {
        cosmic: 'cosmic 7s ease infinite',
      },
      keyframes: {
        cosmic: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}


// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         poppins: ['Poppins', 'sans-serif'],
//       },
//       backgroundImage: {
//         'cosmic-gradient': 'linear-gradient(-45deg, #000000, #1a0033, #330066, #000033, #000000)',
//       },
//       animation: {
//         cosmic: 'cosmic 7s ease infinite',
//       },
//       keyframes: {
//         cosmic: {
//           '0%': { 'background-position': '0% 50%' },
//           '50%': { 'background-position': '100% 50%' },
//           '100%': { 'background-position': '0% 50%' },
//         },
//       },
//     },
//   },
//   plugins: [],
// }

/**
 * Чтобы добавить кастомные переменные для body через Tailwind, 
 * можно использовать директиву @layer в вашем CSS (например, в src/index.css):
 * 
 * @layer base {
 *   body {
 *     @apply bg-cosmic-gradient animate-cosmic font-poppins;
 *   }
 * }
 * 
 * Это применит фон, анимацию и шрифт к body.
 * 
 * В tailwind.config.js ничего дополнительно добавлять не нужно.
 */