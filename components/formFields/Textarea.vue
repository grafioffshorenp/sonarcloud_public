<template>
  <div class="textarea-wrapper">
    <textarea
      :id="`form-input-${input.handle}`"
      :ref="input.handle"
      v-model="value"
      :name="input.handle"
      :placeholder_disabled="`${input.placeholder.replace(/\\n/g, '\n')}`"
      :rows="input.rows || 3"
      :required="!!input.required"
      class="input pl-2 pt-2"
      @input="$emit('changed', value)"
    />
    <label v-if="input.label" :for="`form-input-${input.handle}`" :class="{ required: !!input.required }">
      {{ $t(input.label) }}
    </label>
    <p v-if="input.maxLength" class="max-length">
      <span :class="{ 'error-message': exceedsMaxLength }">{{ value ? value.length : 0 }}</span
      >/{{ input.maxLength }}
    </p>
    <div v-if="input.instructions" class="u-mt-medium">
      <small class="input__helper-text">{{ $t(input.instructions) }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextArea",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      value: ""
    };
  },
  computed: {
    exceedsMaxLength() {
      return this.value && this.value.length > this.input.maxLength;
    }
  },
  watch: {
    input: {
      handler(to) {
        this.value = to.value;
      },
      deep: true
    }
  },
  mounted() {
    if (this.input.autofocus) {
      this.$refs[this.input.handle].focus();
    }
    this.value = this.input.value || "";
  }
};
</script>
