<template>
  <main class="c-content-page">
    <div class="inner-row--large page__box page-details">
      <div class="page__wrapper">
        <section class="page__content">
          <ElementsMyApplicationDetails :application="jobPost"/>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'account',
  title: 'Mijn diensten',
  showBackButton: true,
});

const route = useRoute();
let errors = ref();
let jobPost = ref({});

let jobPostId = route.params.id;
try {
  const vacancyData = await useRWApi(`/job_posts/${jobPostId}`, { method: 'GET' });
  if (vacancyData && vacancyData.data) {
    jobPost.value = vacancyData.data;
  }
} catch (data) {
  if (data.errors) {
    errors.value = data.errors;
  }
}

</script>

<style lang="scss">
$component: 'my-application';

.#{$component} {
  .page-vacancy__header {
    display: none;
  }
}

.margin-bottom {
  margin-bottom: 24px;
}

.main-header {
  padding-top: 32px;
  padding-bottom: 40px;

  @include until-tablet {
    min-height: 108px;
  }

  @include tablet {
    padding-top: 80px;
  }
}
</style>