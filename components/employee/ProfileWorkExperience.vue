<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('onboarding_employee_info_step5_workexperience')" />
        </div>

        <form @submit.prevent="storeWorkExperience">
            <div class="input-row">
                <div class="input-wrapper input--text input--work_experiences">
                    <FormFieldsWorkExperience :input="workExperienceInput"
                        @set-has-work-experience="setHasWorkExperience" />
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
        default: "Work Experience",
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

let storeWorkExperience = async () => {
    errors.value = '';
    try {
        if (!workExperienceFormData.has_work_experience) {
            onboardingStore.removeStep('EmployeeProfileFunctionalSkills');
        }

        if (workExperienceFormData.has_work_experience) {   
            if (!onboardingStore.steps.includes('EmployeeProfileFunctionalSkills')) {
                const workExperienceIndex = onboardingStore.steps.indexOf('EmployeeProfileWorkExperience');
                if (workExperienceIndex !== -1) {
                    const insertIndex = workExperienceIndex + 1;
                    onboardingStore.addStepOnSpecificIndex('EmployeeProfileFunctionalSkills', insertIndex);
                }
            }
        }
        
       let filteredWorkExperianceData =  workExperienceFormData.work_experiences.filter(workExperiance => workExperiance.company !== '' && workExperiance.from_date !== '' && workExperiance.function_id !== '' && workExperiance.function_title !== '' && workExperiance.industry_id !== '' && workExperiance.to_date !== '');
       const { data } = await userStore.storeEmployeeProfile({section: "work_experience", work_experiences: filteredWorkExperianceData, has_work_experience: workExperienceFormData.has_work_experience});

       await refetchUser()
       
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

const refetchUser = async () => {
    try {
        await userStore.fetchUser(true);
    } catch (error) {
        throw error;
    }
}

let workExperienceFormData = reactive({
    section: "work_experience",
    work_experiences: user.employee.work_experiences || [],
    has_work_experience: user.employee.has_work_experience 
});

let setHasWorkExperience = (event) => {
    workExperienceFormData.has_work_experience = event;
}

const industries = await useRWApi('/industries', 'GET');
// console.log(industries.data)
const industryOptions = Object.keys(industries.data).map((industry, key) => {
    return {
        value: industry,
        label: industries.data[industry]
    }
});

let workExperienceInput = {
    handle: 'work_experiences',
    value: workExperienceFormData.work_experiences,
    has_work_experience: user.employee.has_work_experience,
    industries: industries.data,
}

</script>