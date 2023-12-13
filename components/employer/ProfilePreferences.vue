<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <form @submit.prevent="saveLocales">
            <div class="input-wrapper">
                <div class="input-wrapper input--select">
                    <select v-model="localesForm.locale" name="locale" class="pl-4">
                        <option v-for="{ key, value } in localeOptions" :key="key" :value="key">
                            {{ $t(value) }}
                        </option>
                    </select>
                    <label>{{ $t("Taalvoorkeur") }}</label>
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>
    </div>
</template>
<script setup>
const { locale, locales, setLocale, setLocaleCookie } = useI18n();
const localePath = useLocalePath();

const props = defineProps({
    title: {
        type: String,
        default: "Voorkeuren",
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
const { $toastrBus } = useNuxtApp();
let errors = ref();

const localesForm = reactive({
    "section": "preferences",
    locale: userStore.user.locale,
});

let saveLocales = async () => {
    try {
        const { data } = await userStore.storeEmployerProfile(localesForm);
        if (props.isOnboarding) {
            onboardingStore.nextStep();
        }

        let locale = localeOptions.filter(item => {
          return item.key === localesForm.locale;
        })[0];

        setLocale(locale.locale);
        setLocaleCookie(locale.locale);
        setTimeout(async () => {
          await navigateTo(localePath('/my-account/employer/profile/preferences'))
          location.reload();
        })

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

let localeOptions = [
    {
        key: 'nl-NL',
        value: 'Nederlands',
        locale: 'nl'
    },
    {
        key: 'en-001',
        value: 'Engels',
        locale: 'en'
    },
    {
        key: 'ar-001',
        value: 'Arabisch',
        locale: 'ar'
    },
    {
        key: 'fr-FR',
        value: 'Frans',
        locale: 'fr'
    },
    {
        key: 'ru-RU',
        value: 'Russisch',
        locale: 'ru'
    },
    {
        key: 'so-SO',
        value: 'Somalisch',
        locale: 'so'
    },
    {
        key: 'ti-ER',
        value: 'Eritrees',
        locale: 'er'
    },
    {
        key: 'tr-TR',
        value: 'Turks',
        locale: 'tr'
    },
    {
        key: 'uk-UA',
        value: 'Oekraïens',
        locale: 'ua'
    },
    {
        key: 'fa-IR',
        value: 'Farsi',
        locale: 'ir'
    },
    {
        key: 'fa-AF',
        value: 'Dari',
        locale: 'af'
    },
]
</script>