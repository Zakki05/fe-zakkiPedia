export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite()
      })
    }
  })