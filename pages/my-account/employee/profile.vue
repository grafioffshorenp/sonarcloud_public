<template>
  <main id="main">
    <div class="page page-account">
      <div class="page__box inner-row--large">
        <aside class="page__sidebar">
          <div class="page__content tab__list">
            <ul class="">
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile')" class="tab tab__anchor">
                  <div>{{ $t('Overzicht') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/personal')" class="tab tab__anchor">
                  <div>{{ $t('Persoonsgegevens') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/contact-details')" class="tab tab__anchor">
                  <div>{{ $t('Contactgegevens') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/languages')" class="tab tab__anchor">
                  <div>{{ $t('Talen') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/educations')" class="tab tab__anchor">
                  <div>{{ $t('Opleidingsniveau') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/work-experience')" class="tab tab__anchor">
                  <div>{{ $t('Werkervaringen') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li v-if="user?.employee?.has_work_experience">
                <NuxtLink :to="localePath('/my-account/employee/profile/functional-skills')" class="tab tab__anchor">
                  <div>{{ $t('Mijn functionele vaardigheden') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/social-skills')" class="tab tab__anchor">
                  <div>{{ $t('Mijn sociale vaardigheden') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/availability')" class="tab tab__anchor">
                  <div>{{ $t('Availability') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/about')" class="tab tab__anchor">
                  <div>{{ $t('Over mijzelf') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/photo')" class="tab tab__anchor">
                  <div>{{ $t('Profielfoto') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/consent')" class="tab tab__anchor">
                  <div>{{ $t('Consent') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/my-account/employee/profile/preferences')" class="tab tab__anchor">
                  <div>{{ $t('Voorkeuren') }}</div>
                  <div class="link-arrow"></div>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </aside>

        <div class="page__wrapper rtl active is-overview-page">
          <section class="page__content page__content--no-padding-top">
            <div class="c-card c-card--hide-styling">
              <NuxtPage :key="`page-employee-${onboardingStore.getOnboardingState}`"/>
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
const userStore = useUserStore();

await userStore.fetchUser();
const user = computed(() => userStore.getUser);

const step = computed(() => onboardingStore.getOnboardingState);

watch(step, async (value) => {
  if(value === false) {
    await userStore.fetchUser(true);
  }
})

</script>

<style lang="scss">
.router-link-exact-active {
  @apply bg-white font-bold;
}
</style>