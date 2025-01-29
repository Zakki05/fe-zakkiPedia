<script setup>

useSeoMeta({
    title: 'Dashboard Super Admin',
    description: 'This is Super Admin page',
})

definePageMeta({
    layout: "dashboard",
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

async function modalDelete(id) {
    modal.value[id] = document.getElementById('modalDelete-' + id);
    if (modal.value[id]) {
        modal.value[id].classList.remove('hidden');
    }
}

const hapusData = async (id) => {
    const res = await $fetch(`http://be-zakkiPedia.test/api/v1/pemesananDetail/${id}`, {
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

const showCreateModal = ref(false)

const createPembayaran = async () => {
    const res = await $fetch(`http://be-zakkipedia.test/api/v1/pembayaranAdmin/${pemesananId}`, {
        headers: header,
        method: "PUT",
        body: {
            metode_pembayaran: formData.value.metode_pembayaran,
            status: formData.value.status,
        }
    })
    console.log(res)
    toast.add({ title: 'Berhasil Tambah Data Pembayaran' })
    showCreateModal.value = false
    refresh()
}

const submitData = async (id) => {
    try {
        const res = await $fetch(`http://be-zakkiPedia.test/api/v1/simpanPesanan/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userStore.token}`,
                'Accept': 'application/json'
            },
            body: {
                status: "Dikirim",
            }
        });

        toast.add({ title: 'Success Simpan Data Pesanan' });
        await navigateTo(`/superAdmin/pesanan/detailPesanan-${route.params.id}`)
    } catch (error) {
        console.log(error.response);
    }
};

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
    label: 'Dashboard',
    to: '/superAdmin',
    icon: 'i-heroicons-chart-pie-solid'
}, {
    label: 'Buat Pesanan',
    to: '/superAdmin/pesanan',
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
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">Rp. {{ formatRupiah(pemesanan.subtotal) }} </p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.kode_pembayaran : 'Belum Bayar' }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.metode_pembayaran : 'Belum Bayar' }}</p>
                            <p class="text-xs pt-1 text-right font-normal text-gray-700">{{ pemesanan.pembayaran ? pemesanan.pembayaran.status : 'Belum Bayar' }}</p>
                            <p :class="{
                                'border-blue-500 text-blue-800 bg-blue-200': pemesanan.status == 'Dipesan',
                                'border-yellow-500 text-yellow-800 bg-yellow-200': pemesanan.status == 'Dikirim',
                                'border-green-500 text-green-800 bg-green-200': pemesanan.status == 'Selesai'
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
                    class="w-full md:w-[43%] p-6 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8">
                    <form @submit.prevent="tambahData">
                        <div class="grid gap-4 mb-4 grid-cols-2">
                            <div class="col-span-1">
                                <label for="category" class="block mb-2 text-sm font-medium text-gray-900">
                                    Nama Barang
                                </label>
                                <div class="relative flex flex-col">
                                    <select id="countries" v-model="formData.produk_detail_id"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                        <option value="">Pilih barang</option>
                                        <option v-for="(produkDetail, index) in produkDetails.data.records" :key="index"
                                            :value="produkDetail.id">
                                            {{ produkDetail.produk.nama_produk }} ({{ produkDetail.ukuran }})
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-span-1">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Jumlah</label>
                                <input type="number" v-model="formData.jumlah"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Masukkan jumlah barang" required>
                            </div>
                        </div>
                        <div class="flex justify-center mt-8">
                            <button type="submit"
                                class="text-white flex items-center bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-8 py-2.5 text-center">
                                <svg class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                Tambah Produk
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Isi Codingan (Sebelah Kanan) -->
                <div
                    class="w-full ml-auto md:w-[55%] p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-4 md:p-6">
                    <div v-if="pemesananDetails.data.records.length > 0" class="w-full bg-white  px-2">
                        <div v-for="(pemesananDetail, index) in pemesananDetails.data.records" :key="index">
                            <div class="w-full bg-white hover:bg-gray-100 rounded-2xl py-2">
                                <div class="grid grid-cols-2 pt-2 gap-2 w-full">
                                    <div class="flex space-x-3 pl-4">
                                        <img :src="pemesananDetail.produk_detail.produk.gambar" alt="Product Image"
                                            class="w-20 h-24 mt-2">
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
                                            Rp. {{ formatRupiah(pemesananDetail.harga_produk) || '-' }} 
                                        </p>
                                        <p class="text-xs font-normal pt-1 text-gray-700">
                                            {{ pemesananDetail.jumlah }}
                                        </p>
                                        <h1 class="text-sm font-semibold pt-1 text-gray-900">
                                            Rp. {{ formatRupiah(pemesananDetail.total_harga) || '-' }} 
                                        </h1>
                                        <div>
                                            <button type="button" @click="modalDelete(pemesananDetail.id)"
                                                v-if="pemesanan?.pembayaran_id === null"
                                                class="font-medium text-red-600 pt-2 pb-3 hover:underline">
                                                <UIcon name="i-heroicons-trash-solid" class="mt-1 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Hapus Data Produk -->
                                <div :id="`modalDelete-${pemesananDetail.id}`" tabindex="-1"
                                    class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full">
                                    <div class="relative p-4 w-full max-w-md max-h-full">
                                        <div class="relative bg-white rounded-lg shadow">
                                            <button type="button" @click="hideModal(pemesananDetail.id)"
                                                class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                                <svg class="w-3 h-3" aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round"
                                                        stroke-linejoin="round" stroke-width="2"
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                                <span class="sr-only">Close modal</span>
                                            </button>
                                            <div class="p-4 md:p-5 text-center">
                                                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round"
                                                        stroke-linejoin="round" stroke-width="2"
                                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                <h3 class="mb-5 text-lg font-normal text-gray-500">Apakah kamu yakin
                                                    menghapus
                                                    barang "{{ pemesananDetail.produk_detail.produk.nama_produk }}"</h3>
                                                <button type="button" @click="hideModal(pemesananDetail.id)"
                                                    class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100">No,
                                                    cancel</button>
                                                <button type="button" @click="hapusData(pemesananDetail.id)"
                                                    class="text-white ms-3 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                                    Saya setuju
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button Aksi -->
                        <div class="flex justify-between pt-4">
                            <button @click="showCreateModal = true" v-if="pemesanan?.pembayaran_id === null"
                                class="text-white flex justify-center items-center bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <UIcon name="i-heroicons-currency-dollar-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                                Buat Pembayaran
                            </button>
                            <button type="submit" @click="submitData(pemesanan.id)" v-else
                                class="text-white flex justify-center items-center bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <UIcon name="i-heroicons-check-circle-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                                Simpan Data Pesanan
                            </button>
                        </div>

                        <!-- Buat Pembayaran -->
                        <div v-if="showCreateModal" tabindex="-1" aria-hidden="true"
                            class="bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen">
                            <div class="relative p-4 w-full max-w-md max-h-full">
                                <!-- Modal content -->
                                <div class="relative bg-white rounded-lg shadow">
                                    <!-- Modal header -->
                                    <div
                                        class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
                                        <h3 class="text-lg font-semibold text-white">
                                            Buat Pembayaran
                                        </h3>
                                        <button type="button" @click="showCreateModal = false"
                                            class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <!-- Modal body -->
                                    <form class="p-4 md:p-5" @submit.prevent="createPembayaran">
                                        <div class="grid gap-4 mb-8 grid-cols-2">
                                            <div class="col-span-2">
                                                <label for="category"
                                                    class="block mb-2 text-sm font-medium text-gray-900">
                                                    Metode Pembayaran
                                                </label>
                                                <div class="relative flex flex-col">
                                                    <select id="countries" v-model="formData.metode_pembayaran"
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                        <option value="" selected>Pilih Metode Pembayaran</option>
                                                        <option value="BRI">BRI</option>
                                                        <option value="MANDIRI">MANDIRI</option>
                                                        <option value="BSI">BSI</option>
                                                        <option value="BCA">BCA</option>
                                                        <option value="DANA">DANA</option>
                                                        <option value="GOPAY">GOPAY</option>
                                                        <option value="GOPAY">GOPAY</option>
                                                        <option value="COD">COD</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-span-2">
                                                <label for="category"
                                                    class="block mb-2 text-sm font-medium text-gray-900">
                                                    Status
                                                </label>
                                                <div class="relative flex flex-col">
                                                    <select id="countries" v-model="formData.status"
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                        <option value="">Pilih Status Pembayaran</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Lunas">Lunas</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex justify-center">
                                            <button type="submit"
                                                class="text-white inline-flex items-center bg-[#c8a876] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#c8a876]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                                <UIcon name="i-heroicons-plus-circle-16-solid"
                                                    class="mr-2 mt-0.5 w-4 h-4" />
                                                Buat Pembayarans Baru
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Pesanan -->

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
                                Rp. {{ formatRupiah(pemesanan.total_pemesanan) || '-' }} 
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
                                Rp. {{ formatRupiah(pemesanan.biaya) || '-' }} 
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
                                Rp. {{ formatRupiah(pemesanan.subtotal) || '-' }} 
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>