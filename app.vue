<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (process.client) {
    import('flowbite').then(({ initFlowbite }) => {
      initFlowbite()
    })
  }
})
</script>