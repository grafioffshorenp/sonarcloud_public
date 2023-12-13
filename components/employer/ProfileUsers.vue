<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <form @submit.prevent="saveAccountDetails">
            <div class="input-row">
                <div class="input-wrapper input--email input--email">
                    <input type="text" v-model="addUserForm.email" />
                    <label for="form-input-email" class="required">{{ $t("E-mailadres") }}</label>
                    <div v-if="errors && errors.email" class="text-red-400">{{ $t(errors.email[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--email input--first-name">
                    <input type="text" v-model="addUserForm.first_name" />
                    <label for="form-input-first_name" class="required">{{ $t("Voornaam") }}</label>
                    <div v-if="errors && errors.first_name" class="text-red-400">{{ $t(errors.first_name[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--email input--password">
                    <input type="password" v-model="addUserForm.password" />
                    <label for="form-input-password" class="required">{{ $t("Wachtwoord") }}</label>
                    <div v-if="errors && errors.password" class="text-red-400">{{ $t(errors.password[0]) }}</div>
                    <div>{{ $t('passwordInstructions') }}</div>
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>
    </div>
</template>
<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "Users",
        required: false
    },
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const onboardingStore = useOnboardingStore();

const userStore = useUserStore();
await userStore.fetchUser();
const { $toastrBus } = useNuxtApp();
let formIsSaving = ref(false);
let errors = ref();

const addUserForm = reactive({
    "email": null,
    "first_name": null,
    "password": null,
    "last_name": "-",
    "mobile": "-",
});

const resetForm = () => {
    addUserForm.email = null;
    addUserForm.first_name = null;
    addUserForm.password = null;
};

let saveAccountDetails = async () => {
    errors.value = '';

    try {
        formIsSaving.value = true;
        const response = await useRWApi(`/employer/${userStore.user.employer_user.employer.id}/employer_users/register`, {
            method: 'POST',
            body: addUserForm
        });
        formIsSaving.value = false;

        if(!props.isOnboarding) {
            resetForm();
        }

        if (props.isOnboarding) {
            onboardingStore.nextStep();
        }
        $toastrBus.$emit('show', {
            type: 'success',
            message: 'Je gegevens zijn opgeslagen'
        });
    } catch (e) {
        errors.value = e.data.data.errors
        $toastrBus.$emit('show', {
            type: 'error',
            message: 'Formulier kon niet worden opgeslagen'
        });
    }
}
</script>