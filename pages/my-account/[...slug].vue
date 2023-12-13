<template>
  <div></div>
</template>

<script setup>
import { useUserStore } from '~/stores/user.js';

const localePath = useLocalePath();

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const routes = router.getRoutes();

await userStore.fetchUser();

let to = route.params.slug;
if (to && to.length) {
  to = to.join('/');

  const match = routes.find(route => route.path === localePath(`/my-account/${userStore.user.role}/${to}`));
  if (match) {
    navigateTo(match.path);
  }
}

navigateTo(localePath(`/my-account/${userStore.user.role}/profile`));
</script>
