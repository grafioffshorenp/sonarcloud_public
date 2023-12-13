<template>
  <div>
    <img
      v-if="employee.profile_picture"
      v-click-outside="handleClickOutside"
      :class="`picture picture--${type}`"
      :src="picture"
      :alt="employee.first_name"
      :height="height"
      :width="width"
      @click="handleClick"
    />
    <div v-else class="img bg-fallback-employee" :class="`picture picture--${type}`" />
    <img
      v-if="showEnlarged"
      :class="`picture picture--${type} picture--enlarged`"
      :src="picture"
      :alt="employee.first_name"
      @click.stop
    />
  </div>
</template>

<script>
import vClickOutside from "v-click-outside";

export default {
  name: "ProfilePicture",
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    clickToEnlarge: {
      required: false,
      default: false,
      type: Boolean
    },
    employee: {
      required: true,
      type: Object
    },
    type: {
      default: "small",
      required: false,
      type: String // small, small-plus, medium, large
    }
  },
  data() {
    return {
      showEnlarged: false
    };
  },
  computed: {
    height() {
      return this.type === "small" ? 40 : this.type === "medium" ? 64 : 160;
    },
    picture() {
      const base64 = "data:image/jpeg;base64,";
      const prefix =
        this.employee.profile_picture.indexOf("https://") > -1 || this.employee.profile_picture.indexOf("base64") > -1
          ? ""
          : base64;
      return prefix + this.employee.profile_picture;
    },
    width() {
      return this.type === "small" ? 40 : this.type === "medium" ? 64 : 160;
    }
  },
  methods: {
    handleClick(e) {
      if (this.clickToEnlarge) {
        e.stopPropagation();
        this.showEnlarged = !this.showEnlarged;
      }
      return;
    },
    handleClickOutside(e) {
      if (this.clickToEnlarge) {
        e.stopPropagation();
        this.showEnlarged = false;
      }
    }
  }
};
</script>
