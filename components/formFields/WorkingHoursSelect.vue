<template>
  <div class="input-row">
    <div class="input-wrapper input--select">
      <select v-model="input.value" name="working_hours" @change="$emit('changed', $event)" class="pl-4">
        <option value="Full-time">{{ $t("Full-time") }}</option>
        <option value="Part-time">{{ $t("Part-time") }}</option>
      </select>
      <label>{{ $t("Working hours") }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkingHoursSelect",
  props: {
    input: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped></style>
