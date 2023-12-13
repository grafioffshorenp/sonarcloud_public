<template>
  <div>
    <p v-if="isCandidate && userHasAppliedToAll" class="confirmation">{{ $t("Je hebt al gereageerd") }}</p>
    <a v-else-if="isCandidate && !userHasAppliedToAll" :class="['c-btn c-btn--with-icon', { disabled: isDisabled }]" @click="toggleModal()">
      <span>{{ $t("Reageren") }}</span>
      <i class="far fa-comment-alt"></i>
    </a>
    <NuxtLink
        v-else-if="!isLoggedIn"
        :to="localePath('/registreren-werknemer')"
        target="_self"
        class="c-btn c-btn--with-icon c-btn btn color-default background-default border-default btn--with-icon">
      {{ $t("Reageren") }}
      <i class="far fa-comment-alt"></i>
    </NuxtLink>
    <NuxtLink
        v-else-if="isCandidate && profileCompleteness > emptyPercentage && profileCompleteness < 100"
        :to="localePath('/my-account')"
        target="_self"
        class="c-btn c-btn--with-icon c-btn btn color-default background-default border-default btn--with-icon">
      {{ $t("Maak je profiel compleet om te reageren") }}
    </NuxtLink>

    <ElementsVacancyModal
        v-if="isCandidate"
        :vacancy="vacancy"
        v-bind="info"
        :modal-open="modalOpen === 'jobpost-apply'"
        @update-jobpost="updateJobpost"
        @toggle-modal="toggleModal"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  vacancy: {
    type: Object,
    default: null,
    required: true,
  },
  user: {
    type: Object,
    default: null,
    required: true
  }
})
const profileCompleteness = props.user?.employee?.profile_completeness;
const emptyPercentage = 9;

const isDisabled = () => {
  return props.vacancy && !selectedGigs.length;
};

const info = computed(() => {
  return {jobpost: props.vacancy, user: props.user};
});

const isLoggedIn = computed(() => {
  return props.user ? true : false;
});

const isEmployer = computed(() => {
  return props.user && props.user.role === "employer";
});

const isCandidate = computed(() => {
  return isLoggedIn.value && !isEmployer.value;
});

const userHasAppliedToAll = computed(() => {
  return props.vacancy.has_current_user_applied;
});
const updateJobpost = (data) => {
  const job = data.find(jobpost => jobpost.type === "job");
  Object.assign(props.vacancy, job);
};

let modalOpen = ref();
const toggleModal = () => {
  if (modalOpen.value) {
    modalOpen.value = null;
    return;
  }

  // dataLayer.push({
  //     event: "add_to_cart"
  // });

  modalOpen.value = "jobpost-apply";
}
</script>