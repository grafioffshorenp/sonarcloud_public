<template>
  <div class="u-mb-medium-big">
    <template v-if="employee.skills && employee.skills.length">
      <div class="u-mt-medium-big">
        <div class="u-mb-small">
          <p class="t-text t-text--small">
            {{ $t('Vaardigheden') }}
          </p>
        </div>

        <ul class="l-inline-items l-inline-items--wrap">
          <li v-for="skill in employee.skills" :key="`skill-${skill.id}`" class="u-mb-small">
            <div class="px-3 py-1 rounded-lg border border-sky-500 text-sm text-sky-500">
              {{ $t(skill.name) }}
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template v-else>
      <div v-if="employee.skills_functional" class="u-mt-medium-big">
        <div class="u-mb-small">
          <p class="t-text t-text--small">
            {{ $t('Functionele Vaardigheden') }}
          </p>
        </div>

        <ul class="l-inline-items l-inline-items--wrap">
          <li v-for="skill in employee.skills_functional" :key="`skill-${skill.id}`" class="u-mb-small">
            <div class="px-3 py-1 rounded-lg border border-sky-500 text-sm text-sky-500">
              {{ $t(skill.name ) }}
            </div>
          </li>
        </ul>
      </div>

      <div v-if="employee.skills_social" class="u-mt-medium-big">
        <div class="u-mb-small">
          <p class="t-text t-text--small">
            {{ $t('Sociale Vaardigheden') }}
          </p>
        </div>

        <ul class="l-inline-items l-inline-items--wrap">
          <li v-for="skill in employee.skills_social" :key="`skill-${skill.id}`" class="u-mb-small">
            <div class="px-3 py-1 rounded-lg border border-sky-500 text-sm text-sky-500">
              {{ $t(skill.name) }}
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  name: 'EmployeeSkillsFunction',
  props: {
    employee: {
      required: true,
      type: Object,
    },
    jobpost: {
      required: false,
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      skills: null,
      functionExperience: null,
    };
  },
  computed: {
    employerId() {
      return this.user.employer_user.employer.id;
    },
    isEmployer() {
      return this.userStore.isEmployer;
    },
  },
  async mounted() {
    if (!this.isEmployer) {
      return;
    }

    if (this.employee && this.employee.skills_functional) {
      this.$emit('has-data', true);
      return;
    }
    this.$emit('has-data', false);
  },
};
</script>
