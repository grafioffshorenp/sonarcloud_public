<template>
    <div class="my-applications-header">
            <div class="table__row table__row--transparent-bg desktop-only">
                <div class="table__column">
                    <div class="table__cell" v-if="headers[0]">
                        <p class="table__title">
                            {{ $t(headers[0]) }}
                        </p>
                    </div>
                </div>
                <div class="table__column">
                    <div class="table__cell" v-if="headers[1]">
                        <p class="table__title">
                            {{ $t(headers[1]) }}
                        </p>
                    </div>
                </div>
                <div class="table__column">
                    <div class="table__cell" v-if="headers[2]">
                        <p class="table__title">
                            {{ $t(headers[2]) }}
                        </p>
                    </div>
                    <div class="table__cell" v-if="headers[3]">
                        <p class="table__title">
                            {{ $t(headers[3]) }}
                        </p>
                    </div>
                    <div class="table__cell" v-if="headers[4]">
                        <p class="table__title">
                            {{ $t(headers[4]) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
const props = defineProps({
    headers: {
        type: Array,
        default: [],
        required: true,
    }
});
</script>

<style lang="scss" scoped></style>