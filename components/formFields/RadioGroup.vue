<template>
  <div :class="{ 'radio-group-all-one-line': allOneLine }">
    <label :class="[{ required: input.required }, { 'label--primary': primaryLabel }]">{{
      $t(input.label)
    }}</label>

    <div
      :class="[
        { 'input-row input-group-one-line': input.oneLine || allOneLine },
        { 'input-group-with-background': hasBackground }
      ]"
    >
      <label v-for="(option, index) in options" :key="index" :class="{ 'label--increased-spacing': increasedSpacing }">
        <input
          ref="inputs"
          :name="input.handle"
          type="radio"
          :value="option.value"
          :checked="input.value === option.value"
          :required="input.required"
          class="input"
          @input="$emit('on-change', option.value)"
        />

        <div class="label__text" :class="{ 'has-description': option.description }">
          <p class="label__text--title">{{ option.label }}</p>
          <p v-if="option.title" class="label__text--description">{{ $t(option.title) }}</p>
          <p v-if="option.description" class="label__text--description">{{ option.description }}</p>
          <p v-if="option.subDescription" class="label__text--subdescription">
            {{ $t(option.subDescription) }}
          </p>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "RadioGroup",
  props: {
    input: {
      required: true,
      type: Object
    },
    allOneLine: {
      required: false,
      type: Boolean,
      default: false
    },
    increasedSpacing: {
      required: false,
      type: Boolean,
      default: false
    },
    primaryLabel: {
      required: false,
      type: Boolean,
      default: false
    },
    hasBackground: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    options() {
      return this.input.options.map(option => {
        let value = option.value;

        if (value === "true" || value === "false" || value === "1" || value === "0") value = JSON.parse(value);

        return { ...option, value };
      });
    }
  },
  mounted() {
    if (this.input.value) {
      this.$emit("on-mount", this.input.value);
    }
  },
  methods: {
    clearInputs() {
      if (this.$refs.inputs) {
        this.$refs.inputs.forEach(element => {
          element.checked = false;
        });
      }
    }
  }
};
</script>
