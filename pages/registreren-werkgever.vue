<template>
  <main id="main">
    <Head>
      <Title>RefugeeWork | {{ $t("Registreren") }}</Title>
    </Head>
    <div class="c-register__content">
      <section class="page__content">
        <div class="c-register__title">
          <h2 class="t-form-title">{{ $t('Meld je aan als werkgever') }}</h2>
        </div>
  
        <div class="consol-register">
  
          <ul v-if="form.errors" class="error-list">
            <template v-for="errors in form.errors">
              <li v-for="error in errors" class="error-list__message">{{ $t(error) }}</li>
            </template>
          </ul>
  
          <form @submit.prevent="register">
            <div :class="{ 'input-wrapper': true, 'input--text': true, 'input--has-error': form.errors['name'] }">
              <input v-model="form.name" @input="e => searchKvK(e.target.value)" type="text" id="name"
                :placeholder="$t('Company name')" name="name" required>
              <label class="required" for="name">{{ $t('Company name') }}</label>
  
              <ul v-if="companies" class="autocomplete-list">
                <li @click="selectCompany(company)" v-for="company in companies"
                  :key="`${company.company_name}-${company.city}-${company.kvk_number}`">
                  <p class="t-text t-text--bold">{{ company.company_name }}</p>
                  <p class="t-text">{{ company.city }}</p>
                  <p class="t-text">{{ company.kvk_number }}</p>
                </li>
              </ul>
  
            </div>
            <div :class="{ 'input-wrapper': true, 'input--text': true, 'input--has-error': form.errors['kvk_number'] }">
              <input v-model="form.kvk_number" type="text" id="kvk_number" :placeholder="$t('Kvk nummer')" name="kvk_number"
                required readonly>
              <label class="required" for="kvk_number">{{ $t('KVK number') }}</label>
            </div>
            <div :class="{ 'input-wrapper': true, 'input--text': true, 'input--has-error': form.errors['email'] }">
              <input v-model="form.email" inputmode="email" type="text" id="email" :placeholder="$t('Email address')"
                name="email" required>
              <label class="required" for="email">{{ $t('Email address') }}</label>
            </div>
            <div :class="{ 'input-wrapper': true, 'input--password': true, 'input--has-error': form.errors['password'] }">
              <input v-model="form.password" autocomplete="new-password" type="password" id="password"
                :placeholder="$t('Password')" name="password" required>
              <label class="required" for="password">{{ $t('Password') }}</label>
  
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
            <!-- <div :class="{ 'input-wrapper': true, 'input--checkbox': true, 'input--has-error': form.errors['email_optin'] }">
              <input v-model="form.email_optin" type="checkbox" id="email_optin" name="email_optin" value="1">
              <label for="email_optin">{{ $t('Yes, I want to subscribe to the newsletter') }}</label>
            </div> -->
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
import pkg from 'lodash';
const { debounce } = pkg;
const { $toastrBus } = useNuxtApp();

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/my-account',
  },
});

const form = reactive({
  errors: [],
  'name': '',
  'email': '',
  'password': '',
  'kvk_number': '',
  'terms_and_conditions': false,
});
const companies = ref([]);

const { token, data, status } = useAuth();

const register = async () => {
  try {
    const data = await useRWApi('/employer/register', { method: 'POST', body: form });

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

const searchKvK = debounce(async (name) => {
  form.kvk_number = '';

  try {
    const { data } = await useRWApi(
      `/employer/register/companies/search/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    companies.value = data;
  } catch (error) {
  }
}, 200);

const selectCompany = ({ kvk_number, company_name }) => {
  form.kvk_number = kvk_number;
  form.name = company_name;

  companies.value = [];
};

</script>

<style scoped lang="scss">
#main {
  padding-top: 64px;
  @include desktop {
    padding-top: 104px;
  }

  .terms {
    color: $teal-dark;
    text-decoration: underline;
  }
}
</style>