<template>
  <aside class="page-vacancy__sidebar" v-if="vacancy">
    <div>
      <div class="page-vacancy__sidebar-inner">
        <header class="page-vacancy__sidebar-header">
          <div class="c-company">
            <div v-if="vacancy['function_template'].logo" class="c-company__image">
              <img :src="vacancy['function_template'].logo" :alt="vacancy.employer.name"/>
            </div>
            <div v-else class="c-company__fallback-icon">
              <i class="fas fa-building"/>
            </div>
            <div class="c-company__details">
              <p class="t-text t-text--bolder">{{ vacancy.employer.name }}</p>
            </div>
          </div>
        </header>
        <section>
          <div class="page-details__properties column">
            <p class="header">{{ $t("Functie") }}</p>
            <p class="body">{{ vacancy.function && vacancy.function.name ? vacancy.function.name : '-' }}</p>
          </div>
          <div class="page-details__properties column">
            <p class="header">{{ $t("Work type") }}</p>
            <p class="body">{{ $t(vacancy['function_template']['work_type']) }}</p>
          </div>
          <div class="page-details__properties column">
            <p class="header">{{ $t("Working hours") }}</p>
            <p class="body">{{ vacancy['function_template']['working_hours'] }}</p>
          </div>
          <div class="page-details__properties column">
            <p class="header">{{ $t("Adres") }}</p>
            <p class="body">{{ vacancy.street }} {{ vacancy['house_number'] }}<br/>
              {{ vacancy.postalcode }}, {{ vacancy.city }}</p>
          </div>
          <div class="page-details__properties column" v-if="vacancy.employer['avg_application_response_time']">
            <p class="header">{{ $t("Gemiddelde reactietijd werkgever") }}</p>
            <p class="body">{{ vacancy.employer['avg_application_response_time'] }}</p>
          </div>
          <div class="page-details__properties column">
            <p class="header">{{ vacancy['is_permanent'] ? $t('Permanent') : $t('Tijdelijk') }}</p>
            <p class="body" v-if="!vacancy['is_permanent']">
              <span>{{ startDate }}<template v-if="displayRange">&nbsp;{{ $t("t/m") }}&nbsp;{{ endDate }}</template></span>
            </p>
          </div>
          <div class="page-details__properties column">
            <ElementsApplyToJobPostButton :vacancy="vacancy" :user="user" />
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>
<script setup>

import { format } from 'date-fns';
import * as locales from 'date-fns/locale/index.js';

const props = defineProps({
  vacancy: {
    type: Object,
    default: null,
    required: true,
  },
  user: {
    type: Object,
    default: null,
    required: false
  }
});

const { locale, availableLocales } = useI18n();
const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);

const displayRange = computed(() => {
  return props.vacancy.end_date && props.vacancy.start_date !== props.vacancy.end_date;
});

const startDate = computed(() => {
  return ucFirst(date(props.vacancy.start_date));
});
const endDate = computed(() => {
  return ucFirst(date(props.vacancy.end_date));
});
const dateFormat = computed(() => {
  return displayRange.value ? 'EEEEEE d MMM yyyy' : 'EEEEEE d MMMM yyyy';
});
const date = (date) => {
  return format(new Date(date), dateFormat.value, { locale: locales[locale.value] }).replace('.', '');
};
</script>