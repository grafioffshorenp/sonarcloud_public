<template>
  <NuxtLink v-if="buttonType === 'nuxt-link'" :class="`c-btn btn ${classes}`" :to="localePath(routerLink)">
    <slot v-if="showText">{{ $t(textLink) }}</slot>
    <i v-if="icon" :class="icon" />
  </NuxtLink>
  <a v-else-if="buttonType === 'anchor'" :href="url" :class="`c-btn btn ${classes}`" :target="target">
    <slot v-if="showText">{{ $t(textLink) }}</slot>
    <i v-if="icon" :class="icon" />
  </a>
  <a v-else-if="buttonType === 'action'" :class="`c-btn btn ${classes}`">
    <slot v-if="showText">{{ $t(textAction) }}</slot>
    <i v-if="icon" :class="icon" />
  </a>
</template>

<script>
export default {
  name: "Button",
  props: {
    buttonType: {
      default: "router-link", // anchor, action, router-link
      required: false,
      type: String
    },
    configuration: {
      required: true,
      type: Object
    },
    icon: {
      default: "",
      required: false,
      type: String
    },
    route: {
      default: null,
      required: false,
      type: Object
    },
    noTextTablet: {
      default: false,
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      tabletBreakpoint: 768
    };
  },
  computed: {
    classes() {
      const background =
        (this.configuration.buttonBackgroundColor && this.configuration.buttonBackgroundColor.handle) || "default";
      const border = (this.configuration.buttonBorderColor && this.configuration.buttonBorderColor.handle) || "default";
      const color = (this.configuration.buttonTextColor && this.configuration.buttonTextColor.handle) || "default";
      let classes = `color-${color} background-${background} border-${border}`;
      if (this.icon) {
        classes += " btn--with-icon";
      }
      if (this.noTextTablet) {
        classes += " btn--no-text-tablet";
      }
      return classes;
    },
    routerLink() {
      return this.route || this.url.replace(window.location.origin, "");
    },
    target() {
      return this.configuration.buttonLink.target;
    },
    textAction() {
      return this.configuration.buttonText;
    },
    textLink() {
      return this.configuration.buttonLink.text;
    },
    url() {
      return this.configuration.buttonLink.url;
    },
    showText() {
      return this.noTextTablet ? this.windowWidth >= this.tabletBreakpoint : true;
    }
  },
  created() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  }
};
</script>
