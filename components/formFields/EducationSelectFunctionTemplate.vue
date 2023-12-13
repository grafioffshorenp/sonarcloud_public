<template>
  <div>
    <p v-if="loading">{{ $t("Opleidingsniveau wordt geladen... ") }}</p>

    <template v-if="educations && educations.length">
      <select :name="input.handle" :required="input.required" class="input pl-4" @change="$emit('changed', $event)">
        <option value="">{{ $t("Minimale opleidingsrichting") }}</option>
        <option
          v-for="education in educations"
          :key="`education-${education.value}`"
          :selected="education.value === input.value"
          :value="education.value"
        >
          {{ $t(education.name) }}
        </option>
      </select>
      <div class="c-input-icon c-input-icon--teal">
        <i class="far fa-chevron-down"></i>
      </div>
    </template>
    <label :class="{ required: input.required }">{{ $t(input.label) }}</label>
  </div>
</template>

<script>
export default {
  name: "EducationSelectFunctionTemplate",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      educations: [
        {
          name: "Master (WO)",
          value: "master_wo"
        },
        {
          name: "Master (HBO)",
          value: "master_hbo"
        },
        {
          name: "Bachelor (WO)",
          value: "bachelor_wo"
        },
        {
          name: "Bachelor (HBO)",
          value: "bachelor_hbo"
        },
        {
          name: "MBO",
          value: "mbo"
        },
        {
          name: "VWO",
          value: "vwo"
        },
        {
          name: "HAVO",
          value: "havo"
        },
        {
          name: "VMBO",
          value: "vmbo"
        },
        {
          name: "Geen opleiding",
          value: "geen"
        }
      ]
    };
  }
};
</script>
