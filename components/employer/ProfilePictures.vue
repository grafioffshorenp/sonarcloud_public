<template>
  <div>
    <h2 class="form-title">{{ $t(title) }}</h2>

    <div class="pr-10">
      {{
        $t("Voeg je bedrijfslogo en een sfeerfoto van het bedrijf toe. Youbahners zien het logo en de foto bij je shifts.")
      }}
    </div>

    <br/>

    <div class="input-row relative">
      <FormFieldsInfoButton :text="$t('onboarding_employer_info_step3_companylogoandpicture')"/>
    </div>

    <form @submit.prevent="savePictures">
      <div class="input-wrapper">
        <div class="input-wrapper input--filee input--employer_logo">

          <FormFieldsFileUpload :input="inputLogo" :accept="['image']" :file="companyDetailsForm.logo"
                                @cropping="setCanContinue" @setCrop="setCropLogo"/>
          <div v-if="errors && errors.logo" class="text-red-400">{{
              $t(errors.logo[0])
            }}
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper input--filee input--employer_picture">
          <FormFieldsFileUpload :input="inputAmbiance" :accept="['image']" :width="475" :height="475"
                                :file="companyDetailsForm.picture" @cropping="setCanContinue"
                                @setCrop="setCropPicture"/>
          <div v-if="errors && errors.picture" class="text-red-400">{{
              $t(errors.picture[0])
            }}
          </div>
        </div>
      </div>

      <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" :skipStep="false" :canContinue="canContinue"/>
    </form>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "Pictures",
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

const canContinue = ref(true);
// From the upload component the `cropping` event is emitted when the user
// enters the crop selection state at which point we want to disable the submit button
let setCanContinue = (e) => {
  canContinue.value = !e;
}

const onboardingStore = useOnboardingStore();
const { $toastrBus } = useNuxtApp();
let errors = ref();

const companyDetailsForm = reactive({
  "section": "logo",
  logo: user.employer_user.employer.logo !== '' ? user.employer_user.employer.logo : null,
  picture: user.employer_user.employer.picture !== '' ? user.employer_user.employer.picture : null,
});

let inputLogo = {
  handle: 'logo',
  label: 'Bedrijfslogo',
  required: !user.employer_user.employer.logo
}

let inputAmbiance = {
  handle: 'picture',
  label: 'Sfeerfoto'
}

let setCropLogo = async (data) => {
  companyDetailsForm.logo = data;
}

let setCropPicture = async (data) => {
  companyDetailsForm.picture = data;
}

let savePictures = async (event) => {
  errors.value = '';

  // Don't send files if they are already URLs
  if (companyDetailsForm.logo && companyDetailsForm.logo.substr(0, 4) === 'http') {
    companyDetailsForm.logo = null;
  }
  if (companyDetailsForm.picture && companyDetailsForm.picture.substr(0, 4) === 'http') {
    companyDetailsForm.picture = null;
  }

  try {
    const { data } = await userStore.storeEmployerProfile(companyDetailsForm);
    if (props.isOnboarding) {
      onboardingStore.nextStep();
    }
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je gegevens zijn opgeslagen'
    });
    if (onboardingStore.isLast) {
      await userStore.fetchUser(true);
      onboardingStore.setOnboardingState(false);
    }
  } catch (e) {
    errors.value = e.data.data.errors
    $toastrBus.$emit('show', {
      type: 'error',
      message: 'Formulier kon niet worden opgeslagen'
    });
  }
}
</script>