<template>
  <div>
    <ais-state-results>
      <template v-slot="{ results: { hits }, state }">
        {{ addStateToRoute(state, $router, $route) /* Hacky way to add the state to the url */ }}
        <ais-hits class="jobpost-list" ref="searchResults" v-if="hits.length > 0">
          <template v-slot="{ items, sendEvent }">
            <div class="jobpost-list__item" v-for="item in items" :key="item.objectID">
              <NuxtLink
                  :to="localePath(`/vacancy/${item.employer.slug}/${item.function.slug}/${item.objectID}`)"
                  class="jobpost-list__link">
                <div v-if="getImage(item)" class="jobpost-list__image">
                  <img :alt="item.function_template?.name || item.employer?.name || ''"
                       :src="getImage(item)" height="100">
                </div>
                <div class="jobpost-list__wrapper">
                  <h4 class="work-type">{{ item.work_type }}</h4>
                  <header class="jobpost-list__header">
                    <h3 class="translate">{{ item['function_template'].name }}</h3>
                  </header>
                  <div class="jobpost-list__subheader">
                    <h4 class="t-text t-text--small t-text--grey">{{ item.employer.name }}</h4>
                  </div>
                  <section class="jobpost-list__content employee">
                    <div class="column">
                      <p class="vacancy-meta">
                        <i class="fas fa-clock vacancy-icon"></i>
                        {{ $t(item['function_template']['working_hours']) }}
                      </p>
                      <p class="vacancy-meta">
                        <i class="fal fa-calendar vacancy-icon"></i>
                        <span v-if="item.is_permanent">{{ $t('Permanent') }}</span>
                        <span v-if="!item.is_permanent">{{ $t('Temporary runs on') }} <ElementsDateRange :dateRange="item"/></span>
                      </p>
                    </div>
                    <div class="column">
                      <p class="vacancy-meta">
                        <i class="fal fa-suitcase vacancy-icon"></i>
                        {{ item.function.name }}
                      </p>
                      <p class="vacancy-meta">
                        <i class="fal fa-map-marker-alt vacancy-icon"></i>
                        {{ item.street }} {{ item['house_number'] }},<br>
                        {{ item.postalcode }} {{ item.city }}
                      </p>
                    </div>
                    <div class="column">
                      <p class="vacancy-meta__read-more vacancy-meta__read-more--negative-top-margin">
                        <i class="fas fa-chevron-right vacancy-icon vacancy-icon--bg-orange vacancy-icon--small vacancy-icon--no-margin"></i>
                      </p>
                    </div>
                  </section>
                </div>
              </NuxtLink>
            </div>
          </template>
        </ais-hits>
        <div v-else>
          <div class="page__wrapper">
            <section class="page__content page__centered">
              <h2 class="no-results">{{ $t('Geen resultaten gevonden') }}</h2>

              <!-- <p v-if="noResultsText">{{ noResultsText }}</p> -->
              <ais-clear-refinements :excluded-attributes="[]">
                <template v-slot:resetLabel>{{ $t('Filters wissen') }}</template>
              </ais-clear-refinements>
            </section>
          </div>
        </div>
      </template>
    </ais-state-results>
  </div>
</template>

<script setup>
import { AisClearRefinements, AisHits, AisStateResults } from 'vue-instantsearch/vue3/es';
import { addStateToRoute } from '~/helpers/instantsearch.js';
const { locale, availableLocales } = useI18n();

const getImage = item => item.function_template?.ambiance_picture || item.employer?.picture || item.employer?.logo;

</script>