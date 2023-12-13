<template>
  <div class="modal active">
    <ModalWrapper @toggle-modal="$emit('toggle-modal')">
      <i class="rounded-icon fas fa-info"/>

      <p v-for="reaction in data" :key="reaction.application.id">
        <strong
        >{{ formatDate(reaction.application.job_post.start_date, 'short') }} {{ $t("van") }}
          {{ reaction.application.job_post.schedule.start }} {{ $t("tot") }}
          {{ reaction.application.job_post.schedule.end }} {{ $t("uur") }}:</strong
        ><br/>
        {{ rejectionReason(reaction.application.status) }}
      </p>

      <a class="btn" @click="confirm()">
        {{ $t('Oké') }}
      </a>
    </ModalWrapper>
  </div>
</template>

<script>

import { formatDate } from '~/helpers/stringHelpers.js';
import ModalWrapper from '~/components/elements/ModalWrapper.vue';

export default {
  name: 'FailedReactionsModal',
  components: {
    ModalWrapper,
  },
  props: {
    data: {
      required: true,
      type: Array,
    },
  },
  methods: {
    formatDate,
    confirm() {
      this.$emit('toggle-modal');
    },
    rejectionReason(status) {
      return status === 'retracted'
          ? this.reactionsFields.failedReactionsModal.retractedStatusText || 'Reactie is tussentijds teruggetrokken'
          : status === 'overlapping'
              ? this.reactionsFields.failedReactionsModal.overlappingStatusText ||
              'Shift overlapt met een bestaand contract'
              : 'Reden onbekend';
    },
  },
};
</script>
