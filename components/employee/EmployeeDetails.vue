<template>
  <div class="employee-details" :class="{ 'is-reaction': !!status }">
    <section
        v-if="!hideTopDetails"
        class="page-details__section page-details__section--centered page-details__section--stroke relative"
    >
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

    </section>

    <section :class="['page-details__section', { 'page-details__section--hide-bottom': hideBottom }]">
      <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Personal data") }}</h1>
      <div>
        <div class="grid grid-cols-2 gap-4">

          <div v-if="employee.region" class="page-details__properties">
            <p class="header">{{ $t('Locatie') }}</p>
            <p class="body">{{ employee.region }}</p>
          </div>

          <div v-if="employee.birthdate" class="page-details__properties">
            <p class="header">{{ $t('Leeftijd') }}</p>
            <p class="body bold">{{ employee.birthdate }}</p>
          </div>

          <div
              v-if="isEmployer && hideTopDetails && employee.attendance_percentage !== undefined"
              class="page-details__properties"
          >
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

          <div v-if="employee.email" class="page-details__properties">
            <p class="header">{{ $t('E-mailadres') }}</p>
            <p class="body bold">{{ employee.email }}</p>
          </div>
        </div>
        <div v-if="employee.driver_licenses && employee.driver_licenses.length" class="page-details__properties">
          <p class="header">{{ $t('Rijbewijs') }}</p>
          <p class="body">
            <template v-for="(license, index) in employee.driver_licenses" :key="index">
              <span>{{ license }}{{ separator(index) }}</span>
            </template>
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
      <div v-if="employee.about" class="page-details__properties">
        <p>{{ employee.about }}</p>
      </div>
    </section>
  </div>
</template>

<script>

import ProfilePicture from '~/components/ProfilePicture.vue';
import EmployeeLanguages from '~/components/employee/EmployeeLanguages.vue';
import EmployeeEducation from '~/components/employee/EmployeeEducation.vue';
import EmployeeWorkExperience from '~/components/employee/EmployeeWorkExperience.vue';
import EmployeeSkillsFunction from '~/components/employee/EmployeeSkillsFunction.vue';

export default {
  name: 'EmployeeDetails',
  components: {
    ProfilePicture,
    EmployeeLanguages,
    EmployeeSkillsFunction,
    EmployeeEducation,
    EmployeeWorkExperience,
  },
  props: {
    employee: {
      required: true,
      type: Object,
    },
    hideTopDetails: {
      default: false,
      required: false,
      type: Boolean,
    },
    jobpost: {
      required: false,
      type: Object,
      default: null,
    },
    status: {
      default: null,
      required: false,
      type: String,
    },
    hideBottom: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      skills: null,
    };
  },
  computed: {
    isEmployer() {
      return this.userStore.isEmployer;
    },
    attendancePercentage() {
      return this.employee.attendance_percentage || this.employee.attendance_percentage === 0;
    },
  },
  methods: {
    newline(index) {
      return index < this.employee.industry_experiences.length - 1 ? '\n' : '';
    },
    separator(index) {
      return index < this.employee.driver_licenses.length - 1 ? ', ' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.bold {
  font-weight: bold !important;
}

.padding-table {
  padding: 5px 10px;
  line-height: 1.4rem;
  color: #6f6f6f;
  font-size: 14px;
}

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

  .column {
    :deep(.rating-wrapper) {
      .stars-row {
        justify-content: flex-start;
      }

      .rating-number {
        color: $paragraph;
      }
    }
  }

  &--no-styling {
    box-shadow: none !important;
    background-color: transparent !important;
  }
}
</style>
