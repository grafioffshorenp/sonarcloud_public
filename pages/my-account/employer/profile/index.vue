<template>
  <div>
    <template v-if="profileCompleteness > emptyPercentage && profileCompleteness < 100">
      <h2 class="t-heading-1 t-heading-1--centered t-heading-1--from-desktop">
        <div class="u-mb-big">{{ $t('Welkom') }} {{ employerUserData.first_name }}</div>
      </h2>

      <header class="c-card__inner-card">
        <div class="u-mb-big">
          <h2 class="t-heading-1 t-heading-1--until-desktop">{{ $t('Welkom') }} {{ employerUserData.first_name }}</h2>
        </div>

        <div class="u-mb-medium-big">
          <radial-progress-bar :diameter="86" :inner-stroke-width="6" :percentage="profileCompleteness"
                               start-color="#FF6047" second-color="#F5877F" third-color="#E3B1E3" stop-color="#95E1FC"
                               :stroke-width="6">
            <p class="t-label">{{ profileCompleteness }}<span class="t-percentage">%</span></p>
          </radial-progress-bar>
        </div>
        <div class="l-max-width-container">
          <div v-if="employerData.missing_fields.checks.screening_passed" class="w-full text-center mt-5">
            <p class="text-capitalize mb-5 text-slate-700 font-extrabold">{{ $t('almost done onboarding') }}</p>
            <NuxtLink as="button" :to="localePath('/my-account/employer/vacancies/new')"
                      class="c-btn btn color-default background-default border-default btn--with-icon uppercase">
              {{ $t('add vacancy') }}
            </NuxtLink>
          </div>
        </div>
      </header>

      <section v-if="missingFieldsEmployer['fields'].length" class="missing-fields">
        <p class="u-text-align-center">
          {{ $t('Open fields') }}
        </p>

        <ul class="missing-fields">
          <li v-for="field in missingFieldsEmployer['fields']" :key="field">
            <a class="list-item list-item__row" :href="openTab(field)">
              <span>{{ $t(field) }} </span>
              <i class="fas fa-chevron-right"/>
            </a>
          </li>
        </ul>
      </section>

      <section v-if="missingFieldsEmployer['checks'].length" class="missing-fields">
        <p class="u-text-align-center">
          {{ $t('Open statussen label') }}
        </p>

        <ul class="missing-fields missing-fields__finance">
          <li v-for="check in missingFieldsEmployer['checks']" :key="check">
            <p class="list-item list-item__row">{{ $t(check) }} <i class="fas fa-clock"/></p>
          </li>
        </ul>
      </section>

    </template>

    <template v-else>
      <div class="page-details rtl">
        <div class="employer-details">
          <section class="page-details__section page-details__section--centered page-details__section--gradient-stroke">
            <img :src="employerData.logo" :alt="employerData.name" class="picture picture--large img"
                 v-if="employerData.logo">
            <div class="img bg-fallback-employer picture picture--large" v-else></div>
            <h2>{{ employerData.name }}</h2>
            <br>
          </section>
          <section class="page-details__section">
            <div class="columns-row">
              <div class="columns">
                <div class="page-details__properties column">
                  <p class="header">{{ $t('Hoofdvestiging') }}</p>
                  <p class="body" v-if="employerData.street">{{ employerData.street }} {{ employerData.house_number }}{{
                      employerData.house_number_ext
                    }},<br/>
                    {{ employerData.postalcode }}, {{ employerData.city }}</p>
                </div>
                <div class="page-details__properties column">
                  <p class="header">{{ $t('Bedrijfstelefoonnummer') }}</p>
                  <p class="body">{{ employerData.phone }}</p>
                </div>
              </div>
            </div>
            <div class="page-details__properties column column--wide">
              <p class="header">{{ $t('E-mailadres') }}</p>
              <p class="body">{{ userStore.user.email }}</p>
            </div>
            <div class="page-details__properties column column--wide">
              <p class="header">{{ $t('Bedrijfsprofiel') }}</p>
              <p class="body body--light">{{ employerData.company_profile }}</p>
            </div>
          </section>
        </div>
      </div>
    </template>

  </div>
</template>
<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

await userStore.fetchUser();

const userData = computed(() => userStore.user);
const employerUserData = computed(() => userData.value.employer_user);
const employerData = computed(() => userData.value.employer_user.employer);

const profileCompleteness = computed(() => userData.value.employer_user.employer.profile_completeness);
const emptyPercentage = 9;

const missingFieldsEmployer = computed(() => Object.entries(employerData.value.missing_fields).reduce((missing, block) => {
  missing[block[0]] = Object.keys(block[1]);
  return missing;
}, {}));

const openTab = (field) => {
  if (field === 'company_profile' || field === 'postalcode' || field === 'house_number') {
    return '/my-account/employer/profile/company-details';
  } else if (field === 'first_name' || field === 'last_name' || field === 'phone') {
    return '/my-account/employer/profile/account-details';
  } else if (field === 'languages') {
    return '/my-account/employer/profile/languages';
  } else if (field === 'logo') {
    return '/my-account/employer/profile/pictures';
  } else if (field === 'locale') {
    return '/my-account/employer/profile/preferences';
  }
};

</script>

<style lang="scss" scoped>
section.missing-fields {
  margin-top: 1.25rem;

  @include tablet {
    margin-top: 40px;
  }

  p {
    font-size: 14px;
    margin-bottom: 8px;

    @include tablet {
      margin-bottom: 16px;
    }
  }
}

ul.missing-fields {
  margin: 0 auto 6px auto;
  max-width: 100%;

  @include tablet {
    max-width: 368px;
  }

  li {
    background: hsla(0, 0%, 43.5%, .05);
    border-radius: 24px;
    margin-bottom: 16px;
    text-align: left;
    transition: background-color ease 0.2s;

    .list-item {
      color: #333;
      display: flex;
      font-size: 16px;
      padding: 12px 24px;
      justify-content: space-between;
      text-decoration: none;

      &__row {
        align-items: center;
        justify-content: space-between;
      }

      &__column {
        flex-direction: column;
      }

      &__description {
        color: $paragraph;
        font-size: 14px;
        margin: 8px 0;
      }

      &__loading {
        color: $light-grey;
      }

      &__info {
        align-items: center;
        display: flex;
        gap: 12px;
        position: relative;
        line-height: 1.2;
      }
    }

    i {
      font-size: 18px;
    }
  }

  li:not(.missing-fields__status):hover {
    background: darken(#eee, 10%);
  }
}
</style>