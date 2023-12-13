<template>
  <div>
    <h2 class="form-title">{{ $t(title) }}</h2>

    <div class="input-row relative">
      <FormFieldsInfoButton
        :text="$t('onboarding_employee_info_step7_socialskills')" />
    </div>

    <form @submit.prevent="storeSocialSkills">
      <div class="input-row">
        <div class="input-wrapper input--select input--languages">
          <label>{{ $t("Maak een keuze uit minimaal 3 en maximaal 7 skills") }}</label>
          <div v-if="errors && errors.social_skill_ids" class="text-red-400">{{ $t(errors.social_skill_ids[0]) }}</div>
          <FormFieldsEmployeeSkillsSelect :input="socialSkillsInput" skills-type="soft" @changed="setSkills" />
        </div>
      </div>

      <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
    </form>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const props = defineProps({
  title: {
    type: String,
    default: "Social Skills",
    required: false
  },
  isOnboarding: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const userStore = useUserStore();
const user = await userStore.fetchUser();
const onboardingStore = useOnboardingStore();
const { $toastrBus } = useNuxtApp();
let errors = ref();

let storeSocialSkills = async () => {
  try {
    const { data } = await userStore.storeEmployeeProfile(socialSkillsForm);
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je gegevens zijn opgeslagen'
    });
    if (props.isOnboarding) {
      onboardingStore.nextStep();
    }
  } catch (e) {
    errors.value = e.data.data.errors
    $toastrBus.$emit('show', {
      type: 'error',
      message: e.data.data.message,
      duration: 6000
    });
  }
}

let socialSkillsForm = reactive({
  section: "social_skills",
  social_skill_ids: user.employee.skills_social || []
});

let setSkills = (e) => {
  socialSkillsForm.social_skill_ids = e;
}
const skills = await useRWApi(`/employee/${user.employee.id}/skills`, {
  method: 'GET',
  params: {
    employee_id: user.employee.id,
    "filter[type]": 'soft',
    "per_page": 500
  }
});

const workExperienceSkills = await useRWApi(`/employee/${user.employee.id}/work_experience_skills`, {
  method: 'GET',
  params: {
    employee_id: user.employee.id,
    "filter[type]": 'soft',
    "per_page": 500
  }
});

let socialSkillsInput = {
  handle: 'social_skill_ids',
  skills_social: socialSkillsForm.social_skill_ids,
  skills: skills.data,
  workExperienceSkills: workExperienceSkills.data,
}
</script>