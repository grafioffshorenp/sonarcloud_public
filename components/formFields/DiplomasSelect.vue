<template>
  <div>
    <label v-if="input.label">{{ $t(input.label) }}</label>
    <p v-if="input.instructions">{{ $t(input.instructions) }}</p>
    <p class="pb-2">{{ "Have you completed any education?" }}</p>
    <div><input v-model="hasEducation" type="radio" :value="1" class="mb-4" /> {{ $t("Yes") }}</div>
    <div><input v-model="hasEducation" type="radio" :value="0" class="mb-4" /> {{ $t("No") }}</div>
    <input type="hidden" name="has_education" :value="hasEducation" />
    <div v-if="hasEducation">

      <div v-if="errors && errors.educations" class="text-red-400">{{ $t(errors.educations[0]) }}<br /><br /></div>

      <input v-model="hiddenInput" type="hidden" :name="input.handle" />
      <div v-for="(row, index) in rows" :key="`row-diplomas-${index}`">
        <div class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <input :id="`${input.handle}-${index}-title`" v-model="row.title" type="text" class="input"
              :placeholder="$t('Titel opleiding')" />
            <label :for="`${input.handle}-${index}-title`">{{ $t("Titel opleiding") }}</label>
          </div>
          <div class="c-input-row__wrapper">
            <input :id="`${input.handle}-${index}-institution`" v-model="row.institution" type="text" class="input"
              :placeholder="$t('Institute')" />
            <label :for="`${input.handle}-${index}-institution`">{{ "Institute" }}</label>
          </div>
        </div>
        <div class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <FormFieldsMonthPicker :value="row.end_period" :label="$t('Tot')" :placeholder="$t('Tot')" name="end_period"
              @input="row.end_period = $event.target.value" />
            <div v-if="errors && errors['educations.0.end_period']" class="text-red-400">{{ $t(errors['educations.0.end_period'][0]) }}<br /><br /></div>
          </div>
          <div class="c-input-row__wrapper">
            <p class="u-mb-small">{{ $t("verified") }}</p>
            <div class="relative" style="display: flex">
              <div class="auto-accept__switch" style="display: inline-block ">
                <div class="auto-accept__switch-toggle">
                  <label class="input--switch">
                    <input v-model="row.verified" type="checkbox" @click="toggleEducation(row)" />
                    <span class="toggler"></span>
                  </label>
                </div>
              </div>
              <FormFieldsInfoButton style="margin-left: 1rem;"
                :text="$t('verified_explanation')"
                handle="verified_explanation" />
            </div>
          </div>
        </div>

        <div v-if="row.verified" class="c-input-row c-input-row--columns-2">
          <div class="c-input-row__wrapper">
            <FormFieldsEducationSelectFunctionTemplate
              :input="{ handle: 'level', required: true, value: row.level, label: 'Niveau (thuisland)' }"
              @change="row.level = $event.target.value" />
          </div>
        </div>

        <span class=" u-mt-small u-mb-big u-flex">
          <a class="c-form-link" @click.prevent="deleteRow(index)">
            {{ $t("Verwijder diploma") }}

            <div class="c-form-link__icon">
              <i class="far fa-trash-alt"></i>
            </div>
          </a>
        </span>
      </div>
      <span class="u-mt-big u-flex">
        <a class="c-form-link" @click.prevent="addRow()">
          {{ $t("+ nog een diploma toevoegen") }}
        </a>
      </span>
    </div>
  </div>
</template>
<script>
const emptyRow = { title: "", institution: "", start_period: "", end_period: "", level: "" };

export default {
  name: "DiplomasSelect",
  props: {
    input: {
      required: true,
      type: Object
    },
    errors: {
      required: false,
      default: [],
      type: Array
    }
  },
  data() {
    return {
      hasEducation: 1,
      rows: []
    };
  },
  computed: {
    hiddenInput() {
      return JSON.stringify(this.rows);
    }
  },
  watch: {
    rows(newValue) {
      if (newValue.length === 0) this.addRow();
    },
    hasEducation(newValue) {
      this.$emit('set-has-education', newValue);
    }
  },
  mounted() {
    this.hasEducation = this.input.has_education ? 1 : 0;
    if (this.input.value) {
      const rows = this.input.value;
      for (const i of rows) {
        if (i.level) {
          i.verified = true;
        }
      }
      this.rows = rows;
      return;
    }

    this.addRow();
  },
  methods: {
    addRow() {
      this.rows.push({ ...emptyRow });
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
    },
    toggleEducation(row) {
      row.level = "";
    }
  }
};
</script>
