<template>
    <div v-for="(user, index) in sortedUsers" :key="index"
        class="md:hidden bg-[#f9f5ee] border-4 border-[#e0d6c3] rounded-lg mb-4 p-4 shadow-md">
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">Role:</p>
            <p class="text-[#4a453e]">{{ user.role.nama_role }}</p>
        </div>
        <!-- Email -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">email:</p>
            <p class="text-[#4a453e]">{{ user.email }}</p>
        </div>
        <!-- Username -->
        <div class="mb-4">
            <p class="text-[#4a453e] font-bold">username:</p>
            <p class="text-[#4a453e]">Rp. {{ user.username }}</p>
        </div>
        <div class="flex justify-end space-x-2 mt-2">
            <button type="button" @click="showModalMobile(user.id)"
                class="text-white bg-blue-500 hover:bg-blue-700 rounded-full p-2">
                <UIcon name="i-heroicons-eye-solid" />
            </button>
            <NuxtLink :to="`/superAdmin/user/edit-${user.id}`">
                <button type="button" class="text-white bg-yellow-300 hover:bg-yellow-500 rounded-full p-2">
                    <UIcon name="i-heroicons-pencil-square-solid" />
                </button>
            </NuxtLink>
            <button type="button" @click="deleteModalMobile(user.id)"
                class="text-white bg-red-500 hover:bg-red-700 rounded-full p-2">
                <UIcon name="i-heroicons-trash-solid" />
            </button>
        </div>
        <!-- Show -->
        <div :id="`modalShowMobile-${user.id}`" tabindex="-1" aria-hidden="true"
            class="hidden bg-black bg-opacity-20 overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full max-h-full pt-28 pl-14">
            <div class="relative p-4 w-full max-w-3xl max-h-full">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 class="text-lg font-semibold text-gray-900">
                            Detail User
                        </h3>
                        <button type="button" @click="hideModal(user.id)"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <form class="p-4 md:p-5">
                        <div class="flex flex-wrap gap-4">
                            <!-- Info Field -->
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Role</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.role?.nama_role || '-' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Email</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.email || '-' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Username</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.username || '-' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Nama</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.nama || 'tersedia untuk admin' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Alamat</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.alamat || 'tersedia untuk admin' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Nama Panggilan</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.nama_panggilan || 'tersedia untuk pelanggan' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Nama Lengkap</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.nama_lengkap || 'tersedia untuk pelanggan' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Telepon</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.telepon || 'tersedia untuk pelanggan' }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full">
                                <label class="w-2/5 text-sm font-medium text-gray-900">Alamat Pelanggan</label>
                                <span class="text-sm font-medium text-gray-900">:</span>
                                <span class="text-sm font-medium text-gray-900 flex-1 break-words whitespace-normal">
                                    {{ user.alamatPelanggan || 'tersedia untuk pelanggan' }}
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete -->
        <div :id="`modalDeleteMobile-${user.id}`" tabindex="-1"
            class="hidden bg-black bg-opacity-20 overflow-y-auto fixed inset-0 z-50 flex w-full h-full max-h-full">
            <div class="relative p-4 w-full max-w-md max-h-full pt-52 ml-14">
                <div class="relative bg-white rounded-lg shadow">
                    <button type="button" @click="hideModal(user.id)"
                        class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-4 md:p-5 text-center px-5">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500">Apakah Kamu Ingin
                            Menghapus {{ user.username }}?
                        </h3>

                        <div class="flex justify-center gap-4">
                            <button type="button" @click="hideModal(user.id)"
                                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                Tidak, Batalkan
                            </button>

                            <button type="button" @click="removeData(user.id)"
                                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Yaa, Hapus Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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

// Modal Functions
const hideModal = (id) => {
  modal[id]?.classList.add('hidden');
};

const showModalMobile = async (id) => {
  modal[id] = document.getElementById(`modalShowMobile-${id}`);
  modal[id]?.classList.remove('hidden');
};

const deleteModalMobile = async (id) => {
  modal[id] = document.getElementById(`modalDeleteMobile-${id}`);
  modal[id]?.classList.remove('hidden');
};

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
</script>