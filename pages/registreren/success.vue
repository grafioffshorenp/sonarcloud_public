<template>
  <div class="c-register__content">
    <section class="page__content page__centered page__centered__mobile">
      <div class="consol-register"></div>
      <div class="c-register__success-message">
        <i class="rounded-icon fas fa-check"></i>
        <p><strong>{{ $t('Thanks!') }}</strong></p>
        <p>{{ $t('We\'ve send you an email for validating your email address.') }}</p>
        <NuxtLink :to="localePath('/')" class="c-btn color-default background-default border-default" target="_self">
          {{ $t('To homepage') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
