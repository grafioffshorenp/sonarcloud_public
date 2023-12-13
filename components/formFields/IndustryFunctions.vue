<template>
  <div class="input-row">
    <p v-if="loading">{{ $t("Functies worden geladen ...") }}</p>

    <template v-if="input.industryFunctions">
      <div class="input-wrapper input--select">
        <select
          v-model="selectedIndustryId"
          :disabled="isUpdating"
          name="industry_id"
          :required="input.required"
          class="pl-4"
          @change="onIndustryChange()"
        >
          <option v-for="industry in input.industryFunctions" :key="industry.id" :value="industry.id">
            {{ $t(industry.name) }}
          </option>
        </select>
        <div class="c-input-icon c-input-icon--teal">
          <i class="far fa-chevron-down"></i>
        </div>

        <label :class="{ required: input.required }">{{ $t("Branche") }}</label>
      </div>

      <template v-for="industry in input.industryFunctions">
        <div
          v-if="selectedIndustryId === industry.id"
          :key="industry.id"
          :required="input.required"
          class="input-wrapper input--select"
        >
          <select v-model="selectedFunctionId" :disabled="isUpdating" @change="$emit('functionChanged', selectedFunctionId)" class="pl-4">
            <option v-for="(f, i) in industry.functions" :key="i" :value="f.id">
              {{ $t(f.name) }}
            </option>
          </select>
          <div class="c-input-icon c-input-icon--teal">
            <i class="far fa-chevron-down"></i>
          </div>

          <label :class="{ required: input.required }">{{ $t("Functie") }}</label>
        </div>
      </template>

      <input type="hidden" name="function_id" :value="selectedFunctionId" />
    </template>
  </div>
</template>

<script>
export default {
  name: "IndustryFunctions",
  props: {
    input: {
      required: true,
      type: Object
    },
    template: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      selectedFunctionId: 0,
      selectedIndustryId: 0
    };
  },
  inject: ["isUpdating"],
  computed: {
    firstFunctionId() {
      return this.input.industryFunctions[0].functions[0].id;
    },
    firstIndustryId() {
      return this.input.industryFunctions[0].id;
    },
    functionsBySelectedIndustryId() {
      return this.input.industryFunctions.find(industry => industry.id === this.selectedIndustryId).functions;
    },
    isOriginalIndustry() {
      return this.template.industry ? this.template.industry.id === this.selectedIndustryId : false;
    }
  },
  watch: {
    selectedFunctionId: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('update', newValue)
          // this.setSelectedFunctionId(newValue);
        }
      }
    }
  },
  async mounted() {
    if (!this.input.industryFunctions) {
      this.loading = true;
      // await this.getIndustryFunctions();
      this.loading = false;
    }
    // this.selectedFunctionId = this.template.function ? this.template.function.id : this.firstFunctionId;
    // this.selectedIndustryId = this.template.industry ? this.template.industry.id : this.firstIndustryId;
    this.selectedIndustryId = this.input.industryId ? this.input.industryId : this.firstIndustryId;
    this.selectedFunctionId = this.input.functionId ? this.input.functionId : this.firstFunctionId;

    this.$emit('industryChanged', this.selectedIndustryId)
    this.$emit('functionChanged', this.selectedFunctionId)
  },
  methods: {
    // ...mapActions("jobposts", ["getIndustryFunctions"]),
    // ...mapMutations("jobposts", ["setSelectedFunctionId"]),
    onIndustryChange() {
      this.selectedFunctionId = this.isOriginalIndustry
        ? this.template.function.id
        : this.functionsBySelectedIndustryId[0].id;
      this.$emit('industryChanged', this.selectedIndustryId)
    }
  }
};
</script>
