<script setup>

useSeoMeta({
  title: 'Dashboard Pelanggan',
  description: 'This is Pelanggan page',
})

definePageMeta({
  layout: false,
  middleware: 'auth'
});

</script>

<template>
    Halo saya Pelanggan
</template>