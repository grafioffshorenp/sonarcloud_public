<template>
    <div>
        <ais-stats>
            <template v-slot="{ hitsPerPage, nbPages, nbHits, page, processingTimeMS, query }">
                <div class="jobpost-list__stats">
                    <p class="totals">
                        <span class="totals__number">{{ nbHits }}</span>
                        <span v-if="nbHits > 1">
                          &nbsp;{{ $t(`${textPlural} gevonden`) }}
                        </span>
                        <span v-else>
                          &nbsp;{{ $t(`${textSingular} gevonden`) }}
                        </span>
                    </p>
                </div>
            </template>
        </ais-stats>
    </div>
</template>

<script setup>
import { AisStats } from 'vue-instantsearch/vue3/es'

const props = defineProps({
    type: {
        type: String,
        default: "vacancies",
        required: false,
    },
});

const textPlural = computed(() => {
  if (props.type === 'vacancies') {
    return 'Vacatures'
  } else if (props.type === 'employees') {
    return 'Werknemers'
  }

  return 'Resultaten'
});

const textSingular = computed(() => {
  if (props.type === 'vacancies') {
    return 'Vacature'
  } else if (props.type === 'employees') {
    return 'Werknemer'
  }

  return 'Resultaten'
});
</script>