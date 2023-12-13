<template>
  <ElementsAccountOnboarding
      v-if="onboardingStore.getOnboardingState"
      :user="user"
      :onboardingForms="onboardingStore.getSteps"/>
  <slot name="after-completion" v-else></slot>
</template>

<script setup>
const onboardingStore = useOnboardingStore();
const userStore = useUserStore();

const isOnboarding = computed(
    () => (userStore.isEmployer && userStore.user?.employer_user?.employer?.show_onboarding) ||
        (userStore.isEmployee && userStore.user?.employee?.show_onboarding),
);

const user = computed(
    () => userStore.isEmployer ? userStore.user.employer_user : (
        userStore.isEmployee ? userStore.user.employee : null),
);

watch(isOnboarding, (newOnboarding, oldOnboarding) => {
  // Only (re)initialize the onboarding when the value changes to `true`.
  // Reinitializing on every change can cause the onboarding modal to cause issues.
  // And during the onboarding the state can change to false, even though some steps have not been completed yet, so we
  // only initialze the modal when the state goes from `false` to `true`.
  if (newOnboarding === oldOnboarding || !newOnboarding) {
    return;
  }

  onboardingStore.setOnboardingState(true);
  if (userStore.isEmployer) {
    setEmployerOnboardingSteps();
  }
  if (userStore.isEmployee) {
    setEmployeeOnboardingSteps();
  }
}, { immediate: true });

const setEmployerOnboardingSteps = () => {
  onboardingStore.setSteps([
    'Welcome',
    'EmployerProfileCompanyDetails',
    'EmployerProfileAccountDetails',
    'EmployerProfilePictures',
  ]);
  const employer_user = userStore.user.employer_user;
  const employer = userStore.user.employer_user.employer;

  // If none of these values are, start at the Welcome step.
  if (employer.name === null && employer.postalcode === null && employer.house_number === null &&
      employer.street === null && employer.city === null && employer.chamber_of_commerce_number === null &&
      employer.phone === null && employer.company_profile === null) {
    onboardingStore.setStep(0);
    return;
  }

  // If one of the required company details is missing, start at the EmployerProfileCompanyDetails step.
  if (employer.name === null || employer.postalcode === null || employer.house_number === null ||
      employer.street === null || employer.city === null || employer.chamber_of_commerce_number === null ||
      employer.phone === null || employer.company_profile === null) {
    onboardingStore.setStep(1);
    return;
  }

  // If one of the required account details is missing, start at the EmployerProfileAccountDetails step.
  if (employer_user.first_name === null || employer_user.last_name === null || employer_user.mobile === null) {
    onboardingStore.setStep(2);
    return;
  }

  // If one of the required pictures is missing, start at the EmployerProfilePictures step.
  if (employer.logo === '' || employer.picture === '') {
    onboardingStore.setStep(3);
    return;
  }

  // This step can only be reached if the backend still requires an onboarding field to be set, but that field has not
  // been added in one of the checks above.
  onboardingStore.setStep(0);
};

const setEmployeeOnboardingSteps = () => {
  const user = userStore.user;
  onboardingStore.setSteps([
    'Welcome',
    'EmployeeProfilePersonal',
    'EmployeeProfileContactDetails',
    'EmployeeProfileLanguages',
    'EmployeeProfileEducations',
    'EmployeeProfileWorkExperience',
    'EmployeeProfileFunctionalSkills',
    'EmployeeProfileSocialSkills',
    'EmployeeProfileAvailability',
    'EmployeeProfileAbout',
    'EmployeeProfilePhoto',
    'EmployeeProfileConsent',
  ]);
  if (user.employee.gender === null && user.employee.last_name === null && user.employee.birthdate === null &&
      user.employee.nationality === null && user.employee.has_social_security_number === null &&
      user.employee.has_work_permit === null && user.employee.has_dutch_bank_account === null) {
    onboardingStore.setStep(0);
    return;
  }
  if (user.employee.gender === null || user.employee.last_name === null || user.employee.birthdate === null ||
      user.employee.nationality === null || user.employee.has_social_security_number === null ||
      user.employee.has_work_permit === null || user.employee.has_dutch_bank_account === null) {
    onboardingStore.setStep(1);
    return;
  }
  if (user.employee.region === null || user.employee.city === null || user.employee.mobile === null) {
    onboardingStore.setStep(2);
    return;
  }
  if (user.employee.languages === null) {
    onboardingStore.setStep(3);
    return;
  }
  if (user.employee.educations === null && user.employee.has_education) {
    onboardingStore.setStep(4);
    return;
  }
  if (user.employee.work_experiences.length === 0 && user.employee.has_work_experience) {
    onboardingStore.setStep(5);
    return;
  }
  if (user.employee.skills_functional.length === 0 && user.employee.has_work_experience) {
    onboardingStore.setStep(6);
    return;
  }
  if (user.employee.skills_social.length === 0) {
    onboardingStore.setStep(7);
    return;
  }
  if (user.employee.work_type === null || user.employee.working_hours === null ||
      user.employee.work_status_holder === null) {
    onboardingStore.setStep(8);
    return;
  }
  if (user.employee.about === '') {
    onboardingStore.setStep(9);
    return;
  }
  if (user.employee.profile_picture === '') {
    onboardingStore.setStep(10);
    return;
  }
  onboardingStore.setStep(0);
};
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-white font-bold;
}
</style>