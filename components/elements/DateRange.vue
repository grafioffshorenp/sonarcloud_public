<template>
    <span>
        {{ startDate }}<template v-if="displayRange">&nbsp;&nbsp;{{ $t('t/m') }}&nbsp;&nbsp;{{ endDate }}</template>
    </span>
</template>

<script setup>
import { format } from 'date-fns';
import * as locales from 'date-fns/locale/index.js';

const props = defineProps({
  dateRange: {
    type: Object,
    default: null,
    required: true,
  },
});

const { locale, availableLocales } = useI18n();
const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);

const displayRange = computed(() => {
  return props.dateRange.end_date && props.dateRange.start_date !== props.dateRange.end_date;
});

const startDate = computed(() => {
  return ucFirst(date(props.dateRange.start_date));
});
const endDate = computed(() => {
  return ucFirst(date(props.dateRange.end_date));
});
const dateFormat = computed(() => {
  return displayRange.value ? 'EEEEEE d MMM yyyy' : 'EEEEEE d MMMM yyyy';
});
const date = (date) => {
  return format(new Date(date), dateFormat.value, { locale: locales[locale.value] }).replace('.', '');
};

</script>