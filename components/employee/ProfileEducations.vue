<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('onboarding_employee_info_step4_educationlevel')" />
        </div>

        <form @submit.prevent="storeEducations">
            <div class="input-row">
                <div class="input-wrapper input--select input--educations">
                    <FormFieldsDiplomasSelect :input="educationInput" @set-has-education="setHasEducation" :errors="errors" />
                </div>
            </div>
            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>
    </div>
</template>
<script setup>
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Educations",
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

let storeEducations = async () => {
    errors.value = '';
    try {
        let filteredEducationData =  educationForm.educations.filter(education => education.institution !== '' && education.title !== '' && education.end_period !== '');
        const { data } = await userStore.storeEmployeeProfile({section: 'education', educations : filteredEducationData, has_education: educationForm.has_education});

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

let educationForm = reactive({
    section: "education",
    educations: user.employee.educations || [],
    has_education: user.employee.has_education
});

let setHasEducation = (event) => {
    educationForm.has_education = event;
}

let educationInput = {
    handle: 'educations',
    value: educationForm.educations,
    has_education: user.employee.has_education
}

</script>