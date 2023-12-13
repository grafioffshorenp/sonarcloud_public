<template>
  <ul class="c-tabs-menu">
    <li v-for="tab in tabs" :key="tab">
      <div class="c-tabs-menu__button" :class="{ 'c-tabs-menu__button--is-active': activeTab === tab.value }">
        <RWButton as="text" :handler="() => tabClickHandler(tab.value)">{{ tab.name }}</RWButton>
      </div>
    </li>
  </ul>
</template>

<script>
import RWButton from "../atoms/RWButton.vue";

export default {
  name: "TabsMenu",
  components: { RWButton },
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeTab: this.tabs[0].value
    };
  },
  methods: {
    tabClickHandler(tab) {
      this.activeTab = tab;
      this.$emit("callback", this.activeTab);
    }
  }
};
</script>

<style lang="scss" scoped>
.c-tabs-menu {
  display: flex;
  gap: 0.5rem;

  padding: 0 1.5rem;

  border-bottom: 1px solid $background-light;
}

.c-tabs-menu__button {
  > button,
  > r-w-button {
    font-weight: 400;
    color: $grey;
  }

  &--is-active {
    border-bottom: 1px solid $teal-dark;

    > button,
    > r-w-button {
      font-weight: 600;
      color: $teal-dark;
    }
  }
}
</style>
