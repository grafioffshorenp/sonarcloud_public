<template>
    <div>
        <div class="l-container">
            <div class="page search-page">
                <ais-instant-search class="page__box" :index-name="indexName" :search-client="algolia" :initial-ui-state="uiState">
                    <aside class="page__sidebar">
                        <ElementsVacanciesFilterList :filters="filters" />
                    </aside>
                    <div class="page__wrapper clear-background" id="hits-page-wrapper">
                        <div id="stats">
                            <ElementsVacanciesStats type="employees" />
                        </div>
                        <div id="hits">
                            <ElementsTalentsHits />
                        </div>
                        <div id="pagination">
                            <ais-hits-per-page class="mr-4" :items="perPageItems" />
                            <ais-pagination :items-per-page="perPage" @update:items-per-page="handleItemsPerPageUpdate" />
                        </div>
                    </div>
                </ais-instant-search>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
  AisHits,
  AisHitsPerPage,
  AisInstantSearch,
  AisPagination,
  AisRefinementList,
  AisSearchBox,
  AisStats,
  createServerRootMixin,
} from 'vue-instantsearch/vue3/es';
import { renderToString } from 'vue/server-renderer';

const config = useRuntimeConfig();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { status } = useAuth();
const authenticated = status.value === 'authenticated';

const perPageItems = [
  { label: '10', value: 10 },
  { label: '20', value: 20, default: true },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

definePageMeta({
  middleware: 'auth',
});

const filters = [
  { type: 'search', title: 'Zoek (op trefwoord)' },
  { type: 'checkbox', attribute: 'working_hours', title: 'Working hours' },
  { type: 'checkbox', attribute: 'work_type', title: 'Work type' },
  { type: 'checkbox', attribute: 'work_experiences.industry.name', title: 'Industry' },
  { type: 'checkbox', attribute: 'work_experiences.function.name', title: 'Function' },
  { type: 'checkbox', attribute: 'educations.level', title: 'Educations' },
  { type: 'checkbox', attribute: 'language_levels.lang', title: 'Talen' },
  {
    type: 'numeric', attribute: 'minimum_language_level.value', title: 'Taalniveau', items: [
      { label: t('Alle') },
      { label: t('A1 - Starter'), end: 1 },
      { label: t('A2 - Elementary'), start: 1, end: 2 },
      { label: t('B1 - Intermediate'), start: 2, end: 3 },
      { label: t('B2 - Upper intermediate'), start: 3, end: 4 },
      { label: t('C1 - Expert'), start: 4, end: 5 },
      { label: t('C2 - Mastery (native)'), start: 5 }],
  },
];

const indexName = config.public.algoliaIndexTalents;

const query = route.query.q;
const refinementList = route.query.filters ? JSON.parse(route.query.filters) : undefined;
const page = route.query.page;
const uiState = {
  [indexName]: {
    query,
    refinementList,
    page,
  },
};

const algolia = useAlgoliaRef();

const serverRootMixin = ref(
    createServerRootMixin({
      searchClient: algolia,
      indexName,
    }),
);

const { instantsearch } = serverRootMixin.value.data();
provide('$_ais_ssrInstantSearchInstance', instantsearch);

onBeforeMount(() => {
  // Use data loaded on the server
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value);
  }
});

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
  if (process.server) {
    const nuxtApp = useNuxtApp();
    nuxtApp.$algolia.transporter.requester = (
        await import('@algolia/requester-node-http').then(
            (lib) => lib.default || lib,
        )
    ).createNodeHttpRequester();
  }
  return instantsearch.findResultsState({
    // IMPORTANT: a component with access to `this.instantsearch` to be used by the createServerRootMixin code
    component: {
      $options: {
        components: {
          AisInstantSearchSsr,
          AisIndex,
          AisConfigure,
          AisRefinementList,
          AisHits,
          AisHighlight,
          AisSearchBox,
          AisStats,
          AisPagination,
        },
        data() {
          return { instantsearch };
        },
        provide: { $_ais_ssrInstantSearchInstance: instantsearch },
        render() {
          return h(AisInstantSearchSsr, null, () => [
            // Include any vue-instantsearch components that you use including each refinement attribute
            h(AisHits),
          ]);
        },
      },
    },
    renderToString,
  });
});
</script>

<style scoped lang="scss">
#pagination {
  padding: 1rem 0;
  display: flex;
}
</style>