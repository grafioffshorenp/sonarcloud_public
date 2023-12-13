<template>
  <div>
    <input v-model="value" type="hidden" :name="input.handle" />
    <div class="u-flex">
      <label class="input input--switch u-order-0"
        ><input v-model="value" type="checkbox"/><span class="toggler"></span
      ></label>
      <p class="u-ml-small u-mb-none">{{ $t(input.label) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toggle",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      value: false
    };
  },
  mounted() {
    this.value = this.input.value;
  }
};
</script>
