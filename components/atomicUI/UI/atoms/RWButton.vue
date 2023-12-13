<template>
  <component
      :is="element"
      :href="href"
      :aria-label="ariaLabel"
      :class="{
          [`c-button--${as}`]: as,
          [`c-button--min-width`]: minWidth
      }"
      class="c-button"
      :disabled="disabled"
      @click="handler"
  >
    <slot/>
  </component>
</template>

<script>
/**
 * Props
 * as: button appearance
 * href: button we be a link when true
 * handler: add a custom handler
 */

const ALLOWED_APPEARANCE = ['button', 'outline', 'link', 'text'];

export default {
  // Can't name it Button, nuxt autoloading will cause an infinite loop if we do, as it will try to load this component
  // again if it's type is `button`
  name: 'RWButton',
  props: {
    as: {
      type: String,
      default: 'button',
      validator: propValue => {
        return ALLOWED_APPEARANCE.some(el => propValue.includes(el));
      },
    },
    minWidth: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: null,
    },
    handler: {
      type: Function,
      default: () => null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    element() {
      return this.href ? 'a' : 'button';
    },
  },
};
</script>

<style lang="scss" scoped>
.c-button {
  display: flex;
  gap: 0.5rem;

  cursor: pointer;

  &--button,
  &--outline {
    width: 100%;
    padding: 1rem;

    border-radius: 5px;
    border: none;

    font-family: $font-title;
    font-size: 1.1rem;
    line-height: 1.4rem;
    text-align: center;
    text-decoration: none;

    transition: 0.2s background-color, 0.2s color, 0.2s border-color;

    &:focus {
      color: #2395d3;
      background-color: transparent;
    }
  }

  &--button {
    color: $white;
    background-color: $orange;

    @include on-event {
      background-color: darken($orange, 7%);
      color: $white;
    }
  }

  &--outline {
    background-color: transparent;
    border: 1px solid $teal-dark;
    color: $teal-dark;

    @include on-event {
      border-color: $blue;
      color: $blue;
    }
  }

  &--link,
  &--text {
    padding: 0;

    background-color: transparent;

    font-family: $font-body;
    font-weight: 500;

    @include on-event {
      color: $blue;
      background-color: transparent;
    }
  }

  &--link {
    text-decoration: underline;
  }

  &--text {
    text-decoration: none;
  }

  &--centered-text {
    justify-content: center;
  }

  &--min-width {
    width: min-content;
  }
}

.c-button:disabled {
  background-color: $grey-light;
  cursor: auto;
  pointer-events: none;
}
</style>
