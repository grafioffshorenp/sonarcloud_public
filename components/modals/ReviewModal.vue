<template>
  <div v-if="reviewsFields">
    <div :class="['modal modal--wide', { active: modalActive }]">
      <ModalWrapper @toggle-modal="toggleModalActive()">
        <h3 class="modal__title text-left">{{ modalTitle }}</h3>

        <div v-if="modalFields.modalText" class="modal__text text-left" v-html="modalFields.modalText"/>

        <p v-if="loadingForm" class="loading">{{ modalFields.formLoading || 'Formulier wordt geladen...' }}</p>

        <p v-if="!loadingForm && !reviewForm.length" class="loading error-message">
          {{ $t(modalFields.formLoadingError) || $t('Formulier kon niet geladen worden') }}
        </p>

        <form v-if="reviewForm.length" @submit.prevent="submit($event)">
          <h3>
            {{ $t(modalFields.formTitle) || $t('Geef je waardering') }}
            <Popover v-if="modalFields.formPopover" :text="modalFields.formPopover"/>
          </h3>

          <input type="hidden" name="contract_id" :value="contractId"/>
          <input type="hidden" name="context" :value="context"/>
          <input v-if="context === 'employer'" type="hidden" name="employee_id" :value="employee.id"/>
          <input v-if="context === 'employer'" type="hidden" name="employer_id" :value="employerId"/>

          <div class="modal__stars">
            <RatingStars @set-rating="setRating"/>
          </div>

          <SkillSelect
              v-if="hasSkills"
              :title="modalFields.skillsSelectTitle"
              :predetermined-skills="skills"
              name="skill_ids"
              @update="setSkills"
          />

          <h3 v-if="rating">{{ $t('Opmerking') }}</h3>
          <template v-for="page in reviewForm">
            <div v-for="layout in page.layout" :key="layout.id" class="input-row">
              <div v-for="field in layout.columns" :key="field.id" :class="['input-wrapper', `input--${field.handle}`]">
                <template v-if="rating">
                  <Checkbox v-if="field.type === 'checkbox'" :input="field"/>
                  <Textarea v-else-if="field.type === 'textarea'" :input="field"/>
                </template>
              </div>
            </div>
          </template>

          <FlexpoolSwitch
              v-if="showFlexpoolSwitch"
              :employee-id="employee.id"
              :in-flexpool="employee.in_current_employer_flexpool"
              :is-after-review="true"
              :location-id="locationId"
              :function-id="functionId"
              :function-name="functionName"
          />

          <div class="modal__submit">
            <button :class="['btn btn--flatten', { disabled: disableButton(context) }]" type="submit">
              {{ $t('Indienen') }}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>

    <div class="modal" :class="{ active: !modalActive }">
      <ModalWrapper :min-height="false" @toggle-modal="$emit('close-modal')">
        <h3 class="modal__title text-left">{{ modalFields.abortTitle || 'Weet je het zeker?' }}</h3>

        <p v-if="modalFields.abortText" class="modal__text text-left" v-html="modalFields.abortText"/>

        <div class="u-mb-medium u-width-100%">
          <div class="modal__submit">
            <a class="btn btn--flatten" @click="toggleModalActive()">
              {{ modalFields.abortButton || 'Verder met review' }}
            </a>
          </div>
        </div>

        <a class="text-link" @click="$emit('close-modal')">{{ modalFields.abortConfirm || 'Ik weet het zeker' }}</a>
      </ModalWrapper>
    </div>
  </div>
</template>

<script>

import { useUserStore } from '~/stores/user.js';
import ModalWrapper from '~/components/elements/ModalWrapper.vue';
import { Popover } from '@headlessui/vue';
import Textarea from '~/components/formFields/Textarea.vue';
import SkillSelect from '~/components/formFields/SkillSelect.vue';
import Checkbox from '~/components/formFields/Checkbox.vue';
import FlexpoolSwitch from '~/components/flexpool/FlexpoolSwitch.vue';
import RatingStars from '~/components/elements/RatingStars.vue';

