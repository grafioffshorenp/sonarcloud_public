<template>
  <main id="main">
    <Head>
      <Title>RefugeeWork | {{ $t("Registreren") }}</Title>
    </Head>
    <div class="c-register__content">
      <section class="page__content">
        <div class="c-register__title">
          <h2 class="t-form-title">{{ $t('Meld je aan als werknemer') }}</h2>
        </div>
  
        <div class="consol-register">
  
          <ul v-if="form.errors" class="error-list">
            <template v-for="errors in form.errors">
              <li v-for="error in errors" class="error-list__message">{{ $t(error) }}</li>
            </template>
          </ul>
  
          <form @submit.prevent="register">
            <div :class="{ 'input-wrapper': true, 'input--text': true, 'input--has-error': form.errors['first_name'] }">
              <input v-model="form.first_name" type="text" id="first_name" :placeholder="$t('First name')" name="first_name"
                required>
              <label class="required" for="first_name">{{ $t('First name') }}</label>
            </div>
            <div :class="{ 'input-wrapper': true, 'input--text': true, 'input--has-error': form.errors['email'] }">
              <input v-model="form.email" inputmode="email" type="text" id="email" :placeholder="$t('Email address')"
                name="email" required>
              <label class="required" for="email">{{ $t('Email address') }}</label>
            </div>
            <div :class="{ 'input-wrapper': true, 'input--password': true, 'input--has-error': form.errors['password'] }">
              <input v-model="form.password" autocomplete="new-password" type="password" id="password"
                :placeholder="$t('Wachtwoord')" name="password" required>
              <label class="required" for="password">{{ $t('Wachtwoord') }}</label>
  
              <p class="input-guide">{{ $t('passwordInstructions') }}</p>
            </div>
            <div
              :class="{ 'input-wrapper': true, 'input--checkbox': true, 'input--has-error': form.errors['terms_and_conditions'] }">
              <input v-model="form.terms_and_conditions" type="checkbox" id="terms_and_conditions"
                name="terms_and_conditions" required>
              <label class="required" for="terms_and_conditions">
                {{ $t('Yes, I have read the privacy statement') }}
              </label>
            </div>
            <div :class="{ 'input-wrapper': true, 'input--checkbox': true, 'input--has-error': form.errors['email_optin'] }">
              <input v-model="form.email_optin" type="checkbox" id="email_optin" name="email_optin" value="1">
              <label for="email_optin">{{ $t('Ja, ik wil relevante updates per e-mail ontvangen') }}</label>
            </div>
            <div style="position: absolute; left: -5000px;" aria-hidden="true">
              <input type="text" name="c_1" tabindex="-1" value="">
            </div>
            <button class="button" type="submit">{{ $t('registerButton') }}</button>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/my-account',
  },
});

const form = reactive({
  errors: {},
  'first_name': '',
  'email': '',
  'password': '',
  'terms_and_conditions': false,
  'email_optin': false,
});

const { token, data, status } = useAuth();
const { $toastrBus } = useNuxtApp();

const register = async () => {
  try {
    const data = await useRWApi('/employee/register', { method: 'POST', body: form });
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'You are successfully registered'
    });
    form.errors = {};
    if (data.errors) {
      form.errors = data.errors;
      $toastrBus.$emit('show', {
        type: 'error',
        message: 'Something went wrong'
      });
    } else {
      navigateTo('/registreren/success');
    }
  } catch (error) {
    form.errors = error.data.data.errors;
    $toastrBus.$emit('show', {
      type: 'error',
      message: 'Something went wrong'
    });
  }
};

</script>

<style scoped lang="scss">
#main {
  padding-top: 64px;
  @include desktop {
    padding-top: 104px;
  }
}
</style>