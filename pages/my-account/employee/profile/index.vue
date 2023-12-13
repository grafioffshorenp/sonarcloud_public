<template>
  <div>
    <template v-if="profileCompleteness > emptyPercentage && profileCompleteness < 100">
      <h2 class="t-heading-1 t-heading-1--centered t-heading-1--from-desktop">
        <div class="u-mb-big">{{ $t('Welkom') }} {{ employee.first_name }}</div>
      </h2>

      <header class="c-card__inner-card">
        <div class="u-mb-big">
          <h2 class="t-heading-1 t-heading-1--until-desktop">{{ $t('Welkom') }} {{ employee.first_name }}</h2>
        </div>

        <div class="u-mb-medium-big">
          <radial-progress-bar :diameter="86" :inner-stroke-width="6" :percentage="profileCompleteness"
                               start-color="#FF6047" second-color="#F5877F" third-color="#E3B1E3" stop-color="#95E1FC"
                               :stroke-width="6">
            <p class="t-label">{{ profileCompleteness }}<span class="t-percentage">%</span></p>
          </radial-progress-bar>
        </div>
      </header>

      <section v-if="missingFieldsEmployee.length" class="missing-fields">
        <p class="u-text-align-center">
          {{ $t('Open fields') }}
        </p>

        <ul class="missing-fields">
          <li v-for="field in missingFieldsEmployee" :key="field">
            <a class="list-item list-item__row" :href="openTab(field)">
              <span>{{ $t(field) }} </span>
              <i class="fas fa-chevron-right"/>
            </a>
          </li>
        </ul>
      </section>
    </template>

    <template v-else>
      <div class="employee-details" :class="{ 'is-reaction': !!status }">
        <section class="page__content page__content--no-padding-top flex justify-center">
          <div class="c-card c-card--hide-styling">
            <section v-if="!hideTopDetails"
                     class="page-details__section page-details__section--centered page-details__section--stroke relative justify-center flex flex-col items-center relative">
              <ProfilePicture :employee="employee" type="large"/>

              <p v-if="status" class="accept-label" :class="status">
                <template v-if="status === 'accepted'">
                  <i class="fas fa-clock disabled"/>
                  {{ $t('In behandeling') }}
                </template>
                <template v-if="status === 'contracted'">
                  <i class="fas fa-check"/>
                  {{ $t('Gecontracteerd') }}
                </template>
                <template v-if="status === 'rejected'">
                  {{ $t('Geweigerd') }}
                </template>
              </p>

              <h2 v-if="employee.display_name">{{ employee.display_name }}</h2>
              <h2 v-else>{{ employee.first_name }} {{ employee.last_name }}</h2>
              <p
                  class="left-56 bottom-0 text-right text-sm font-semibold text-sky-500 cursor-pointer p-2"
                  style="min-width: 150px"
                  @click="downloadCV()"
              ><i class="fa fa-download text-orange-500 mr-2"></i>{{ $t('Download') }} CV</p>
            </section>

          </div>
        </section>


        <section :class="['page-details__section', { 'page-details__section--hide-bottom': hideBottom }]">
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Persoonlijke gegevens') }}</h1>
          <div>
            <div class="grid grid-cols-2 gap-4">

              <div v-if="employee.region" class="page-details__properties">
                <p class="header">{{ 'Locatie' }}</p>
                <p class="body">{{ employee.city }} / {{ employee.region }}</p>
              </div>

              <div v-if="employee.birthdate" class="page-details__properties">
                <p class="header">{{ 'Leeftijd' }}</p>
                <p class="body bold">{{ moment().diff(employee.birthdate, 'years') }}</p>
              </div>

              <div v-if="isEmployer && hideTopDetails && employee.attendance_percentage !== undefined"
                   class="page-details__properties">
                <p class="header">{{ $t('Opkomstpercentage') }}</p>
                <p class="body">
                  {{
                    attendancePercentage
                        ? `${employee.attendance_percentage}%`
                        : $t('Niet bekend')
                  }}
                </p>
              </div>

              <div v-if="employee.mobile" class="page-details__properties">
                <p class="header">{{ $t('Mobiel telefoonnummer') }}</p>
                <p class="body bold">{{ employee.mobile }}</p>
              </div>

              <div v-if="user.email" class="page-details__properties">
                <p class="header">{{ $t('E-mailadres') }}</p>
                <p class="body bold">{{ user.email }}</p>
              </div>
            </div>
            <div v-if="employee.driver_licenses && employee.driver_licenses.length" class="page-details__properties">
              <p class="header">{{ $t('Rijbewijs') }}</p>
              <p class="body">
                <span v-for="(license, index) in employee.driver_licenses" :key="index">{{
                    license
                  }}<template v-if="index !== employee.driver_licenses.length - 1">, </template></span>
              </p>
            </div>

            <hr class="border-b my-4"/>
            <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Vaardigheden') }}</h1>
            <EmployeeSkillsFunction :employee="employee"/>

            <hr class="border-b my-4"/>
            <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Talen') }}</h1>
            <EmployeeLanguages :employee="employee"/>

            <hr class="border-b my-4"/>
            <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Opleidingen') }}</h1>
            <EmployeeEducation :educations="employee.educations"/>

            <hr class="border-b my-4"/>
            <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Recente werkervaring') }}</h1>
            <EmployeeWorkExperience :work-experience="employee.work_experiences"/>
          </div>

          <hr class="border-b my-4"/>
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Motivatie') }}</h1>
          <div v-if="employee.about" class="page-details__properties">
            <p>{{ employee.about }}</p>
          </div>
        </section>

      </div>
    </template>

  </div>
