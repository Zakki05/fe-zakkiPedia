<script setup>

useSeoMeta({
    title: 'Home Pelanggan',
    description: 'This is Pelanggan page',
})

definePageMeta({
    layout: "pelanggan",
    middleware: 'auth'
});

</script>

<template>
    <div class="divide-y divide-gray-200">
        <div>
            <h2 class="text-lg font-medium leading-6 text-gray-900">Cara Pesan Pelanggan</h2>
            <p class="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
            </p>
        </div>
    </div>
</template>