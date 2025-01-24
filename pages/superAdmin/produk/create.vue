<script setup>

useSeoMeta({
    title: 'Buat Admin',
    description: 'This is Create User',
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

const token = useCookie('auth-token').value
const isloading = ref(null)
const router = useRouter()


const formData = ref({
    kategori_id: '',
    nama_produk: '',
})

const userStore = useUserStore()
const toast = useToast()
const file = ref()
const previewUrl = ref()
const isImage = ref()

const { data: kategoris, pending } = await useFetch('http://be-zakkiPedia.test/api/v1/kategori', {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    lazy: true
})

async function handleUploadFile(event) {
    file.value = event.target.files[0]

    if (file) { //utk preview image
        const fileReader = new FileReader()

        fileReader.onload = (e) => {
            previewUrl.value = e.target.result
            isImage.value = file.value.type.startsWith('image/')
            if (!isImage) {
                file.value = null
            }
        }

        fileReader.readAsDataURL(file.value)
    }
}

const formStore = new FormData()

const errors = reactive({
    kategori_id: '',
    nama_produk: '',
    file: '',
});

async function save() {
    errors.nama_produk = '';
    errors.kategori_id = '';
    errors.file = '';

    let hasError = false;

    if (!formData.value.kategori_id) {
        errors.kategori_id = 'Kategori produk harus diisi';
        hasError = true;
    } else if (formData.value.kategori_id.length < 2) {
        errors.kategori_id = "Kategori produk harus lebih dari 2 karakter"
        hasError = true;
    } else if (formData.value.kategori_id.length >= 40) {
        errors.kategori_id = "Kategori produk melebihi 40 karakter"
        hasError = true
    } else if (!/^[a-zA-Z0-9'" -]+$/.test(formData.value.kategori_id)) {
        errors.kategori_id = "Kategori produk hanya boleh mengandung huruf, angka, tanda hubung, dan simbol '"
        hasError = true
    }

    if (!formData.value.nama_produk) {
        errors.nama_produk = 'Nama produk harus diisi';
        hasError = true;
    } else if (formData.value.nama_produk.length < 2) {
        errors.nama_produk = "Nama produk harus lebih dari 2 karakter"
        hasError = true;
    } else if (formData.value.nama_produk.length >= 40) {
        errors.nama_produk = "Nama produk melebihi 40 karakter"
        hasError = true
    } else if (!/^[a-zA-Z0-9'" ]+$/.test(formData.value.nama_produk)) {
        errors.nama_produk = "Nama produk hanya boleh mengandung huruf, angka, tanda hubung, dan simbol '"
        hasError = true
    }

    if (!file.value) {
        errors.file = 'Gambar harus diisi';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    formStore.append('file', file.value)
    formStore.append('kategori_id', formData.value.kategori_id)
    formStore.append('nama_produk', formData.value.nama_produk)
    console.log(formData)

    const res = await $fetch('http://be-zakkiPedia.test/api/v1/produk', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Accept': 'application/json'
        },
        body: formStore
    })
    console.log(res)

    toast.add({ title: 'Success Menambahkan Data Produk' })

    formData.value.kategori_id = ''
    formData.value.nama_produk = ''
    file.value = null
    previewUrl.value = null
    isImage.value = null
    
    await navigateTo(`/superAdmin/produk/createProdukDetail-${res.data.record.id}`);
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
            <Loading title="loading">
            </Loading>
        </div>

        <div v-else
            class="w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8 pb-4 px-2 py-5">
            <form class="space-y-6" @submit.prevent="save">
                <div class="flex flex-row items-center">
                    <NuxtLink @click="router.back()"
                        class="text-xl me-4 flex py-1 px-1 cursor-pointer text-gray-600 text-center w-fit h-fit hover:bg-gray-300 rounded ">
                        <UIcon name="i-heroicons-arrow-left-16-solid" />
                    </NuxtLink>
                    <h5 class="text-2xl font-medium text-gray-700">Buat Produk Baru</h5>
                </div>

                <div class="grid gap-4 mb-4 grid-cols-2 mt-7 px-1">
                    <div class="col-span-1">
                        <label class="block mb-2 text-sm font-medium text-gray-900">Nama Kategori</label>
                        <select id="category" v-model="formData.kategori_id"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih kategori</option>
                            <option v-for="(kategori, index) in kategoris.data.records" :key="index"
                                :value="kategori.id">
                                {{ kategori.nama_kategori }}
                            </option>
                        </select>
                        <span v-if="errors.kategori_id" class="text-red-600 text-sm">{{ errors.kategori_id }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nama Produk</label>
                        <input type="text" v-model="formData.nama_produk"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input nama barang">
                        <span v-if="errors.nama_produk" class="text-red-600 text-sm">{{ errors.nama_produk }}</span>
                    </div>

                    <div class="col-span-2">
                        <label for="file_input" class="block mb-2 text-sm font-medium text-gray-900">
                            Images
                        </label>
                        <div v-if="previewUrl">
                            <img class="mb-2 w-full min-w-72 min-h-40 h-auto max-w-md" v-if="isImage" :src="previewUrl"
                                alt="">
                            <div v-else>
                                <p class="text-red-600 text-xs">File harus berupa : JPG, PNG</p>
                            </div>
                        </div>
                        <input @change="handleUploadFile" type="file"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input your images">
                        <p class="mt-1 text-xs text-gray-500" id="file_input_help">SVG, PNG,
                            JPG or GIF (MAX. 800x400px).</p>
                        <span v-if="errors.file" class="text-red-600 text-sm">{{ errors.file }}</span>
                    </div>
                </div>
                <div class="flex space-x-4 justify-center pt-1">
                    <!-- <button type="button" @click="router.back()"
                        class="text-white flex justify-center items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        <UIcon name="i-heroicons-x-circle-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                        Cancel
                    </button> -->
                    <button type="submit"
                        class="text-white flex justify-center items-center bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-8 py-2.5 text-center">
                        <UIcon name="i-heroicons-plus-circle-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                        Buat Produk Baru
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