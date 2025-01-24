<template>
    <aside class="w-16 lg:w-64 bg-gray-50 flex-shrink-0 flex flex-col items-center lg:items-start py-6">
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin') }">
                <UIcon name="i-heroicons-chart-pie" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Dashboard</span>
            </NuxtLink>
        </nav>
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin/kategori" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin/kategori') }">
                <UIcon name="i-heroicons-squares-plus" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Kategori</span>
            </NuxtLink>
        </nav>
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin/produk" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin/produk') }">
                <UIcon name="i-heroicons-cube" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Produk</span>
            </NuxtLink>
        </nav>
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin/ongkir" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin/ongkir') }">
                <UIcon name="i-heroicons-truck" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Ongkir</span>
            </NuxtLink>
        </nav>
        <nav class="space-y-2 w-full">
            <button @click="toggleDropdownPesanan"
            class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4 w-full text-left">
                <UIcon name="i-heroicons-shopping-bag" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Pesanan</span>
                <UIcon :name="isDropdownOpenPesanan ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                class="hidden lg:block text-black h-4 w-4 ml-auto"/>
            </button>
            <div v-if="isDropdownOpenPesanan" class="lg:ml-8">
                <NuxtLink to="/superAdmin/pesanan" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/pesanan/dipesan') }">
                    <UIcon name="i-heroicons-plus-circle" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Buat Pesanan</span>
                </NuxtLink>
                <NuxtLink to="/superAdmin/pesanan/dipesan" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/pesanan/dipesan') }">
                    <UIcon name="i-heroicons-shopping-cart" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Dipesan</span>
                </NuxtLink>
                <NuxtLink to="/superAdmin/pesanan/dikirim" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/pesanan/dikirim') }">
                    <UIcon name="i-heroicons-truck" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Dikirim</span>
                </NuxtLink>
                <NuxtLink to="/superAdmin/pesanan/selesai" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/pesanan/selesai') }">
                    <UIcon name="i-heroicons-check-badge" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Selesai</span>
                </NuxtLink>
            </div>
        </nav>
        <nav class="space-y-2 w-full">
            <button @click="toggleDropdown"
            class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4 w-full text-left">
                <UIcon name="i-heroicons-document" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Laporan</span>
                <UIcon :name="isDropdownOpen ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                class="hidden lg:block text-black h-4 w-4 ml-auto"/>
            </button>
            <div v-if="isDropdownOpen" class="lg:ml-8">
                <NuxtLink to="/superAdmin/laporan/harian" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/laporan/harian') }">
                    <UIcon name="i-heroicons-clock" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Laporan Harian</span>
                </NuxtLink>
                <NuxtLink to="/superAdmin/laporan/bulanan" class="mb-2 group flex items-center justify-center lg:justify-start p-2 lg:px-4 lg:py-2 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
                :class="{ active: isActive('/superAdmin/laporan/bulanan') }">
                    <UIcon name="i-heroicons-calendar" class="text-black group-hover:text-black h-5 w-5" />
                    <span class="hidden lg:block truncate text-black ml-3">Laporan Bulanan</span>
                </NuxtLink>
            </div>
        </nav>
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin/user" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin/user') }">
                <UIcon name="i-heroicons-user" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">User</span>
            </NuxtLink>
        </nav>
        <nav class="space-y-4 w-full">
            <NuxtLink to="/superAdmin/akun" class="group flex flex-col lg:flex-row items-center lg:items-start lg:justify-start p-2 lg:px-4 lg:py-3 text-sm font-medium hover:border-[#c8a876] hover:bg-[#e8e8e5] hover:text-black border-l-4"
            :class="{ active: isActive('/superAdmin/akun') }">
                <UIcon name="i-heroicons-user-circle" class="text-black group-hover:text-black h-5 w-5" />
                <span class="hidden lg:block truncate text-black ml-3">Akun</span>
            </NuxtLink>
        </nav>
    </aside>
</template>

<style>

.active {
    --tw-bg-opacity: 1;
    background-color: rgba(232, 232, 229, var(--tw-bg-opacity));
    color: #e8e8e5;
    border-left-width: 4px;
    border-left-color: #c8a876;
}

</style>

<script setup>

const route = useRoute()
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const isDropdownOpenPesanan = ref(false);

const toggleDropdownPesanan = () => {
    isDropdownOpenPesanan.value = !isDropdownOpenPesanan.value;
};

const isActive = (path) => {
    return route.path === path;
};


</script>