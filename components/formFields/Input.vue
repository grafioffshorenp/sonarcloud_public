<template>
  <div>
    <input
      :id="`form-input-${input.handle}`"
      :ref="input.handle"
      :name="input.handle"
      :type="input.type"
      :min="input.minValue"
      :max="input.maxValue"
      :minlength="input.minLength"
      :maxlength="input.maxLength"
      :step="input.type === 'number' ? (input.decimalCount > 0 ? 0.01 : 1) : false"
      :value="input.value || ''"
      :readonly="input.disabled"
      :required="input.required"
      :class="['input', { loading: input.loading }]"
      @change="$emit('on-change', $event)"
      @input="$emit('changed', $event)"
    />
    <label :for="`form-input-${input.handle}`" :class="{ required: input.required }">{{
      $t(input.label)
    }}</label>
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  name: "Input",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  // computed: {
  //   ...mapState("statuses", ["activeField"])
  // },
  mounted() {
    // if (this.input.handle === this.activeField) {
    //   this.$refs[this.input.handle].focus();
    // }
  }
};
</script>
