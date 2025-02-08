<script setup>
useSeoMeta({
    title: 'Homepage Admin',
    description: 'This is Admin page',
})

definePageMeta({
    layout: "admin",
    middleware: 'auth'
});

const links = [{
    label: 'Homepage',
    to: '/admin',
    icon: 'i-heroicons-home-solid'
}, {
    label: 'Laporan Harian',
    to: '/admin/laporan/harian',
    icon: 'i-heroicons-clock-solid'
}]

const token = useCookie("auth-token").value

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const startDate = ref('');
const endDate = ref('');
const loading = ref(false);
const toast = useToast()

const generateReport = async (event) => {
    event.preventDefault();
    
    if (!startDate.value || !endDate.value) {
        toast.error('Harap pilih tanggal mulai dan tanggal selesai');
        return;
    }

    loading.value = true;

    try {
        const token = useCookie('token').value; // Mengambil token dari cookie
        
        const response = await fetch(
            `http://be-zakkiPedia.test/api/v1/exportLaporanHarian?start_date=${startDate.value}&end_date=${endDate.value}`,
            {
                method: 'POST',
                headers: header,
                body: {
                    start_date: startDate.value,
                    end_date: endDate.value
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Ekstrak nama file dari header
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : `laporan_pemesanan_${startDate.value}_to_${endDate.value}.xlsx`;

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast.success('Laporan berhasil diunduh');

    } catch (error) {
        console.error('Error:', error);
        toast.error('Gagal mengunduh laporan: ' + error.message);
    } finally {
        loading.value = false;
    }
};
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

        <div class="shadow-lg sm:rounded-lg pl-4 pr-4 pt-2 pb-4 mt-4 bg-[#f9f5ee] border border-[#e0d6c3]">
            <p class="text-[#c8a876] text-3xl font-semibold text-center py-6">
                Laporan Harian
            </p>
            <UForm @submit="generateReport" class="space-y-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormGroup label="Tanggal Mulai" name="startDate" required>
                        <UInput type="date" v-model="startDate" placeholder="Pilih Tanggal Mulai" />
                    </UFormGroup>

                    <UFormGroup label="Tanggal Selesai" name="endDate" required>
                        <UInput type="date" v-model="endDate" placeholder="Pilih Tanggal Selesai" />
                    </UFormGroup>
                </div>

                <div class="flex justify-end pt-3">
                    <UButton 
                        type="submit" 
                        icon="i-heroicons-document-magnifying-glass" 
                        color="primary"
                        :loading="loading"
                        :disabled="!startDate || !endDate"
                        class="transition-all duration-200 hover:shadow-lg"
                    >
                        Cetak Laporan
                    </UButton>
                </div>
            </UForm>
        </div>
    </div>
</template>