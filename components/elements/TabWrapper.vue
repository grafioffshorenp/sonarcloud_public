<template>
  <div class="page__box">
    <aside class="page__sidebar" :class="{ active: activeTabState === 'closed' }">
      <slot name="tab-sidebar" />
    </aside>
    <div
      class="page__wrapper rtl"
      :class="[wrapperClass, { active: activeTabState === 'open' }]"
    >
      <slot name="tab-panel" />
    </div>
  </div>
</template>

<script>

export default {
  name: "TabWrapper",
  props: {
    wrapperClass: {
      default: "",
      required: false,
      type: String
    }
  },
  data() {
    return {
      activeTabState: 'closed'
    }
  }
};
</script>

<style lang="scss" scoped>
.page__sidebar:not(.active),
.page__wrapper:not(.active) {
  @include until-desktop {
    display: none;
  }
}
</style>
