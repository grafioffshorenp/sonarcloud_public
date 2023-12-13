<template>
  <div>
    <div class="option">
      <label :class="[{ required: input.required}]">{{ $t("Work type") }}</label>
<!--      <span><IconTooltip :tooltip="$options.filters.t('Work type info', 'labels')"/></span>-->
    </div>
    <div class="option">
      <label>
        <input  :required="isAtLeastOneCheckboxSelected"  v-model="workType" name="work_type[]" type="checkbox" value="Regular"
               @change="$emit('setWorkType', workType)"
        />
        {{ $t("Regular") }}
      </label>
    </div>
    <div class="option">
      <label>
        <input  :required="isAtLeastOneCheckboxSelected" v-model="workType" name="work_type[]" type="checkbox" value="Entrepreneurship"
               @change="$emit('setWorkType', workType)"
        />
               {{ $t("Entrepreneurship") }}
      </label>
    </div>
    <div class="option">
      <label>
        <input :required="isAtLeastOneCheckboxSelected"  v-model="workType" name="work_type[]" type="checkbox" value="Apprenticeship"
               @change="$emit('setWorkType', workType)"
        />
               {{ $t("Apprenticeship") }}
      </label>
    </div>
    <div class="option">
      <label>
        <input :required="isAtLeastOneCheckboxSelected"  v-model="workType" name="work_type[]" type="checkbox" value="Voluntary"
               @change="$emit('setWorkType', workType)"
        />
               {{ $t("Voluntary") }}
      </label>
    </div>
    <div class="option">
      <label>
        <input :required="isAtLeastOneCheckboxSelected"  v-model="workType" name="work_type[]" type="checkbox" value="Internship"
               @change="$emit('setWorkType', workType)"
        />
               {{ $t("Internship") }}
      </label>
    </div>
  </div>
</template>

<script>
// import IconTooltip from "@/account/components/atomicUI/UI/atoms/IconTooltip.vue";

export default {
  name: "WorkType",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    workType: ["Regular"]
  }),
  mounted() {
    if (this.input.value) {
      this.workType = this.input.value;
      if (typeof this.input.value === "string") {
        this.workType = JSON.parse(this.input.value);
      } else {
        this.workType = this.input.value;
      }
    }
  },
    computed: {
    isAtLeastOneCheckboxSelected() {
      return this.workType.length === 0;
    },
  },
};

</script>

<style lang="scss" scoped>
.option {
  display: flex;
  justify-content: space-between;
}
</style>
