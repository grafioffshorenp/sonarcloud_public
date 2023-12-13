<template>
    <div v-if="application" class="jobpost-details">

        <section class="page-details__section columns">
            <div class="column">
                <div class="c-company">
                    <div v-if="application['function_template'].logo" class="c-company__image">
                        <img :src="application['function_template'].logo" :alt="application.employer.name" />
                    </div>
                    <div v-else class="c-company__fallback-icon">
                        <i class="fas fa-building" />
                    </div>
                    <div class="c-company__details">
                        <p class="t-text t-text--bolder">{{ application.employer.name }}</p>
                    </div>
                </div>
            </div>
            <div class="column column--alt-position">
                <div class="column--dashed-border-top"></div>
            </div>
            <div class="page-details__properties column">
                <p class="header">Function</p>
                <p class="body">{{ application.function.name }}</p>
                <p v-if="application.function.name !== application.function_template.name" class="t-text">
                    {{ application.function_template.name }}
                </p>
            </div>
            <div class="page-details__properties column" >
              <div v-if="!application.is_permanent">
                <p class="header">Date</p>
                <p class="body">
                    <ElementsDateRange :dateRange="application" />
                </p>
                </div>
              <div v-else>
                <p class="body">
                    {{ $t("Permanent") }}
                </p>
              </div>
            </div>
            <div v-if="application.type !== 'job' && application.schedule.length" class="page-details__properties column">
                <p class="header">{{ $t("Tijd") }}</p>
                <p class="body">{{ application.schedule[0].start }} tot {{ application.schedule[0].end }} uur</p>
            </div>
            <div class="page-details__properties column" v-if="application">
                <p class="header">{{ $t("Address") }}</p>
                <p class="body">
                    <span class="pre-line">
                      {{ application.street }} {{ application.house_number }}{{ application.house_number_ext }}<br />
                      {{ application.postalcode }}, {{ application.city }}
                    </span>
                </p>
            </div>
            <div v-if="application.travel_allowance && application.travel_allowance_type === 'distance'"
                class="page-details__properties column">
                <p class="header">{{ "Reiskostenvergoeding" }}</p>
                <p class="body">&euro; {{ getAmount(application.travel_allowance) }} {{ $t("p/km") | $t("text") }}</p>
            </div>

            <div v-if="application.employer.phone" class="page-details__properties column">
                <p class="header">{{ $t("Telefoonnummer") }}</p>
                <p class="body">{{ application.employer.phone }}</p>
            </div>

            <div v-if="application.employer.email" class="page-details__properties column">
                <p class="header">{{ $t("E-mailadres") }}</p>
                <p class="body">{{ application.employer.email }}</p>
            </div>
        </section>
        <div class="jobpost-details__group">
            <ElementsVacancyDetails :vacancy="application" />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    application: {
        type: Object,
        default: null,
        required: true,
    }
});

const getAmount = (amount) => {
  if (amount.toString().indexOf(".") > -1) {
    amount = Number(amount).toFixed(2);
  }
  return amount.toString().replace(".", ",");
};

</script>

