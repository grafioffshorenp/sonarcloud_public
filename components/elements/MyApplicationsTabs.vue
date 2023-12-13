<template>
    <div class="my-applications-tabs margin-bottom">
        <div class="jobposts-header">
            <div :class="['filter-bar', { collapsed: !dropdownExpanded }]">
                <ul class="filter-bar__options desktop-only">
                    <li class="filter-bar__option filter-bar__option--active"
                        :class="[tab.value === selectedTab.value ? 'filter-bar__option--active' : '']" @click="setTab(tab)"
                        v-for="tab in tabs" :key="tab.value">
                        <p class="filter-bar__text"
                            :class="[tab.value === selectedTab.value ? 'filter-bar__text--active' : '']">
                            {{ $t(tab.name) }}
                        </p>
                    </li>
                </ul>
                <ul class="filter-bar__options until-desktop-only" v-if="dropdownExpanded">
                    <li v-for="tab in tabs" :key="tab.value" class="filter-bar__option" @click="setTab(tab)"
                        :class="[tab.value === selectedTab.value ? 'filter-bar__option--active' : '']">
                        <p class="filter-bar__text"
                            :class="[tab.value === selectedTab.value ? 'filter-bar__text--active' : '']">
                            {{ $t(tab.name) }}
                        </p>
                    </li>
                </ul>
                <ul v-else class="filter-bar__options until-desktop-only">
                    <li class="filter-bar__option" @click="toggleDropdown">
                        <p class="filter-bar__text filter-bar__text--active">
                            {{ $t(selectedTab.name) }}
                        </p>
                    </li>
                </ul>
                <i :class="`far fa-chevron-${dropdownExpanded ? 'up' : 'down'} filter-bar__dropdown-icon filter-bar__dropdown-icon--hide-desktop`"
                    @click="toggleDropdown"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    tabs: {
        type: Array,
        default: [],
        required: true,
    }
});

const emit = defineEmits(['select-tab'])

let selectedTab = ref(props.tabs[0]);
let dropdownExpanded = ref(false);

const toggleDropdown = () => {
    dropdownExpanded.value = !dropdownExpanded.value;
}

const setTab = (tab) => {
    emit("select-tab", tab);
    selectedTab.value = tab;
    dropdownExpanded.value = false;
}
</script>

<style lang="scss" scoped></style>