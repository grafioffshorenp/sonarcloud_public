<template>
  <div>
    <input
      :id="`form-input-${handle}`"
      ref="dateField"
      v-model="field.value"
      :name="handle"
      type="date"
      :placeholder="$t(placeholder) || $t(label)"
      :required="isRequired"
      class="input flatpickr-input date"
      @keyup="validateOnKeypress"
      @blur="validate()"
      @input="validateOnInput"
    />
    <label :for="`form-input-${handle}`" :class="{ required: isRequired }">{{ $t(label) }}</label>
  </div>
</template>

<script>
import { isValid, format, parse } from "date-fns";
// import Device from "@/public/services/device.service";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
// const dutch = require("flatpickr/dist/l10n/nl.js").default.nl;
// flatpickr.localize(dutch);

export default {
  name: "DateInput",
  props: {
    field: {
      required: true,
      type: Object
    },
    handle: {
      required: true,
      type: String
    },
    isRequired: {
      required: true,
      type: Boolean
    },
    label: {
      required: true,
      type: String
    },
    placeholder: {
      default: "",
      required: false,
      type: String
    },
    setValidityState: {
      default: false,
      required: false,
      type: Boolean
    },
    useFlatpickr: {
      default: true,
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      classList: null,
      dateConfig: {
        allowInput: true,
        altFormat: "d-m-Y",
        altInput: true,
        dateFormat: "Y-m-d",
        onClose: this.validate,
      },
      instance: null,
      tmp: "",
      initialValue: "",
      newValue: ""
    };
  },
  computed: {
    flatPicker() {
      return this.useFlatpickr;
      // return this.useFlatpickr && !Device.isMobileDevice();
    }
  },
  watch: {
    "field.value": {
      handler(newValue) {
        if (this.instance) {
          this.instance.setDate(newValue, false, this.dateConfig.dateFormat);
          this.updateValidityState();
        }
      }
    }
  },
  beforeUpdate() {
    if (this.instance) {
      this.tmp = this.instance.input.value;
    }
  },
  updated() {
    if (this.tmp && this.instance) {
      this.instance.input.value = this.tmp;
    }
  },
  mounted() {
    this.initialValue = this.field.value;
    this.classList = this.$refs.dateField.parentNode.classList;

    if (this.flatPicker) {
      this.$nextTick(() => {
        this.instance = flatpickr(this.$refs.dateField, this.dateConfig);
        this.instance.calendarContainer.classList.add("date-picker");
        this.instance.input.value = this.field.value;
      });
    }
    this.updateValidityState();
  },
  methods: {
    emitChange() {
      if (this.field.valid && this.$refs.dateField.value !== this.initialValue) {
        this.initialValue = this.$refs.dateField.value;
        this.$emit("setDate", { target: this.$refs.dateField });
      }
    },
    formatDate() {
      let value = this.field.value;

      value = this.validateReplace(value);
      value = this.validateSupplement(value);
      value = this.validateShorten(value);

      if (this.flatPicker) {
        value = this.validateSlice(value, [2, 5]);
      } else {
        value = this.validateSlice(value, [4, 7]);
      }

      if (this.flatPicker) {
        this.instance.altInput.value = value;
        const parsed = parse(value, "dd-MM-yyyy", new Date());
        value = isValid(parsed) ? format(parsed, "yyyy-MM-dd") : value;
        this.instance.input.value = value;
        this.field.value = value;
      }

      return value;
    },
    isValidFormat: value => /^\d{4}[./-]\d{2}[./-]\d{2}$/.test(value),
    setClassList(isValid) {
      isValid ? this.classList.remove("input--has-error") : this.classList.add("input--has-error");
    },
    updateValidityState() {
      const isValid = this.field.value ? this.isValidFormat(this.field.value) : true;
      this.field.valid = isValid;

      if (this.setValidityState) {
        this.setClassList(isValid);
      }
    },
    validate() {
      if (this.flatPicker) {
        this.field.value = this.instance.altInput.value;
      }

      if (!this.field.value) {
        this.field.valid = !this.isRequired;
        this.setClassList(this.field.valid);
        return;
      }

      this.field.value = this.formatDate();
      this.updateValidityState();

      this.emitChange();
    },
    validateOnInput() {
      if (this.isValidFormat(this.field.value)) {
        this.updateValidityState();
      }
    },
    validateOnKeypress(event) {
      const key = window.event ? event.keyCode : event.which;
      if (key === 8 || key === 46 || key === 37 || key === 39 || key === 45) {
        //
      } else if (key < 48 || key > 57) {
        return event.preventDefault();
      }
    },
    validateReplace: value => value.replace(/\//g, "-").replace(/\./g, "-"),
    validateShorten: value => {
      if (value.length >= 9 && value.indexOf("-") === -1) {
        value = value.substring(0, 8);
      }
      return value;
    },
    validateSlice: (value, format) => {
      const [first, second] = format;
      if (value.length === 8 && value.indexOf("-") === -1) {
        value = [value.slice(0, first), "-", value.slice(first)].join("");
        value = [value.slice(0, second), "-", value.slice(second)].join("");
      }
      return value;
    },
    validateSupplement: value => {
      if (value.length < 8) {
        value += "0".repeat(8 - value.length);
      }
      return value;
    }
  }
};
</script>
