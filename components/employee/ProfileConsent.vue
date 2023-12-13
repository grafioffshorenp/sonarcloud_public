<template>
  <div>
    <h2 class="form-title capitalize">{{ consentTitle }}</h2>

    <div class="input-row relative">
      <FormFieldsInfoButton :text="$t('onboarding_employee_info_step10_consent')"/>
    </div>

    <form @submit.prevent="storeConsentData">
      <p>{{ $t(consentTitle) }}</p>
      <div class="input-row">
        <div class="input-wrapper input--select input--consent">
          <FormFieldsRadioGroup
              :input="inputConsent"
              @change="consentHandleChange($event.target.value)"
          />
        </div>
      </div>

      <p>{{ $t(anonymousConsentTitle) }}</p>
      <div class="input-row">
        <div class="input-wrapper input--select input--consent">
          <FormFieldsRadioGroup
              :input="inputAnonymousConsent"
              @change="anomyusConsentHandleChange($event.target.value)"
          />
        </div>
      </div>

      <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding"/>
    </form>
  </div>
</template>
<script setup>
import { useUserStore } from '~/stores/user';

const props = defineProps({
  consentTitle: {
    type: String,
    default: 'Consent',
    required: false,
  },
  anonymousConsentTitle: {
    type: String,
    default: 'Anonymous',
    required: false,
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

let storeConsentData = async () => {
  try {
    const { data } = await userStore.storeEmployeeProfile(consentFormdata);
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je gegevens zijn opgeslagen',
    });
    if (props.isOnboarding) {
      onboardingStore.nextStep();
    }
    if (onboardingStore.isLast) {
      await userStore.fetchUser(true);
      onboardingStore.setOnboardingState(false);
    }
  } catch (e) {
    errors.value = e.data.data.errors;
    $toastrBus.$emit('show', {
      type: 'error',
      message: e.data.data.message,
      duration: 6000,
    });
  }
};

let consentFormdata = reactive({
  section: 'consent',
  consent: user.employee.consent || false,
  anonymous_consent: user.employee.anonymous_consent || false,
});

let inputConsent = {
  handle: 'consent',
  value: consentFormdata.consent,
  label: '',
  options: [
    {
      value: true,
      required: true,
      title: 'Ja, werkgevers mogen mijn gegevens inzien en mij benaderen als zij interesse hebben',
      description: '',
      subDescription: '',
    },
    {
      value: false,
      required: true,
      title: 'Nee, ik wil dat werkgevers pas mijn gegevens kunnen inzien op het moment dat ik reageer op vacatures',
      description: '',
      subDescription: '',
    },
  ],
};

let inputAnonymousConsent = {
  handle: 'anonymous_consent',
  value: consentFormdata.consent,
  label: '',
  options: [
    {
      value: false,
      required: true,
      title: 'Anonymous',
      description: '',
      subDescription: '',
    },
    {
      value: true,
      required: true,
      title: 'Non anonymous',
      description: '',
      subDescription: '',
    },
  ],
};

const consentHandleChange = (value) => {
  if (value === 'false') {
    return consentFormdata.consent = false;
  }
  return consentFormdata.consent = true;
};

const anomyusConsentHandleChange = (value) => {
  if (value === 'false') {
    return consentFormdata.anonymous_consent = false;
  }
  return consentFormdata.anonymous_consent = true;
};
</script>