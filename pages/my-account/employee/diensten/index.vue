<template>
  <main>
    <section class="inner-row--large page__box">
      <div class="page__wrapper clear-background">
        <ElementsMyApplicationsTabs :tabs="tabs" @select-tab="selectTab"/>

        <div class="table">
          <ElementsMyApplicationsHeader :headers="headers"/>
          <ElementsMyApplicationsContent :applications="applications"/>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'account',
  title: 'Mijn diensten',
});

const router = useRouter();

const userStore = useUserStore();
const user = await userStore.fetchUser();

const tabs = [
  { name: 'All', value: null },
  { name: 'Pending', value: 'pending' },
  { name: 'Accepted', value: 'contracted' },
  { name: 'Rejected', value: 'rejected' },
];

const headers = ['Function', 'Start date', 'Work type', 'Working hours', 'Status'];

const data = await useRWApi('/employee/job_posts/applications', { method: 'GET' });
let errors = ref();

const applications = computed(() => {
  if (data.errors) {
    errors.value = data.errors;
    return [];
  }

  if (data.data && data.data.length > 0) {
    if (activeTab.value.value) {
      return data.data.filter(contract => {
        return contract.status === activeTab.value.value;
      });
    }
    return data.data;
  }

  return [];
});

let activeTab = ref({ name: 'All', value: null });
const selectTab = (tab) => {
  activeTab.value = tab;
};

</script>

<style lang="scss" scoped>
.margin-bottom {
  margin-bottom: 24px;
}

.main-header {
  padding-top: 32px;
  padding-bottom: 40px;

  @include until-tablet {
    min-height: 108px;
  }

  @include tablet {
    padding-top: 80px;
  }
}
</style>