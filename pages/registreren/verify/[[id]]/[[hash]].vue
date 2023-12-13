<template>
  <section class="c-login__content">
    <div v-if="success" class="c-login__title">
      <h1 class="t-form-title">{{ $t('Je account is geverifieerd.') }}</h1>
    </div>
    <div v-else>
      <p class="error-message">{{ $t('The link you used is expired. Send new activation link') }}</p>
    </div>
  </section>
</template>
<script setup>

import { useRoute } from 'nuxt/app';

const route = useRoute();
const success = ref(true);

try {
  await useRWApi(
    `/email/verify/${route.params.id}/${route.params.hash}`,
    { method: 'GET', query: route.query },
  );
} catch (e) {
  success.value = false;
}


</script>