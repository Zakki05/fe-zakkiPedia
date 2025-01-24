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
const setRole = ref('')

const header = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json'
}

/* const selectedColumns = ref([...columns]) */

const formData = ref({
  kode_kategori: '',
  nama_kategori: '',
  query: '',
  s: ''
})

const { data: kategoris, pending, refresh: refreshKategori } = await useFetch(() => `http://be-zakkipedia.test/api/v1/kategori?page=${page.value}&q=${formData.value.s}`, {
  headers: header,
  key: `kategoriPage-${page.value}`,
  lazy: true,
})
console.log(kategoris)

const modal = [];

function search() {
  formData.value.s = formData.value.query
  refreshKategori()
}

const showCreateModal = ref(false)

const errors = reactive({
  nama_kategori: ''
});

async function createData() {
  try {
    errors.nama_kategori = '';

    let hasError = false;

    if (!formData.value.nama_kategori) {
      errors.telepon = 'Nama Kategori harus diisi';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const response = await $fetch('http://be-zakkipedia.test/api/v1/kategori', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      body: {
        nama_kategori: formData.value.nama_kategori,
      }
    })
    console.log(response)
    toast.add({ title: 'Berhasil Menambahkan Data Kategori' })

    if (!response) {
      throw new Error('Gagal Menambahkan Kategori');
    }

    formData.value.nama_kategori = '',

      showCreateModal.value = false
    refresh()

  } catch (error) {
    console.error(error)
  }
}

const links = [{
  label: 'Dashboard',
  to: '/superAdmin',
  icon: 'i-heroicons-chart-pie-solid'
}, {
  label: 'Kategori',
  to: '/superAdmin/kategori',
  icon: 'i-heroicons-squares-plus-solid'
}]

function refresh() {
  formData.value = {
    s: '',
  };
  refreshKategori();
}

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

    <div v-else>
      <div v-if="kategoris.data.paging.total_record == 0">
        <div class="text-center py-6 bg-[#f9f5ee] border border-[#e0d6c3] rounded-md shadow-md mx-auto my-8">
          <div class="flex flex-col items-center my-3 mx-5">
            <!-- Icon -->
            <div class="bg-[#f0e5d1] p-3 rounded-full my-3 mx-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#c8a876]" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <!-- Heading -->
            <p class="text-[#c8a876] text-lg font-semibold">
              Belum Ada Data Kategori
            </p>

            <!-- Description -->
            <p class="text-[#8c857a] text-sm max-w-xs md:max-w-md my-2">
              Data kategori masih kosong. Silakan menambahkan data kategori baru.
            </p>

            <div
              class="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-md mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
              <button @click="refresh"
                class="inline-flex justify-center items-center px-6 lg:px-10 py-2 bg-[#c8a876] hover:bg-[#b89b6c] text-white text-sm font-medium rounded-md shadow transition duration-300">
                Refresh Halaman
              </button>

              <button @click="showCreateModal = true"
                class="inline-flex justify-center items-center px-6 lg:px-10 py-2 bg-[#c8a876] hover:bg-[#b89b6c] text-white text-sm font-medium rounded-md shadow transition duration-300">
                + Tambah Kategori
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="shadow-lg sm:rounded-lg pl-4 pr-4 pt-2 pb-4 mt-4 bg-[#f9f5ee] border border-[#e0d6c3]">
        <div class="flex flex-col sm:flex-row flex-wrap sm:space-y-0 items-center justify-between pb-4">
            <!-- Bagian Form -->
            <div class="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <form class="flex flex-row items-center w-full sm:w-auto" @submit.prevent="search()">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative flex-grow sm:flex-grow-0">
                        <div
                            class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-5 h-5 text-[#c8a876]" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <input type="text" id="table-search" v-model="formData.query"
                          class="block p-2 ps-10 text-sm w-full text-[#4a453e] border border-[#c8a876] rounded-lg bg-white focus:ring-[#c8a876] focus:border-[#c8a876]"
                          placeholder="Search kode kategori">
                    </div>
                    <button type="submit"
                        class="text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2 ms-2 shadow-md transition duration-300">
                        Search
                    </button>
                </form>
            </div>
            <!-- Bagian Tombol Tambahan -->
            <div class="w-full sm:w-auto flex justify-center sm:justify-end mt-3 sm:mt-0">
                <button type="button" @click="showCreateModal = true"
                    class="flex items-center w-full sm:w-auto text-white bg-[#c8a876] hover:bg-[#b89b6c] focus:ring-4 focus:outline-none focus:ring-[#c8a876] font-medium rounded-lg text-sm px-6 py-2.5 text-center shadow-md transition duration-300">
                    <UIcon name="i-heroicons-plus-circle-16-solid" class="w-4 h-4 mr-2"></UIcon>
                    Buat Kategori Baru
                </button>
            </div>
        </div>

        <div class="relative overflow-x-scroll">
          <DesktopSuperAdminKategoriDesktopKategori></DesktopSuperAdminKategoriDesktopKategori>

          <MobileSuperAdminKategoriMobileKategori></MobileSuperAdminKategoriMobileKategori>
        </div>
      </div>

      <div v-if="showCreateModal" tabindex="-1" aria-hidden="true"
        class="bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
              <h3 class="text-lg font-semibold text-white">
                Buat Kategori Baru
              </h3>
              <button type="button" @click="showCreateModal = false"
                class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <!-- Modal body -->
            <form class="p-4 md:p-5" @submit.prevent="createData">
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label for="nama_kategori" class="block mb-2 text-sm font-medium text-gray-900">Nama
                    Kategori</label>
                  <input type="text" v-model="formData.nama_kategori"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Input nama kategori" required>
                  <span v-if="errors.nama_kategori" class="text-red-600 text-sm">{{
                    errors.nama_kategori
                  }}</span>
                </div>
              </div>
              <div class="flex justify-center">
                <button type="submit"
                  class="text-white inline-flex items-center bg-[#c8a876] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#c8a876]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  <UIcon name="i-heroicons-plus-circle-16-solid" class="mr-2 mt-0.5 w-4 h-4" />
                  Buat Kategori Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="kategoris.data.paging.total_record != 0"
        class="flex flex-col md:flex-row items-center justify-between w-full space-y-2 md:space-y-0 pt-4 pb-6">
        <!-- Informasi Paging -->
        <p class="text-xs text-gray-500 font-normal italic text-center md:text-left">
          Tampilkan {{ kategoris.data.paging.record_from }}-{{
            kategoris.data.paging.record_to }} dari {{ kategoris.data.paging.total_record }}
        </p>

        <!-- Pagination -->
        <UPagination class="flex flex-wrap justify-center md:justify-end pt-2 pb-2 px-4" v-model="page"
          :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
          :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
          :page-count="10" :total="kategoris.data.paging.total_record" />
      </div>
    </div>
  </div>
</template>