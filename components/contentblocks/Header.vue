<template>
    <header class="c-general-header" v-if="data">
        <div class="c-general-header__main">
            <div class="c-general-header__content">
                <div class="u-mb-small" v-if="data.title">
                    <h1 class="t-title-1 t-title-1--white">{{ data.title }}</h1>
                </div>
                <h2 class="t-text t-text--white" v-if="data.subtitle">{{ data.subtitle }}</h2>
                <div class="u-mt-medium-big c-general-header__action" v-if="router.currentRoute.value.name.includes('index__')">
                  <ElementsHeaderSearchForm :list="industries.data" :vacancies-url="'/vacancies'" />
                </div>
                <div class="u-mt-medium-big c-general-header__action" v-if="data.callToAction && data.callToAction.length > 0 && data.callToAction[0].buttonLink">
                    <NuxtLink class="c-btn" :to="localePath(usePath().getSlug(data.callToAction[0].buttonLink.url))">{{
                        data.callToAction[0].buttonLink.text }}</NuxtLink>
                </div>
            </div>
            <div class="c-general-header__visual" v-if="data.images && data.images.length > 0">
                <!-- TODO get source set -->
                <picture>
                    <!-- <source
                        :srcset="data.images[0].url"
                        media="(min-width: 2000px)">
                    <source
                        :srcset="data.images[0].url"
                        media="(min-width: 1600px)"> -->
                    <img :src="data.images[0].url" alt="Header background image">
                </picture>
            </div>
        </div>
        <div class="c-general-header__wave-bar">
            <div class="c-general-header__wave-filler c-general-header__wave-filler--left"></div>
            <img src="@/assets/svg/header-wave-mobile.svg" class="c-general-header__wave-mobile" alt="Wave mobile">
            <img src="@/assets/svg/header-wave-desktop.svg" class="c-general-header__wave-desktop" alt="Wave desktop">
            <div class="c-general-header__wave-filler c-general-header__wave-filler--right"></div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: null,
        required: true,
    },
});
const router = useRouter();

// TODO when there are vacancies set on TRUE
let industries = await useRWApi('/industries?include=functions&excludeResultsWithoutJobPosts=false', 'GET');
</script>

<style lang="scss" setup>
    $compontent: 'c-general-header';

    .#{$compontent} {
        &__action {
            position: relative;
            z-index: 1;
        }
    }
</style>