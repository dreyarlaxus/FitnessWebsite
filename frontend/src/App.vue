<template>
   <Header></Header>
   <main class="mt-[104px]">
      <router-view></router-view>
   </main>
   <Footer></Footer>
   <!-- <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
      rel="stylesheet"
   /> -->
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped></style>
