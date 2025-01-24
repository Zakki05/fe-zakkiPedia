<template>
    <table class="w-full hidden md:table text-sm text-left rtl:text-right text-[#4a453e]">
        <thead class="text-xs text-white uppercase bg-[#c8a876]">
            <tr class="text-center">
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('role')">
                    Role
                    <span v-if="sortKey !== 'role'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'role'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('username')">
                    Username
                    <span v-if="sortKey !== 'username'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'username'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('email')">
                    Email
                    <span v-if="sortKey !== 'email'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'email'">
                        <span v-if="sortOrder === 'asc'">
                            <UIcon name="i-heroicons-bars-arrow-up-16-solid" />
                        </span>
                        <span v-else>
                            <UIcon name="i-heroicons-bars-arrow-down-16-solid" />
                        </span>
                    </span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortTable('nama')">
                    Nama
                    <span v-if="sortKey !== 'nama'">
                        <UIcon name="i-heroicons-arrows-up-down-16-solid" />
                    </span>
                    <span v-if="sortKey === 'nama'">
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
            <tr v-for="(user, index) in sortedUsers" :key="index"
                class="bg-white border-b border-[#e0d6c3] hover:bg-[#f0e5d1] text-center">
                <th scope="row" class="px-4 py-3 font-medium text-[#4a453e] whitespace-nowrap break-words">
                    {{ user.role.nama_role }}
                </th>
                <td class="px-4 py-3 break-words text-[#4a453e]">
                    {{ user.username }}
                </td>
                <td class="px-4 py-3 break-words text-[#4a453e]">
                    {{ user.email  }}
                </td>
                <td class="px-4 py-3 break-words text-[#4a453e]">
                    {{ user.nama || '-'}}
                </td>
                <td class="px-4 py-3 items-center space-x-2">
                    <button type="button" @click="showModal(user.id)"
                        class="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <UIcon name="i-heroicons-eye-solid" class="w-4 h-4" />
                    </button>
                    <button type="button" @click="handleEdit(user)"
                        class="text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                        <UIcon name="i-heroicons-pencil-square-solid" class="w-4 h-4" />
                    </button>
                    <button type="button" @click="deleteModal(user.id)"
                        class="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        <UIcon name="i-heroicons-trash-solid" class="w-4 h-4" />
                    </button>
                </td>

                <td>

                </td>

                <!-- Show -->
                <td>
                    <div :id="`modalShow-${user.id}`" tabindex="-1" aria-hidden="true"
                        class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0">
                        <div class="relative p-4 w-full max-w-3xl max-h-screen">
                            <!-- Modal content -->
                            <div class="relative bg-white rounded-lg shadow">
                                <!-- Modal header -->
                                <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 bg-[#c8a876] rounded-t">
                                    <h3 class="text-lg font-semibold text-white">
                                        Detail User
                                    </h3>
                                    <button type="button" @click="hideModal(user.id)"
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
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                        <!-- Kiri -->
                                        <div class="space-y-4">
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Role</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.role?.nama_role || '-' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Email</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.email || '-' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Username</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.username || '-' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Nama</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.nama || 'tersedia untuk admin' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Alamat</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.alamat || 'tersedia untuk admin' }}
                                                </span>
                                            </div>
                                        </div>
                                        <!-- Kanan -->
                                        <div class="space-y-4">
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Nama Panggilan</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.nama_panggilan || 'tersedia untuk pelanggan' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Nama Lengkap</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.nama_lengkap || 'tersedia untuk pelanggan' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Telepon</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.nama_panggilan || 'tersedia untuk pelanggan' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Telepon</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.telepon || 'tersedia untuk pelanggan' }}
                                                </span>
                                            </div>
                                            <div class="flex flex-row items-center gap-2 w-full">
                                                <label class="w-2/5 text-sm font-normal text-gray-900">Alamat Pelanggan</label>
                                                <span class="text-sm font-normal text-gray-900">:</span>
                                                <span class="text-sm font-normal text-gray-900 flex-1 break-words whitespace-normal">
                                                    {{ user.alamatPelanggan || 'tersedia untuk pelanggan' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Delete -->
                <td class="relative">
                    <div :id="`modalDelete-${user.id}`" tabindex="-1"
                        class="hidden bg-black bg-opacity-20 overflow-y-auto fixed inset-0 z-50 flex w-full h-full max-h-full pt-40 pl-96">
                        <div class="relative p-4 w-full max-w-md max-h-full ml-36">
                            <div class="relative bg-white rounded-lg shadow">
                                <button type="button" @click="hideModal(user.id)"
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
                                    <h3 class="mb-5 text-lg font-normal text-gray-500">Apakah Kamu Ingin Menghapus User "{{ user.username }}"?
                                    </h3>

                                    <div class="flex justify-center gap-4 px-6">
                                        <!-- Tombol Tidak, Batalkan -->
                                        <button type="button" @click="hideModal(user.id)"
                                                class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-200">
                                            Tidak, Batalkan
                                        </button>
                                        
                                        <!-- Tombol Yaa, Hapus Data -->
                                        <button type="button" @click="removeData(user.id)"
                                                class="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                                            Yaa, Hapus Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>

useSeoMeta({
  title: 'Dashboard - User',
  description: 'This is dashboard',
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

// State & Variables
const token = useCookie('auth-token').value;
const page = ref(1);
const toast = useToast();
const setRole = ref('');
const pending = ref(false);
const roles = ref([]);
const users = ref({
  data: { records: [], paging: { total_record: 0, record_from: 0, record_to: 0 } },
});
const formData = reactive({
  query: '',
  s: '',
});
const modal = reactive({});
const sortKey = ref('');
const sortOrder = ref('asc');

// Header API
const header = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
};

// Fetch Users
const fetchUsers = async () => {
  try {
    pending.value = true;
    const { data } = await useFetch(
      `http://be-zakkipedia.test/api/v1/user?page=${page.value}&q=${formData.s}&role=${setRole.value}`,
      { 
        headers: header,
        key: `userPage-${page.value}`,
        lazy: true,
      }
    );
    users.value = data.value || users.value;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    pending.value = false;
  }
};

// Sorted Users
const sortedUsers = computed(() => {
  if (!users.value.data.records) return [];
  return users.value.data.records.slice().sort((a, b) => {
    const key = sortKey.value;
    const order = sortOrder.value === 'asc' ? 1 : -1;
    if (key === 'username' || key === 'email' || key === 'nama') {
      return order * a[key].localeCompare(b[key]);
    } else if (key === 'role') {
      return order * a.role.nama_role.localeCompare(b.role.nama_role);
    }
    return 0;
  });
});

// Sorting Function
const sortTable = (key) => {
  sortKey.value = key;
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// Modal Functions
const hideModal = (id) => {
  modal[id]?.classList.add('hidden');
};

const showModal = async (id) => {
  modal[id] = document.getElementById(`modalShow-${id}`);
  modal[id]?.classList.remove('hidden');
};

const deleteModal = (id) => {
    modal[id] = document.getElementById('modalDelete-' + id)
    modal[id].classList.remove("hidden")
}

// Remove Data
const removeData = async (id) => {
  try {
    await $fetch(`http://be-zakkipedia.test/api/v1/user/${id}`, {
      headers: header,
      method: 'DELETE',
    });
    toast.add({ title: 'Berhasil Hapus Data User' });
    fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchUsers();
});

// Router instance untuk navigasi
const router = useRouter();

// Fungsi navigasi berdasarkan role_id
const handleEdit = (user) => {
    if (user.role.id === 2) {
        router.push(`/superAdmin/user/edit-${user.id}`);
    } else if (user.role.id === 3) {
        router.push(`/superAdmin/user/editPelanggan-${user.id}`);
    } else {
        alert("Aksi edit tidak tersedia untuk role ini.");
    }
};

</script>