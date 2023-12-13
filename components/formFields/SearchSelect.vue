<template>
  <div class="dropdown">
    <label class="label" :for="`form-input-${input.handle}`" :class="{ required: input.required }">{{
      $t(input.label)
    }}</label>
    <input
      v-if="Object.keys(selectedItem).length === 0"
      :id="`form-input-${input.handle}`"
      ref="dropdowninput"
      v-model.trim="inputValue"
      :name="input.handle"
      class="dropdown-input"
      type="text"
    />
    <div v-else @click="resetSelection">
      <input
        :id="`form-input-${input.handle}`"
        ref="dropdowninput"
        :value="selectedItem.city"
        :name="input.handle"
        class="dropdown-input"
        type="text"
      />
    </div>
    <div v-if="inputValue" class="dropdown-list">
      <div
        v-for="item in itemList"
        v-show="itemVisible(item)"
        :key="item.city"
        class="dropdown-item"
        @click="selectItem(item)"
      >
        {{ item.city }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Array,
      required: true
    },
    input: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedItem: {},
      inputValue: ""
    };
  },
  mounted() {
    if (this.input.value) {
      this.selectItem({ city: this.input.value });
    }
  },
  methods: {
    resetSelection() {
      this.selectedItem = {};
      this.$nextTick(() => this.$refs.dropdowninput.focus());
      this.$emit("on-item-reset");
    },
    selectItem(theItem) {
      this.selectedItem = theItem;
      this.inputValue = "";
      this.$emit("on-item-selected", theItem);
    },
    itemVisible(item) {
      const currentName = item.city.toLowerCase();
      const currentInput = this.inputValue.toLowerCase();
      return currentName.includes(currentInput);
    }
  }
};
</script>

<style>
.dropdown {
  position: relative;
  width: 100%;
  margin: 0 auto;
  z-index: 1000;
}
.dropdown-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: white;
  line-height: 1.5em;
  outline: none;
  border-radius: 8px;
}
.dropdown-input:focus {
  background: #fff;
  border-color: #e2e8f0;
}
.dropdown-input::placeholder {
  opacity: 0.7;
}
.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #edf2f7;
}
.label {
  color: #bcbcbc;
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  left: 16px;
  margin: 0;
  max-width: calc(100% - 32px);
  padding: 1px 2px;
  pointer-events: none;
  position: absolute;
  top: 18px;
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 1001;
  background: white;
  width: 30px;
}
</style>
