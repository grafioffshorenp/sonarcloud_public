<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('onboarding_employee_info_step8_aboutme')" />
        </div>

        <form @submit.prevent="storeAboutData">
            <div class="input-row">
                <div class="input-wrapper input--textarea input--about">
                    <FormFieldsTextarea :input="inputAbout" @change="aboutFormData.about = $event.target.value" />
                    <div v-if="errors && errors.about" class="text-red-400">{{ errors.about[0] }}</div>
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" :skipStep="true" />
        </form>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "About",
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

let storeAboutData = async () => {
    try {
        const { data } = await userStore.storeEmployeeProfile(aboutFormData);
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

let aboutFormData = reactive({
    section: "about_me",
    about: user.employee.about
});


let inputAbout = {
    label: "Vertel ons iets over jezelf en welk soort werk je zoekt",
    handle: "about_me",
    type: "textarea",
    value: aboutFormData.about,
    placeholder: "",
}
</script>