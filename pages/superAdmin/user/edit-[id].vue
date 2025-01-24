<script setup>

const token = useCookie('auth-token').value
const isLoading = ref(null)

useSeoMeta({
    title: 'Edit Admin',
    description: 'This is Create User',
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

const user = ref('');
const userStore = useUserStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const inputType = ref('password');
const showPassword = ref(false);
const inputTypeRepeat = ref('password');
const showPasswordRepeat = ref(false);

const formData = ref({
    role_id: 2,
    email: '',
    username: '',
    nama: '',
    password: '',
    alamat: '',
    repeat_password: '',
    provinces: '',
    citys: '',
    subDistricts: '',
    villages: '',
})

const errors = reactive({
    role_id: '',
    email: '',
    username: '',
    password: '',
});

const selectedProvince = ref('')
const selectedCity = ref('')
const selectedSubDistrict = ref('')
const selectedVillage = ref('')

async function fetchProvinces() {
    const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
    );
    formData.value.provinces = await response.json();
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  inputType.value = showPassword.value ? 'text' : 'password';
};

const togglePasswordVisibilityRepeat = () => {
  showPasswordRepeat.value = !showPasswordRepeat.value;
  inputTypeRepeat.value = showPasswordRepeat.value ? 'text' : 'password';
};

async function fetchCitys() {
    if (!selectedProvince.value) {
        formData.value.citys = [];
        return;
    }
    const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.value}.json`
    );
    formData.value.citys = await response.json();
}

async function fetchSubDistricts() {
    if (selectedCity.value) {
        const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity.value}.json`
        );
        formData.value.subDistricts = await response.json();
        formData.value.villages = [];
    }
}

async function fetchVillages() {
    if (selectedSubDistrict.value) {
        const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedSubDistrict.value}.json`
        );
        formData.value.villages = await response.json();
    }
}

watch(selectedProvince, fetchCitys);
watch(selectedCity, fetchSubDistricts);
watch(selectedSubDistrict, fetchVillages);

const formattedAlamat = computed(() => {
    const provinceName =
        formData.value.provinces.find((p) => p.id === selectedProvince.value)?.name || "";
    const cityName =
        formData.value.citys.find((c) => c.id === selectedCity.value)?.name || "";
    const subDistrictName =
        formData.value.subDistricts.find((s) => s.id === selectedSubDistrict.value)?.name ||
        "";
    const villageName =
        formData.value.villages.find((v) => v.id === selectedVillage.value)?.name || "";
    return `${formData.value.alamat}, ${villageName}, ${subDistrictName}, ${cityName}, ${provinceName}`;
});

fetchProvinces();

const userData = async () => {
    try {
        isLoading.value = 'Loading'
        const { data: res } = await useFetch(`http://be-zakkipedia.test/api/v1/user/${route.params.id}`, {
            headers: {
                'Authorization': `Bearer ${userStore.token}`,
                'Accept': 'application/json'
            },
        })
        console.log(res)
        user.value = res.value.data.record
        isLoading.value = null
    } catch (error) {
        console.log(error)
    }
}

await userData() //untuk menghindari reading data 'null', saat mengambil 1 data
if (user.value) {
    formData.value.username = user.value.username
    formData.value.email = user.value.email
    formData.value.role_id = user.value.role.id
    formData.value.nama = user.value.nama
} else {
    console.error('Respone Error')
}

async function update() {

    isLoading.value = "update";

    errors.email = ""
    errors.username = ""
    errors.password = ""
    errors.nama = ""
    errors.alamat = ""
    errors.role_id = ""

    let hasError = false;

    if (!formData.value.nama) {
        errors.nama = 'Nama harus diisi';
        hasError = true;
    } else{
        errors.nama = '';
    }

    if (!formData.value.email) {
        errors.email = 'Email harus diisi';
        hasError = true;
    } else if (formData.value.email.length < 2) {
        errors.email = "Email harus lebih dari 2 karakter"
        hasError = true;
    } else if (formData.value.email.length >= 40) {
        errors.email = "Email melebihi 40 karakter"
        hasError = true
    } else if (!/^[a-zA-Z0-9@.]+$/.test(formData.value.email)) {
        errors.email = "Email hanya boleh mengandung huruf, angka, dan simbol @"
        hasError = true
    } else {
        errors.email = '';
    }

    if (!formData.value.username) {
        errors.username = 'Username harus diisi';
        hasError = true;
    } else if (formData.value.username.length < 2) {
        errors.username = "Username harus lebih dari 2 karakter"
        hasError = true;
    } else if (formData.value.username.length >= 40) {
        errors.username = "Username melebihi 40 karakter"
        hasError = true
    } else if (!/^[a-zA-Z0-9'" ]+$/.test(formData.value.username)) {
        errors.username = "Username hanya boleh mengandung huruf, angka, tanda hubung, dan simbol '"
        hasError = true
    } else {
        errors.username = '';
    }

    if (!formData.value.password) {
        errors.password = 'Password harus diisi';
        hasError = true;
    } else if (formData.value.password.length <= 7) {
        errors.password = "Password harus lebih dari 8 karakter"
        hasError = true
    } else if (!/[A-Z]/.test(formData.value.password)) {
        errors.password = "Password harus mengandung setidaknya satu huruf besar";
        hasError = true;
    } else if (!/[0-9]/.test(formData.value.password)) {
        errors.password = "Password harus mengandung setidaknya satu angka";
        hasError = true;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.value.password)) {
        errors.password = "Password harus mengandung setidaknya satu simbol";
        hasError = true;
    } else {
        errors.password = '';
    }

    if (hasError) {
        return;
    }

    const res = await $fetch(`http://be-zakkipedia.test/api/v1/user/${route.params.id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`, // melakukan pengecekan authentication berdasarkan token
            },
            body: {
                role_id: formData.value.role_id,
                username: formData.value.username,
                email: formData.value.email,
                password: formData.value.password,
                nama: formData.value.nama,
                alamat: formattedAlamat.value,
            },
        }
    );
    console.log(res)

    toast.add({ title: 'Berhasil Edit Data User dan Admin' })

    formData.value.username = ''
    formData.value.email = ''
    formData.value.password = ''
    formData.value.role_id = ''
    formData.value.nama = ''
    formData.value.repeat_password = ''
    formData.value.alamat = ''

    await navigateTo('/superAdmin/user')
}

