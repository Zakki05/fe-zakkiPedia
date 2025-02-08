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

const userStore = useUserStore()
const page = ref(1)
const router = useRouter();
const toast = useToast();
const route = useRoute();

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const formData = ref({
    pemesanan_id: route.params.id,
    produk_detail_id: '',
    harga_produk: '',
    jumlah: '',
    pelanggan_id: '',
    tanggal_pembayaran: '',
    total_harga: '',
    pembayaran: '',
    metode_pembayaran: '',
    status: '',
    query: '',
    s: '',
});

const pemesananId = Math.abs(parseInt(formData.value.pemesanan_id));

const errors = ref({});

const { data: pemesanans, refresh: refreshPemesanan } = useFetch(`http://be-zakkiPedia.test/api/v1/pemesanan?id=${formData.value.pemesanan_id}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    }
});

const pemesanan = computed(() => {
    const result = pemesanans.value?.data?.records?.find(p => p.id === parseInt(pemesananId));
    console.log('Pemesanan:', result); // Cek hasil pemesanan
    return result;
});

const { data: produkDetails } = useFetch(() => `http://be-zakkiPedia.test/api/v1/dataProduk?q=${formData.value.s}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    }
});

console.log('Pemesanans:', pemesanan);

const { data: pemesananDetails, pending, refresh: refreshPemesananDetails } = useFetch(() => `http://be-zakkiPedia.test/api/v1/pemesananDetail?pemesanan_id=${pemesananId}`, {
    headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
    },
    lazy: true,
})

console.log("Pemesanan Detail", pemesananDetails)

const modal = ref({});

const refresh = async () => {
    await Promise.all([
        refreshPemesanan(),
        refreshPemesananDetails()
    ]);
};

