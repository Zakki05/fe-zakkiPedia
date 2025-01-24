<script setup>
import { ref, onMounted } from 'vue';

const detailsVisible1 = ref(true);
const detailsVisible2 = ref(true);
const detailsVisible3 = ref(true);
const stock1 = ref('');
const stock2 = ref('');
const stock3 = ref('');
const price1 = ref('');
const price2 = ref('');
const price3 = ref('');
const selectedSize1 = ref('S');
const selectedSize2 = ref('S');
const selectedSize3 = ref('S'); 

const showDetails1 = (size) => {
  selectedSize1.value = size;
  switch (size) {
    case 'S':
      stock1.value = '20';
      price1.value = 'Rp 150.000';
      break;
    case 'M':
      stock1.value = '15';
      price1.value = 'Rp 160.000';
      break;
    case 'L':
      stock1.value = '10';
      price1.value = 'Rp 170.000';
      break;
    case 'XL':
      stock1.value = '5';
      price1.value = 'Rp 180.000';
      break;
    default:
      stock1.value = '';
      price1.value = '';
  }
};

const showDetails2 = (size) => {
  selectedSize2.value = size; 
  switch (size) {
    case 'S':
      stock2.value = '30';
      price2.value = 'Rp 200.000';
      break;
    case 'M':
      stock2.value = '35';
      price2.value = 'Rp 210.000';
      break;
    case 'L':
      stock2.value = '20';
      price2.value = 'Rp 220.000';
      break;
    case 'XL':
      stock2.value = '25';
      price2.value = 'Rp 230.000';
      break;
    default:
      stock2.value = '';
      price2.value = '';
  }
};

const showDetails3 = (size) => {
  selectedSize3.value = size;
  switch (size) {
    case 'S':
      stock3.value = '20';
      price3.value = 'Rp 250.000';
      break;
    case 'M':
      stock3.value = '45';
      price3.value = 'Rp 260.000';
      break;
    case 'L':
      stock3.value = '10';
      price3.value = 'Rp 270.000';
      break;
    case 'XL':
      stock3.value = '5';
      price3.value = 'Rp 280.000';
      break;
    default:
      stock3.value = '';
      price3.value = '';
  }
};

onMounted(() => {
  showDetails1('S');
  showDetails2('S');
  showDetails3('S');
});
</script>

<template>
    <!-- our services section -->
    <section class="py-10" id="produk">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Etalase Produk</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- CARD1 -->
                <div class="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src="~/assets/images/kaosU.png"
                    alt="Nama Produk Pakaian" class="w-full h-64 object-cover" />
                    <div class="p-6">
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Kaos Coklat Uniqlo</h3>
                        <p class="text-gray-600 mb-2">Kategori: <span class="font-semibold">Kaos</span></p>

                        <p class="text-gray-600 mb-2">Ukuran:</p>
                        <div class="flex space-x-2 mb-4">
                            <button 
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize1 === 'S' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails1('S')">
                                S
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize1 === 'M' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails1('M')">
                                M
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize1 === 'L' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails1('L')">
                                L
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize1 === 'XL' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails1('XL')">
                                XL
                            </button>
                        </div>

                        <div v-if="detailsVisible1" class="text-gray-600 mb-4">
                            <p>Stok: {{ stock1 }}</p>
                        </div>

                        <p class="text-gray-600 mb-4">Kaos kasual ini terbuat dari bahan berkualitas tinggi yang nyaman dipakai. Tersedia dalam berbagai ukuran dan warna, cocok untuk berbagai kesempatan.</p>
                        
                        <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
                            <span class="text-lg font-bold text-gray-800 transition duration-300 transform hover:text-green-600 mb-4 sm:mb-0">{{ price1 }}</span>
                            <NuxtLink to="/auth">
                              <button class="bg-[#c8a876] text-white font-semibold py-2 px-4 rounded hover:bg-[#c09858] transition duration-300 shadow-md hover:shadow-lg flex items-center w-full sm:w-auto">
                                  <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5 mr-2" />
                                  Tambah ke Keranjang
                              </button>
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- CARD2 -->
                <div
                class="bg-white rounded-lg bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg overflow-hidden min-h-full">
                    <div class="text-center text-white font-medium">Best Seller</div>
                    <img src="~/assets/images/kemejaU.png"
                    alt="Nama Produk Pakaian" class="w-full h-56 object-cover" />
                    <div class="p-6 bg-white">
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Kemeja Uniqlo</h3>
                        <p class="text-gray-600 mb-2">Kategori: <span class="font-semibold">Kemeja</span></p>

                        <p class="text-gray-600 mb-2">Ukuran:</p>
                        <div class="flex space-x-2 mb-4">
                            <button 
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize2 === 'S' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails2('S')">
                                S
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize2 === 'M' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails2('M')">
                                M
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize2 === 'L' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails2('L')">
                                L
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize2 === 'XL' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails2('XL')">
                                XL
                            </button>
                        </div>

                        <div v-if="detailsVisible2" class="text-gray-600 mb-4">
                            <p>Stok: {{ stock2 }}</p>
                        </div>

                        <p class="text-gray-600 mb-4">Kemeja kasual ini terbuat dari bahan berkualitas tinggi yang nyaman dipakai. Tersedia dalam berbagai ukuran dan warna, cocok untuk berbagai kesempatan.</p>
                        
                        <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
                            <span class="text-lg font-bold text-gray-800 transition duration-300 transform hover:text-green-600 mb-4 sm:mb-0">{{ price2 }}</span>
                            <NuxtLink to="/auth">
                              <button class="bg-[#c8a876] text-white font-semibold py-2 px-4 rounded hover:bg-[#c09858] transition duration-300 shadow-md hover:shadow-lg flex items-center w-full sm:w-auto">
                                  <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5 mr-2" />
                                  Tambah ke Keranjang
                              </button>
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- CARD3 -->
                <div class="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src="~/assets/images/hoodieU.png"
                    alt="Nama Produk Pakaian" class="w-full h-64 object-cover" />
                    <div class="p-6">
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Hoodie Uniqlo</h3>
                        <p class="text-gray-600 mb-2">Kategori: <span class="font-semibold">Hoodie</span></p>

                        <p class="text-gray-600 mb-2">Ukuran:</p>
                        <div class="flex space-x-2 mb-4">
                            <button 
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize3 === 'S' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails3('S')">
                                S
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize3 === 'M' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails3('M')">
                                M
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize3 === 'L' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails3('L')">
                                L
                            </button>
                            <button
                            :class="['w-10 h-10 rounded-full border transition duration-200', selectedSize3 === 'XL' ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-500 hover:text-white']"
                            @click="showDetails3('XL')">
                                XL
                            </button>
                        </div>

                        <div v-if="detailsVisible3" class="text-gray-600 mb-4">
                            <p>Stok: {{ stock3 }}</p>
                        </div>

                        <p class="text-gray-600 mb-4">Hoodie ini terbuat dari bahan berkualitas tinggi yang nyaman dipakai. Tersedia dalam berbagai ukuran dan warna, cocok untuk berbagai kesempatan.</p>
                        
                        <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
                            <span class="text-lg font-bold text-gray-800 transition duration-300 transform hover:text-green-600 mb-4 sm:mb-0">{{ price3 }}</span>
                            <NuxtLink to="/auth">
                              <button class="bg-[#c8a876] text-white font-semibold py-2 px-4 rounded hover:bg-[#c09858] transition duration-300 shadow-md hover:shadow-lg flex items-center w-full sm:w-auto">
                                  <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5 mr-2" />
                                  Tambah ke Keranjang
                              </button>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>