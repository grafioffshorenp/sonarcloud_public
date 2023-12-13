<template>
    <div v-for="job in applications" :key="job.jobPost.id" class="table__row table__row--clickable"
        @click.stop="goToShift(job)" v-if="applications && applications.length">
        <div class="table__column table__column--mobile-row">
            <div class="table__cell table__cell--full-width">
                <p class="table__text table__text--large-mobile table__text--primary-mobile table__text--color">
                    <strong>{{ job.jobPost.function.name }}</strong>
                </p>
                <p v-if="job.jobPost.function.name !== job.jobPost.function_template.name"
                    class="table__text table__text--small">
                    {{ job.jobPost.function_template.name }}
                </p>
                <p class="table__text table__text--small">{{ address }}</p>
            </div>
            <div class="table__cell table__cell--narrow table__cell--no-padding table__cell--ellipsis">
                <i v-click-outside="hideOptions" class="fas fa-ellipsis-v table__ellipsis" @click.stop="toggleOptions"></i>
            </div>
        </div>
        <div class="table__column table__column">
            <div class="table__cell table__cell--mobile-stretch">
                <p class="table__text table__text--no-break table__text--small">
                    <i class="fal fa-calendar table__info-icon"></i>{{ formatDate(job.jobPost.start_date) }}
                    {{ $t("t/m") }}
                    <br class="desktop-only" />
                    {{ formatDate(job.jobPost.end_date) }}
                </p>
            </div>
        </div>
        <div class="table__column table__column--mobile-row table__column--no-margin table__column--light-bg flex-wrap">
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
                <p class="table__text">{{ $t("Work type") }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding">
                <p :class="['table__text table__text--centered table__text--primary-desktop']">
                    <strong>{{ job.jobPost.function_template.work_type }}</strong>
                </p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
                <p class="table__text">{{ $t("Working hours") }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding">
                <p :class="['table__text table__text--centered table__text--primary-desktop']">
                    <strong>{{ job.jobPost.function_template.working_hours }}</strong>
                </p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
                <p class="table__text">{{ $t("Status") }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding">
                <p :class="['table__text table__text--centered table__text--primary-desktop']">
                    <i :class="['fa', 'fa-' + statusIcon(job.status)]" />
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from "moment";

const props = defineProps({
    applications: {
        type: Array,
        default: [],
        required: true,
    }
});

const router = useRouter();
const { locale, availableLocales } = useI18n();
let showOptions = ref(false);

const address = computed(() => {
    return "";
});

const hideOptions = () => {
    showOptions.value = false;
}

const toggleOptions = () => {
    showOptions.value = !showOptions.value;
}
const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
}

const statusIcon = (status) => {
    if (status === "contracted" || status === "accepted") {
        return "check green";
    } else if (status === "rejected") {
        return "times red";
    }
    return "clock orange";
}

const goToShift = (job) => {
    showOptions.value = false;

    router.push({
        name: `my-account-employee-diensten-id___${locale.value}`,
        params: { id: job.jobPost.id }
    });
}
</script>

<style lang="scss" scoped>
.table__cell {
    &--ellipsis {
        @include desktop {
            display: none;
        }
    }

    @include until-desktop {
        width: 100%;
    }
}

.green {
    color: #22c55e;
}

.red {
    color: #ef4444;
}

.orange {
    color: #f97316;
}

.grey {
    color: #d1d5db;
}</style>