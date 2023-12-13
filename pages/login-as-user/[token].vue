<template>
  Logging in, please wait...
</template>

<script setup>

const { signIn, data } = useAuth();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const token = route.params.token;
  // To prevent a login loop, check if we're trying to login with the access_token that we're already logged in as.
  if (token !== data.value?.access_token) {
    await signIn('token', { token });
  }
  await router.push('/my-account/profile');
});
</script>