async function tambahData() {
    try {
        const response = await $fetch('http://be-zakkiPedia.test/api/v1/pemesananDetail', {
            headers: {
                'Authorization': `Bearer ${userStore.token}`,
                'Accept': 'application/json'
            },
            method: 'POST',
            body: {
                pemesanan_id: pemesananId,
                produk_detail_id: formData.value.produk_detail_id,
                harga_produk: formData.value.harga_produk,
                jumlah: formData.value.jumlah,
                total_harga: formData.value.total_harga,
            }
        });
        toast.add({ title: 'Berhasil Menambahkan Produk Pemesanan' });

        if (!response) {
            throw new Error('Gagal Menambahkan Barang Pemesanan');
        }
        formData.value.produk_detail_id = '';
        formData.value.jumlah = '';
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
}

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

const links = [{
    label: 'Homepage',
    to: '/admin',
    icon: 'i-heroicons-home-solid'
}, {
    label: 'Detail Pesanan',
    to: '/admin/pesanan',
    icon: 'i-heroicons-shopping-bag-solid'
}]

</script>

<template>
    <div class="divide-y divide-gray-200">
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
            <div
                class="rounded-md shadow-md mt-5 text-gray-900 bg-white p-4 flex flex-col lg:justify-start mx-auto sm:mx-0 lg:mx-0 w-full space-y-2 mb-2">
                <h1 class="text-lg font-semibold">Data Pemesanan</h1>
                <hr>
                <div v-if="pemesanan" class="w-full bg-white py-4 px-4 mt-3 pb-5">
                    <div class="grid grid-cols-2 gap-2 w-full">
                        <div class="flex flex-col">
                            <p class="text-xs pt-1 font-normal text-gray-700">Kode Pemesanan: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Nama Pelanggan: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Alamat: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Kode Pos: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Total Pembayaran: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Pembayaran: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Metode Pembayaran: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Status Pembayaran: </p>
                            <p class="text-xs pt-1 font-normal text-gray-700">Status: </p>
                        </div>
                        <div class="flex flex-col justify-between items-end">
                            <p class="text-xs pt-1 font-normal text-gray-700">{{ pemesanan.kode_pemesanan }}</p>
                            <p class="text-xs pt-1 font-normal text-gray-700">{{ pemesanan.pelanggan.nama_lengkap }}</p>
                            <p class="text-xs pt-1 font-normal text-gray-700">{{ pemesanan.alamat }}, {{
                                pemesanan.kelurahan }},
                                {{ pemesanan.kecamatan }}, {{ pemesanan.ongkir.kota }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.kode_pos }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">Rp. {{ formatRupiah(pemesanan.subtotal) || ''}} </p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.kode_pembayaran : 'Belum Bayar' }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.metode_pembayaran : 'Belum Bayar' }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.status : 'Belum Bayar' }}</p>
                            <p :class="{
                                'border-blue-500 text-blue-800 bg-blue-200': pemesanan.status == 'Dipesan',
                                'text-yellow-800 border-yellow-500 bg-yellow-200': pemesanan.status == 'Dikirim',
                                'text-green-500 border-green-800 bg-green-200': pemesanan.status == 'Selesai',
                            }"
                                class="text-xs text-center border bg-opacity-40 px-2 w-fit mt-1 rounded-xl font-semibold ">
                                {{ pemesanan.status }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-else class="w-full bg-white py-4 px-4 mt-3 pb-5">
                    <p class="text-xs pt-1 font-normal text-gray-700">Data Pemesanan tidak ditemukan</p>
                </div>
            </div>

            <div class="flex flex-wrap items-start">
                <div
                    class="w-full ml-auto md:w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-4 md:p-6">
                    <h1 class="text-lg font-semibold">Etalase Produk Pemesanan</h1>
                    <hr>
                    <div v-if="pemesananDetails.data.records.length > 0" class="w-full bg-white px-2 pt-5">
                        <div v-for="(pemesananDetail, index) in pemesananDetails.data.records" :key="index">
                            <div class="w-full bg-white hover:bg-gray-100 rounded-2xl py-2">
                                <div class="grid grid-cols-2 pt-2 gap-2 w-full">
                                    <div class="flex space-x-3 pl-4">
                                        <img :src="pemesananDetail.produk_detail.produk.gambar" alt="Product Image"
                                            class="w-32 h-24">
                                        <span class="product-name">
                                            <h1 class="text-xs text-left font-semibold text-gray-900">
                                                Nama Produk:
                                            </h1>
                                            <p class="text-xs pt-1 text-left text-gray-900">
                                                Harga:
                                            </p>
                                            <p class="text-xs pt-1 text-left text-gray-900">
                                                Jumlah:
                                            </p>
                                            <p class="text-xs pt-1 text-left text-gray-900">
                                                Total Harga:
                                            </p>
                                        </span>
                                        <h1></h1>
                                    </div>
                                    <div class="flex flex-col items-end pr-4">
                                        <p class="text-xs font-semibold text-gray-700">
                                            {{ pemesananDetail.produk_detail.produk.nama_produk }}
                                        </p>
                                        <p class="text-xs font-normal pt-1 text-gray-700">
                                            Rp. {{ formatRupiah(pemesananDetail.harga_produk) || ''}} 
                                        </p>
                                        <p class="text-xs font-normal pt-1 text-gray-700">
                                            {{ pemesananDetail.jumlah }}
                                        </p>
                                        <h1 class="text-sm font-semibold pt-1 text-gray-900">
                                            Rp. {{ formatRupiah(pemesananDetail.total_harga) || ''}} 
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="w-full bg-white py-4 px-4 pb-5 flex justify-center">
                        <p class="text-sm pt-1 items-center font-normal text-gray-700">Data pemesanan barang belum
                            ditambahkan
                        </p>
                    </div>
                </div>
            </div>

            <div class="w-full mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-4 md:p-6">
                <div class="w-full bg-white px-4">
                    <div class="grid grid-cols-3 gap-2 w-full">
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                Total Pesanan
                            </h1>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                :
                            </h1>
                        </div>
                        <div v-if="pemesanan" class="flex flex-col justify-between items-end">
                            <h1 class="text-sm font-semibold  text-gray-900">
                                Rp. {{ formatRupiah(pemesanan.total_pemesanan) || ''}} 
                            </h1>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                Biaya Ongkir
                            </h1>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                :
                            </h1>
                        </div>
                        <div v-if="pemesanan" class="flex flex-col justify-between items-end">
                            <h1 class="text-sm font-semibold  text-gray-900">
                                Rp. {{ formatRupiah(pemesanan.biaya) || ''}} 
                            </h1>
                        </div>
                        <div class="col-span-3">
                            <hr class="border-gray-300 my-2">
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                Total Pembayaran</h1>
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-sm font-semibold text-gray-900">
                                :
                            </h1>
                        </div>
                        <div v-if="pemesanan" class="flex flex-col justify-between items-end">
                            <h1 class="text-sm font-semibold  text-gray-900">
                                Rp. {{ formatRupiah(pemesanan.subtotal) || ''}} 
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>