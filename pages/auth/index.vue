<script setup lang="ts">

useSeoMeta({
  title: 'Login',
  description: 'This is Login page',
})

definePageMeta({
  layout: false,
  middleware: 'already-auth'
});

</script>

<template>
    <SectionAuthLogin></SectionAuthLogin>
</template>
