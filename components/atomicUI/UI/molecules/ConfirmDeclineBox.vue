<template>
  <div>
    <div class="c-confirm-decline-buttons">
      <RWButton
        as="outline"
        class="c-button--centered-text"
        :aria-label="declineLabel"
        :handler="() => (showDeclineModal = true)"
      >
        {{ declineLabel }}
      </RWButton>

      <RWButton as="button" class="c-button--centered-text" :aria-label="confirmLabel" :handler="() => $emit('confirm')">
        {{ confirmLabel }}
      </RWButton>
    </div>

    <div v-if="showDeclineModal" :class="['modal', 'modal--wide', 'active']">
      <ModalWrapper :modal-title="declineLabel" :fit-content-height="true" @toggle-modal="showDeclineModal = false">
        <slot name="modal">
          <h3 class="u-mb-medium">
            {{ $t("Weet je zeker dat je wilt annuleren?") }}
          </h3>

          <p class="u-text-align-left">{{ $t("Klik op annuleren om het venster te sluiten.") }}</p>
        </slot>

        <div class="c-confirm-decline-buttons">
          <RWButton
            as="outline"
            class="c-button--centered-text"
            :aria-label="$t('Annuleren')"
            :handler="() => (showDeclineModal = false)"
          >
            {{ $t("Annuleren") }}
          </RWButton>

          <RWButton
            as="button"
            class="c-button--centered-text"
            :aria-label="confirmLabel"
            :handler="() => $emit('decline')"
          >
            {{ declineLabel }}
          </RWButton>
        </div>
      </ModalWrapper>
    </div>
  </div>
</template>

<script>
import RWButton from "../atoms/RWButton.vue";
import ModalWrapper from "~/components/elements/ModalWrapper.vue";

export default {
  name: "ConfirmDeclineBox",
  components: { ModalWrapper, RWButton },
  props: {
    declineButtonText: {
      required: false,
      type: String,
      default: ""
    },
    confirmButtonText: {
      required: false,
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showDeclineModal: false
    };
  },
  computed: {
    declineLabel() {
      return this.declineButtonText || this.$t("Cancel");
    },
    confirmLabel() {
      return this.confirmButtonText || this.$t("OK");
    }
  }
};
</script>

<style lang="scss" scoped>
.c-confirm-decline-buttons {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  @include tablet {
    flex-direction: row;
  }
}
</style>
