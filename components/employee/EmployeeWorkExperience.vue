<template>
  <div v-if="workExperience" class="page-details__properties">
    <ul>
      <li v-for="(item, index) in workExperience" :key="`work-experience-${index}`">
        <div class="flex-start flex items-center">
          <div class="-ml-[5px] mr-3 h-3 w-3 rounded-full bg-neutral-300"></div>
          <h4 class="mb-1.5 text-xl font-semibold text-zinc-800">
            {{ item.function_title }}
          </h4>
        </div>
        <div class="mb-6 mt-2 border-l border-neutral-300 pl-4">
          <p class="mb-3 text-zinc-800">
            {{ item.company }}
          </p>
          <p class="text-sm text-neutral-400">{{ item.from_date }} - {{ item.to_date }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "EmployeeWorkExperience",
  props: {
    workExperience: {
      required: false,
      type: Array,
      default: null
    }
  },
  async mounted() {
    if (this.workExperience && this.workExperience.length) {
      this.$emit("has-data", true);
      return;
    }

    this.$emit("has-data", false);
  }
};
</script>
