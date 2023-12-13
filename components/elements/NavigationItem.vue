<template>
    <ul class="c-nav__menu">
        <li class="c-nav__links-list-item" v-if="item.blockUrl">
            <NuxtLink :to="localePath(usePath().getSlug(item.blockUrl.url))" target="_self" class="t-nav__link" @click="toggle">
                {{ item.blockUrl.text }}
            </NuxtLink>
        </li>
        <li class="c-nav__links-list-item" v-else-if="item.blockLinks && item.blockLinks.length > 0">
            <details class="c-nav__link-item-menu js-pop-over" ref="menuBlock" v-click-outside="onClickOutside">
                <summary class="t-nav__summary">
                    <div class="c-nav__link-icon"><i class="fas fa-chevron-down"></i></div>
                    {{ item.blockTitle }}
                </summary>
                <ul class="c-nav__links-list">
                    <li class="c-nav__links-list-item" v-for="dropdownItem in item.blockLinks">
                        <NuxtLink v-if="dropdownItem.blockUrl" :to="localePath(usePath().getSlug(dropdownItem.blockUrl.url))" target="_self" class="t-nav__sub-link"
                            @click="toggle($event, true)">
                            {{ dropdownItem.blockUrl.text }}
                        </NuxtLink>
                    </li>
                </ul>
            </details>
        </li>
    </ul>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        default: null,
        required: true,
    },
});

const menuBlock = ref();

const onClickOutside = (event) => {
    menuBlock.value.removeAttribute("open");
}

const emit = defineEmits();
const toggle = (event, clickOutside) => {
    const htmlClasslist = document.documentElement.classList;
    htmlClasslist.remove("disable-scroll");

    emit('childData', false);
    if (clickOutside) {
        onClickOutside(event);
    }
}

</script>

<style lang="scss" scoped>
@include until-desktop {
    .t-nav__summary {
        font-family: $primary-font;
        font-size: 20px;
        font-weight: 600;

        padding: 16px 0;
    }
}
</style>