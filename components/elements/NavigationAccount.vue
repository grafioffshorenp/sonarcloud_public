<template>
  <div class="nav__inner" :class="{ toggled }" v-if="menuItems">
    <div class="nav__inner-header">
      <NuxtLink :to="localePath('/')" class="logo" v-if="logo">
        <img :src="logo.src" :alt="logo.alt">
      </NuxtLink>
      <a :class="`nav-mobile-button nav-mobile-button--${toggled ? 'closed' : 'open'}`" @click="toggle()">
        <i :class="`far fa-${toggled ? 'times' : 'bars'}`" />
      </a>
    </div>
    <div class="nav__wrapper" v-if="menuItems && menuItems.length > 0">
      <div class="c-nav__menu-wrapper">
        <ElementsNavigationItem :item="item" v-for="item in menuItems" @childData="handleClick" />
      </div>

      <ul class="nav__desktop">
        <li class="c-nav__links-list-item" v-for="item in menuItems">
          <ElementsNavigationItem :item="item" @childData="handleClick" />
        </li>
      </ul>
      <ul class="nav__acc">
        <ElementsNavigationAccountDropdown />
      </ul>
    </div>
  </div>
</template>

<script setup>
const { locale, availableLocales } = useI18n();
const toggled = ref(false);

defineProps({
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

const toggle = () => {
  toggled.value = !toggled.value;

  const htmlClasslist = document.documentElement.classList;
  toggled.value ? htmlClasslist.add("disable-scroll") : htmlClasslist.remove("disable-scroll");
}

const handleClick = (data) => {
  toggled.value = data;
};

</script>

<style lang="scss" scoped>
$component: "nav";

.#{$component} {
  &__wrapper {
    .t-nav__summary {
      @include until-desktop {
        align-items: center;
        display: flex;
        font-family: "CircularStd", "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif;
        font-size: 20px;
        font-weight: 600;
        padding: 16px 0;
      }
    }
  }

  &__inner {

    .c-nav__menu-wrapper,
    .navigation-account-dropdown__mobile {
      display: none;
    }
  }

  &__inner.toggled {

    .c-nav__menu-wrapper,
    .navigation-account-dropdown__mobile {
      display: block;
    }
  }

  &__inner:not(.toggled) {
    .#{$component}__acc {
      @include until-desktop {
        display: none;
      }
    }
  }

  &__desktop {
    @include until-desktop {
      display: none !important;
    }
  }
}

@include desktop {

  .c-nav__menu-wrapper,
  .nav-mobile-button {
    display: none !important;
  }
}
</style>