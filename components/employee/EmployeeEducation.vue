<template>
  <div v-if="educations" class="page-details__properties">
    <ul>
      <li v-for="(item, index) in educations" :key="`education-${index}`">
        <div class="flex-start flex items-center">
          <div class="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300"></div>
          <h4 class="mb-1.5 text-xl font-semibold text-zinc-800">
            {{ item.title }} <span v-if="item.level" class="text-neutral-400">[{{ item.level }}]</span>
          </h4>
        </div>
        <div class="mb-6 mt-2 border-l border-neutral-300 pl-4">
          <p class="mb-3 text-zinc-800">
            {{ item.institution }}
          </p>
          <p class="text-sm text-neutral-400">
            {{ item.end_period }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "EmployeeEducation",
  props: {
    educations: {
      required: false,
      type: Array,
      default: null
    }
  },
  async mounted() {
    if (this.educations && this.educations.length) {
      this.$emit("has-data", true);
      return;
    }

    this.$emit("has-data", false);
  }
};
</script>
