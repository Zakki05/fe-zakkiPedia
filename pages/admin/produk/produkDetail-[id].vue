<script setup>

useSeoMeta({
    title: 'Homepage Admin',
    description: 'This is Admin Page',
})

definePageMeta({
    layout: "admin",
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
    label: 'Homepage',
    to: '/admin',
    icon: 'i-heroicons-home-solid'
}, {
    label: 'Produk',
    to: '/admin/produk',
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
                    <NuxtLink to="/admin/produk"
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
            <div class="gap-4 mt-6">
                <!-- Card Hasil Input Detail Produk -->
                <div class="bg-white p-6 border-2 border-[#e0d6c3] rounded-lg shadow-lg">
                    <h5 class="text-lg font-medium text-[#4a453e] mb-6">Detail Produk {{ produk.nama_produk }}</h5>
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(produkDetail, index) in produkDetails.data.records" :key="index"
                                    class="bg-white border-b hover:bg-[#f0e5d1] border-[#e0d6c3] text-center">
                                    <td class="border px-4 py-2">{{ index + 1 }}</td>
                                    <td class="border px-4 py-2">{{ produkDetail.ukuran }}</td>
                                    <td class="border px-2 py-2">{{ produkDetail.stok }}</td>
                                    <td class="border px-3 py-2">Rp. {{ formatRupiah(produkDetail.harga) }}</td>
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