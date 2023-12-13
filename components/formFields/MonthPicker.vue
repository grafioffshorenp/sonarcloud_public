<template>
  <div>
    <input
      :id="`form-input-${name}`"
      ref="picker"
      v-model="$attrs.value"
      type="date"
      class="input date flatpickr-input"
      :placeholder="placeholder"
      @change="handleChange"
    />
    <label :for="`form-input-${name}`" :class="{ required: false }">{{ $t(label) }}</label>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";

import { format } from "date-fns";

// const dutch = require("flatpickr/dist/l10n/nl.js").default.nl;
// flatpickr.localize(dutch);

export default {
  name: "MonthPicker",
  props: {
    config: {
      required: false,
      type: Object,
      default: () => {
        return {
          monthSelectorType: "dropdown",
          allowInput: true,
          dateFormat: "MM-yyyy",
          plugins: [
            new monthSelectPlugin({
              dateFormat: "m-Y",
              altFormat: "F Y",
              shorthand: true
            })
          ]
        };
      }
    },
    label: {
      required: true,
      type: String
    },
    name: {
      required: true,
      type: String
    },
    placeholder: {
      required: false,
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      instance: null
    };
  },
  mounted() {
    this.instance = flatpickr(this.$refs.picker, { ...this.config, disableMobile: true, defaultDate: this.$attrs.value });
  },
  methods: {
    handleChange() {
      try {
        const formatted = format(this.instance.selectedDates[0], "MM-yyyy");
        this.$emit("on-input", formatted);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss">
.flatpickr-calendar {
  // background-color: blue; 
  // font-size: 16px;
  // font-weight: 600;
  // color: black; 
}

.flatpickr-innerContainer,
.flatpickr-rContainer {
  width: 100%;
}

.flatpickr-monthSelect-months {
  padding-top: 24px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  // background-color: rgb(212, 210, 210);
}

.flatpickr-monthSelect-month {
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  transition: all 0.4 s ease;

  &:hover {
    // color: red; //$flatpickr-month-font-color-hover;
    cursor: pointer;
    // background-color: black; //$flatpickr-month-hover-color;
  }
}

.flatpickr-input {
  &::placeholder {
    opacity: 0;
    transition: 0.2s opacity;
  }

  &:focus {
    &::placeholder {
      opacity: 1;
    }
  }
}
</style>
