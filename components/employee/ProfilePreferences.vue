<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <form @submit.prevent="storePreferences">
            <div class="input-row">
                <div class="input-wrapper input--select input--preferences">
                    <FormFieldsRWSelect :input="inputLocale" @change="preferencesFormData.locale = $event.target.value" />
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>
    </div>
</template>
<script setup>
const { locale, locales, setLocale, setLocaleCookie } = useI18n();
const localePath = useLocalePath();

import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Preferences",
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

let storePreferences = async () => {
    try {
        let locale = inputLocale.options.filter(item => {
          return item.value === preferencesFormData.locale;
        })[0];

        const { data } = await userStore.storeEmployeeProfile(preferencesFormData);
        $toastrBus.$emit('show', {
            type: 'success',
            message: 'Je gegevens zijn opgeslagen'
        });

        setLocale(locale.locale);
        setLocaleCookie(locale.locale);
        setTimeout(async () => {
          await navigateTo(localePath('/my-account/employee/profile/preferences'))
          location.reload();
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

let preferencesFormData = reactive({
    section: "preferences",
    locale: user.locale,
});

let inputLocale = {
    handle: 'nationality',
    label: 'Taalvoorkeur',
    required: true,
    instructions: null,
    value: preferencesFormData.locale,
    options: [
        {
            label: "Nederlands (Dutch)",
            value: "nl-NL",
            locale: 'nl'
        },
        {
            label: "English (English)",
            value: "en-001",
            locale: 'en'
        },
        {
            label: "العربية (Arabic)",
            value: "ar-001",
            locale: 'ar'
        },
        {
            label: "Français (French)",
            value: "fr-FR",
            locale: 'fr'
        },
        {
            label: "Русский (Russian)",
            value: "ru-RU",
            locale: 'ru'
        },
        {
            label: "Af Soomaali (Somali)",
            value: "so-SO",
            locale: 'so'
        },
        {
            label: "ትግርኛ (Tigrinya)",
            value: "ti-ER",
            locale: 'er'
        },
        {
            label: "Türkçe (Turkish)",
            value: "tr-TR",
            locale: 'tr'
        },
        {
            label: "Українська (Ukrainian)",
            value: "uk-UA",
            locale: 'ua'
        },
        {
            label: "فارسی (Farsi)",
            value: "fa-IR",
            locale: 'ir'
        },
        {
            label: "دری-dari",
            value: "fa-AF",
            locale: 'af'
        }
    ]
}
</script>