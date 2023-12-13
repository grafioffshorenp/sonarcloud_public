<template>
  <div class="date-block" :class="{ 'is-range': contractHasEndDate }">
    <template v-if="!contractHasEndDate">
      <span class="large">{{ day(jobpost.start_date) }}</span>
      <span class="uppercase small">{{ month(jobpost.start_date) }}</span>
    </template>

    <template v-else>
      <span class="large">
        {{ day(jobpost.start_date) }}
        <span class="uppercase">{{ month(jobpost.start_date) }}</span>
      </span>

      <span class="separator">-</span>

      <span class="large">
        {{ day(jobpost.end_date) }}
        <span class="uppercase">{{ month(jobpost.end_date) }}</span>
      </span>
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns';
import * as locales from 'date-fns/locale/index.js';

export default {
  name: 'JobpostDateBlock',
  props: {
    jobpost: {
      required: true,
      type: Object,
    },
  },
  computed: {
    locale() {
      return locales[useI18n().locale];
    },
    contractHasEndDate() {
      return !!this.jobpost.end_date && this.jobpost.end_date !== this.jobpost.start_date;
    },
  },
  methods: {
    day(date) {
      return format(new Date(date), 'dd', { locale: this.locale });
    },
    month(date) {
      return format(new Date(date), 'MMM', { locale: this.locale }).replace('.', '');
    },
  },
};
</script>
