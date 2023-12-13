<template>
  <!-- <div class="navigation"> -->
    <!-- <div style="padding: 10px; position: sticky; top: 0;  z-index: 5000; background: white; width: 100%">
      <div id="google_translate_element" class="google_translate_element" style="text-align: right;display:none;"></div>
    </div> -->
    <nav :class="[authenticated ? 'nav-account logged-in with-toggle' : 'c-nav']" v-if="menuItems">
      <template v-if="!authenticated">
        <ElementsNavigationPublic :logo="publicLogo ? { src: publicLogo.src, alt: publicLogo.alt } : null"
          :menuItems="menuItems" />
      </template>
      <template v-else>
        <ElementsNavigationAccount :logo="privateLogo ? { src: privateLogo.src, alt: privateLogo.alt } : null"
          :menuItems="menuItems" />
      </template>
    </nav>
  <!-- </div> -->
</template>

<script setup>
const userStore = useUserStore();
const { status, signOut } = useAuth();
const { locale, availableLocales } = useI18n();

const menus = await useCraftData('menus', 'menus');
const globals = await useCraftData('globals', 'globals');

const publicLogo = computed(() => {
  if (globals && globals.globalSets && globals.globalSets.length > 0 && globals.globalSets[0].siteLogo.length > 0 && globals.globalSets[0].siteLogo[0].logoPublic.length > 0) {
    return { src: globals.globalSets[0].siteLogo[0].logoPublic[0].url, alt: globals.globalSets[0].siteLogo[0].logoPublic[0].title }
  }
  return null;
});

const privateLogo = computed(() => {
  if (globals && globals.globalSets && globals.globalSets.length > 0 && globals.globalSets[0].siteLogo.length > 0 && globals.globalSets[0].siteLogo[0].logoLoggedIn.length > 0) {
    return { src: globals.globalSets[0].siteLogo[0].logoLoggedIn[0].url, alt: globals.globalSets[0].siteLogo[0].logoLoggedIn[0].title }
  }
  return null;
});

// Determin the menu
let menuSlug = ref();
const authenticated = computed(() => {
  return status.value === 'authenticated';
});

let getMenuSlug = async () => {
  const user = await userStore.fetchUser();
  if (user) {
    if (user.role === "employee") {
      menuSlug.value = 'employee-navigation';
    } else if (user.role === "employer") {
      menuSlug.value = 'employer-navigation';
    }
  }
}

if (authenticated.value) {
  getMenuSlug();
} else {
  menuSlug.value = 'main-navigation';
}

watch(authenticated, async (newUser, oldUser) => {
  await getMenuSlug();
});

let menuItems = computed(() => {
  if(typeof menuSlug.value !== 'undefined') {
    return menus ? menus.entries.filter(item => {
      return item.slug === menuSlug.value;
    })[0].navigationItem : [];
  } else {
    return [];
  }
});

</script>

<style lang="scss">
$component: "c-nav";

.goog-te-gadget-simple,
.skiptranslate.goog-te-gadget {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // width: fit-content;
}

.goog-te-gadget-simple {
  width: 165px;
}

.VIpgJd-ZVi9od-xl07Ob-lTBxed {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.#{$component} {
  .c-nav {
    @media (max-width: $navigation-breakpoint) {

      &__inline-nav,
      &__desktop-language-switcher,
      &__sub-nav.rtl {
        display: none;
      }
    }

    @media (min-width: $navigation-breakpoint) {

      &__menu-wrapper,
      &__mobile-language-switcher,
      &__mobile-register-button {
        display: none;
      }
    }

  }
}
</style>