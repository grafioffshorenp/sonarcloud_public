<template>
  <div>
    <ais-state-results>
      <template v-slot="{ results: { hits }, state }">
        {{ addStateToRoute(state, $router, $route) /* Hacky way to add the state to the url */ }}
        <ais-hits class="jobpost-list" ref="searchResults" v-if="hits.length > 0">
          <template v-slot="{ items }">
            <div class="talentsearch-list__item" v-for="item in items" :key="item.objectID">
              <NuxtLink :to="localePath(`/talents/${item.objectID}`)" class="talentsearch-list__link">
                <div class="talentsearch-list__wrapper">
                  <!-- TODO: should give a percentage of selected skills + skills of profile -->
                  <header v-if="item.first_name === 'anonymous'" class="talentsearch-list__header capitalize">
                    <h3>{{ $t('anonymous') }}</h3>
                  </header>
                  <header v-else class="talentsearch-list__header">
                    <div class="image-div">
                      <div v-if="item.profile_picture" class="circle-image">
                        <img
                            :src='`${baseUrl}${item.profile_picture}`'
                            alt="Profile Image"
                        />
                      </div>
                      <div v-else class="circle-image img picture bg-fallback-employee">
                      </div>
                    </div>
                    <div class="name-lastname-div">
                      <h3 style="text-transform: capitalize; padding-bottom: 1rem;">{{ item.first_name }} {{ item.last_name }}</h3>
                      <p class="talentsearch-meta">
                        <i class="fal fa-map-marker-alt vacancy-icon"></i>
                        {{ item.region }}
                      </p>
                    </div>
                  </header>

                  <section class="talentsearch-list__content">
                    <p v-if="item.first_name === 'anonymous'" class="talentsearch-meta">
                      <i class="fal fa-map-marker-alt vacancy-icon"></i>
                      {{ item.region }}
                    </p>

                    <div class="column">
                      <div class="talentsearch-meta--wide">
                        <h4 class="talentsearch-meta__section-title">{{ $t('Recente werkervaring') }}</h4>
                        <ul v-if="item.work_experiences && item.work_experiences.length > 0">
                          <li class="u-mb-small" v-for="experience in item.work_experiences" :key="experience">
                            <p class="talentsearch-meta">
                              <i class="fal fa-suitcase talentsearch-icon"></i>
                              <strong class="talentsearch-meta--strong mr-2">{{
                                  experience.function_title !== 'N/A' ? experience.function_title : ''
                                }}
                              </strong>
                              {{ experience.from_date }} - {{ experience.to_date }}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="column">
                      <div>
                        <h4 class="talentsearch-meta__section-title">{{ $t('Taalniveau') }}</h4>
                        <ul class="l-inline-items l-inline-items--wrap">
                          <li class="u-mb-small" v-for="language in item.language_levels" :key="language.lang">
                            <div class="c-pill c-pill--selected">{{ language.lang }} {{ language.label }}</div>
                          </li>
                        </ul>
                      </div>

                      <p class="talentsearch-meta talentsearch-meta__read-more">
                        <span>{{ $t('Bekijk profiel') }}</span>
                        <i class="fas fa-chevron-right talentsearch-icon talentsearch-icon--bg-orange talentsearch-icon--right-aligned"></i>
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
const config = useRuntimeConfig();

const baseUrl = config.public.rwEnv === 'production' ?
    'https://np-rw-api-production.s3-eu-west-1.amazonaws.com/' :
    'https://np-rw-api-develop.s3-eu-west-1.amazonaws.com/';

</script>
