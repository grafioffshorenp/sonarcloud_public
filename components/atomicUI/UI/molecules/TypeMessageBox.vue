<template>
  <div ref="messageBox" class="c-type-message-box">
    <TextareaField ref="input" name="message" :placeholder="placeholderText" :disabled="disabled" />

    <div class="c-type-message-box__mobile-send-button">
      <RWButton
        as="text"
        :aria-label="$t('Versturen')"
        min-width
        :handler="() => buttonClickHandler()"
        :disabled="disabled"
      >
        <Icon fa-class="fas fa-paper-plane" color="orange" size="large" />
      </RWButton>
    </div>
    <div class="c-type-message-box__desktop-send-button">
      <RWButton
        as="button"
        :aria-label="$t('Versturen')"
        min-width
        :handler="() => buttonClickHandler()"
        :disabled="disabled"
      >
        <span>{{ $t("Versturen") }}</span>
        <Icon fa-class="fas fa-paper-plane" color="white" />
      </RWButton>
    </div>
  </div>
</template>

<script>
import RWButton from "../atoms/RWButton.vue";
import Icon from "../atoms/Icon";
import TextareaField from "@/components/atomicUI/UI/atoms/TextareaField.vue";

export default {
  name: "TypeMessageBox",
  components: { TextareaField, RWButton, Icon },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    placeholderText() {
      if (this.disabled) {
        return this.$t('Bericht versturen niet mogelijk')
      }

      return this.$t('Typ een nieuw bericht...')
    }
  },
  methods: {
    sendMessage() {
      if (this.disabled) {
        return;
      }

      if (this.$refs.input) {
        const message = this.$refs.input.$el.value;

        if (message.trim()) {
          this.$emit("onMessageSend", message.trim());
          this.$refs.input.$el.value = "";
        }
      }
    },
    buttonClickHandler() {
      this.sendMessage();
    }
  }
};
</script>

<style lang="scss" scoped>
.c-type-message-box {
  display: flex;
  align-items: center;

  padding: 0.5rem 0;

  border-top: 1px solid $background-light;
}

.c-type-message-box__mobile-send-button {
  display: block;

  @include desktop {
    display: none;
  }
}

.c-type-message-box__desktop-send-button {
  display: none;

  @include desktop {
    display: block;
  }
}
</style>
