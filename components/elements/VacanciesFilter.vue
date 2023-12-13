<template>
    <section class="panel show-after-load">
        <a class="panel__anchor" @click="toggle">
            {{ title }}
            <i :class="expanded ? 'far fa-window-minimize expanded' : 'fal fa-plus'"></i>
        </a>
        <div v-show="expanded">
          <ais-refinement-list v-if='attribute === "function_template.working_hours" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "function_template.work_type" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "language_levels.lang" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "industry.name" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "function.name" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "minimum_education_level" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ $t(item.value) }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
          <ais-refinement-list v-if='attribute === "is_permanent" && type === "checkbox"' :attribute="attribute" :searchable="searchable">
            <template #default="{ items, refine }">
              <ul>
                <li v-for="item in items" :key="item.value">
                  <label class="ais-RefinementList-label">
                    <input type="checkbox" :id="item.value" :value="item.value" :checked="item.isRefined" @change="refine(item.value)" >
                    <span class="ais-RefinementList-labelText">
                                    <span :for="item.value" class="ais-Highlight">{{ item.value === 'true' ? $t('Permanent') : $t('Tijdelijk') }}</span>
                                </span>
                    <span class="ais-RefinementList-count">{{ item.count }}</span>
                  </label>
                </li>
              </ul>
            </template>
          </ais-refinement-list>
            <ais-refinement-list :attribute="attribute" :searchable="searchable" v-if="type === 'checkbox' && attribute !== 'language_levels.lang' && attribute !== 'is_permanent' && attribute !== 'industry.name' && attribute !== 'function.name' && attribute !== 'function_template.working_hours' && attribute !== 'function_template.work_type' && attribute !== 'minimum_education_level'" />
            <ais-search-box :placeholder="title" v-if="type === 'search'" />
            <ais-numeric-menu v-if="type === 'numeric'" :attribute="attribute" :items="items" />
            <template v-if="type === 'range'">
                <ElementsVacanciesFilterZipcode />
            </template>
        </div>
    </section>
</template>

<script setup>
import { AisRefinementList, AisSearchBox, AisNumericMenu } from 'vue-instantsearch/vue3/es';
import { ParseLanguageName } from '@/helpers/languagesHelper';

const props = defineProps({
    items: {
        type: Array,
        default: [],
        required: false,
    },
    attribute: {
        type: String,
        default: "",
        required: false,
    },
    title: {
        type: String,
        default: "",
        required: true,
    },
    type: {
        type: String,
        default: "",
        required: true,
    },
    searchable: {
        required: false,
        default: false,
        type: Boolean
    },
});

const expanded = ref(true);

const toggle = () => {
    expanded.value = !expanded.value;
}

</script>
