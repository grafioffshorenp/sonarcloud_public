<template>
  <h1 class="text-3xl font-bold">
    Functie template bewerken
  </h1>
  ID: {{ $route.params.slug }}
</template>

<script setup>
const route = useRoute()
console.log(route.params.slug) // My home page
</script>
