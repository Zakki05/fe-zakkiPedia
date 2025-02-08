<template>
    <div class="bg-gray-100">
        <div>
            <AppHeaderPelanggan></AppHeaderPelanggan>
            <main class="relative -mt-32">
                <div class="mx-auto max-w-full-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                    <div class="overflow-hidden rounded-lg bg-white shadow">
                        <div class="flex flex-row divide-x">
                            <AppSidebarPelanggan></AppSidebarPelanggan>
                            <main class="flex-1 py-6 px-4 sm:p-6">
                                <slot></slot>
                            </main>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>