<template>
    <div class="c-nav__inner" :class="{ toggled }">
        <div class="c-nav__logo-and-toggle">
            <div class="c-nav__logo-container" v-if="logo">
                <NuxtLink :to="localePath('/')" class="logo">
                    <img :src="logo.src" :alt="logo.alt">
                </NuxtLink>
            </div>
            <div class="c-nav__language-switcher-and-toggle">
                <div class="c-nav__mobile-language-switcher">
                    <ElementsNavigationLanguage />
                </div>
                <a :class="`c-nav-mobile-button c-nav-mobile-button--${toggled ? 'closed' : 'open'}`" @click="toggle()">
                    <i :class="`far fa-${toggled ? 'times' : 'bars'}`" />
                </a>
            </div>
        </div>

        <div class="c-nav__wrapper">
            <div class="c-nav__desktop-language-switcher">
                <ElementsNavigationLanguage />
            </div>

            <template v-if="items && items.length > 0">
                <!-- desktop -->
                <ul class="c-nav__inline-nav rtl">
                    <li class="c-nav__inline-nav-item" v-for="item in items">
                        <ElementsNavigationItem :item="item" @childData="handleClick"/>
                    </li>
                </ul>
                <!-- mobile -->
                <div class="c-nav__menu-wrapper">
                    <ElementsNavigationItem :item="item" v-for="item in items" @childData="handleClick"/>
                    <NuxtLink :to="localePath('/inloggen')" class="login c-btn c-btn--as-text-link" @click="toggle()">
                        {{ $t("Inloggen") }}
                    </NuxtLink>
                </div>
            </template>
            <!-- desktop -->
            <ul class="c-nav__sub-nav rtl">
                <li class="c-nav__sub-nav-item">
                    <NuxtLink :to="localePath('/inloggen')" class="login c-btn c-btn--as-text-link">
                        {{ $t("Inloggen") }}
                    </NuxtLink>
                </li>
                <li class="c-nav__sub-nav-item">
                    <NuxtLink :to="localePath('/registreren')" target="_self"
                        class="c-btn color-default background-default border-default c-btn is-small">
                        {{ $t("Registreren") }}
                    </NuxtLink>
                </li>
            </ul>
            <!-- mobile -->
            <div class="c-nav__mobile-register-button">
                <NuxtLink :to="localePath('/registreren')" target="_self"
                    class="c-btn color-default background-default border-default c-btn is-small" @click="toggle()">
                    {{ $t("Registreren") }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const { locale, availableLocales } = useI18n();

const props = defineProps({
    logo: {
        type: Object,
        default: { src: "", alt: "logo" },
        required: false,
    },
    menuItems: {
        type: [Object],
        default: [],
        required: true,
    }
});

const toggled = ref(false);
const items = ref();

onMounted(() => {
    items.value = props.menuItems;
})

const toggle = () => {
    toggled.value = !toggled.value;

    const htmlClasslist = document.documentElement.classList;
    toggled.value ? htmlClasslist.add("disable-scroll") : htmlClasslist.remove("disable-scroll");
}

const handleClick = (data) => {
    toggled.value = data;
};

</script>