</template>

<script setup>
import moment from 'moment';

const localePath = useLocalePath();

defineProps({
  status: {
    type: String,
    default: null,
  },
  hideTopDetails: {
    default: false,
    required: false,
    type: Boolean,
  },
  hideBottom: {
    default: false,
    required: false,
    type: Boolean,
  },
});

const userStore = useUserStore();
await userStore.fetchUser();
const user = computed(() => userStore.user);

const employee = computed(() => user.value.employee);

const isEmployer = computed(() => userStore.isEmployer);

const profileCompleteness = computed(() => user.value.employee.profile_completeness);
const emptyPercentage = 9;

const missingFieldsEmployee = computed(
    () => Object.entries(employee.value.missing_fields_profile).map(field => field[0]),
);

const openTab = (field) => {
  if (field === 'educations') {
    return localePath('/my-account/employee/profile/educations');
  } else if (field === 'functional_skill_ids') {
    return localePath('/my-account/employee/profile/functional-skills');
  } else if (field === 'languages') {
    return localePath('/my-account/employee/profile/languages');
  } else if (field === 'social_skill_ids') {
    return localePath('/my-account/employee/profile/social-skills');
  } else if (field === 'work_experiences') {
    return localePath('/my-account/employee/profile/work-experience');
  } else if (field === 'work_type' || field === 'working_hours' || field === 'work_status_holder') {
    return localePath('/my-account/employee/profile/about');
  } else if (field === 'region' || field === 'city' || field === 'mobile' || field === 'email') {
    return localePath('/my-account/employee/profile/contact-details');
  } else if (field === 'nationality' || field === 'gender' || field === 'first_name' || field === 'last_name' ||
      field === 'birthdate' || field === 'has_social_security_number' || field === 'has_work_permit' || field ===
      'has_dutch_bank_account') {
    return localePath('/my-account/employee/profile/personal');
  } else if (field === 'locale') {
    return localePath('/my-account/employee/profile/preferences');
  }
};

const downloadCVtag = ref(null);

const downloadCV = async () => {
  try {
    const cvLink = await downloadCVLink();
    window.location.href = cvLink;
  } catch (error) {
    console.error('Error downloading CV:', error);
    throw error;
  }
};

const downloadCVLink = async () => {
  try {
    const body = {
      user_id: employee.value.id,
      first_name: employee.value.first_name,
      last_name: employee.value.last_name,
    };
    const response = await userStore.downloadCV(body);
    return response;
  } catch (error) {
    throw error;
  }
};

</script>

<style lang="scss" scoped>
.employee-details {
  &:not(.is-reaction) {
    margin-bottom: 32px;

    @include until-tablet {
      background: $white;
      border-radius: 5px;
      box-shadow: $box-shadow;
    }

    .page-details__section {
      background: none;
      border-radius: 0;
      box-shadow: none;

      @include until-tablet {
        border-bottom: 0;
        padding-bottom: 0;
      }

      &:last-of-type {
        border-bottom: 0;
      }
    }
  }
}

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