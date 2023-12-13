<template>
  <p v-if="loading">
    {{ $t("De branches worden geladen ...") }}
  </p>

  <div v-else>
    <p class="pb-2">{{ $t("Do you have work experience?") }}</p>
    <div><input v-model="hasWorkExperience" type="radio" :value="1" class="mb-4"/> {{ $t("Yes") }}</div>
    <div><input v-model="hasWorkExperience" type="radio" :value="0" class="mb-4"/> {{ $t("No") }}</div>
    <template v-if="hasWorkExperience">
      {{ $t('Werkervaring') }}
    </template>

    <input type="hidden" name="has_work_experience" :value="hasWorkExperience"/>
    <div v-if="hasWorkExperience">
      <label v-if="input.label">{{ input.label }}</label>
      <p v-if="input.instructions">{{ input.instructions }}</p>
      <input v-model="hiddenInput" :name="input.handle" type="hidden"/>
      <div v-for="(row, index) in rows" :key="`row-experience-${index}`">
        <div class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <select v-model="row.industry_id" class="pl-4">
              <option disabled selected value="">
                {{ $t("Branche") }}
              </option>
              <option v-for="industry in industries" :key="`option-${industry.id}`" :value="industry.id">
                {{ $t(industry.name) }}
              </option>
            </select>
            <div class="c-input-icon c-input-icon--teal">
              <i class="far fa-chevron-down"></i>
            </div>
          </div>
          <div class="c-input-row__wrapper">
            <select v-model="row.function_id" class="pl-4">
              <option disabled selected value="">
                {{ $t("Functie") }}
              </option>
              <option v-for="job in getFunctions(row.industry_id)" :key="`job-option${job.id}`" :value="job.id">
                {{ $t(job.name) }}
              </option>
            </select>
            <div class="c-input-icon c-input-icon--teal">
              <i class="far fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <div class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <input
                :id="`${input.handle}-${index}-name`"
                v-model="row.company"
                :placeholder="$t('Bedrijf')"
                class="input"
                type="text"
            />
            <label :for="`${input.handle}-${index}-name`">{{ $t("Bedrijf") }}</label>
          </div>
          <div class="c-input-row__wrapper">
            <input
                :id="`${input.handle}-${index}-title`"
                v-model="row.function_title"
                :placeholder="$t('Functietitel')"
                class="input"
                type="text"
            />
            <label :for="`${input.handle}-${index}-title`">{{ $t("Functietitel") }}</label>
          </div>
        </div>

        <div class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <FormFieldsMonthPicker
                :value="row.from_date"
                :label="$t('Vanaf')"
                :placeholder="$t('Vanaf')"
                @input="row.from_date = $event.target.value"
            />
          </div>
          <div class="c-input-row__wrapper">
            <FormFieldsMonthPicker
                :value="row.to_date"
                :label="$t('Tot')"
                :placeholder="$t('Tot')"
                @input="row.to_date = $event.target.value"
                name="to_date"
            />
          </div>
        </div>

        <span class="u-mt-small u-mb-big u-flex">
          <a class="c-form-link" @click.prevent="deleteRow(index)">
            {{ $t("Verwijder werkervaring") }}
            <div class="c-form-link__icon">
              <i class="far fa-trash-alt"></i>
            </div>
          </a>
        </span>
      </div>
      <span class="u-mt-big u-flex">
        <a class="c-form-link" @click.prevent="addRow()">
          {{ $t("+ nog een ervaring toevoegen") }}
        </a>
      </span>
    </div>
  </div>
</template>
<script>
const emptyRow = {industry_id: "", function_id: "", company: "", function_title: "", from_date: "", to_date: ""};

export default {
  name: "WorkExperience",
  components: {
    // MonthPicker
  },
  props: {
    input: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      loading: false,
      hasWorkExperience: 1,
      rows: []
    };
  },
  computed: {
    showAddRow() {
      const lastRow = this.rows.at(-1);
      return lastRow ? this.validRow(lastRow) : false;
    },
    hiddenInput() {
      return JSON.stringify(this.rows);
    }
  },
  watch: {
    rows(newValue) {
      if (newValue.length === 0) this.addRow();
    },
    hasWorkExperience(newValue) {
      this.$emit('set-has-work-experience', newValue)
    }
  },
  async beforeMount() {
    if (!this.industries) {
      this.loading = true;
      this.industries = this.input.industries;
      this.loading = false;
    }

    // TO DO MERGE VALUES FROM USER INTO ROWS
    if (this.input.value) {
      this.rows = this.input.value;
      return;
    }

    this.addRow();
  },
  mounted() {
    this.hasWorkExperience = this.input.has_work_experience ? 1 : 0;
  },
  methods: {
    addRow() {
      this.rows.push({...emptyRow});
    },
    getFunctions(industryId) {
      if (!industryId) return [];

      const industry = this.industries.find(industry => industry.id === industryId);

      return industry.functions;
    },
    deleteRow(index) {
      if(index != 0){
        this.rows.splice(index, 1);
      }else{
        this.rows.splice(index, 1);
        this.rows.splice(index, 0, { ...emptyRow });
      }
    },
    validRow(row) {
      return Object.values(row).every(value => !!value);
    }
  }
};
</script>
