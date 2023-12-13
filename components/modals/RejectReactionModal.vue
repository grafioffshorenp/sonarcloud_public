<template>
  <div class="modal active">
    <ModalWrapper :min-height="false" @toggle-modal="$emit('close-modal')">
      <i v-if="loading" class="fas fa-spinner"/>
      <div v-else class="u-flex-direction-column u-flex-align-start">
        <div class="u-mb-medium">
          <h3 class="t-heading-3">{{ $t('Weigeren') }}</h3>
        </div>
        <div class="u-mb-medium">
          <p class="t-text">{{ $t('Geef een reden op.') }}</p>
        </div>

        <span class="u-mb-medium">
          <FormFieldsRWSelect v-if="input" v-model="value" :input="input"/>
        </span>

        <button :class="['btn btn--flatten', { disabled: !value }]" :disabled="!value" @click="handleClick">
          {{ $t('Indienen') }}
        </button>
      </div>
    </ModalWrapper>
  </div>
</template>

<script>
import ModalWrapper from '~/components/elements/ModalWrapper.vue';

export default {
  name: 'RejectReactionModal',
  components: {
    ModalWrapper,
  },
  props: {
    reaction: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      reactionStore: useReactionStore(),
      value: null,
      input: null,
      loading: false,
    };
  },
  computed: {
    reasons() {
      return this.reactionStore.reasons;
    },
    employerId() {
      return this.userStore.employerId;
    },
  },
  async mounted() {
    this.loading = true;
    if (this.reasons.length === 0) {
      await this.reactionStore.fetchRejectionReasons();
    }

    let options = this.reasons.map(reason => {
      return {
        label: reason.reason,
        value: reason.id,
      };
    });

    options = [
      { label: this.$t('Selecteer een reden'), value: '' },
      ...options,
    ];

    this.input = {
      required: true,
      handle: 'reason',
      label: this.$t('Reden weigering'),
      options,
    };

    this.loading = false;
  },
  methods: {
    handleClick() {
      this.$emit('submit', { reaction: this.reaction, reason: this.value });
    },
  },
};
</script>
