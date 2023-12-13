<template>
  <div class="c-notification-badge">
    <slot />

    <span v-if="counter" class="c-notification-badge__counter" :class="`c-notification-badge__counter--${position}`">
      {{ counter }}
    </span>
  </div>
</template>

<script>
export default {
  name: "NotificationBadge",
  props: {
    counter: {
      default: 0,
      type: Number
    },
    position: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.c-notification-badge {
  position: relative;
}

.c-notification-badge__counter {
  position: absolute;

  width: 1.25rem;
  height: 1.25rem;

  background-color: $orange;
  border-radius: 50%;

  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: $white;

  &--top-left {
    top: 0;
    left: 0;
  }

  &--top-right {
    top: 0;
    right: 0;
  }

  &--bottom-left {
    bottom: 0;
    left: 0;
  }

  &--bottom-right {
    bottom: 0;
    right: 0;
  }
}
</style>
