<template>
    <div class="onboarding modal" :class="[{ 'active': onboardingStore.getOnboardingState }]">
        <div class="modal__backdrop">
            <div class="modal__content">

                <div class="onboarding__welcome" :class="{ transition }" v-if="onboardingStore.getCurrentStep === 0">
                    <header class="onboarding__header">
                        <h2>{{ $t("Welkom") }} {{ user.first_name }}</h2>
                        <p>{{ $t("Vul je gegevens aan en vind vandaag je eerste baan.") }}</p>
                        <i class="rounded-icon fas fa-arrow-down" @click="nextStep(true)" />
                    </header>

                    <a class="btn" @click="nextStep(true)">{{ $t("Start") }}</a>
                </div>

                <template v-if="onboardingStore.getCurrentStep > 0">
                    <header class="onboarding__header transparent">
                        <h3 v-if="userStore.user.role === 'employer'">{{ $t("Welkom") }} {{ userStore.user.employer_user.first_name }}!</h3>
                        <h3 v-if="userStore.user.role === 'employee'">{{ $t("Welkom") }} {{ userStore.user.employee.first_name }}!</h3>
                    </header>

                    <ElementsProgressBar :progress="onboardingStore.getProgress + 1" />
                </template>

                <div class="onboarding__page" v-if="!transition && onboardingStore.getCurrentStep > 0">
                    <component :is="`${onboardingStore.getCurrentStepComponent}`" :isOnboarding="true"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const userStore = useUserStore();

const props = defineProps({
    user: {
        type: Object,
        default: null,
        required: true,
    },
    onboardingForms: {
        type: Array,
        default: [],
        required: true,
    },
});

const onboardingStore = useOnboardingStore();
let transition = ref(false);

const nextStep = (delay) => {
    if (delay) {
        transition.value = true;
    }
    setTimeout(
        () => {
            onboardingStore.nextStep();
            transition.value = false;
        },
        delay ? 600 : 0
    );
}


</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 1.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.onboarding {
    &.modal {
        .modal__content:not(.compact) {
            align-items: flex-start;
            justify-content: flex-start;
            text-align: left;
            box-shadow: 0 2px 44px 0 rgba($white, 0.15);

            overflow: hidden;

            @include tablet {
                max-width: 768px;
            }
        }
    }

    &__page {
        animation: fadein 0.1s;
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 100%;

        :deep(form) {
            flex: 1;

            .input-row {
                &:first-of-type {
                    @include tablet {
                        margin-top: 0;
                    }
                }
            }
        }
    }

    &__header {
        align-items: center;
        background: $teal-dark;
        border-radius: 5px 5px 0 0;
        display: flex;
        justify-content: space-between;
        margin: -24px -24px 0 -24px;
        overflow: hidden;
        padding: 12px 24px;
        width: calc(100% + 48px);

        @include tablet {
            margin: -32px -32px 0 -32px;
            padding: 20px 32px;
            width: calc(100% + 64px);
        }

        h2 {
            font-family: $font-title;
        }

        h2,
        h3,
        p,
        .rounded-icon {
            animation: fadein 0.1s;
            color: $white;
            margin: 0;
            z-index: 1;
        }

        h3 {
            font-weight: 600;
        }

        &.transparent {
            background: $background-light;

            h2,
            h3,
            p,
            .rounded-icon {
                color: $color-first;
            }
        }
    }

    :deep(.progress-bar) {
        margin-bottom: 24px;
        width: calc(100% + 64px);
    }

    &__welcome {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 100%;
        min-height: 704px;

        &.transition {
            header {
                flex: 0;
                height: 68px;
                position: absolute;

                >*,
                +.btn {
                    opacity: 0;
                }
            }
        }

        header {
            text-align: center;
            flex: 1;
            flex-direction: column;
            height: calc(100% - 100px);
            justify-content: center;
            left: 0;
            padding: 32px;
            position: absolute;
            top: 0;
            transition: height 0.3s ease;

            @include tablet {
                height: calc(100% - 100px);
            }

            h2,
            p {
                margin: 0 auto;
                max-width: 480px;
            }

            h2,
            p+.btn {
                opacity: 1;
                transition: opacity 0.2 ease;
            }

            h2 {
                font-size: 24px;
                margin-bottom: 16px;

                @include tablet {
                    font-size: 56px;
                    margin-bottom: 24px;
                }
            }

            p {
                font-family: $font-body;
                font-size: 16px;
                margin-bottom: 48px;

                @include tablet {
                    font-size: 24px;
                    margin-bottom: 64px;
                }
            }

            .rounded-icon {
                border-color: $white;
                border-width: 3px;
                font-size: 72px;
                height: 120px;
                line-height: 115%;
                width: 120px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        .btn,
        :deep(.btn) {
            margin: auto auto 0 auto;
            width: 100%;

            @include tablet {
                width: 365px;
            }
        }
    }

    .btn:not(:last-child),
    :deep(.btn:not(:last-child)) {
        margin-bottom: 0;
    }

    :deep(.input--submit) {
        .btn:first-of-type:not(:only-of-type) {
            @include tablet {
                bottom: 0;
                left: 0;
                position: absolute;
                width: 96px;
            }
        }

        .btn:nth-of-type(2) {
            margin-left: 16px;

            @include tablet {
                margin: 0 auto;
                max-width: 368px;
            }
        }
    }
}
</style>
