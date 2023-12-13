<template>
  <div v-if="open" class="c-notification-message" :class="classes">
    <div class="c-notification-message__headings">
      <Heading v-if="message.title" element="h3" as="h4" :modifiers="['line-height-normal', 'sub-title']">
        {{ message.title }}
      </Heading>

      <TextElement v-if="message.text" element="p">{{ message.text }}</TextElement>

      <RWButton v-if="detailLink" as="link" :href="detailLink.url" :target="detailLink.target || '_self'" class="u-mt-small">{{ detailLink.text}}</RWButton>
    </div>

    <div v-if="closeButton" class="c-notification-message__icon">
      <RWButton as="text" min-width :handler="buttonClickHandler">
        <Icon fa-class="fas fa-times" :color="iconColor" size="large" />
      </RWButton>
    </div>
  </div>
</template>

<script>
/**
 * Props
 * message: {
 *  title: String,
 *  text: String
 * }
 */

import Heading from "../atoms/Heading";
import TextElement from "../atoms/TextElement";
import RWButton from "../atoms/RWButton.vue";
import Icon from "../atoms/Icon";

const SEVERITY_TYPES = ["default", "low", "warning", "error"];

export default {
  name: "NotificationMessage",
  components: { Heading, TextElement, RWButton, Icon },
  props: {
    message: {
      type: Object,
      required: true
    },
    detailLink: {
      type: Object,
      required: false,
      default: null
    },
    severity: {
      type: String,
      default: "default",
      validator: propValue => {
        return SEVERITY_TYPES.some(el => propValue.includes(el));
      }
    },
    closeButton: {
      type: Boolean,
      default: false
    },
    wide: {
      type: Boolean,
      default: false
    },
    wideMobileOnly: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: true
    };
  },
  computed: {
    classes() {
      const severityProperty = `c-notification-message--${this.$props.severity}`;
      return {
        "c-notification-message--wide": this.$props.wide,
        "c-notification-message--wide-mobile-only": this.$props.wideMobileOnly,
        "c-notification-message--rounded": this.$props.rounded,
        [severityProperty]: this.$props.severity
      };
    },
    iconColor() {
      const colors = {
        default: "text",
        low: "teal",
        warning: "orange",
        error: "white"
      };

      return colors[this.$props.severity];
    }
  },
  methods: {
    buttonClickHandler() {
      this.open = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.c-notification-message {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  padding: 1rem;

  &--default {
    background-color: $white;

    .c-notification-message__headings {
      > h3,
      > p {
        color: $text-color;
      }
    }
  }

  &--low {
    background-color: $background-light;

    .c-notification-message__headings {
      > h3,
      > p {
        color: $teal-dark;
      }
    }
  }

  &--warning {
    background-color: $color-warning;
    backdrop-filter: blur(10px);

    .c-notification-message__headings {
      > h3,
      > p {
        color: $text-color;
      }
    }
  }

  &--error {
    background-color: $color-error;

    .c-notification-message__headings {
      > h3,
      > p {
        color: $white;
      }
    }
  }

  &--wide {
    left: -1.5rem;
    width: calc(100% + 3rem);
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;

    @include desktop {
      padding: 0.5rem 2.5rem 0.5rem 1.5rem;
    }
  }

  &--wide-mobile-only {
    left: -1.5rem;
    width: calc(100% + 3rem);
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;

    border-radius: 0;

    @include desktop {
      left: initial;
      width: 100%;

      padding: 1rem;

      border-radius: 6px;
    }
  }

  &--rounded {
    border-radius: 6px;
  }

  &--rounded-desktop-only {
    @include desktop {
      border-radius: 6px;
    }
  }
}
</style>
