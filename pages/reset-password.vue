<template>
  <section class="c-login__content">
    <Head>
      <Title>RefugeeWork | {{ $t("Wachtwoord resetten") }}</Title>
    </Head>

    <template v-if="!success">
      <div class="c-login__title"><h1 class="t-form-title">{{ $t('Maak je nieuwe wachtwoord aan.') }}</h1></div>
      <div class="consol-reset-password">
        <ul class="error-list">
          <template v-for="error in errors">
            <li v-for="message in error" class="error-list__message">{{ $t(message) }}</li>
          </template>
        </ul>

        <form @submit.prevent="resetPassword">
          <p class="input-guide input-guide--above-input">{{
              $t('Zorg dat je wachtwoord minimaal 8 karakters, 1 hoofdletter, 1 cijfer en 1 speciaal karakter bevat')
            }}</p>
          <div :class="{'input-wrapper':true, 'input--password': true, 'input--has-error': hasErrors}">
            <input v-model="resetPasswordForm.password" autocomplete="new-password" type="password" id="password"
                   :placeholder="$t('Password')" name="password"
                   required>
            <label class="required" for="password">{{ $t('Wachtwoord') }}</label>
          </div>
          <div :class="{'input-wrapper':true, 'input--password': true, 'input--has-error': hasErrors}">
            <input v-model="resetPasswordForm.password_confirmation" type="password" id="password-repeat"
                   :placeholder="$t('Wachtwoord bevestigen')"
                   name="password_confirmation" required>
            <label class="required" for="password-repeat">{{ $t('Bevestig wachtwoord') }}</label>
          </div>
          <div class="input-wrapper input--checkbox">
            <input type="checkbox" id="terms_and_conditions" name="terms_and_conditions" required>
            <label class="required" for="terms_and_conditions">
              {{ $t('Ja, ik heb het') }}
              <NuxtLink :to="localePath('/privacy-and-cookies')" target="_blank" rel="noreferrer noopener">{{
                  $t('privacy statement')
                }}
              </NuxtLink>
              {{ $t('gelezen.') }}
            </label>
          </div>
          <button class="button" type="submit" :disabled="resetting">
            {{ $t('Bevestig') }}
          </button>
        </form>
      </div>
    </template>

    <template v-else>
      <div class="consol-reset-password"></div>
      <div class="c-register__success-message">
        <i class="rounded-icon fas fa-check"></i>
        <p><strong>{{ $t('Gelukt!') }}</strong></p>
        <p>{{ $t('Je wachtwoord is aangepast.') }}</p>
        <NuxtLink :to="localePath('/login')" class="c-btn color-default background-default border-default" target="_self">
          {{ $t('Inloggen') }}
        </NuxtLink>
      </div>
    </template>

  </section>
</template>

<script setup>
import { useRoute } from 'nuxt/app';

const router = useRouter();
const route = useRoute();

const resetting = ref(false);
const hasErrors = ref(false);
const errors = ref({});
const success = ref(false);

const resetPasswordForm = reactive({
  token: route.query.token,
  email: route.query.email,
  password: '',
  password_confirmation: '',
});

const resetPassword = async () => {
  resetting.value = true;
  try {
    await useRWApi('/password/reset', { method: 'POST', body: resetPasswordForm });
    success.value = true;
  } catch (error) {
    hasErrors.value = true;
    errors.value = error.data.data.errors;
  } finally {
    resetting.value = false;
  }
};

</script>
