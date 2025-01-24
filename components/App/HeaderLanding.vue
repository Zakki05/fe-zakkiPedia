<script setup>

const isMenuOpen = ref(false);
const activeLink = ref('home');

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = window.innerWidth < 768 ? 220 : 60; // 60px untuk mobile, 70px untuk desktop
        const elementPosition = element.getBoundingClientRect().top; // Posisi elemen relatif terhadap viewport
        const offsetPosition = elementPosition + window.scrollY - headerOffset; // Hitung posisi scroll yang diinginkan

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth' // Efek scroll halus
        });

        isMenuOpen.value = false; // Menutup menu setelah klik
    }
};

const updateActiveLink = () => {
  const sections = ['home', 'produk', 'about', 'tentangKami'];
  const scrollPosition = window.scrollY + (window.innerWidth < 768 ? 100 : 65); // Offset berdasarkan ukuran layar

  sections.forEach((section) => {
    const element = document.getElementById(section);
    if (element) {
      const sectionTop = element.offsetTop;
      const sectionHeight = element.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeLink.value = section;
      }
    }
  });
};

onMounted(() => {
  window.addEventListener('scroll', updateActiveLink);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveLink);
});
</script>

<template>
    <!-- nav bar section -->
    <nav class="sticky top-0 flex flex-wrap items-center justify-between px-4 py-1 bg-[#e8e8e5] z-10 shadow-sm">
        <div class="text-xl">
            <NuxtLink to="/">
                <img src="~/assets/images/ZakkiPedia.png" alt="Logo" class="h-12 px-3" />
            </NuxtLink>
            
        </div>
        <div class="flex md:hidden">
            <button @click="toggleMenu" id="hamburger">
                <img class="toggle block" 
                     :class="{ hidden: isMenuOpen }" 
                     src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
                     width="40" height="40" />
                <img class="toggle" 
                     :class="{ hidden: !isMenuOpen }" 
                     src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
                     width="40" height="40" />
            </button>
        </div>
        <div class="toggle" :class="{ hidden: !isMenuOpen, 'w-full': true, 'md:w-auto': true, 'md:flex': true }">
            <a href="#home" @click.prevent="scrollTo('home')" :class="{'text-blue-500': activeLink === 'home'}" class="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none">Home</a>
            <a href="#produk" @click.prevent="scrollTo('produk')" :class="{'text-blue-500': activeLink === 'produk'}" class="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none">Produk</a>
            <a href="#about" @click.prevent="scrollTo('about')" :class="{'text-blue-500': activeLink === 'about'}" class="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none">Tentang Kami</a>
            <a href="#tentangKami" @click.prevent="scrollTo('tentangKami')" :class="{'text-blue-500': activeLink === 'tentangKami'}" class="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none">Kunjungi Kami</a>
            <NuxtLink href="/auth" class="block md:hidden hover:text-blue-500 px-3 py-3 md:border-none">Login</NuxtLink>
        </div>

        <div class="toggle w-full text-end hidden md:flex md:w-auto px-2 py-2 md:rounded">
            <NuxtLink to="/auth">
                <div class="flex justify-end">
                    <div class="flex items-center h-10 w-30 rounded-md bg-[#c8a876] text-white font-medium p-2">
                        <!-- Heroicon name: phone -->
                        <UIcon name="i-heroicons-arrow-left-start-on-rectangle" class="w-6 h-6 mx-1" />
                        Login
                    </div>
                </div>
            </NuxtLink>
        </div>
    </nav>
</template>