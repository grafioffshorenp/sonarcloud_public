<template>
  <div class="c-avatar" :class="`c-avatar--${size}`">
    <img v-if="image" :src="image" alt="" class="c-avatar__image" />

    <div v-else>
      <!-- Fallback content -->
      <slot />
    </div>
  </div>
</template>

<script>
/**
 * Props
 * image: {
 *  src: String,
 *  title: String
 * }
 */

export default {
  name: "Avatar",
  props: {
    image: {
      default: null,
      type: String
    },
    size: {
      type: String,
      default: "default"
    }
  }
};
</script>

<style lang="scss" scoped>
.c-avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 50%;
  background-color: $background-light;

  &--default {
    width: 3.75rem;
    height: 3.75rem;

    // Prevent flex squeezing
    min-width: 3.75rem;
    min-height: 3.75rem;
  }

  &--small {
    width: 2.5rem;
    height: 2.5rem;

    // Prevent flex squeezing
    min-width: 2.5rem;
    min-height: 2.5rem;
  }
}

.c-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
