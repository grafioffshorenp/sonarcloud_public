<template>
  <main id="main">
    <div class="c-register-landing">
      <section class="c-register-landing__column rtl">
        <div>
          <h2 class="c-register-landing__title">{{ $t('I am looking for work') }}</h2>
          <ul class="c-register-landing__list"></ul>
        </div>
        <NuxtLink :to="localePath('/registreren-werknemer')" class="c-btn	color-default background-default border-default"
          target="_self">
          {{ $t('Start now employee') }}
        </NuxtLink>
      </section>
      <section class="c-register-landing__column rtl">
        <div>
          <h2 class="c-register-landing__title">{{ $t('I am an employer') }}</h2>
          <ul class="c-register-landing__list"></ul>
        </div>
        <NuxtLink :to="localePath('/registreren-werkgever')" class="c-btn color-default background-default border-default"
          target="_self">
          {{ $t('Start now employer') }}
        </NuxtLink>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
#main {
  padding-top: 64px;

  @include desktop {
    padding-top: 104px;
  }
}
</style>