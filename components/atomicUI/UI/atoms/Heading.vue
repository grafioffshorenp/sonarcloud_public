<template>
  <component
    :is="element"
    :class="[as ? `t-heading--${as}` : '', modifiers.length ? setModifiers : '']"
    class="t-heading"
  >
    <slot />
  </component>
</template>

<script>
/**
 * Props
 * element: the HTML element
 * as: the element appearance, example { element: 'h2', as: 'h3' } => h2 element with h3 styling
 * modifiers: An array of css class modifiers, example ['teal', 'centered'] => .heading--teal .heading--centered
 */

const ALLOWED_ELEMENTS = ["h1", "h2", "h3", "h4"];

export default {
  name: "Heading",
  props: {
    element: {
      default: "h2",
      type: String,
      validator: propValue => {
        return ALLOWED_ELEMENTS.some(el => propValue.includes(el));
      }
    },
    as: {
      default: "h2",
      type: String,
      validator: propValue => {
        return ALLOWED_ELEMENTS.some(el => propValue.includes(el));
      }
    },
    modifiers: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    setModifiers() {
      return this.modifiers.map(modifier => `t-heading--${modifier}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin heading-modifiers() {
  // Colors
  &--text {
    color: $text-color;
  }

  &--white {
    color: $white;
  }

  &--teal {
    color: $teal-dark;
  }

  // Font options
  &--sub-title {
    font-family: $font-body-medium;
  }

  &--body-font-bold {
    font-family: $font-body-bold;
  }

  &--line-height-small {
    line-height: 20px;
  }

  &--line-height-normal {
    line-height: 30px;
  }

  &--higlight {
    strong {
      color: $blue;
    }
  }

  // Positioning
  &--centered {
    text-align: center;
  }
}

.t-heading {
  @include heading-modifiers;
  @include text-rendering;

  &--h1 {
    @extend .t-heading-1;

    margin-bottom: 2.5rem;
  }

  &--h2 {
    @extend .t-heading-2;

    margin-bottom: 1.5rem;
  }

  &--h3 {
    @extend .t-heading-3;
  }

  &--h4 {
    font-size: 1rem;
  }
}
</style>
