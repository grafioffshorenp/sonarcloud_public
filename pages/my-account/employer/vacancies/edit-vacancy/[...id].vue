<template>
  <div class="jobpost-form">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ $t('Edit vacancy') }}</h1>
      </div>
    </header>
    <JobpostForm
        v-if="vacancyData && industries && profileData"
        :jobpostData="vacancyData"
        :industries="industries"
        :profileData="profileData"
        :isEdit="true"
        :action="editVacancyAction"/>

    <div v-else class="loader-overlay">
      <i class="fas fa-spinner fa-6x"/>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
let functionTemplateId = route.params.id[0];
let jobPostId = route.params.id[1];
const { $toastrBus } = useNuxtApp();

let vacancyData = ref();
let profileData = ref();
let industries = ref();

const getVacany = async () => {
  try {
    const response = await useRWApi(`/employer/shifts/function_templates/${functionTemplateId}/job_posts/${jobPostId}`,
        'GET');
    vacancyData.value = { ...response.data };
  } catch (error) {
    throw error;
  }
};

const getIndustries = async () => {
  try {
    const response = await useRWApi(`/industries`, 'GET');
    industries.value = { ...response.data };
  } catch (error) {
    throw error;
  }
};

const getUser = async () => {
  try {
    const response = await useRWApi('/user', { method: 'GET' });
    profileData.value = { ...response.data };
  } catch (error) {
    throw error;
  }
};

const editVacancyAction = async (formData) => {
  try {
    await useRWApi(
        `/employer/shifts/function_templates/${vacancyData.value.function_template_id}/job_posts/${vacancyData.value.id}`,
        {
          method: 'PUT',
          body: formData,
        });
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je gegevens zijn opgeslagen',
      durarion: 6000,
    });
    await navigateTo(
        `/my-account/employer/vacancies/jobposts/${vacancyData.value.function_template_id}/${vacancyData.value.id}`);
  } catch (e) {
    errors.value = e.data.data.errors;
    $toastrBus.$emit('show', {
      type: 'error',
      message: e.data.data.message,
      durarion: 6000,
    });
  }
};

onMounted(() => {
  getVacany();
  getIndustries();
  getUser();
});

</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>