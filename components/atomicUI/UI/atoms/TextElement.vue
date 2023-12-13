<template>
  <component
    :is="element"
    :class="[element ? `t-text--${element}` : '', modifiers.length ? setModifiers : '']"
    class="t-text"
  >
    <slot />
  </component>
</template>

<script>
/**
 * Props
 * element: the HTML element
 * modifiers: An array of css class modifiers, example ['teal', 'centered'] => .text--teal .text--centered
 */

const ALLOWED_ELEMENTS = ["p", "span", "small"];

export default {
  name: "TextElement",
  props: {
    element: {
      default: "span",
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
      return this.modifiers.map(modifier => `t-text--${modifier}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin text-modifiers() {
  // Colors
  &--white {
    color: $white;
  }

  &--grey {
    color: $grey;
  }

  &--teal {
    color: $teal-dark;
  }

  // Font options
  &--bold {
    font-family: $font-body-bold;
  }

  &--line-height-normal {
    line-height: 20px;
  }

  // Positioning
  &--centered {
    text-align: center;
  }
}

.t-text {
  @include text-modifiers;

  font-family: $font-body;

  &--p {
    display: block;
    margin-bottom: 0;
  }

  &--small {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
  }
}
</style>
