<template>
  <div>
    <h1 class="text-3xl font-bold">
      Mijn Functies
    </h1>

    <table class="border">
      <tr>
        <td class="border p-3">Functie</td>
        <td class="border p-3">Locatie</td>
        <td class="border p-3">Shifts</td>
        <td class="border p-3">Aanmaakdatum</td>
      </tr>
      <tr v-for="functionTemplate in functionTemplates">
        <td class="border p-3">
          <span class="font-bold">{{ functionTemplate.function.name }}</span>
          <br />
          <NuxtLink :to="localePath('/mijn-account/templates/' + functionTemplate.id + '/bewerken')">{{
            functionTemplate.name }}</NuxtLink>
        </td>
        <td class="border p-3">{{ functionTemplate.employer_location ? functionTemplate.employer_location.name :
          'Alle locaties' }}</td>
        <td class="border p-3">{{ functionTemplate.job_posts_count }}</td>
        <td class="border p-3">{{ functionTemplate.created_at }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
})

const res = await useRWApi('/api/employer/292/shifts/function_templates?per_page=400', 'GET', {
  some: 'thing'
});
const functionTemplates = res.data;

console.log('functionTemplates', functionTemplates)

</script>