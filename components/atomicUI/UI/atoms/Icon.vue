<template>
  <div :class="`c-icon--${size}`">
    <i :class="[faClass, `c-icon__i--${color}`]" class="c-icon__i"></i>
  </div>
</template>

<script>
/**
 * Props
 *  faClass: font awesome class
 *  color: color
 *  size: icon size
 */

export default {
  name: "Icon",
  props: {
    faClass: {
      required: true,
      type: String
    },
    color: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "default"
    }
  }
};
</script>

<style lang="scss" scoped>
.c-icon {
  &--default {
    font-size: 1rem;
  }

  &--large {
    font-size: 1.5rem;
  }
}

.c-icon__i {
  &--text {
    color: $text-color;
  }

  &--teal {
    color: $teal-dark;
  }

  &--orange {
    color: $orange;
  }

  &--white {
    color: $white;
  }
}
</style>