export default {
  name: 'ReviewModal',
  components: {
    Checkbox,
    FlexpoolSwitch,
    ModalWrapper,
    Popover,
    RatingStars,
    Textarea,
    SkillSelect,
  },
  props: {
    context: {
      required: true,
      type: String,
    },
    contractId: {
      required: true,
      type: Number,
    },
    employee: {
      required: false,
      type: Object,
      default: null,
    },
    name: {
      required: true,
      type: String,
    },
    locationId: {
      required: false,
      type: Number,
      default: null,
    },
    functionId: {
      required: false,
      type: Number,
      default: null,
    },
    functionName: {
      required: false,
      type: String,
      default: null,
    },
    skills: {
      required: false,
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      loadingForm: false,
      modalActive: true,
      rating: 0,
      skillInput: [],
      userStore: useUserStore(),
    };
  },
  computed: {
    user() {
      return this.userStore.user;
    },
    isEmployer() {
      return this.userStore.isEmployer;
    },
    employerId() {
      return this.user.employer.id;
    },
    modalFields() {
      return this.isEmployer ? this.reviewsFields.employerReviewModal : this.reviewsFields.employeeReviewModal;
    },
    modalTitle() {
      return this.name;
    },
    showFlexpoolSwitch() {
      return this.context === 'employer' && this.rating && this.employee.in_current_employer_flexpool !== undefined;
    },
    hasSkills() {
      return this.isEmployer && this.skills && this.skills.length;
    },
  },
  async mounted() {
    if (!this.reviewForm.length) {
      this.loadingForm = true;
      await this.getReviewForm(this.isEmployer ? 'employerReview' : 'employeeReview');
      this.loadingForm = false;
    }
    if (this.context === 'employer') {
      this.getFlexpoolStatusForContract({ employerId: this.employerId, contractId: this.contractId });
    }
  },
  methods: {
    disableButton(context) {
      if (context === 'employer') {
        return this.loading || !this.rating;
      }
      return this.loading || !this.rating;
    },
    setRating(rating) {
      this.rating = rating;
    },
    setSkills(skills) {
      this.skillInput = skills;
    },
    async submit($event) {
      this.loading = true;
      const response = await this.submitReview($event.target);
      this.loading = false;

      let title;
      let description;

      if (response && response.data) {
        await this.submitSkills($event.target);

        title = this.$options.filters.t('Top!', 'toastr');
        description = this.$options.filters.t('Je review is succesvol opgeslagen', 'toastr');

        this.setToastr({
          scrollToTop: false,
          text: `<strong>${title}</strong> ${description}`,
          type: 'success',
        });
        this.$emit('review-submitted');
      } else {
        title = this.$options.filters.t('Fout', 'toastr');
        description = this.$options.filters.t('Je review kon niet worden opgeslagen', 'toastr');

        this.setToastr({ text: `<strong>${title}</strong> ${description}`, type: 'error' });
      }
    },
    async submitSkills(formData) {
      const data = new FormData(formData);
      if (!this.context === 'employer' || !this.skillInput.length) {
        return null;
      }

      data.delete('context');
      data.delete('remark');
      data.delete('rating');

      return await this.saveReviewSkills(data);
    },
    async submitReview(formData) {
      const data = new FormData(formData);
      data.delete('skill_ids');
      data.delete('employer_id');
      data.delete('employee_id');

      return await this.saveReview({ data, context: this.context, contractId: this.contractId });
    },
    toggleModalActive() {
      this.modalActive = !this.modalActive;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  .modal__text,
  .modal__text :deep(p) {
    margin-bottom: 0;
  }

  .modal__title {
    line-height: 133%;
  }

  .modal__content .btn {
    margin-top: 32px;
  }
}

p.loading {
  margin-top: 16px;
}

form {
  text-align: left;
  width: 100%;

  h3 {
    margin-top: 24px;
    position: relative;
  }

  .input-wrapper {
    margin-bottom: 0;
  }
}
</style>
