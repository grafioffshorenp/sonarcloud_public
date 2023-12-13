<template>
    <li :class="['account-dropdown hide-until-desktop navigation-account-dropdown navigation-account-dropdown__desktop', { active: onAccountPage }]">
        <a class="account-dropdown__toggle" @click="toggleAccountDropdown()">
            <i class="far fa-user-cog"></i>
        </a>
        <div v-if="showAccountDropdown" v-click-outside="handleClickOutside" class="account-dropdown__menu"
            @click="closeDropdown">
            <NuxtLink :to="localePath(item.href)" target="_self" :class="{ 'consol-logout': item.href === 'logout' }"
                class="account-dropdown__option" @click="item.href === 'logout' ? logOut() : ''"
                v-for="item in userNavigation">
                <span class="rtl">{{ $t(item.name) }}</span>
                <i class="far fa-sign-out" v-if="item.href === 'logout'" />
            </NuxtLink>
        </div>
    </li>
    <ul class="navigation-account-dropdown navigation-account-dropdown__mobile">
        <li class="c-nav__links-list-item" v-for="item in userNavigation">
            <NuxtLink :to="localePath(item.href)" target="_self" :class="{ 'consol-logout': item.href === 'logout' }"
                class="t-nav__link" @click="item.href === 'logout' ? logOut() : ''">
                <span class="rtl">{{ $t(item.name) }}</span>
                <i class="far fa-sign-out" v-if="item.href === 'logout'" />
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup>
import { useRouter } from 'vue-router';

const { status, signOut } = useAuth();
const router = useRouter();

const onAccountPage = computed(() => {
    return router.currentRoute.value.path.includes("/mijn-account/profiel");
})

const showAccountDropdown = ref(false);

const userNavigation = [
    { name: 'Mijn account', href: '/my-account' },
    { name: 'Log uit', href: 'logout' },
];

const closeDropdown = () => {
    showAccountDropdown.value = false;
}
const toggleAccountDropdown = () => {
    showAccountDropdown.value = !showAccountDropdown.value;
}
const handleClickOutside = () => {
    showAccountDropdown.value = false;
}

const logOut = () => {
    try {
        console.log('logout');
        signOut({ callbackUrl: '/' });

        $toastrBus.$emit('show', {
            type: 'success',
            message: 'You logged out succesfully',
            duration: 9000,
        });
    } catch (error) {
        $toastrBus.$emit('show', {
            type: 'error',
            message: 'You did not log out succesfully',
            duration: 5000,
        });
    }
}
</script>

<style lang="scss" scoped>
$component: "navigation-account-dropdown";

.#{$component} {

    @include desktop {
        &__mobile {
            display: none;
        }
    }

    @include until-desktop {
        margin-top: -1.5rem;
        &__desktop {
            display: none;
        }
    }

}
</style>