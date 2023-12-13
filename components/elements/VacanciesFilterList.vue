<template>
    <section id="filter-panel" class="panel show-after-load page__content">
        <a class="panel__anchor parent expanded" @click="toggle()">
            {{ $t("Filters") }}
            <i class="fas expanded" :class="expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </a>
        <div class="panel__details" :class="{'expanded': expanded}">
            <template v-for="filter in filters">
                <ElementsVacanciesFilter :type="filter.type" :attribute="filter.attribute" :title="$t(filter.title)"
                    :items="filter.items" :searchable="filter.searchable"/>
            </template>

            <ais-clear-refinements>
                <template v-slot:resetLabel>{{ $t("Filter wissen") }}</template>
            </ais-clear-refinements>
        </div>

    </section>
</template>

<script setup>
import { AisClearRefinements } from 'vue-instantsearch/vue3/es';

const props = defineProps({
    filters: {
        type: Array,
        default: [],
        required: true,
    },
});

const expanded = ref(false);

const toggle = () => {
    expanded.value = !expanded.value;
}
</script>

<style lang="scss">
.ais-Pagination-item.ais-Pagination-item--page:not(.ais-Pagination-item--previousPage):not(.ais-Pagination-item--firstPage):not(.ais-Pagination-item--nextPage):not(.ais-Pagination-item--lastPage):not(.ais-Pagination-item--selected) {
    @include until-desktop {
        display: none;
    }
}

.panel__details {
    @include desktop {
        display: block !important;

        &.expanded {
            display: block !important;
        }
    }

    @include until-desktop {
        display: none;

        &.expanded {
            display: block;
        }
    }
}
</style>