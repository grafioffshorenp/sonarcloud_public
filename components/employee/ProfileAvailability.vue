<template>
    <div>
        <h2 class="form-title">{{ title }}</h2>
        <form @submit.prevent="storeAboutData">
            <div class="input-row">
                <div class="input-wrapper input--select input--working_hours">
                    <FormFieldsWorkingHours :input="workingHoursInput"
                        @set-working-hours="aboutFormData.working_hours = $event" />
                        <div v-if="errors && errors.working_hours" class="text-red-400">{{ errors.working_hours[0] }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--multiple_select input--work_type">
                    <FormFieldsWorkType :input="workTypeInput" @set-work-type="aboutFormData.work_type = $event" />
                    <div v-if="errors && errors.work_type" class="text-red-400">{{ errors.work_type[0] }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--radio_group input--work_status_holder">
                    <FormFieldsRadioGroup :input="inputWorkStatusHolder"
                        @change="aboutFormData.work_status_holder = $event.target.value" />
                        <div v-if="errors && errors.work_status_holder" class="text-red-400">{{ errors.work_status_holder[0] }}</div>
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
        default: "Availability",
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

let errors = ref();

let storeAboutData = async () => {
    const { data } = await userStore.storeEmployeeProfile(aboutFormData);
    if (data.errors) {
        errors.value = data.errors
    } else if (props.isOnboarding) {
        onboardingStore.nextStep();
    }
}

let aboutFormData = reactive({
    section: "availability",
    working_hours: JSON.parse(user.employee.working_hours) || [],
    work_type: JSON.parse(user.employee.work_type) || [],
    work_status_holder: user.employee.work_status_holder,
});

let workingHoursInput = {
    handle: 'working_hours',
    value:  Object.values(aboutFormData.working_hours).filter(item => typeof item === 'string'),
    required: true
}

let workTypeInput = {
    handle: 'work_type',
    value: Object.values(aboutFormData.work_type).filter(item => typeof item === 'string'),
    required: true
}
let inputWorkStatusHolder = {
    handle: 'work_status_holder',
    value: aboutFormData.work_status_holder,
    label: 'How many weeks per year are you officially allowed to work?',
    required: true,
    options: [
        {
            value: "24Weeks",
            required: true,
            title: "24 Weeks",
            description: "",
            subDescription: ""
        },
        {
            value: "unlimited",
            required: true,
            title: "Unlimited",
            description: "",
            subDescription: ""
        }
    ]
}

</script>