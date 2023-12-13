<template>
  <div class="max-w-7xl m-auto mt-10">
    <div class="flex gap-10 mx-10">
      <div class="w-2/3 bg-white p-10">
        <AtomicUIUIAtomsIconButton fa-class="fas fa-arrow-left" :aria-label="$t('Ga terug')" :handler="goToVacancies">
          {{ $t("Ga terug") }}
        </AtomicUIUIAtomsIconButton>
        <br />
        <ElementsVacancyDetails :vacancy="vacancyData.data" />
      </div>
      <div class="w-1/3" style="align-self: start">
        <div class="bg-white p-5">
          <h3 v-if="!isArchived()">{{ $t('Acties') }}</h3>

          <NuxtLink
            class="c-btn btn mt-2"
            v-if="!isArchived()"
            :to="localePath(`/my-account/employer/vacancies/edit-vacancy/${functionTemplateId}/${jobPostId}`)"
          >{{ $t('Edit') }}</NuxtLink>

          <div class="mt-10" v-if="isArchived()">
            <p>{{ $t("De vacature is gearchiveerd") }}</p>
          </div>

          <div v-if="!isArchived() && canPublish" class="mt-10">
            <p>{{ $t("De vacature staat nu als") }} <span class="font-bold">{{ $t(status) }}</span>.</p>
            <label v-if="canPublish" class="input--switch">
              <input v-model="isOpen" type="checkbox" @change="toggleStatus()" />
              <span class="toggler"></span>
            </label>
          </div>
        </div>

        <div v-if="vacancyData.data.contracts.length > 0" class="bg-white p-5 mt-10">
          <h3>{{ $t("Medewerkers") }}</h3>

          <div class="mt-5">
            <ul>
              <li v-for="contract in vacancyData.data.contracts" :key="contract" class="flex space-x-2 align-center">
                <div>
                  <img :src="contract.employee.profile_picture" class="w-16 rounded-full">
                </div>
                <div class="flex-grow">
                  {{ contract.employee.name }}
                </div>
                <div>
                  <NuxtLink :to="localePath(`/my-account/employer/employee/${contract.employee.id}`)">{{ $t("Bekijk") }}</NuxtLink>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { locale } = useI18n();

// URL Structure is /my-account/employer/vacancies/jobposts/{functionTemplateId}/{jobPostId}
let functionTemplateId = route.params.slug[1];
let jobPostId = route.params.slug[2];

let vacancyData = ref();
vacancyData.value = await useRWApi(`/employer/shifts/function_templates/${functionTemplateId}/job_posts/${jobPostId}`, 'GET');

let status = ref(vacancyData.value.data.status)
let isOpen = status.value === 'open';

const user = await userStore.fetchUser();

const canPublish = computed(() => user?.employer_user?.employer?.is_allowed_to_create_job_posts);

const isArchived = () => {
  return status.value === 'archived' ? true : false
}

let toggleStatus = async () => {
  await useRWApi(`/employer/shifts/function_templates/${functionTemplateId}/job_posts/${jobPostId}/status`, {
    method: 'PUT',
    body: {
      status: isOpen && canPublish.value ? 'open' : 'offline'
    }
  });
  vacancyData.value = await useRWApi(`/employer/shifts/function_templates/${functionTemplateId}/job_posts/${jobPostId}`, 'GET');
}

let goToVacancies = () => {
  router.push({
    path: `/my-account/employer/vacancies`
  })
}

</script>

<style lang="scss">
body {}
</style>