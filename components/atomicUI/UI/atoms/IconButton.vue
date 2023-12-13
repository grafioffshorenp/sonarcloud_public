<template>
  <button :aria-label="ariaLabel" class="c-icon-button" @click="handler">
    <i :class="faClass"></i>
    <slot />
  </button>
</template>

<script>
/**
 * Props
 * faClass: font awesome icon class
 * handler: add a custom handler
 */

export default {
  name: "IconButton",
  props: {
    faClass: {
      type: String,
      required: true
    },
    ariaLabel: {
      type: String,
      default: ""
    },
    handler: {
      type: Function,
      default: () => null
    }
  }
};
</script>

<style lang="scss" scoped>
.c-icon-button {
  display: flex;
  align-items: center;

  color: $teal-dark;

  cursor: pointer;

  transition: 0.2s color;

  @include on-event {
    color: $blue;
  }

  > i {
    margin-right: 0.5rem;

    font-size: 1.25rem;
  }
}
</style>
