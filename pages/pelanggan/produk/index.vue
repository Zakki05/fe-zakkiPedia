<script setup>
useSeoMeta({
    title: 'Home Pelanggan',
    description: 'This is Pelanggan page',
})

definePageMeta({
    layout: "pelanggan",
    middleware: 'auth'
});

// Menyimpan data yang diambil dari API
const token = useCookie('auth-token').value
const router = useRouter()
const userStore = useUserStore()
const toast = useToast();
const route = useRoute();
const page = ref(1)

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const formData = ref({
    produk_id: '',
    ukuran: '',
    stok: '',
    harga: '',
    s: ''
})

// Ambil data produk detail
const { data: produkDetails } = useFetch(() => `http://127.0.0.1:8000/api/v1/produkDetail`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    },
    lazy: true,
});

// Ambil data produk
const { data: produks, pending, refresh } = useFetch(`http://be-zakkiPedia.test/api/v1/produk?page=${page.value}&q=${formData.value.s}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    }
});

const selectedSize = ref({});
const showModal = ref(false);
const selectedProduct = ref(null);
const quantity = ref(1);

// Fungsi untuk memperbarui detail berdasarkan produk dan ukuran
const showDetails = (produk_id, size) => {
    selectedSize.value[produk_id] = selectedSize.value[produk_id] || {};

    if (Array.isArray(produkDetails.value?.data?.records)) {
        const detail = produkDetails.value.data.records.find(d => d.produk.id === produk_id && d.ukuran === size);
        if (detail) {
            selectedSize.value[produk_id].size = size;
            selectedSize.value[produk_id].stok = detail.stok;
            selectedSize.value[produk_id].harga = detail.harga;
        } else {
            selectedSize.value[produk_id].stok = 'Tidak tersedia';
            selectedSize.value[produk_id].harga = 'Tidak tersedia';
        }
    } else {
        console.error("produkDetails.value.data.records is not an array:", produkDetails.value);
        selectedSize.value[produk_id].stok = 'Tidak tersedia';
        selectedSize.value[produk_id].harga = 'Tidak tersedia';
    }
}

// Fungsi untuk membuka modal
const openModal = (produk) => {
    selectedProduct.value = produk;  // Set produk yang dipilih
    showModal.value = true;
    quantity.value = 1; // Reset quantity saat membuka modal
    // Set ukuran default jika belum ada yang dipilih
    if (!selectedSize.value[produk.id]?.size) {
        selectedSize.value[produk.id].size = 'S'; // Default size
    }
}

// Fungsi untuk menambahkan ke keranjang
const addToCart = () => {
    if (!selectedProduct.value) {
        toast.error('Produk tidak ditemukan!');
        return;
    }

    const selectedProductSize = selectedSize.value[selectedProduct.value.id];
    if (!selectedProductSize || !selectedProductSize.size) {
        toast.error('Silakan pilih ukuran terlebih dahulu!');
        return;
    }

    if (quantity.value > selectedProductSize.stok) {
        toast.error('Jumlah melebihi stok yang tersedia.');
        return;
    }

    console.log(`Menambahkan ${quantity.value} item ${selectedProduct.value.nama_produk} ukuran ${selectedProductSize.size} ke keranjang.`);
    showModal.value = false; // Tutup modal setelah menambahkan
}

const formatRupiah = (value) => {
    if (typeof value !== 'number') {
        value = parseFloat(value);
    }

    if (isNaN(value)) {
        return 'Pilih ukuran';
    }

    return 'Rp.' + new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value).replace('Rp', '');
};
</script>

<template>
    <div class="divide-y divide-gray-200">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Etalase Produk</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(produk, index) in produks.data.records" :key="index"
                    class="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <img :src="produk.gambar" :alt="produk.nama_produk" class="w-full h-64 object-cover" />
                    <div class="p-6">
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">{{ produk.nama_produk }}</h3>
                        <p class="text-gray-600 mb-2">Kategori: <span class="font-semibold">{{ produk.kategori ?
                            produk.kategori.nama_kategori : 'Tidak ada kategori' }}</span></p>

                        <p class="text-gray-600 mb-2">Ukuran:</p>
                        <div class="flex space-x-2 mb-4">
                            <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size"
                                :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize[produk.id]?.size === size ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                                @click="showDetails(produk.id, size)">
                                {{ size }}
                            </button>
                        </div>

                        <div v-if="selectedSize[produk.id]" class="text-gray-600 mb-4">
                            <p>Stok : {{ selectedSize[produk.id].stok }}</p>
                            <p>Harga : {{ formatRupiah(selectedSize[produk.id].harga) }}</p>
                        </div>

                        <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
                            <span
                                class="text-lg font-bold text-gray-800 transition duration-300 transform hover:text-green-600 mb-4 sm:mb-0">
                                {{ formatRupiah(selectedSize[produk.id]?.harga) }}
                            </span>
                            <button @click="openModal(produk)"
                                class="bg-[#c8a876] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#c09858] transition duration-300 shadow-md hover:shadow-lg flex items-center w-full sm:w-auto">
                                <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <transition name="modal">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <!-- Modal content -->
                    <div class="relative bg-white rounded-lg shadow">
                        <!-- Modal header -->
                        <div
                            class="flex items-center justify-between p-4 border-b border-gray-300 bg-[#c8a876] rounded-t">
                            <h3 class="text-lg font-semibold text-white">
                                Tambah ke Keranjang
                            </h3>
                            <button type="button" @click="showModal = false"
                                class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4">
                            <p v-if="selectedProduct && selectedSize[selectedProduct.id]" class="mb-2">Ukuran : {{
                                selectedSize[selectedProduct.id]?.size }}</p>
                            <p v-if="selectedProduct && selectedSize[selectedProduct.id]" class="mb-2">Harga : {{
                                formatRupiah(selectedSize[selectedProduct.id]?.harga) }}</p>
                            <p v-if="selectedProduct && selectedSize[selectedProduct.id]" class="mb-4">Stok : {{
                                selectedSize[selectedProduct.id]?.stok }}</p>
                            <form @submit.prevent="addToCart">
                                <div class="mt-4">
                                    <label for="quantity" class="text-gray-700">Jumlah :</label>
                                    <input type="number" v-model="quantity" min="1"
                                        :max="selectedSize[selectedProduct.id]?.stok"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-1" />
                                </div>
                                <div class="flex justify-end py-1">
                                    <button type="submit"
                                        class="text-white bg-[#c8a876] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#c8a876]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>