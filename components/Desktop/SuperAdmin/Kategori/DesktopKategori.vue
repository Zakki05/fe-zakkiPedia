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
const page = ref(1)
const toast = useToast()
const sortKey = ref('');
const sortOrder = ref('asc');
const isLoading = ref(false);
const kategoris = ref({
    data: { records: [], paging: { total_record: 0, record_from: 0, record_to: 0 } },
});

const header = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json'
}

const formData = ref({
  kode_kategori: '',
  nama_kategori: '',
  query: '',
  s: ''
})

const fetchKategoris = async () => {
  try {
    isLoading.value = true;
    const { data } = await useFetch(
      `http://be-zakkipedia.test/api/v1/kategori?page=${page.value}&q=${formData.value.s}`,
      { 
        headers: header,
        key: `kategoriPage-${page.value}`,
        lazy: true,
      }
    );
    kategoris.value = data.value || kategoris.value;
  } catch (error) {
    console.error('Error fetching kategoris:', error);
  } finally {
    isLoading.value = false;
  }
};

const modal = [];

const sortedKategoris = computed(() => {
  if (!kategoris.value.data.records) return [];
  return kategoris.value.data.records.slice().sort((a, b) => {
    const key = sortKey.value;
    const order = sortOrder.value === 'asc' ? 1 : -1;
    if (key === 'kode_kategori' || key === 'nama_kategori') {
      return order * a[key].localeCompare(b[key]);
    }
    return 0;
  });
});

