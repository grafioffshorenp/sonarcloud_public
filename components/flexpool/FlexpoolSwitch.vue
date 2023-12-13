<template>
  <div class="flexpool__switch">
    <div :class="['flexpool__switch-toggle', { 'flexpool__switch-toggle--space-between': isAfterReview }]">
      <div v-if="isAfterReview" class="flexpool__review-text">
        {{ $t(functionName) }}
      </div>

      <label class="input--switch" :class="{ disabled: loading }">
        <input v-model="flexpoolStatus" type="checkbox" @change="updateFlexpoolStatus()"/>
        <span class="toggler"></span>
      </label>

      <h4 v-if="!isAfterReview">{{ functionName }} {{ flexpoolLocationName }}</h4>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FlexpoolSwitch',
  props: {
    employeeId: {
      required: true,
      type: Number,
    },
    functionId: {
      required: true,
      type: Number,
    },
    functionName: {
      required: true,
      type: String,
    },
    inFlexpool: {
      required: true,
      type: Boolean,
    },
    isAfterReview: {
      required: false,
      type: Boolean,
      default: false,
    },
    locationId: {
      required: true,
      type: Number,
    },
    locationName: {
      required: false,
      type: String,
      default: null,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      loading: false,
      flexpoolStatus: false,
    };
  },
  computed: {
    employerId() {
      return this.userStore.employerId;
    },
    flexpoolLocationName() {
      return this.locationName ? `– ${this.locationName}` : '';
    },
  },
  mounted() {
    this.flexpoolStatus = this.inFlexpool;
  },
  methods: {
    async updateFlexpoolStatus() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      if (this.inFlexpool) {
        await this.deleteEmployeeFromFlexpool({
          employer_id: this.employerId,
          employee_id: this.employeeId,
          function_id: this.functionId,
          employer_location_ids: [this.locationId],
        });
      } else {
        await this.addEmployeeToFlexpool({
          employer_id: this.employerId,
          employee_id: this.employeeId,
          function_id: this.functionId,
          employer_location_id: this.locationId,
        });
      }

      this.loading = false;
    },
    updateFunctionName(text) {
      return text.replace('{{functie}}', this.functionName);
    },
  },
};
</script>

<style lang="scss" scoped>
.flexpool {
  &__switch {
    border-radius: 6px;

    @include tablet {
      box-shadow: none;
    }

    p {
      font-size: 16px;
      margin: 0 0 12px 0;
    }
  }

  &__switch-toggle {
    align-items: center;
    display: flex;
    margin-bottom: 24px;

    &--space-between {
      justify-content: space-between;
    }

    .input--switch {
      margin-right: 18px;
    }
  }

  &__review-text {
    max-width: 60%;

    :deep(p),
    :deep(strong) {
      font-size: 14px !important;
      margin: 0;
      color: $label-color;
    }
  }
}
</style>
