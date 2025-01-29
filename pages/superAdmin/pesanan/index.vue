<script setup>

useSeoMeta({
    title: 'Buat Pesanan',
    description: 'This is Create User',
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

const token = useCookie('auth-token').value
const isloading = ref(null)
const router = useRouter()
const formStore = new FormData()
const userStore = useUserStore()
const toast = useToast()

const formData = ref({
    pelanggan_id: '',
    ongkir_id: '',
    pembayaran_id: '',
    tanggal: '',
    kecamatan: '',
    kelurahan: '',
    alamat: '',
    kode_pos: '',
    status: 'Dipesan',
    total_pemesanan: '',
    biaya: '',
    subtotal: '',
})

const { data: pelanggans, pending, refresh } = await useFetch('http://be-zakkipedia.test/api/v1/dataPelanggan', {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    lazy: true
})

const { data: ongkirs } = await useFetch('http://be-zakkipedia.test/api/v1/dataOngkir', {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    lazy: true
})

const errors = reactive({
    pelanggan_id: '',
    ongkir_id: '',
    pembayaran_id: '',
    tanggal: '',
    kecamatan: '',
    kelurahan: '',
    alamat: '',
    kode_pos: '',
    status: '',
    total_pemesanan: '',
    biaya: '',
    subtotal: '',
});

async function save() {

    formStore.append('pelanggan_id', formData.value.pelanggan_id)
    formStore.append('ongkir_id', formData.value.ongkir_id)
    formStore.append('pembayaran_id', formData.value.pembayaran_id)
    formStore.append('tanggal', formData.value.tanggal)
    formStore.append('kecamatan', formData.value.kecamatan)
    formStore.append('kelurahan', formData.value.kelurahan)
    formStore.append('alamat', formData.value.alamat)
    formStore.append('kode_pos', formData.value.kode_pos)
    formStore.append('status', formData.value.status)
    formStore.append('total_pemesanan', formData.value.total_pemesanan)
    formStore.append('biaya', formData.value.biaya)
    formStore.append('subtotal', formData.value.subtotal)
    console.log(formData)

    const res = await $fetch('http://be-zakkipedia.test/api/v1/pemesanan', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Accept': 'application/json'
        },
        body: formStore
    })
    console.log(res)

    toast.add({ title: 'Success Menambahkan Data Pesanan' })

    formData.value.pelanggan_id = ''
    formData.value.ongkir_id = ''
    formData.value.pembayaran_id = ''
    formData.value.tanggal = ''
    formData.value.kecamatan = ''
    formData.value.kelurahan = ''
    formData.value.alamat = ''
    formData.value.kode_pos = ''
    formData.value.status = ''
    formData.value.total_pemesanan = ''
    formData.value.biaya = ''
    formData.value.subtotal = ''

    await navigateTo(`/superAdmin/pesanan/buatDetailPesanan-${res.data.record.id}`);
}

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

        <div v-else
            class="w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8 pb-4 px-2 py-5">
            <form class="space-y-6" @submit.prevent="save">
                <div class="flex flex-row items-center">
                    <div class="flex flex-row justify-start w-full">
                        <NuxtLink @click="router.back()"
                            class="text-xl me-4 flex py-1 px-1 cursor-pointer text-gray-600 text-center w-fit h-fit hover:bg-gray-300 rounded mt-1">
                            <UIcon name="i-heroicons-arrow-left-16-solid" />
                        </NuxtLink>
                        <h5 class="text-2xl font-medium text-gray-700">Buat Pesanan Baru</h5>
                    </div>

                    <div class="flex flex-row justify-content sm:justify-end w-full">
                        <NuxtLink to="/superAdmin/user/createPelanggan" class="w-full sm:w-auto">
                            <button
                                class="flex items-center w-full sm:w-auto text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2.5 text-center shadow-md transition duration-300">
                                <UIcon name="i-heroicons-plus-circle-16-solid" class="w-4 h-4 mr-2"></UIcon>
                                Pelanggan
                            </button>
                        </NuxtLink>
                    </div>
                </div>

                <div class="grid gap-4 mb-4 grid-cols-2 mt-7 px-1">
                    <div class="col-span-1">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Pelanggan</label>
                        <select id="category" v-model="formData.pelanggan_id"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Pelanggan</option>
                            <option v-for="(pelanggan, index) in pelanggans.data.records" :key="index" :value="pelanggan.id">
                                {{ pelanggan.nama_lengkap }}
                            </option>
                        </select>
                        <!-- <span v-if="errors.role_id" class="text-red-600 text-sm">{{ errors.role_id }}</span> -->
                    </div>

                    <div class="col-span-1">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Kota</label>
                        <select id="category" v-model="formData.ongkir_id"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Kota</option>
                            <option v-for="(ongkir, index) in ongkirs.data.records" :key="index" :value="ongkir.id">
                                {{ ongkir.kota }}
                            </option>
                        </select>
                        <!-- <span v-if="errors.role_id" class="text-red-600 text-sm">{{ errors.role_id }}</span> -->
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                        <input type="text" v-model="formData.kecamatan"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input kecamatan">
                        <!-- <span v-if="errors.nama" class="text-red-600 text-sm">{{ errors.nama }}</span> -->
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                        <input type="text" v-model="formData.kelurahan"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input kelurahan">
                        <!-- <span v-if="errors.nama" class="text-red-600 text-sm">{{ errors.nama }}</span> -->
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Jalan</label>
                        <input type="text" v-model="formData.alamat"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input jalan">
                        <!-- <span v-if="errors.nama" class="text-red-600 text-sm">{{ errors.nama }}</span> -->
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Kode Pos</label>
                        <input type="text" v-model="formData.kode_pos"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input kode pos">
                        <!-- <span v-if="errors.nama" class="text-red-600 text-sm">{{ errors.nama }}</span> -->
                    </div>
                </div>
                <div class="flex space-x-4 justify-center pt-1">
                    <button type="submit"
                        class="text-white flex justify-center items-center bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-8 py-2.5 text-center">
                        <UIcon name="i-heroicons-plus-circle-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                        Buat Pesanan Baru
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.date-pick::-webkit-calendar-picker-indicator {
    background: black;
    opacity: 20%;
}
</style>