<template>
    <div class="c-language-switcher js-pop-over">
        <Listbox v-model="$i18n.locale">
            <summary class="c-language-switcher__summary">
                <ListboxButton class="header__list-link header__list-link--arrow" @mouseover="">
                    <span class="u-pr-small">{{ $t(locales.find((el) => el.code === $i18n.locale).title) }}</span>
                    <i class="c-language-switcher__icon fas fa-chevron-down"></i>
                </ListboxButton>
            </summary>
            <ListboxOptions class="c-language-switcher__locales-lists">
                <div class="c-language-switcher__locales-list">
                    <ListboxOption
                        class="c-language-switcher__locales-list-item"
                        :class="{'c-language-switcher__locales-list-item--is-active' : locale.code === $i18n.locale}"
                        @click="switchLanguage(locale.code)" v-for="locale in locales" :key="locale.code" :value="locale.code">
                        <span class="t-text t-text--bold">{{ $t(locale.title) }}</span>
                    </ListboxOption>
                </div>
            </ListboxOptions>
        </Listbox>
    </div>
</template>

<script setup>
import { Listbox, ListboxOptions, ListboxOption, ListboxButton } from '@headlessui/vue'

const { locales, setLocale, setLocaleCookie } = useI18n()
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath()

defineProps({

});

let switchLanguage = async (code) => {
    switchLocalePath(code);
    setLocale(code);
    setLocaleCookie(code)
    await navigateTo(localePath(useRoute().path), {external: true});
}
</script>

<style lang="scss" scoped>
.c-language-switcher {
    position: relative;

    margin: 1rem;

    &[open] {
        .c-language-switcher__icon {
            transform: rotate(180deg);
        }

        @media (min-width: $navigation-breakpoint) {
            .c-language-switcher__summary {
                color: $blue;
                font-weight: 900;
            }
        }
    }
}

.c-language-switcher__icon {
    margin-left: 0.2rem;

    transition: transform 0.2s;
}

.c-language-switcher__summary {
    display: flex;
    align-items: center;

    cursor: pointer;

    &::marker,
    &::-webkit-details-marker {
        display: none;
        content: "";
    }
}

.c-language-switcher__locales-lists {
    @include pop-over-menu(-50%, 80%);

    min-width: max-content;
    display: flex;
    flex-direction: column;

    left: initial;
    right: 0;
    z-index: 2;

    padding: 0 1rem;
    box-sizing: border-box;

    transform: initial;

    @include desktop {
        @include pop-over-menu(-50%, 50%);

        flex-direction: row;
        justify-content: space-between;
        min-width: max-content;

        left: 50%;
        right: initial;

        padding: 1.5rem;

        translate: transformx(-50%);
    }
}

.c-language-switcher__locales-list {
    width: 100%;
    list-style-type: none;
    user-select: none;

    &:first-of-type {
        margin: 1rem 0;

        @include desktop {
            margin: 0;
        }
    }
}

.c-language-switcher__locales-list-item {
    display: flex;

    position: relative;

    padding: 1rem;

    border-radius: 50px;

    transition: background 0.2s ease-out;

    @include on-event {
        cursor: pointer;

        background-color: $background-light;

        .t-text {
            color: $blue;
        }
    }

    &--is-active {
        .t-text {
            color: $blue;
        }

        &::after {
            content: "";

            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;

            background-image: url("data:image/svg+xml, #{svg-replace($icon-checkmark, $blue)}");
        }
    }
}

.c-language-switcher__link {
    display: flex;
    align-items: center;

    color: $text-color;
    font-weight: 700;
    text-decoration: none;

    transition: color 0.2s;

    @include on-event {
        color: $blue;
    }
}
</style>