<template>
  <div :class="{ active: modalOpen, 'modal--wide': formSuccess }" class="modal">
    <ElementsModalWrapper :min-height="!formSuccess" @toggle-modal="emit('toggle-modal')">
      <div v-if="user.employee.profile_completeness !== 100" class="application-form">
        <div class="application-form__centered">
          <i class="rounded-icon fas fa-info" />

          <p><strong>We need a few more details from you before you can respond to this shift.</strong></p>
          <p>In <strong>'My account'</strong>, you can edit your details.</p>

          <ul v-if="!hasMissingProfileFields">
            <li v-for="(value, index) in missingJobpostFields" :key="index">{{ value }}</li>
          </ul>
        </div>

        <router-link class="c-btn" to="/my-account">{{$t('Mijn account')}}</router-link>
      </div>

      <div v-else class="application-form-wrapper">
        <div v-if="!formSuccess" class="application-form text-left">
          <h3 class="modal__title">
            {{ $t("Good to hear from you!") }}
          </h3>

          <div class="modal__text">
            <div class="modal__html-content">
              <p>{{ $t("To increase your chances, please briefly answer these questions:") }}</p>
              <ul>
                <li>{{ $t("Why do you like this job?") }}</li>
                <li>{{ $t("What is your experience and what are your strengths?") }}</li>
                <li>{{ $t("Would you like to say something else about why this job suits you?") }}</li>
              </ul>
              <p><br></p>
              <p>{{ $t("Pay attention: check the distance from your home to the location of this job before you respond.") }}<br><br></p>
              <p><br></p>
            </div>
          </div>

          <ElementsVacancyApplyForm :vacancy="vacancy" @toggle-modal="emit('toggle-modal')"
            @form-success="formSuccessHandler" @update-jobpost="data => emit('update-jobpost', data)" />
        </div>

        <div v-if="formSuccess" class="application-form text-left">
          <div class="application-form__centered">
            <h3 class="modal__title">{{ $t("Bedankt voor je reactie!") }}</h3>
            <div class="modal__text">
              {{ $t("Your response has been sent") }}
            </div>

            <!-- <div v-if="entry.applicationModal.formSuccessCtaText" class="modal__link">
              <a href="/mijn-account/inbox" class="c-btn c-btn--as-text-link c-btn--underline c-btn--text-centered">
                {{ entry.applicationModal.formSuccessCtaText || "Bekijk je inbox" }}
              </a>
            </div> -->
          </div>
        </div>
      </div>
    </ElementsModalWrapper>
  </div>
</template>

<script setup>
const props = defineProps({
  vacancy: {
    type: Object,
    default: null,
    required: true,
  },
  modalOpen: {
    required: true,
    type: Boolean
  },
  user: {
    default: null,
    required: false,
    type: Object
  }
});

const emit = defineEmits(['toggle-modal', 'update-jobpost']);

let formSuccess = ref(false);
const formSuccessHandler = () => {
  formSuccess.value = true;
};

</script>

<style lang="scss" scoped>
.modal {
  .application-form-wrapper {
    width: 100%;
  }

  .modal__text,
  .modal__text p {
    margin-bottom: 12px;
  }

  .modal__html-content {
    text-align: left;
    color: $grey;

    &:deep(> ul) {
      margin-left: 1rem;

      list-style: disc;
    }
  }

  .modal__link {
    > a {
      max-width: initial;
      font-weight: 600;
    }
  }
}
</style>