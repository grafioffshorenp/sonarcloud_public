<template>
    <div class="l-container" v-if="data && data.length > 0">
        <div class="c-content-page">
            <div class="c-page-content rtl" v-for="item in data">
                <h3 class="c-page-content__subtitle" v-if="item.subtitle">{{item.subtitle}}</h3>
                <div v-if="item.body" v-html="item.body"></div>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    data: {
        type: Object,
        default: null,
        required: true,
    }
})

</script>