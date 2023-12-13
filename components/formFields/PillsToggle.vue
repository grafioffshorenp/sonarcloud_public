<template>
  <ul class="l-inline-items l-inline-items--wrap">
    <li v-for="(item, index) in items" :key="index">
      <label :class="['c-pill', { 'c-pill--selected': item.selected }]">
        <input v-model="item.selected" type="checkbox" class="c-pill__input" />
        {{ $t(item.name) }}
      </label>
    </li>
  </ul>
</template>

<script>
// An item should look like this:
//
// const item = {
//   id: Number,
//   name: String,
//   selected: Boolean
// }

export default {
  name: "PillsToggle",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  watch: {
    items: {
      handler(newValue) {
        this.$emit(
          "input",
          newValue.reduce((acc, current) => (current.selected ? [...acc, current.id] : acc), [])
        );
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
