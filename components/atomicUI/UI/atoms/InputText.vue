<template>
  <input
    class="c-input-text"
    :class="{ 'c-input-text--bordered': bordered }"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: "InputText",
  props: {
    type: {
      default: "text",
      type: String
    },
    name: {
      required: true,
      type: String
    },
    placeholder: {
      default: "",
      type: String
    },
    bordered: {
      default: false,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.c-input-text,
.c-input-text:disabled {
  width: 100%;
  padding: 1rem;
  height: 56px;

  background-color: $white;
  border: none;

  color: $text-color;
  font-size: 1rem;

  &::placeholder {
    color: $grey !important;
  }

  &--bordered {
    border-radius: 6px;
    border: 1px solid $grey;
  }
}
</style>
