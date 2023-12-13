<template>
  <div>
    <div v-if="input.instructions" class="u-mb-small">
      <small class="input__helper-text">{{ $t(input.instructions) }}</small>
    </div>

    <div>
      <select
          :id="`form-input-${input.handle}`"
          :name="input.handle"
          class="input pl-4"
          :required="input.required"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          @change="$emit('change', $event)"
      >
        <option
            v-for="(option, index) in input.options"
            :key="`select-${input.handle}-${index}`"
            :value="option.value"
            :selected="option.value === input.value ? input.value.toString() : false"
        >
          {{ $t(option.label) }}
        </option>
      </select>
      <div class="c-input-icon c-input-icon--teal">
        <i class="far fa-chevron-down"></i>
      </div>
      <label :for="`form-input-${input.handle}`" :class="{ required: input.required }">{{
          $t(input.label)
        }}</label>
    </div>
  </div>
</template>

<script setup>

defineProps({
  input: {
    required: true,
    type: Object,
  },
  disabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  value: {
    required: false,
    type: String || Number,
    default: null,
  },
});

</script>

<style lang="scss" scoped>
.c-input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;

  width: 1rem;
  height: 1rem;

  background-color: #FFF;

  font-size: 1rem;

  transform: translateY(-50%);

  &--teal {
    pointer-events: none;
    color: teal;
  }
}
</style>
