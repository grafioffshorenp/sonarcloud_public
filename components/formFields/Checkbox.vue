<template>
  <label>
    <input class="input" :name="input.handle" type="checkbox" :value="input.value" />
    {{ $t(input.label) }}
  </label>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    input: {
      required: true,
      type: Object
    }
  }
};
</script>
