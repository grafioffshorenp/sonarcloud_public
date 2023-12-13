<template>
  <main id="main">
    <div class="page page-account">
      <div class="page__box inner-row--large">
        <aside class="page__sidebar">
          <div class="page__content tab__list">
            <ul class="">
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile')" class="tab tab__anchor">
                  <div>{{ $t('Overzicht') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/company-details')" class="tab tab__anchor">
                  <div>{{ $t('Bedrijfsgegevens') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/account-details')" class="tab tab__anchor">
                  <div>{{ $t('Accountgegevens') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/pictures')" class="tab tab__anchor">
                  <div>{{ $t('Bedrijfslogo en foto') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/preferences')" class="tab tab__anchor">
                  <div>{{ $t('Voorkeuren') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/locations')" class="tab tab__anchor">
                  <div>{{ $t('Locaties') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employer/profile/users')"
                          class="tab__anchor transition-all hover:bg-white rounded-full p-3 pl-5 rounded-r-none group flex justify-between">
                  <div>{{ $t('Invite users') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </aside>

        <div class="page__wrapper rtl active is-overview-page">
          <section class="page__content page__content--no-padding-top">
            <div class="c-card c-card--hide-styling">
              <NuxtPage/>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'account',
  title: 'Mijn profiel',
});

const onboardingStore = useOnboardingStore();

</script>

<style scoped>
.router-link-exact-active {
  @apply bg-white font-bold;
}

/* .link-arrow::after {
  content: "";
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='18' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='%23333' d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 13px;
  height: 23px;
  margin-left: auto;
  width: 12px;
  display: block;
} */
</style>