<style lang="scss" scoped>
.page-details {
    .page__footer {
        .btn {
            margin: 0;

            @include until-desktop-wide {
                max-width: 100%;
            }

            @include desktop-wide {
                margin-left: auto;
            }
        }
    }

    &__title {
        margin-bottom: 12px;
    }

    .page-details__section {
        border-bottom: 1px solid $border-color-light;
        border-radius: 5px;
        box-shadow: $box-shadow;
        display: flex;
        flex-direction: column;
        padding: 24px;

        @include until-tablet {
            background: $white;
        }

        @include tablet {
            border-radius: 0;
            box-shadow: none;
            margin-bottom: 32px;
            padding: 0;
        }

        &--more-bottom-padding {
            padding-bottom: 24px;
        }

        &--no-bottom-border {
            border-bottom: none;
        }

        &--stroke {
            border-bottom: none;

            &::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -2px;
                width: 100%;
                height: 2px;
                background-color: $lightest-grey;

                @include until-tablet {
                    width: calc(100% - 48px);
                    margin-left: 24px;
                }
            }
        }

        h2 {
            font-size: 24px;
            margin-bottom: 24px;

            &:not(:first-of-type) {
                @include tablet {
                    margin-top: 28px;
                }
            }
        }

        table {
            margin-top: 16px;
            margin-bottom: 24px;

            @include tablet {
                display: block;
            }

            th {
                color: $dark-grey;
                padding-bottom: 16px;
            }

            tr {
                &.disabled {
                    td {
                        color: $lightest-grey;
                    }
                }
            }
        }

        >img,
        >.img,
        >div>img,
        >div>.img {
            display: block;
            margin: 0 auto 16px auto;

            ~h2 {
                margin: 0;
            }
        }

        p.accept-label {
            display: none;
            color: $header-color;
            font-family: $primary-font;
            font-weight: 600;
            margin-bottom: 16px;

            &.accepted,
            &.contracted,
            &.rejected {
                align-items: center;
                display: flex;
                justify-content: center;

                i {
                    font-size: 24px;
                    margin-right: 8px;
                }
            }

            @include tablet {
                margin-bottom: 24px;
            }
        }

        p.repeat-schedule {
            margin-bottom: 0;
        }

        &--centered {
            align-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
        }

        .columns-row {
            display: flex;
            flex-direction: column;

            @include tablet {
                flex-direction: row;
            }

            @include desktop {
                flex-direction: column;
            }

            @include desktop-wide {
                flex-direction: row;
            }
        }

        &.columns,
        .columns {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
        }

        .column {
            display: flex;
            flex-direction: column;
            margin-bottom: 24px;
            width: calc(50% - 8px);

            &:first-of-type {
                @include until-tablet {
                    margin-top: 0;
                }
            }

            @include tablet {
                width: calc(50% - 16px);
            }

            @include desktop {
                width: calc(50% - 24px);
            }

            &--wide {
                width: 100%;

                @include tablet {
                    margin-bottom: 24px;
                }
            }

            &--narrow {
                width: calc(33% - 8px);

                @include tablet {
                    width: calc(33% - 16px);
                }

                @include desktop {
                    width: calc(33% - 24px);
                }
            }

            &--single {
                @include until-tablet {
                    width: 100%;
                }

                @include tablet {
                    margin-top: 0;
                }

                @include desktop {
                    margin-top: 12px;
                    width: 100%;
                }

                @include desktop-wide {
                    margin-top: 0;
                    width: calc(50% - 24px);
                }
            }
        }
    }

    &__properties {
        margin-bottom: 10px;

        .header,
        .body {
            margin: 0;
        }

        .header {
            color: $grey;
            font-size: 14px;
            line-height: 140%;
        }

        .body {
            color: $dark-grey;
            font-weight: 500;
            word-break: break-word;

            &--light {
                font-weight: 400;
            }
        }

        .experience {
            display: block;
            line-height: 120%;

            &:first-of-type {
                margin-top: 3px;
            }

            &:not(:last-of-type) {
                margin-bottom: 8px;
            }
        }
    }

    table {
        border: none;
        margin-bottom: 0;

        th,
        td {
            background: none;
            border: none;
            padding: 4px 0;

            &:not(:last-of-type) {
                padding-right: 32px;
            }
        }

        th {
            padding-bottom: 5px;
        }
    }
}

.page__sidebar {
    .panel__anchor {
        i {
            color: $icon-color-alt;
        }
    }
}

.page-edit-vacancy,
.page-create-template {
    .page-details {
        form {
            margin-top: 40px;
        }
    }

    .page__sidebar {
        margin-bottom: 16px;

        @include tablet {
            margin-bottom: 32px;
        }

        .page__content {
            margin: 0;
        }
    }

    .page__content.panel {
        .panel__anchor {
            font-family: $primary-font;
            font-weight: 600;
            margin: 0;

            &.expanded {
                margin-bottom: 24px;
            }

            i {
                @include desktop {
                    display: none;
                }
            }

            @include desktop {
                pointer-events: none;
            }
        }

        p {
            margin-bottom: 0;
        }
    }
}

// I have to use !important because we are in specificity hell in the code above.

.page-details {
    &__section {
        &--hide-bottom {
            border-bottom: none !important;
            margin-bottom: 0 !important;
        }
    }
}
</style>