<template>
  <div class="u-mb-medium-big">
    <div v-if="employee.languages" class="u-mt-medium-big">
      <ul>
        <li
          v-for="(language, index) in employee.languages"
          :key="`language-${index}`"
          class="mb-4 grid grid-cols-3 gap-4"
        >
          <div>{{ languagesParsed[language.lang] }}</div>
          <div class="col-span-2">
            <div class="mb-2 h-2 w-full bg-stone-300 rounded">
              <div class="h-2 bg-orange-500 rounded" :style="`width: ${getLevelPercentage(language.level)}%`"></div>
            </div>
            <div>({{ language.level }})</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ParseLanguageName } from '@/helpers/languagesHelper';
export default {
  name: "EmployeeLanguages",
  props: {
    employee: {
      required: true,
      type: Object
    },
    jobpost: {
      required: false,
      type: Object,
      default: null
    }
  },
  data: () => ({
    languagesParsed: ParseLanguageName,
    percentages: {
      A1: 16,
      A2: 33,
      B1: 50,
      B2: 66,
      C1: 83,
      C2: 100
    }
  }),
  async mounted() {

    if (this.employee.languages && this.employee.languages.length) {
      this.$emit("has-data", true);
      return;
    }

    this.$emit("has-data", false);
  },
  methods: {
    getLevelPercentage(level) {
      return this.percentages[level];
    }
  }
};
</script>
