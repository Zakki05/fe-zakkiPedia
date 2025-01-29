<template>
    <table class="w-full hidden md:table text-sm text-left rtl:text-right text-[#4a453e]">
        <thead class="text-xs text-white uppercase bg-[#c8a876]">
            <tr class="text-center">
                <th scope="col" class="px-4 py-3 cursor-pointer" @click="sortTable('kode_pemesanan')">
                    Kode pesanan
                    <span v-if="sortKey !== 'kode_pemesanan'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'kode_pemesanan'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-4 py-3 cursor-pointer" @click="sortTable('pelanggan_id')">
                    Pelanggan
                    <span v-if="sortKey !== 'pelanggan_id'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'pelanggan_id'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-4 py-3 cursor-pointer">
                    Pesanan
                </th>
                <th scope="col" class="px-4 py-3 cursor-pointer" @click="sortTable('subtotal')">
                    Total Pesanan
                    <span v-if="sortKey !== 'subtotal'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'subtotal'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-4 py-3 cursor-pointer">
                    Pembayaran
                </th>
                <th scope="col" class="px-4 py-3" @click="sortTable('status')">
                    Status
                    <span v-if="sortKey !== 'status'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'status'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(pemesanan, index) in sortedpemesanans" :key="index"
                class="bg-white border-b border-[#e0d6c3] hover:bg-[#f0e5d1] text-center">
                <th scope="row" class="px-6 py-4 font-medium text-[#4a453e] whitespace-nowrap break-words">
                   {{ pemesanan.kode_pemesanan }}
                </th>
                <td class="px-4 py-3 break-words text-[#4a453e]">
                    {{ pemesanan.pelanggan.nama_lengkap }}
                </td>
                <td class="px-4 py-3 break-words text-[#4a453e]">
                    <NuxtLink :to="`/superAdmin/pesanan/detailPesanan-${pemesanan.id}`">
                        <button type="button"
                            class="border-blue-500 text-blue-800 bg-blue-200 text-xs text-center border bg-opacity-40 px-2 py-1 w-fit rounded-xl font-semibold ">
                            Lihat Disini
                        </button>
                    </NuxtLink>
                </td>
                <td class="px-4 py-3 break-words">
                    Rp. {{ formatRupiah(pemesanan.subtotal) }}
                </td>
                <td class="px-4 py-3 break-words">
                    {{ pemesanan.pembayaran ? pemesanan.pembayaran.kode_pembayaran : 'Belum Bayar' }}
                </td>
                <td class="px-3 py-3 break-words text-center">
                    <div class="flex justify-center">
                        <p :class="{
                            'border-blue-500 text-blue-800 bg-blue-200': pemesanan.status == 'Dipesan',
                            'border-yellow-500 text-yellow-800 bg-yellow-200': pemesanan.status == 'Dikirim',
                            'border-green-500 text-green-800 bg-green-200': pemesanan.status == 'Selesai'
                        }"
                            class="text-xs text-center border bg-opacity-40 px-2 py-1 rounded-xl font-semibold">
                            {{ pemesanan.status }}
                        </p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>

useSeoMeta({
    title: 'Dashboard Super Admin',
    description: 'This is Super Admin page',
})

definePageMeta({
    layout: "dashboard",
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
            `http://be-zakkiPedia.test/api/v1/getPemesananSuperAdmin?&q=${formData.value.s}&status=Selesai&page=${page.value}`,
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

