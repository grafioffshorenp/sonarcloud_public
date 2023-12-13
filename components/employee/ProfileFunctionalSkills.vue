<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('onboarding_employee_info_step6_functionalskills')" />
        </div>

        <form @submit.prevent="storeFunctionalSkills">
            <div class="input-row">
                <div class="input-wrapper input--select input--skills">
                    <label>{{ $t("Maak een keuze uit maximaal 30 skills") }}</label>
                    <div v-if="errors && errors.functional_skill_ids" class="text-red-400">{{ $t(errors.functional_skill_ids[0]) }}</div>
                    <FormFieldsEmployeeSkillsSelect :input="functionalSkillsInput" skills-type="hard"
                        @changed="setSkills" />
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--textarea input--skill_suggestions">
                    <FormFieldsTextarea :input="suggestionsInput" @change="functionalSkillsForm.skill_suggestions = $event.target.value"/>
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
        default: "Functional Skills",
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


let storeFunctionalSkills = async () => {
    errors.value = '';
    try {
        const { data } = await userStore.storeEmployeeProfile(functionalSkillsForm);
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

let functionalSkillsForm = reactive({
    section: "functional_skills",
    functional_skill_ids: user.employee.skills_functional || [],
    skill_suggestions: user.employee.skill_suggestions || ""
});

let setSkills = (e) => {
    functionalSkillsForm.functional_skill_ids = e;
}
const skills = await useRWApi(`/employee/${user.employee.id}/skills`, {
    method: 'GET',
    params: {
        employee_id: user.employee.id,
        "filter[type]": 'hard',
        "per_page": 500
    }
});

const workExperienceSkills = await useRWApi(`/employee/${user.employee.id}/work_experience_skills`, {
    method: 'GET',
    params: {
        employee_id: user.employee.id,
        "filter[type]": 'hard',
        "per_page": 500
    }
});

let functionalSkillsInput = {
    handle: 'functional_skill_ids',
    skills_functional: functionalSkillsForm.functional_skill_ids,
    skills: skills.data,
    workExperienceSkills: workExperienceSkills.data,
}

let suggestionsInput = {
    handle: 'skill_suggestions',
    skill_suggestions: functionalSkillsForm.skill_suggestions,
    required: false,
    label: 'Suggesties',
    placeholder: 'Als je suggesties hebt voor andere skills, kun je die hier invoeren...',
    value: functionalSkillsForm.skill_suggestions
}
</script>