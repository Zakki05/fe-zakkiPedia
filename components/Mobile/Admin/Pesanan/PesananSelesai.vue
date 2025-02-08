<template>
    <div v-for="(pemesanan, index) in sortedpemesanans" :key="index"
        class="md:hidden bg-[#f9f5ee] border-4 border-[#e0d6c3] rounded-lg mb-4 p-4 shadow-md">
        <!-- Kode Pemesanan -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Kode Pemesanan:</p>
            <p class="text-[#4a453e]">{{ pemesanan.kode_pemesanan }}</p>
        </div>

        <!-- Pelanggan -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Pelanggan:</p>
            <p class="text-[#4a453e]">{{ pemesanan.pelanggan.nama_lengkap }}</p>
        </div>

        <!-- Pesanan -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold mb-1">Pesanan:</p>
            <NuxtLink :to="`/admin/pesanan/detailPesanan-${pemesanan.id}`">
                <button type="button"
                    class="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 border border-blue-500 rounded-lg">
                    Lihat Disini
                </button>
            </NuxtLink>
        </div>

        <!-- Total Pesanan -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Total Pesananr:</p>
            <p class="text-[#4a453e]">Rp. {{ formatRupiah(pemesanan.subtotal) }}</p>
        </div>

        <!-- Pembayaran -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Pembayaran:</p>
            <p class="text-[#4a453e]">{{ pemesanan.pembayaran ? pemesanan.pembayaran.kode_pembayaran : 'Belum Bayar' }}</p>
        </div>

        <!-- Status -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Status:</p>
            <p :class="{
                'border-blue-500 text-blue-800 bg-blue-200': pemesanan.status == 'Dipesan',
                'border-yellow-500 text-yellow-800 bg-yellow-200': pemesanan.status == 'Dikirim',
                'border-green-500 text-green-800 bg-green-200': pemesanan.status == 'Selesai'
            }" class="px-2 py-1 mt-2 text-xs font-semibold text-center border bg-opacity-40 rounded-lg">
                {{ pemesanan.status }}
            </p>
        </div>
    </div>
</template>

<script setup>

useSeoMeta({
    title: 'Homepage Admin',
    description: 'This is Admin page',
})

definePageMeta({
    layout: "admin",
    middleware: 'auth'
});

const token = useCookie('auth-token').value;
const page = ref(1);
const sortKey = ref('');
const sortOrder = ref('asc');
const isLoading = ref(false);
const pemesanans = ref({
    data: { records: [], paging: { total_record: 0, record_from: 0, record_to: 0 } },
});
const pelanggans = ref([]);
const ongkirs = ref([]);
const pembayarans = ref([]);
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

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
};

// Fungsi Fetch Data
const fetchPemesanans = async () => {
    try {
        isLoading.value = true; // Menggunakan isLoading
        const { data } = await useFetch(
            `http://be-zakkiPedia.test/api/v1/getPemesananAdmin?&q=${formData.value.s}&status=Selesai&page=${page.value}`,
            { headers: header, key: `pemesananPage-${page.value}`, lazy: true }
        );
        pemesanans.value = data.value || pemesanans.value;
    } catch (error) {
        console.error('Error fetching pemesanans:', error);
    } finally {
        isLoading.value = false; // Menggunakan isLoading
    }
};

const fetchPelanggans = async () => {
    try {
        const { data } = await useFetch('http://be-zakkiPedia.test/api/v1/pelanggan', { headers: header });
        pelanggans.value = data.value?.data || [];
    } catch (error) {
        console.error('Error fetching pelanggans:', error);
    }
};

const fetchOngkirs = async () => {
    try {
        const { data } = await useFetch('http://be-zakkiPedia.test/api/v1/ongkir', { headers: header });
        ongkirs.value = data.value?.data || [];
    } catch (error) {
        console.error('Error fetching ongkirs:', error);
    }
};

const fetchPembayarans = async () => {
    try {
        const { data } = await useFetch('http://be-zakkiPedia.test/api/v1/pembayaran', { headers: header });
        pembayarans.value = data.value?.data || [];
    } catch (error) {
        console.error('Error fetching pembayarans:', error);
    }
};

// Sorting Pemesanan
const sortedpemesanans = computed(() => {
    if (!pemesanans.value.data.records) return [];
    return pemesanans.value.data.records.slice().sort((a, b) => {
        if (sortKey.value) {
            let keyA, keyB;
            if (sortKey.value === 'kode_pemesanan') {
                keyA = a.kode_pemesanan ?? '';
                keyB = b.kode_pemesanan ?? '';
            } else if (sortKey.value === 'pelanggan_id') {
                keyA = a.pelanggan?.nama_lengkap ?? '';
                keyB = b.pelanggan?.nama_lengkap ?? '';
            } else if (sortKey.value === 'subtotal') {
                keyA = a.subtotal ?? '';
                keyB = b.subtotal ?? '';
            } else {
                keyA = a[sortKey.value] ?? '';
                keyB = b[sortKey.value] ?? '';
            }

            if (sortOrder.value === 'asc') return keyA > keyB ? 1 : -1;
            return keyA < keyB ? 1 : -1;
        }
        return 0;
    });
});
console.log(sortedpemesanans)

const sortTable = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

// Fetch Data saat Komponen Dimuat
onMounted(() => {
    fetchPemesanans();
    fetchPelanggans();
    fetchOngkirs();
    fetchPembayarans();
});

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
