// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  colorMode: {
    preference : 'light'
  },

  build: {
    transpile: ['flowbite']
  },

  plugins: [
    '~/plugins/flowbite.client.ts',
    '~/plugins/v-click-outside.js'
  ],

  compatibilityDate: '2024-12-01',
})