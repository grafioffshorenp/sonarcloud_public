<template>
  <section class="panel show-after-load">
    <a class="panel__anchor" :class="{ parent: isParent, expanded: isExpanded }" @click="togglePanel()">
      <slot name="panel-header" />

      <slot name="expand" @click="togglePanel()">
        <i v-if="isExpanded && !isParent" class="far fa-window-minimize" :class="{ expanded: isExpanded }" />
        <i v-if="isExpanded && isParent" class="fas fa-chevron-up" :class="{ expanded: isExpanded }" />
      </slot>

      <slot name="collapse" @click="togglePanel()">
        <i v-if="!isExpanded && !isParent" class="fal fa-plus" :class="{ expanded: isExpanded }" />
        <i v-if="!isExpanded && isParent" class="fas fa-chevron-down" :class="{ expanded: isExpanded }" />
      </slot>
    </a>

    <div v-show="isExpanded">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: "CollapsiblePanel",
  props: {
    collapsed: {
      default: false,
      required: false,
      type: Boolean
    },
    openOnInit: {
      default: false,
      required: false,
      type: Boolean
    },
    panelType: {
      required: true,
      type: String // 'parent', 'child'
    },
    resizeListener: {
      default: false,
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      currentWidth: 0,
      isExpanded: false,
      toggleWidth: 991
    };
  },
  computed: {
    isParent() {
      return this.panelType === "parent";
    }
  },
  watch: {
    collapsed(newState) {
      if (newState && this.isExpanded) {
        this.isExpanded = false;
      }
    }
  },
  mounted() {
    if (this.resizeListener) {
      this.onResize();
      window.addEventListener("resize", this.onResize);
      this.currentWidth = window.innerWidth;
    }

    if (this.openOnInit) {
      this.isExpanded = this.openOnInit;
    }
  },
  methods: {
    togglePanel() {
      this.isExpanded = !this.isExpanded;
      this.$emit("toggle-panel");
    },
    onResize() {
      if (window.innerWidth === this.currentWidth) {
        return;
      }
      this.currentWidth = window.innerWidth;
      this.isExpanded = window.innerWidth > this.toggleWidth;
    }
  }
};
</script>

<styles lang="scss" scoped>
.panel {
  // FIXME: these backgrounds break My Reactions styling
  // background: $background-light;

  @include desktop {
    // background: $white;
  }

  // Horrible nesting in markup
  .panel {
    background: transparent;
  }
}

.panel__anchor {
  font-family: $font-body-bold !important;
  color: $text-color !important;
}
</styles>
