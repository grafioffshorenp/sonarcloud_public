<template>
    <div>
        <div class="l-container">
            <div class="page search-page">
                <ais-instant-search class="page__box" :index-name="indexName" :search-client="algolia" :initial-ui-state="uiState">
                    <aside class="page__sidebar">
                        <ElementsVacanciesFilterList :filters="filters"/>
                    </aside>
                    <div class="page__wrapper clear-background" id="hits-page-wrapper">
                        <div id="stats">
                           <ElementsVacanciesStats type="vacancies"/>
                        </div>
                        <div id="hits">
                            <ElementsVacanciesHits />
                        </div>
                        <div id="pagination">
                            <ais-pagination />
                        </div>
                    </div>
                </ais-instant-search>
            </div>
        </div>
    </div>
</template>

<script setup>
import { createServerRootMixin } from 'vue-instantsearch/vue3/es'
import { renderToString } from 'vue/server-renderer'
import { AisInstantSearch, AisSearchBox, AisHits, AisStats, AisPagination, AisRefinementList } from 'vue-instantsearch/vue3/es'
import { getStateFromRoute } from '~/helpers/instantsearch.js';

const config = useRuntimeConfig();
const route = useRoute();

const filters = [
    { type: 'search', title: 'Search' },
    { type: 'range', title: 'Locatie' },
    { type: 'checkbox', attribute: 'function_template.working_hours', title: 'Working hours' },
    { type: 'checkbox', attribute: 'function_template.work_type', title: 'Work type' },
    { type: 'checkbox', attribute: 'industry.name', title: 'Branches' },
    { type: 'checkbox', attribute: 'function.name', title: 'Functies' },
    { type: 'checkbox', attribute: 'languages', title: 'Talen' },
    {
      type: 'numeric', attribute: 'minimum_language_level_value', title: 'Taalniveau', items: [
        { label: "Alle" },
        { label: "A1 - Starter", end: 1 },
        { label: "A2 - Elementary", start: 1, end: 2 },
        { label: "B1 - Intermediate", start: 2, end: 3 },
        { label: "B2 - Upper intermediate", start: 3, end: 4 },
        { label: "C1 - Expert", start: 4, end: 5 },
        { label: "C2 - Mastery (native)", start: 5 }]
    },
    { type: 'checkbox', attribute: 'minimum_education_level', title: 'Opleidingsniveau' },
    { type: 'checkbox', attribute: 'is_permanent', title: 'Tijdelijk/permanent' },
]

const indexName = config.public.algoliaIndexJobposts
const algolia = useAlgoliaRef()
const uiState = {
  [indexName]: getStateFromRoute(route),
};

const serverRootMixin = ref(
    createServerRootMixin({
        searchClient: algolia,
        indexName,
    }),
)
const { instantsearch } = serverRootMixin.value.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

onBeforeMount(() => {
    // Use data loaded on the server
    if (algoliaState.value) {
        instantsearch.hydrate(algoliaState.value)
    }
})

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
    if (process.server) {
        const nuxtApp = useNuxtApp();
        nuxtApp.$algolia.transporter.requester = (
            await import('@algolia/requester-node-http').then(
                (lib) => lib.default || lib
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
})


</script>

<style scoped lang="scss">
#pagination {
    padding: 1rem 0;
}
</style>