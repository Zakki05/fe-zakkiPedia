<script setup>

useSeoMeta({
    title: 'Dashboard - Produk Detail',
    description: 'This is Create User',
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

const token = useCookie('auth-token').value
const router = useRouter()
const userStore = useUserStore()
const toast = useToast();
const route = useRoute();

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const formData = ref({
    produk_id: route.params.id,
    ukuran: '',
    stok: '',
    harga: '',
})

const errors = ref({});

const { data: produkDetails, pending, refresh } = useFetch(() => `http://127.0.0.1:8000/api/v1/produkDetail?produk_id=${route.params.id}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    },
    lazy: true,
})

const { data: produks } = useFetch(`http://be-zakkiPedia.test/api/v1/produk?id=${formData.produk_id}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    }
});

const produk = computed(() => {
    return produks.value?.data.records.find(p => p.id === parseInt(route.params.id))
})

const modal = ref({});

async function tambahData() {
    try {
        const response = await $fetch('http://be-zakkiPedia.test/api/v1/produkDetail', {
            headers: {
                'Authorization': `Bearer ${userStore.token}`,
                'Accept': 'application/json'
            },
            method: 'POST',
            body: {
                produk_id: formData.value.produk_id,
                ukuran: formData.value.ukuran,
                stok: formData.value.stok,
                harga: formData.value.harga,
            }
        });
        toast.add({ title: 'Berhasil Menambahkan Detail Produk' });

        if (!response) {
            throw new Error('Gagal Menambahkan Detail Produk');
        }
        formData.value.ukuran = '';
        formData.value.stok = '';
        formData.value.harga = '';
        errors.value = {};

        refresh()
    } catch (error) {
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors;
        } else {
            console.error(error);
        }
    }
}

async function hideModal(id) {
    if (modal.value[id]) {
        modal.value[id].classList.add('hidden');
    }
    modal[id].classList.add("hidden")
    formData.value.ukuran = '';
    formData.value.stok = '';
    formData.value.harga = '';
}

async function modalDelete(id) {
    modal.value[id] = document.getElementById('modalDelete-' + id);
    if (modal.value[id]) {
        modal.value[id].classList.remove('hidden');
    }
}

const hapusData = async (id) => {
    const res = await $fetch(`http://be-zakkiPedia.test/api/v1/produkDetail/${id}`, {
        headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Accept': 'application/json'
        },
        method: "DELETE"
    })
    toast.add({ title: 'Success Hapus 1 Data Produk' })
    hideModal(id);
    refresh()
}

const editModal = async (id) => {
    modal[id] = document.getElementById('modalEdit-' + id)
    modal[id].classList.remove("hidden")

    const { data: res, pending } = await useFetch(`http://be-zakkipedia.test/api/v1/produkDetail/${id}`, {
        headers: header,
        lazy: true
    })
    console.log(res)

    const produkDetail = res.value.data.record

    formData.value.ukuran = produkDetail.ukuran
    formData.value.stok = produkDetail.stok
    formData.value.harga = produkDetail.harga
}

const updateData = async (id) => {
    const res = await $fetch(`http://be-zakkipedia.test/api/v1/produkDetail/${id}`, {
        headers: header,
        method: "PUT",
        body: {
            produk_id: formData.value.produk_id,
            ukuran: formData.value.ukuran,
            stok: formData.value.stok,
            harga: formData.value.harga,
        }
    })
    console.log(res)
    toast.add({ title: 'Berhasil Edit 1 Data Kategori' })
    hideModal(id);
    refresh()
    formData.value.ukuran = '';
    formData.value.stok = '';
    formData.value.harga = '';
}

const links = [{
    label: 'Dashboard',
    to: '/superAdmin',
    icon: 'i-heroicons-chart-pie-solid'
}, {
    label: 'Produk',
    to: '/superAdmin/produk',
    icon: 'i-heroicons-cube-solid'
}]

