<template>
  <div v-if="!loading">
    <label v-if="input.label" :for="`form-input-${input.handle}`" :class="{ required: input.required }">{{ $t(input.label) }}</label>

    <p v-if="input.instructions">{{ $t(input.instructions) }}</p>

    <input v-model="hiddenInput" type="hidden" :name="input.handle" />
    <FormFieldsPillsToggle v-model="value" :items="pills" @input="value = $event" />
  </div>
  <div v-else>
    {{ $t("Aan het laden... ⏳") }}
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "EmployeeSkillsSelect",
  props: {
    input: {
      required: true,
      type: Object
    },
    skillsType: {
      required: true,
      type: String
    },
  },
  data() {
    return {
      value: [],
      pills: [],
      loading: false
    };
  },
  computed: {
    hiddenInput() {
      this.$emit('changed', this.value)
      return JSON.stringify(this.value);
    }
  },
  async mounted() {
    this.loading = true;

    // const { data: skills = [] } = await Api.get(`/skills?employee_id=${this.user.id}&filter[type]=${this.skillsType}`);

    // const { data: workExperienceSkills = [] } = await Api.get(
    //   `/employee-work-experience-skills?employee_id=${this.user.id}&filter[type]=${this.skillsType}`
    // );

    let skills = this.input.skills;
    let workExperienceSkills = this.input.workExperienceSkills;

    this.pills = _.uniqBy([...skills, ...workExperienceSkills], "id").map(skill => {
      return { ...skill, name: skill.name, selected: skills.includes(skill) };
    });

    this.loading = false;
  }
};
</script>
