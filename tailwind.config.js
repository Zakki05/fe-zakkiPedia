/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c8a876', // Warna emas/krem
          50: '#f9f5ee',      // Warna background
          100: '#f3ece2',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