const links = [{
    label: 'Dashboard',
    to: '/superAdmin',
    icon: 'i-heroicons-chart-pie-solid'
}, {
    label: 'User',
    to: '/superAdmin/user',
    icon: 'i-heroicons-user-solid'
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

        <div v-else class="w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8 pb-4 px-2 py-5">
            <form class="space-y-6" @submit.prevent="update">
                <div class="flex flex-row items-center">
                    <NuxtLink @click="router.back()"
                        class="text-xl me-4 flex py-1 px-1 cursor-pointer text-gray-600 text-center w-fit h-fit hover:bg-gray-300 rounded ">
                        <UIcon name="i-heroicons-arrow-left-16-solid" />
                    </NuxtLink>
                    <h5 class="text-2xl font-medium text-gray-700">Edit Data Admin</h5>
                </div>

                <div class="grid gap-4 mb-4 grid-cols-2 mt-7 px-1">
                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
                        <input type="text" v-model="formData.username"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input username">
                        <span v-if="errors.username" class="text-red-600 text-sm">{{ errors.username }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type="email" v-model="formData.email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input email">
                        <span v-if="errors.email" class="text-red-600 text-sm">{{ errors.email }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <div class="relative">
                        <input 
                            :type="inputType" 
                            v-model="formData.password"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
                            placeholder="Input password"
                        />
                        <button 
                            type="button" 
                            @click="togglePasswordVisibility"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                        >
                            <UIcon v-if="showPassword" name="i-heroicons-eye-slash" class="text-gray-600" />
                            <UIcon v-else name="i-heroicons-eye" class="text-gray-600" />
                        </button>
                        </div>
                        <span v-if="errors.password" class="text-red-600 text-sm">{{ errors.password }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="repeat_password" class="block mb-2 text-sm font-medium text-gray-900">
                        Repeat Password
                        </label>
                        <div class="relative">
                        <input 
                            :type="inputTypeRepeat" 
                            v-model="formData.repeat_password"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
                            placeholder="Input repeat password"
                        />
                        <button 
                            type="button" 
                            @click="togglePasswordVisibilityRepeat"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                        >
                            <UIcon v-if="showPassword" name="i-heroicons-eye-slash" class="text-gray-600" />
                            <UIcon v-else name="i-heroicons-eye" class="text-gray-600" />
                        </button>
                        </div>
                        <div v-if="formData.password !== formData.repeat_password" class="text-red-600 text-sm">
                        Password tidak sesuai
                        </div>
                    </div>

                    <div class="col-span-1">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nama</label>
                        <input type="text" v-model="formData.nama"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Input nama">
                        <span v-if="errors.nama" class="text-red-600 text-sm">{{ errors.nama }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="provinsi" class="block mb-2 text-sm font-medium text-gray-900">Provinsi</label>
                        <select v-model="selectedProvince" @change="fetchCitys" id="floating_company"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Provinsi</option>
                            <option v-for="province in formData.provinces" :key="province.id"
                                :value="province.id">
                                {{ province.name }}
                            </option>
                        </select>
                        <span v-if="errors.provinces" class="text-red-600 text-sm">{{ errors.provinces }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="kota" class="block mb-2 text-sm font-medium text-gray-900">Kota</label>
                        <select v-model="selectedCity"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Kota</option>
                            <option v-for="city in formData.citys" :key="city.id" :value="city.id">
                                {{ city.name }}
                            </option>
                        </select>
                        <span v-if="errors.citys" class="text-red-600 text-sm">{{ errors.citys }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="kecamatan" class="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                        <select v-model="selectedSubDistrict" @change="selectedSubDistrict"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Kecamatan</option>
                            <option v-for="subDistrict in formData.subDistricts" :key="subDistrict.id"
                                :value="subDistrict.id">
                                {{ subDistrict.name }}
                            </option>
                        </select>
                        <span v-if="errors.subDistricts" class="text-red-600 text-sm">{{ errors.subDistricts }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="kelurahan" class="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                        <select v-model="selectedVillage" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="">Pilih Kelurahan</option>
                            <option v-for="village in formData.villages" :key="village.id" :value="village.id">
                                {{ village.name }}
                            </option>
                        </select>
                        <span v-if="errors.villages" class="text-red-600 text-sm">{{ errors.villages }}</span>
                    </div>

                    <div class="col-span-1">
                        <label for="alamat" class="block mb-2 text-sm font-medium text-gray-900">Jalan</label>
                        <textarea id="alamat" v-model="formData.alamat"
                        placeholder="Input nama jalan" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"></textarea>
                        <span v-if="errors.alamat" class="text-red-600 text-sm">{{ errors.alamat }}</span>
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
                        Edit Data Admin
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