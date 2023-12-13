<template>

  <Head>
    <Title>RefugeeWork | {{ $t("Wachtwoord vergeten") }}</Title>
  </Head>

  <template v-if="!success">
    <main id="main">
      <div class="c-login rtl">
        <section class="c-login__content">
          <p>
            {{ $t("Enter your user account's verified email address and we will send you a password reset link.") }}
          </p>
          <ul class="error-list">
            <li v-for="error in errors" class="error-list__message">{{ $t(error[0]) }}</li>
          </ul>
          <div class="consol-forgot-password">
            <form method="POST" @submit.prevent="send">
              <input type="hidden" name="CRAFT_CSRF_TOKEN"
                     value="2GkIg1Mf8y7TP2h9lQrSbpnzyBjJXKfpYiKSq037doSk2A_DRxHP9a4oQso_VKAX5lgFM_M9kRTvib1IoGvN2Cp16Plguju00Z9Hmi1ckJc=">

              <div class="input-wrapper input--text">
                <input autofocus inputmode="email" type="text" id="email" :placeholder="$t('Enter your email address')"
                       name="email" v-model="forgotPasswordForm.email" required>
                <label class="required" for="email">{{ $t('E-mailadres') }}</label>
              </div>
              <button class="button" type="submit" :disabled="sending">
                {{ $t('Send password reset email') }}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  </template>

  <template v-else>

    <div class="bg-green-200 px-3 py-2 rounded text-center">{{ success }}</div>

    <div class="c-register__success-message">
      <i class="rounded-icon fas fa-check"></i>
      <p>{{
          $t('Als je een actief account hebt, wordt er een email gestuurd om een nieuw wachtwoord aan te maken.')
        }}</p>
      <NuxtLink :to="localePath('/inloggen')" class="c-btn color-default background-default border-default"
                target="_self">
        {{ $t('Inloggen') }}
      </NuxtLink>
    </div>
  </template>

</template>

<script setup lang="ts">
const sending = ref(false);
const success = ref('');
const errors = ref([]);

const forgotPasswordForm = reactive({
  email: "",
});

const send = async () => {
  sending.value = true
  try {
    const res = await useRWApi('/password/email', { method: 'POST', body: forgotPasswordForm });
    success.value = res.message;
  } catch (error) {
    errors.value = error.data.data.errors;
  } finally {
    sending.value = false;
  }
};

</script>

<style scoped>
#main {
  padding-top: 104px;
}
</style>
