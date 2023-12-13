<template>
  <NuxtLayout id="main-page">
    <NuxtLoadingIndicator />
    <!-- <div class=""> -->
      <NuxtPage />
    <!-- </div> -->
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
