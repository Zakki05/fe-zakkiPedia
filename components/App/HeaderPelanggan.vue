<script setup>

const token = useCookie("auth-token").value
const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
const userStore = useUserStore()
const pelanggan = userStore.pelanggan

const items = [
    [{
        label: pelanggan.user.username,
        slot: 'username',
        disabled: true
    }],
    [{
        label: pelanggan.user.email,
        slot: 'email',
        disabled: true
    }],
    [{
        label: 'Sign out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: async () => {
            const res = await $fetch("http://be-zakkipedia.test/api/v1/logout", {
                headers: {
                    'Authorization': `Bearer ${userStore.token}`,
                },
                method: 'POST'
            })

            console.log(res)
            await userStore.logout()
            await navigateTo('/auth')
        }
    }]
]

const route = useRoute()

const isActive = (path) => {
    return route.path === path
};

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

</script>

<template>
    <div class="relative overflow-hidden bg-sky-700 pb-32">
        <nav class="bg-transparent relative z-10 border-b border-white border-opacity-25 lg:border-none lg:bg-transparent"
            x-state:on="Menu open" x-state:off="Menu closed" :class="{ 'bg-white': open, 'bg-transparent': !(open) }">
            <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div class="relative flex h-16 items-center justify-between lg:border-b lg:border-white">
                    <div class="flex items-center px-2 lg:px-0">
                        <div class="flex-shrink-0">
                            <img class="block h-8 w-auto" src="~/assets/images/ZakkiPedia.png" alt="House in Umbria">
                        </div>
                        <div class="hidden lg:ml-6 lg:block lg:space-x-4">
                            <div class="flex">
                                <p class="py-2 px-1 text-white text-lg font-medium">
                                    Selamat Datang, {{ pelanggan.nama_lengkap }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-1 justify-end items-center px-2 lg:ml-6">
                        <div class="flex-none h-full text-center mr-4">
                            <NuxtLink to="/pelanggan/keranjang">
                                <UIcon name="i-heroicons-shopping-cart-solid"
                                    class="text-3xl font-bold tracking-tight text-white hover:text-[#e8e8e5] h-7 w-7 mr-2" />
                            </NuxtLink>
                        </div>
                        <div class="flex-none h-full text-center">
                            <div
                                class="flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 rounded-xl bg-[#c8a876] py-1 lg:py-1.5 hover:text-black hover:bg-[#b49463] hover:-translate-y-1 transition-all duration-500">
                                <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                                    :popper="{ placement: 'bottom-end' }">
                                    <UAvatar
                                        :src="`https://api.dicebear.com/5.x/initials/svg?seed=${pelanggan.user.username}`" />
                                    <template #username="{ item }">
                                        <div class="truncate font-medium text-gray-900">
                                            <p>
                                                Welcome {{ item.label }}
                                            </p>
                                        </div>
                                    </template>
                                    <template #email="{ item }">
                                        <p class="truncate font-medium text-gray-900">
                                            {{ item.label }}
                                        </p>
                                    </template>

                                    <template #item="{ item }">
                                        <span class="truncate">{{ item.label }}</span>
                                        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto" />
                                    </template>
                                </UDropdown>
                                <div class="hidden lg:block text-sm text-white font-medium tracking-tight">
                                    {{ pelanggan.user.username }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div aria-hidden="true" x-state:on="Menu open" x-state:off="Menu closed"
            class="inset-y-0 absolute inset-x-0 left-1/2 w-full -translate-x-1/2 transform overflow-hidden lg:inset-y-0"
            :class="{ 'bottom-0': open, 'inset-y-0': !(open) }">
            <div class="absolute inset-0 flex">
                <div class="h-full w-1/2" style="background-color: #0a527b"></div>
                <div class="h-full w-1/2" style="background-color: #065d8c"></div>
            </div>
            <div class="relative flex justify-center">
                <svg class="flex-shrink-0" width="1750" height="308" viewBox="0 0 1750 308"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M284.161 308H1465.84L875.001 182.413 284.161 308z" fill="#c8a876"></path>
                    <path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#b49463"></path>
                    <path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#967a51"></path>
                    <path d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z" fill="#705839"></path>
                </svg>
            </div>
        </div>
        <header class="relative py-6">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold tracking-tight text-white">Home</h1>
                </div>
            </div>
        </header>
    </div>
</template>