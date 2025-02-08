<script setup>

useSeoMeta({
    title: 'Homepage Admin',
    description: 'This is Super Admin page',
})

definePageMeta({
    layout: "admin",
    middleware: 'auth'
});

const token = useCookie("auth-token").value
const toast = useToast()
const page = ref(1)

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const formData = ref({
    pelanggan_id: '',
    ongkir_id: '',
    pembayaran_id: '',
    kode_pemesanan: '',
    tanggal: '',
    kecamatan: '',
    kelurahan: '',
    alamat: '',
    kode_pos: '',
    status: '',
    total_pemesanan: '',
    biaya: '',
    subtotal: '',
    query: '',
    s: ''
})

const { data: pemesanans, pending, refresh: refreshPemesanan } = await useFetch(() => `http://be-zakkiPedia.test/api/v1/getPemesananAdmin?&q=${formData.value.s}&status=Dipesan&page=${page.value}`, {
    headers: header,
    key: `pemesananPage-${page.value}`,
    lazy: true,
})
console.log(pemesanans)

const { data: pelanggans } = await useFetch(() => `http://be-zakkiPedia.test/api/v1/pelanggan`, {
    headers: header,
})

const { data: ongkirs } = await useFetch(() => `http://be-zakkiPedia.test/api/v1/ongkir`, {
    headers: header,
})

const { data: pembayarans } = await useFetch(() => `http://be-zakkiPedia.test/api/v1/pembayarans`, {
    headers: header,
})

function search() {
    formData.value.s = formData.value.query
    refreshPemesanan()
}

function refresh() {
    formData.value = {
        s: '',
    };
    refreshPemesanan();
}

const links = [{
    label: 'Homepage',
    to: '/admin',
    icon: 'i-heroicons-home-solid'
}, {
    label: 'Dipesan',
    to: '/admin/pesanan',
    icon: 'i-heroicons-shopping-cart-solid'
}]


</script>

<template>
    <div>
        <nav class="flex px-5 py-3 text-[#c8a876] rounded-lg bg-[#f9f5ee] border border-[#e0d6c3]">
            <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
                <template #divider>
                    <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </template>
            </UBreadcrumb>
        </nav>

        <div v-if="pending">
            <AppLoading title="loading">
            </AppLoading>
        </div>

        <div v-else>
            <div v-if="pemesanans.data.paging.total_record == 0">
                <div class="text-center py-6 bg-[#f9f5ee] border border-[#e0d6c3] rounded-md shadow-md mx-auto my-8">
                    <div class="flex flex-col items-center my-3 mx-5">
                        <!-- Icon -->
                        <div class="bg-[#f0e5d1] p-3 rounded-full my-3 mx-5 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#c8a876]" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>

                        <p class="text-[#c8a876] text-lg font-semibold">
                            Belum Ada Data Pesanan Dipesan
                        </p>

                        <p class="text-[#8c857a] text-sm max-w-xs md:max-w-md my-2">
                            Data Pesanan Dipesan masih kosong. Silakan menambahkan data pesanan baru.
                        </p>

                        <div
                            class="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-md mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
                            <button @click="refresh"
                                class="inline-flex justify-center items-center px-6 lg:px-10 py-2 bg-[#c8a876] hover:bg-[#b89b6c] text-white text-sm font-medium rounded-md shadow transition duration-300">
                                Refresh Halaman
                            </button>

                            <NuxtLink to="/admin/pesanan">
                                <button
                                    class="inline-flex justify-center items-center px-6 lg:px-10 py-2 bg-[#c8a876] hover:bg-[#b89b6c] text-white text-sm font-medium rounded-md shadow transition duration-300">
                                    + Tambah Pesanan
                                </button>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="shadow-lg sm:rounded-lg pl-4 pr-4 pt-2 pb-4 mt-4 bg-[#f9f5ee] border border-[#e0d6c3]">
                <div class="flex flex-col sm:flex-row flex-wrap sm:space-y-0 items-center justify-between pb-4">
                    <!-- Bagian Form -->
                    <div
                        class="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                        <form class="flex flex-row items-center w-full sm:w-auto" @submit.prevent="search()">
                            <label for="table-search" class="sr-only">Search</label>
                            <div class="relative flex-grow sm:flex-grow-0">
                                <div
                                    class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-5 h-5 text-[#c8a876]" aria-hidden="true" fill="currentColor"
                                        viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <input type="text" id="table-search" v-model="formData.query"
                                    class="block p-2 ps-10 text-sm w-full text-[#4a453e] border border-[#c8a876] rounded-lg bg-white focus:ring-[#c8a876] focus:border-[#c8a876]"
                                    placeholder="Search kode pemesanan">
                            </div>
                            <button type="submit"
                                class="text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2 ms-2 shadow-md transition duration-300">
                                Search
                            </button>
                        </form>
                    </div>
                    <!-- Bagian Tombol Tambahan -->
                    <div class="w-full sm:w-auto flex justify-center sm:justify-end mt-3 sm:mt-0">
                        <NuxtLink to="/admin/pesanan">
                            <button type="button"
                                class="flex items-center w-full sm:w-auto text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2.5 text-center shadow-md transition duration-300">
                                <UIcon name="i-heroicons-plus-circle-16-solid" class="w-4 h-4 mr-2"></UIcon>
                                Buat Pesanan Baru
                            </button>
                        </NuxtLink>
                    </div>
                </div>

                <div class="relative overflow-x-scroll">
                    <DesktopAdminPesananDipesan></DesktopAdminPesananDipesan>

                    <MobileAdminPesananDipesan></MobileAdminPesananDipesan>
                </div>
            </div>

            <div v-if="pemesanans.data.paging.total_record != 0"
                class="flex flex-col md:flex-row items-center justify-between w-full space-y-2 md:space-y-0 pt-4 pb-6">
                <!-- Informasi Paging -->
                <p class="text-xs text-gray-500 font-normal italic text-center md:text-left">
                    Tampilkan {{ pemesanans.data.paging.record_from }}-{{
                        pemesanans.data.paging.record_to }} dari {{ pemesanans.data.paging.total_record }}
                </p>

                <!-- Pagination -->
                <UPagination class="flex flex-wrap justify-center md:justify-end pt-2 pb-2 px-4" v-model="page"
                    :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                    :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                    :page-count="10" :total="pemesanans.data.paging.total_record" />
            </div>
        </div>
    </div>
</template>