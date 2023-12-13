<template>
  <div v-if="skillsOptions && skillsOptions.length">
    <div class="u-mb-medium-big">
      <h3 class="t-heading-3">{{ $t(title) }}</h3>
    </div>
    <div class="l-checkbox-group">
      <label
        v-for="(skill, index) in skillsOptions"
        :key="`checkbox-group-${name}-${index}`"
        class="u-reset-styling u-flex-align-start"
      >
        <input
          v-model="selection"
          class="input"
          :name="`${name}[]`"
          type="checkbox"
          :value="skill.id"
          :class="{ 'selected-skill': isSelected(skill.id) }"
          @change="$emit('changed', selection)"
        />
        {{ $t(skill.name) }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkillSelect",
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "Skills"
    },
    skills: {
      type: Array,
      required: false,
      default: []
    },
    selectedSkills: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    predeterminedSkills: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selection: []
    };
  },
  computed: {
    skillsOptions() {
      if (this.predeterminedSkills.length) {
        return this.predeterminedSkills;
      }

      return this.skills;
    },
    selectedSkillsIds() {
      return this.selectedSkills.map(skill => skill.id);
    },
    predeterminedSkillsIds() {
      return this.predeterminedSkills.map(skill => skill.id);
    }
  },
  watch: {
    selectedSkills: {
      handler(value) {
        if (value) {
          let parse = Object.values(value);
          this.selection = parse;
          this.selectedSkillsIds;
        }
      },
      immediate: true,
    },
    selectedFunctionId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateSkills();
      }
    }
  },
  mounted() {
    if (this.predeterminedSkillsIds.length) {
      this.selection = this.predeterminedSkillsIds;
      this.$emit("update", this.selection);
      return;
    }

    if (this.selectedSkillsIds.length) {
      this.selection = this.selectedSkillsIds;
      this.$emit("update", this.selection);
      return;
    }
  },
  methods: {
    async updateSkills() {
      // await this.getSkills({ employerId: this.user.employer_id, functionId: this.selectedFunctionId });
    },
    isSelected(skillId) {
      return this.selection.includes(skillId);
    },
  }
};
</script>

<style lang="scss">
.l-checkbox-group {
  display: grid;
  row-gap: 16px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 16px;
    align-items: flex-start;
  }
}
</style>

