<template>
  <div class="input-row">
    <div class="input-wrapper input--select">
      <select v-model="input.value" name="work_type" @change="$emit('changed', $event)" class="pl-4">
        <option value="Regular">{{ $t("Regular") }}</option>
        <option value="Entrepreneurship">{{ $t("Entrepreneurship") }}</option>
        <option value="Apprenticeship">{{ $t("Apprenticeship") }}</option>
        <option value="Voluntary">{{ $t("Voluntary") }}</option>
        <option value="Internship">{{ $t("Internship") }}</option>
      </select>
      <label>{{ $t("Work type") }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkTypeSelect",
  props: {
    input: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped></style>
