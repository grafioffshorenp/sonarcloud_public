<template>
  <main id="main">
    <Head>
      <Title>RefugeeWork | {{ $t("Inloggen") }}</Title>
    </Head>
    <div class="c-login rtl">
      <section class="c-login__content">
        <div class="c-login__title">
          <h1 class="t-form-title">{{ $t('Inloggen') }}</h1>
        </div>
        <div class="consol-login">
          <p v-if="hasError && errorType === 'invalid_credentials'" class="error-message">{{ $t('Your username or password is incorrect') }}</p>
          <p v-if="hasError && errorType === 'unverified'" class="error-message">{{ $t('Your e-mail has not been verified yet') }}</p>

          <form @submit.prevent="signInHandler({ username: form.email, password: form.password })">
            <div class="input-wrapper input--text">
              <input v-model="form.email" inputmode="email" type="text" id="username" :placeholder="$t('Email address')"
                name="username" autofocus required>
              <label class="required" for="username">{{ $t('Email address') }}</label>
            </div>
            <div class="input-wrapper input--password">
              <input v-model="form.password" autocomplete="new-password" type="password" id="password"
                :placeholder="$t('Password')" name="password" required>
              <label class="required" for="password">{{ $t('Password') }}</label>
            </div>
            <nuxt-link to="/wachtwoord-vergeten">{{ $t('I forgot my password') }}</nuxt-link>
            <button class="button" type="submit">
              {{ $t('Inloggen button') }}
            </button>
          </form>
        </div>
        <NuxtLink :to="localePath('/registreren')" target="_self"
          class="c-btn	color-default background-default border-default c-btn--as-text-link c-btn--text-centered c-btn--underline c-btn--text-slim c-btn--full-width">
          {{ $t('Register') }}
        </NuxtLink>
      </section>
    </div>
  </main>
</template>

<script setup>
const { locale, setLocale, setLocaleCookie } = useI18n();

const localePath = useLocalePath();

import { useUserStore } from "~/stores/user.js";

const config = useRuntimeConfig();
const { $toastrBus } = useNuxtApp();
const hasError = ref(false);
const errorType = ref();

const userStore = useUserStore();

const form = reactive({
  'email': config.public.quickloginUser ?? '',
  'password': config.public.quickloginPassword ?? '',
});

const { signIn, token, data, status } = useAuth();

const signInHandler = async ({ username, password }) => {
  hasError.value = false;
  const { error } = await signIn('credentials', {
    username,
    password,
    redirect: false,
  });

  if (error) {
    errorType.value = error;

    hasError.value = true;

    $toastrBus.$emit('show', {
      type: 'error',
      message: 'Your username or password is incorrect',
      duration: 5000,
    });

  } else {
    
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je bent succesvol ingelogd!',
      duration: 5000,
    });

    const user = await userStore.fetchUser(true);

    const localeMatch = locales.filter(loc => {
      return loc.value === user.locale;
    });

    if(localeMatch) {
      // User has a preferred locale in his/her profile
      // Set it and redirect accordingly
      setLocale(localeMatch[0].locale);
      setLocaleCookie(localeMatch[0].locale);
      setTimeout(() => {
        return navigateTo(localePath(`/my-account`), {
          external: true,
        });
      });
    } else {
      return navigateTo(localePath(`/my-account`), {
        external: true,
      });
    }
  }
};

const locales = [
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
];
</script>

<style scoped lang="scss">
#main {
  padding-top: 64px;
  @include desktop {
    padding-top: 104px;
  }
}
</style>