<template>
    <div class="input-row">
        <div class="input-wrapper input--submit">
            <button class="btn" :disabled="userStore.storing || !canContinue" type="submit" v-if="!isOnboarding">
                {{ userStore.storing ? $t('Aan het opslaan ..') : $t('Bewaar') }}
            </button>

            <div class="c-form-submit c-form-submit--onboarding" v-else>
                <input type="hidden" name="section" value="photo">

                <div class="c-form-submit__button">
                    <button type="submit" class="btn btn--flatten-tablet" @click="closeModal" :disabled="userStore.storing || !canContinue">
                        {{ onboardingStore.isLast ? $t('Finish') : $t('Next') }}
                    </button>
                </div>
                <div class="c-form-submit__button-next" v-if="skipStep">
                    <button class="btn btn--flatten-tablet" @click="onboardingStore.nextStep()" :disabled="userStore.storing || !canContinue">
                        {{ $t("Overslaan") }}
                    </button>
                </div>
                <div class="c-form-submit__button-previous c-form-submit__button-previous--full-width">
                    <button class="btn btn--flatten-tablet background-transparent border-third color-second"
                        @click="onboardingStore.previousStep" :disabled="onboardingStore.getCurrentStep === 0">
                        {{ $t("Back") }}
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
    skipStep: {
        type: Boolean,
        default: false,
        required: false,
    },
    hasErrors: {
        type: Boolean,
        default: false,
        required: false,
    },
    canContinue: {
      type: Boolean,
      default: true,
      required: false
    }
});

const onboardingStore = useOnboardingStore();
const userStore = useUserStore();
const emit = defineEmits();

const closeModal = () => {
    if (onboardingStore.isLast && !props.hasErrors) {
        document.documentElement.classList.remove("disable-scroll");
    }
}
</script>