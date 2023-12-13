<template>
  <div class="talent-detail-page">
    <div class="l-container">
      <div class="page-vacancy__btn-back">
        <div class="c-button-back">
          <a href="javascript:history.back()">
            <div class="c-button-back__icon">
              <i class="fas fa-arrow-left"></i>
            </div>
          </a>
          <a href="javascript:history.back()">{{ $t('Ga terug') }}</a>
        </div>
      </div>
    </div>
    <article class="c-content-page">
      <ElementsTalentDetails :talent="talent"/>
    </article>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const { locale, availableLocales } = useI18n();
const talent = ref(null);

try {
  const { data } = await useRWApi(`/employer/employee/${route.params.slug[0]}/profile`, { method: 'GET' });
  talent.value = {
    id: route.params.slug[0],
    ...data,
  };
} catch (error) {
  console.log('Error: ', error);

  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true,
  });
}


</script>

<style lang="scss" scoped>
.talent-detail-page {
  background-color: white;
}
</style>