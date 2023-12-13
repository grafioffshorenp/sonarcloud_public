<template>
  <main id="main" class="no-margin-until-desktop">
    <div class="l-container">
      <div class="l-sidebar">
        <div :class="{ 'l-sidebar__aside--is-active': activePanel === 'sidebar' }" class="l-sidebar__aside">
          <slot name="sidebar" />
        </div>
        <div :class="{ 'l-sidebar__main--is-active': activePanel === 'main' }" class="l-sidebar__main">
          <slot name="main" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
/**
 * Props
 * activePanel: which panel to show (mobile only, desktop will always show both panels)
 */

export default {
  name: "LayoutSidebar",
  props: {
    activePanel: {
      type: String,
      default: "sidebar"
    }
  },
  methods: {
    panelChangehandler() {
      this.activePanel = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.l-container {
  @include desktop {
    @include container;
  }
}

.l-sidebar {
  display: flex;

  @include desktop {
    gap: 2rem;
  }
}

.l-sidebar__aside {
  display: none;

  padding: 1.5rem 0 0;
  width: 100%;

  background-color: $white;

  &--is-active {
    display: block;
  }

  @include desktop {
    display: block;

    min-width: 368px;
    max-width: 368px;

    border-radius: 6px;
  }
}

.l-sidebar__main {
  display: none;

  padding: 0 1.5rem;
  height: 100%;
  width: 100%;

  border-radius: 6px;
  background-color: $white;

  &--is-active {
    display: block;
  }

  @include desktop {
    display: block;

    flex-grow: 1;
  }
}
</style>
