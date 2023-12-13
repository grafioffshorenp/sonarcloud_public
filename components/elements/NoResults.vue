<template>
  <div class="page__wrapper">
    <section class="page__content page__centered">
      <h2 class="no-results">{{ $t(title) }}</h2>
      <p v-if="loadingResults">{{ noResultsFields.loadingResultsText || $t('Resultaten worden gezocht...') }}</p>
      <slot/>

    </section>
  </div>
</template>

<script>
export default {
  name: 'NoResults',
  props: {
    title: {
      type: String,
      default: 'Geen resultaten gevonden',
    },
    text: {
      type: String,
      default: '',
    },
  },
};
</script>