function sortTable(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const hideModal = (id) => {
  modal[id]?.classList.add("hidden")
  formData.value.kode_kategori = ''
  formData.value.nama_kategori = ''
}

const showModal = async (id) => {
  modal[id] = document.getElementById(`modalShow-${id}`);
  modal[id]?.classList.remove('hidden');
};

const editModal = async (id) => {
  modal[id] = document.getElementById('modalEdit-' + id)
  modal[id].classList.remove("hidden")

  const { data: res, pending } = await useFetch(`http://be-zakkipedia.test/api/v1/kategori/${id}`, {
    headers: header,
    lazy: true
  })
  console.log(res)

  const kategori = res.value.data.record

  formData.value.nama_kategori = kategori.nama_kategori
}

const updateData = async (id) => {
  const res = await $fetch(`http://be-zakkipedia.test/api/v1/kategori/${id}`, {
    headers: header,
    method: "PUT",
    body: {
      nama_kategori: formData.value.nama_kategori,
    }
  })
  console.log(res)
  toast.add({ title: 'Berhasil Edit 1 Data Kategori' })

  formData.value.nama_kategori = ''

  await fetchKategoris();
}

const deleteModal = (id) => {
    modal[id] = document.getElementById('modalDelete-' + id)
    modal[id].classList.remove("hidden")
}

const removeData = async (id) => {
  try {
    await $fetch(`http://be-zakkipedia.test/api/v1/kategori/${id}`, {
      headers: header,
      method: 'DELETE',
    });
    toast.add({ title: 'Berhasil Hapus Data Kategori' });
    await fetchKategoris();
  } catch (error) {
    console.error('Error deleting kategori:', error);
  }
};

onMounted(() => {
  fetchKategoris();
});

</script>

<template>
    <table class="w-full hidden md:table text-sm text-left rtl:text-right text-[#4a453e]">
        <thead class="text-xs text-white uppercase bg-[#c8a876]">
            <tr class="text-center">
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('kode_kategori')">
                    Kode Kategori
                    <span v-if="sortKey !== 'kode_kategori'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'kode_kategori'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('nama_kategori')">
                    Nama Kategori
                    <span v-if="sortKey !== 'nama_kategori'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'nama_kategori'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(kategori, index) in sortedKategoris" :key="index"
                class="bg-white border-b border-[#e0d6c3] hover:bg-[#f0e5d1] text-center">
                <th scope="row" class="px-6 py-4 font-medium text-[#4a453e] whitespace-nowrap break-words">
                    {{ kategori.kode_kategori }}
                </th>
                <td class="px-6 py-4 break-words text-[#4a453e]">
                    {{ kategori.nama_kategori }}
                </td>
                <td class="px-6 py-4 items-center space-x-3">
                    <button type="button" @click="showModal(kategori.id)"
                        class="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <UIcon name="i-heroicons-eye-solid" class="w-4 h-4" />
                    </button>
                    <button type="button" @click="editModal(kategori.id)"
                        class="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                        <UIcon name="i-heroicons-pencil-square-solid" class="w-4 h-4" />
                    </button>
                    <button type="button" @click="deleteModal(kategori.id)"
                        class="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        <UIcon name="i-heroicons-trash-solid" class="w-4 h-4" />
                    </button>
                </td>

                <!-- Show -->
                <td>
                    <div :id="`modalShow-${kategori.id}`" tabindex="-1" aria-hidden="true"
                        class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0">
                        <div class="relative p-4 w-full max-w-lg max-h-screen">
                            <!-- Modal content -->
                            <div class="relative bg-white rounded-lg shadow">
                                <!-- Modal header -->
                                <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
                                        <h3 class="text-lg font-semibold text-white">
                                        Detail Kategori
                                    </h3>
                                    <button type="button" @click="hideModal(kategori.id)"
                                        class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <!-- Modal body -->
                                <form class="p-4 md:p-5">
                                    <div class="gap-8 text-center">
                                        <div class="space-y-4">
                                            <!-- Baris: Kode Kategori -->
                                            <div class="flex items-center gap-4 w-full">
                                                <label class="w-1/3 text-sm font-medium text-gray-900 text-left">Kode Kategori</label>
                                                <span class="text-sm font-medium text-gray-900">:</span>
                                                <span class="text-sm text-gray-700 flex-1 break-words whitespace-normal">
                                                    {{ kategori.kode_kategori || '-' }}
                                                </span>
                                            </div>

                                            <!-- Baris: Nama Kategori -->
                                            <div class="flex items-center gap-4 w-full">
                                                <label class="w-1/3 text-sm font-medium text-gray-900 text-left">Nama Kategori</label>
                                                <span class="text-sm font-medium text-gray-900">:</span>
                                                <span class="text-sm text-gray-700 flex-1 break-words whitespace-normal">
                                                    {{ kategori.nama_kategori || '-' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Edit -->
                <td>
                    <div :id="`modalEdit-${kategori.id}`" tabindex="-1" aria-hidden="true"
                        class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0">
                        <div class="relative p-4 w-full max-w-md max-h-screen">
                            <!-- Modal content -->
                            <div class="relative bg-white rounded-lg shadow">
                                <!-- Modal header -->
                                <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
                                    <h3 class="text-lg font-semibold text-white">
                                        Edit Kategori
                                    </h3>
                                    <button type="button" @click="hideModal(kategori.id)"
                                        class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <!-- Modal body -->
                                <form class="p-4 md:p-5" @submit.prevent="updateData(kategori.id)">
                                    <div class="grid gap-4 mb-4 grid-cols-2">
                                        <div class="col-span-2">
                                            <label for="nama_kategori"
                                                class="block mb-2 text-sm font-medium text-gray-900 text-left">
                                                Nama Kategori
                                            </label>
                                            <input type="text" v-model="formData.nama_kategori"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                placeholder="Input nama kategori" required="">
                                        </div>
                                    </div>
                                    <button type="submit"
                                        class="text-white bg-[#c8a876] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#c8a876]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-1">
                                        <UIcon name="i-heroicons-pencil-square-solid" class="mr-2 w-4 h-4" />
                                        Edit Data Kategori
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </td>


                <!-- Delete -->
                <td>
                    <div :id="`modalDelete-${kategori.id}`" tabindex="-1"
                        class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0">
                        <div class="relative p-4 w-full max-w-md max-h-screen">
                            <div class="relative bg-white rounded-lg shadow">
                                <button type="button" @click="hideModal(kategori.id)"
                                    class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                                <div class="p-4 md:p-5 text-center">
                                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h3 class="mb-5 text-lg font-normal text-gray-500">Apakah Kamu Ingin
                                        Menghapus
                                        {{
                                            kategori.kode_kategori }}?
                                    </h3>
                                    <button type="button" @click="removeData(kategori.id)"
                                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                        Yaa, Hapus Data
                                    </button>
                                    <button type="button" @click="hideModal(kategori.id)"
                                        class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Tidak,
                                        Batalkan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>