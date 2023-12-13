<template>
    <div>
        <h2 class="form-title">{{ $t(title) }} </h2>

        <form @submit.prevent="saveAccountDetails">
            <div class="input-row">
                <div class="input-wrapper input--email input--email">
                    <input type="text" v-model="accountDetailsForm.email" />
                    <label for="form-input-email" class="required">{{ $t("E-mailadres") }}</label>
                    <div v-if="errors && errors.email" class="text-red-400">{{ $t(errors.email[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--text input--first_name">
                    <input type="text" v-model="accountDetailsForm.first_name" />
                    <label for="form-input-first_name" class="required">{{ $t("Voornaam") }}</label>
                    <div v-if="errors && errors.first_name" class="text-red-400">{{ $t(errors.first_name[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--insertions">
                    <input type="text" v-model="accountDetailsForm.insertions" />
                    <label for="form-input-insertions" class="">{{ $t("Tussenv.") }}</label>
                    <div v-if="errors && errors.insertions" class="text-red-400">{{ $t(errors.insertions[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--last_name">
                    <input type="text" v-model="accountDetailsForm.last_name" />
                    <label for="form-input-last_name" class="required">{{ $t("Achternaam") }}</label>
                    <div v-if="errors && errors.last_name" class="text-red-400">{{ $t(errors.last_name[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--phone input--mobile">
                    <input type="text" v-model="accountDetailsForm.mobile" />
                    <label for="form-input-mobile" class="required">{{ $t("Mobiel telefoonnummer") }}</label>
                    <div v-if="errors && errors.mobile" class="text-red-400">{{ $t(errors.mobile[0]) }}</div>
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
        default: "Account Details",
        required: false
    },
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const userStore = useUserStore();
await userStore.fetchUser();
const onboardingStore = useOnboardingStore();
const employerData = userStore.user;
const { $toastrBus } = useNuxtApp();

let errors = ref();

const accountDetailsForm = reactive({
    "section": "account",
    "first_name": employerData.employer_user.first_name,
    "insertions": employerData.employer_user.insertions,
    "last_name": employerData.employer_user.last_name,
    "mobile": employerData.employer_user.mobile,
    "email": employerData.email,
});

let saveAccountDetails = async () => {
    errors.value = '';
    try {
        const { data } = await userStore.storeEmployerProfile(accountDetailsForm);
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
</script>