<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('onboarding_employee_info_step3_languages')" />
        </div>

        <form @submit.prevent="storeLanguages">
            <div class="input-row">
                <div class="input-wrapper input--select input--languages">
                    <FormFieldsLanguageProficiencySelect :input="languageProficiencyInput" />
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
        default: "Languages",
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

let storeLanguages = async () => {
    let filteredLanguageFormdata =  languageFormdata.languages.filter(selectedLanguage => selectedLanguage.lang !== '' && selectedLanguage.level !== '');
    try {
        const { data } = await userStore.storeEmployeeProfile({section: 'language', languages: filteredLanguageFormdata});
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

let languageFormdata = reactive({
    section: "language",
    languages: user.employee.languages || []
});

let languageProficiencyInput = {
    handle: 'languages',
    value: languageFormdata.languages
}
</script>