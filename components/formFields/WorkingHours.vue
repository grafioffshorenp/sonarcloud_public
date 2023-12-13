<template>
  <div>
    <div class="option">
      <label :class="[{ required: input.required}]">{{ $t("Working hours") }}</label>
    </div>
    <div class="option">
      <label>
        <input :required="isAtLeastOneCheckboxSelected" v-model="workingHours" name="working_hours[]" type="checkbox" value="Full-time"
               @change="$emit('setWorkingHours', workingHours)" />
        {{ $t("Full-time") }}
      </label>
    </div>
    <div class="option">
      <label>
        <input :required="isAtLeastOneCheckboxSelected" v-model="workingHours" name="working_hours[]" type="checkbox" value="Part-time"
               @change="$emit('setWorkingHours', workingHours)" />
        {{ $t("Part-time") }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkingHours",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    workingHours: ["Full-time"]
  }),
  mounted() {
    if (this.input.value) {
      // if (typeof this.input.value === "string") {
      //   this.workingHours = JSON.parse(this.input.value);
      // } else {
        this.workingHours = this.input.value;
      // }
    }
  },
  computed: {
    isAtLeastOneCheckboxSelected() {
      return this.workingHours.length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.option {
  display: flex;
  justify-content: space-between;
}
</style>
