<script setup>

useSeoMeta({
    title: 'Homepage Admin',
    description: 'This is Admin page',
})

definePageMeta({
    layout: "admin",
    middleware: 'auth'
});

const token = useCookie("auth-token").value
const page = ref(1)
const toast = useToast()
const previewImg = ref(false)
const file = ref()
const previewUrl = ref()
const isImage = ref()

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

/* const selectedColumns = ref([...columns]) */

const formData = ref({
    kategori_id: '',
    kode_produk: '',
    nama_produk: '',
    gambar: '',
    query: '',
    s: ''
})

const { data: produks, pending, refresh: refreshProduk } = await useFetch(() => `http://be-zakkipedia.test/api/v1/produk?page=${page.value}&q=${formData.value.s}`, {
    headers: header,
    key: `produkPage-${page.value}`,
    lazy: true,
})
console.log(produks)

const modal = [];

const sortKey = ref('') // default sort key
const sortOrder = ref('asc') // default sort order

const sortedProduks = computed(() => {
    if (!produks.value.data.records) return []
    return produks.value.data.records.slice().sort((a, b) => {
        if (sortKey.value === 'kode_produk') {
            return sortOrder.value === 'asc'
                ? a.kode_produk.localeCompare(b.kode_produk)
                : b.kode_produk.localeCompare(a.kode_produk)
        } else if (sortKey.value === 'nama_produk') {
            return sortOrder.value === 'asc'
                ? a.nama_produk.localeCompare(b.nama_produk)
                : b.nama_produk.localeCompare(a.nama_produk)
        } else if (sortKey.value === 'nama_kategori') {
            return sortOrder.value === 'asc'
                ? a.kategori.nama_kategori.localeCompare(b.kategori.nama_kategori)
                : b.kategori.nama_kategori.localeCompare(a.kategori.nama_kategori)
        } else if (sortKey.value === 'stok') {
            return sortOrder.value === 'asc'
                ? a.stok.localeCompare(b.stok)
                : b.stok.localeCompare(a.stok)
        } else if (sortKey.value === 'gambar') {
            return sortOrder.value === 'asc'
                ? a.gambar.localeCompare(b.gambar)
                : b.gambar.localeCompare(a.gambar)
        }
        return 0
    })
})

const hideModal = (id) => {
    modal[id].classList.add("hidden")
    formData.value.kategori_id = ''
    formData.value.nama_produk = ''
    formData.value.gambar = ''
    file.value = null
    previewUrl.value = null
    isImage.value = null
}

function search() {
    formData.value.s = formData.value.query
    refreshProduk()
}

function refresh() {
    formData.value = {
        s: '',
    };
    refreshProduk();
}

const links = [{
    label: 'Homepage',
    to: '/admin',
    icon: 'i-heroicons-home-solid'
}, {
    label: 'Produk',
    to: '/admin/produk',
    icon: 'i-heroicons-cube-solid'
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
            <div v-if="produks.data.paging.total_record == 0">
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

                        <!-- Heading -->
                        <p class="text-[#c8a876] text-lg font-semibold">
                            Belum Ada Data Produk
                        </p>

                        <!-- Description -->
                        <p class="text-[#8c857a] text-sm max-w-xs md:max-w-md my-2">
                            Data produk masih kosong. Silakan menambahkan data produk baru.
                        </p>

                        <div
                            class="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-md mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
                            <button @click="refresh"
                                class="inline-flex justify-center items-center px-6 lg:px-10 py-2 bg-[#c8a876] hover:bg-[#b89b6c] text-white text-sm font-medium rounded-md shadow transition duration-300">
                                Refresh Halaman
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="shadow-lg sm:rounded-lg pl-4 pr-4 pt-2 pb-4 mt-4 bg-[#f9f5ee] border border-[#e0d6c3]">
                <div class="flex flex-col sm:flex-row flex-wrap sm:space-y-0 items-center justify-between py-2 px-2">
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
                                    placeholder="Search kode produk">
                            </div>
                            <button type="submit"
                                class="text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2 ms-2 shadow-md transition duration-300">
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                <div class="relative overflow-x-scroll pb-5 px-2 flex flex-wrap gap-4 md:flex-row">
                    <div v-for="(produk, index) in sortedProduks" :key="index"
                        class="w-full md:w-[50%] lg:w-[32%] px-6 py-4 rounded-xl shadow-xl bg-[#fdfaf4] border-4 border-[#e0d6c3] mt-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                        <h2 class="text-xl font-bold text-[#4a453e] mb-2">{{ produk.nama_produk }}</h2>
                        <div class="bg-[#f8f2e7] p-4 mb-4 rounded-lg shadow-inner">
                            <div class="font-medium text-[#4a453e] mb-2">Kode Produk: {{ produk.kode_produk }}</div>
                            <div class="text-sm text-[#4a453e] mb-1">Produk: {{ produk.nama_produk }}</div>
                            <div class="text-sm text-[#4a453e]">Kategori: {{ produk.kategori.nama_kategori }}</div>
                            <div class="flex justify-center items-center py-3">
                                <img :src="produk.gambar"
                                    class="h-20 w-20 object-cover rounded-full border-2 border-[#c8a876]">
                            </div>
                            <div class="flex space-x-3 justify-center">
                                <NuxtLink :to="`/admin/produk/produkDetail-${produk.id}`">
                                    <button type="button"
                                        class="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center">
                                        <UIcon name="i-heroicons-eye-16-solid" class="w-4 h-4" />
                                    </button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="produks.data.paging.total_record != 0"
                class="flex flex-col md:flex-row items-center justify-between w-full space-y-2 md:space-y-0 pt-4 pb-6">
                <!-- Informasi Paging -->
                <p class="text-xs text-gray-500 font-normal italic text-center md:text-left">
                    Tampilkan {{ produks.data.paging.record_from }}-{{
                        produks.data.paging.record_to }} dari {{ produks.data.paging.total_record }}
                </p>

                <!-- Pagination -->
                <UPagination class="flex flex-wrap justify-center md:justify-end pt-2 pb-2 px-4" v-model="page"
                    :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                    :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
                    :page-count="10" :total="produks.data.paging.total_record" />
            </div>
        </div>
    </div>
</template>