const formatRupiah = (value) => {
    if (typeof value !== 'number') {
        value = parseFloat(value);
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value).replace('Rp', '');
};

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

        <div v-else class="w-full p-6 mt-8 bg-[#f9f5ee] border border-[#e0d6c3] rounded-lg shadow-lg">
            <div class="mb-6 bg-white border-2 border-[#e0d6c3] rounded-lg shadow-lg p-6">
                <div class="flex items-center">
                    <NuxtLink to="/superAdmin/produk"
                        class="text-xl me-4 flex py-1 px-2 cursor-pointer text-gray-600 hover:bg-gray-200 rounded-full">
                        <UIcon name="i-heroicons-arrow-left-16-solid" class="w-5 h-5" />
                    </NuxtLink>
                    <h5 class="text-2xl font-medium text-[#4a453e]">Informasi Produk</h5>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                    <!-- Kode Produk -->
                    <div>
                        <h4 class="text-sm font-semibold text-[#4a453e] mb-1">Kode Produk:</h4>
                        <p class="text-[#4a453e]">{{ produk.kode_produk }}</p>
                    </div>
                    <!-- Nama Produk -->
                    <div>
                        <h4 class="text-sm font-semibold text-[#4a453e] mb-1">Nama Produk:</h4>
                        <p class="text-[#4a453e]">{{ produk.nama_produk }}</p>
                    </div>
                    <!-- Kategori -->
                    <div>
                        <h4 class="text-sm font-semibold text-[#4a453e] mb-1">Kategori:</h4>
                        <p class="text-[#4a453e]">{{ produk.kategori.nama_kategori }}</p>
                    </div>
                    <!-- Gambar Produk -->
                    <div>
                        <img :src="produk.gambar" alt="Gambar Produk"
                            class="w-30 h-30 object-cover rounded-full border-2 border-[#e0d6c3]">
                    </div>
                </div>
            </div>


            <!-- Form Input dan Hasil Detail Produk -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <!-- Card Form Input Detail Produk -->
                <div class="bg-white p-6 border-2 border-[#e0d6c3] rounded-lg shadow-lg">
                    <h5 class="text-lg font-medium text-[#4a453e] mb-4">Tambah Detail Produk</h5>
                    <form @submit.prevent="tambahData" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-[#4a453e] mb-2">Ukuran</label>
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center">
                                    <input id="size-s" type="radio" name="size" value="S" v-model="formData.ukuran"
                                        class="w-4 h-4 text-[#c8a876] border-[#e0d6c3] focus:ring-[#c8a876]">
                                    <label for="size-s" class="ml-2 text-sm font-medium text-[#4a453e]">S</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="size-m" type="radio" name="size" value="M" v-model="formData.ukuran"
                                        class="w-4 h-4 text-[#c8a876] border-[#e0d6c3] focus:ring-[#c8a876]">
                                    <label for="size-m" class="ml-2 text-sm font-medium text-[#4a453e]">M</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="size-l" type="radio" name="size" value="L" v-model="formData.ukuran"
                                        class="w-4 h-4 text-[#c8a876] border-[#e0d6c3] focus:ring-[#c8a876]">
                                    <label for="size-l" class="ml-2 text-sm font-medium text-[#4a453e]">L</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="size-xl" type="radio" name="size" value="XL" v-model="formData.ukuran"
                                        class="w-4 h-4 text-[#c8a876] border-[#e0d6c3] focus:ring-[#c8a876]">
                                    <label for="size-xl" class="ml-2 text-sm font-medium text-[#4a453e]">XL</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label for="stok" class="block text-sm font-medium text-[#4a453e] mb-2">Stok</label>
                            <input id="stok" type="number" v-model="formData.stok" placeholder="Masukkan stok produk"
                                class="block w-full p-2.5 border border-[#e0d6c3] rounded-lg focus:ring-[#c8a876] focus:border-[#c8a876] text-[#4a453e] text-sm">
                        </div>

                        <div>
                            <label for="harga" class="block text-sm font-medium text-[#4a453e] mb-2">Harga</label>
                            <input id="harga" type="number" v-model="formData.harga" placeholder="Masukkan harga produk"
                                class="block w-full p-2.5 border border-[#e0d6c3] rounded-lg focus:ring-[#c8a876] focus:border-[#c8a876] text-[#4a453e] text-sm">
                        </div>

                        <div class="flex justify-center">
                            <button type="submit"
                                class="text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2.5">
                                Simpan Detail
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Card Hasil Input Detail Produk -->
                <div class="bg-white p-6 border-2 border-[#e0d6c3] rounded-lg shadow-lg">
                    <h5 class="text-lg font-medium text-[#4a453e] mb-8">Detail Produk {{ produk.nama_produk }}</h5>
                    <div v-if="produkDetails.data.records.length == 0"
                        class="text-center p-10 rounded-xl shadow-lg max-w-md mx-auto space-y-6 justify-center bg-[#c8a876] hover:bg-[#b89b6c] transition-all duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 mx-auto text-white animate-pulse"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9L15 15M15 9L9 15" />
                        </svg>
                        <p class="text-2xl font-semibold text-white">Oops, Detail produk masih kosong!</p>
                    </div>

                    <div v-else>
                        <table class="w-full text-sm text-left rtl:text-right text-[#4a453e]">
                            <thead class="text-xs text-white uppercase bg-[#c8a876]">
                                <tr class="text-center">
                                    <th class="py-2">No</th>
                                    <th class="py-2">Ukuran</th>
                                    <th class="py-2">Stok</th>
                                    <th class="py-2">Harga</th>
                                    <th class="py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(produkDetail, index) in produkDetails.data.records" :key="index"
                                    class="bg-white border-b border-[#e0d6c3] text-center">
                                    <td class="border px-4 py-2">{{ index + 1 }}</td>
                                    <td class="border px-4 py-2">{{ produkDetail.ukuran }}</td>
                                    <td class="border px-2 py-2">{{ produkDetail.stok }}</td>
                                    <td class="border px-3 py-2">Rp. {{ formatRupiah(produkDetail.harga) }}</td>
                                    <td class="border px-4 py-2 text-center">
                                        <div class="space-x-2">
                                            <button type="button" @click="editModal(produkDetail.id)"
                                                class="text-yellow-300 hover:underline mt-1">
                                                <UIcon name="i-heroicons-pencil-square-16-solid" class="w-4 h-4" />
                                            </button>

                                            <button type="button" @click="modalDelete(produkDetail.id)"
                                                class="text-red-600 hover:underline">
                                                <UIcon name="i-heroicons-trash-solid" class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>

                                    <!-- MODAL DELETE -->
                                    <td>
                                        <div :id="`modalDelete-${produkDetail.id}`" tabindex="-1"
                                            class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full">
                                            <div class="relative p-4 w-full max-w-md max-h-full">
                                                <div class="relative bg-white rounded-lg shadow">
                                                    <button type="button" @click="hideModal(produkDetail.id)"
                                                        class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                                        <svg class="w-3 h-3" aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                                            viewBox="0 0 14 14">
                                                            <path stroke="currentColor" stroke-linecap="round"
                                                                stroke-linejoin="round" stroke-width="2"
                                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                    <div class="p-4 md:p-5 text-center">
                                                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12"
                                                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                            fill="none" viewBox="0 0 20 20">
                                                            <path stroke="currentColor" stroke-linecap="round"
                                                                stroke-linejoin="round" stroke-width="2"
                                                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                        <h3 class="mb-5 text-lg font-normal text-gray-500">Apakah
                                                            kamu yakin
                                                            menghapus
                                                            produk "{{ produkDetail.produk.nama_produk }}" ukuran {{
                                                                produkDetail.ukuran }}</h3>
                                                        <button type="button" @click="hideModal(produkDetail.id)"
                                                            class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100">No,
                                                            cancel</button>
                                                        <button type="button" @click="hapusData(produkDetail.id)"
                                                            class="text-white ms-3 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                                            Saya setuju
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- MODAL EDIT -->
                                    <td>
                                        <div :id="`modalEdit-${produkDetail.id}`" tabindex="-1" aria-hidden="true"
                                            class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full">
                                            <div class="relative p-4 w-full max-w-md max-h-full">
                                                <!-- Modal content -->
                                                <div class="relative bg-white rounded-lg shadow">
                                                    <!-- Modal header -->
                                                    <div
                                                        class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
                                                        <h3 class="text-lg font-semibold text-white">
                                                            Edit Detail Produk
                                                        </h3>
                                                        <button type="button" @click="hideModal(produkDetail.id)"
                                                            class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                                            <svg class="w-3 h-3" aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                viewBox="0 0 14 14">
                                                                <path stroke="currentColor" stroke-linecap="round"
                                                                    stroke-linejoin="round" stroke-width="2"
                                                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                            </svg>
                                                            <span class="sr-only">Close modal</span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal body -->
                                                    <form class="p-4 md:p-5"
                                                        @submit.prevent="updateData(produkDetail.id)">
                                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                                            <div class="col-span-2">
                                                                <label
                                                                    class="block mb-2 text-sm font-medium text-gray-900 text-left">
                                                                    Ukuran
                                                                </label>
                                                                <input type="text" v-model="formData.ukuran" disabled
                                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                    placeholder="Input Ukuran" required="">
                                                            </div>
                                                            <div class="col-span-2">
                                                                <label
                                                                    class="block mb-2 text-sm font-medium text-gray-900 text-left">
                                                                    Stok
                                                                </label>
                                                                <input type="text" v-model="formData.stok"
                                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                    placeholder="Input stok" required="">
                                                            </div>
                                                            <div class="col-span-2">
                                                                <label
                                                                    class="block mb-2 text-sm font-medium text-gray-900 text-left">
                                                                    Harga
                                                                </label>
                                                                <input type="text" v-model="formData.harga"
                                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                    placeholder="Input Harga" required="">
                                                            </div>
                                                        </div>
                                                        <button type="submit"
                                                            class="text-white bg-[#c8a876] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#c8a876]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-1">
                                                            <UIcon name="i-heroicons-pencil-square-solid"
                                                                class="mr-2 w-4 h-4" />
                                                            Edit Data Detail Produk
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.date-pick::-webkit-calendar-picker-indicator {
    background: black;
    opacity: 20%;
}
</style>