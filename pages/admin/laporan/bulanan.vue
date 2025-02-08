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
    label: 'Laporan Bulanan',
    to: '/admin/laporan/bulanan',
    icon: 'i-heroicons-calendar-solid'
}]

const token = useCookie("auth-token").value;

const header = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const selectedMonth = ref(1); // Bulan default (1 untuk Januari)
const selectedYear = ref(new Date().getFullYear()); // Tahun default
const loading = ref(false);
const toast = useToast();

const generateReport = async (event) => {
    event.preventDefault();
    
    if (!selectedMonth.value || !selectedYear.value) {
        toast.error('Harap pilih bulan dan tahun');
        return;
    }

    loading.value = true;

    try {
        const response = await fetch('http://be-zakkiPedia.test/api/v1/exportLaporanBulanan', {
            method: 'POST',
            headers: {
                ...header,
                'Content-Type': 'application/json' // Pastikan Content-Type diatur
            },
            body: JSON.stringify({
                month: selectedMonth.value, // Pastikan ini adalah angka
                year: selectedYear.value // Pastikan ini adalah angka
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengunduh laporan');
        }

        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Format nama file dengan bulan 2 digit
        const formattedMonth = String(selectedMonth.value).padStart(2, '0');
        const fileName = `laporan_bulanan_${selectedYear.value}_${formattedMonth}.xlsx`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('Laporan berhasil diunduh');

    } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Terjadi kesalahan saat mengunduh laporan');
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
                Laporan Bulanan
            </p>
            <UForm @submit="generateReport" class="space-y-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormGroup label="Bulan" name="month" required>
                        <USelect v-model="selectedMonth" :options="months.map((month, index) => ({ label: month, value: index + 1 }))">
                        </USelect>
                    </UFormGroup>

                    <UFormGroup label="Tahun" name="year" required>
                        <UInput type="number" v-model="selectedYear" placeholder="Masukkan Tahun" />
                    </UFormGroup>
                </div>

                <div class="flex justify-end pt-3">
                    <UButton 
                        type="submit" 
                        icon="i-heroicons-document-magnifying-glass" 
                        color="primary"
                        :loading="loading"
                        class="transition-all duration-200 hover:shadow-lg"
                    >
                        Cetak Laporan
                    </UButton>
                </div>
            </UForm>
        </div>
    </div>
</template>