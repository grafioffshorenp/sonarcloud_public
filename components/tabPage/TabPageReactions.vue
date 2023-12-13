<template>
  <p v-if="loading && reaction">
    {{ $t('De reacties voor') }} {{ reaction.function_template.name }} {{ $t('worden geladen...') }}
  </p>
  <div v-else-if="applications.length" class="tab__page page-details active">
    <header v-if="reaction" class="tab__header">
      <div>
        <div class="u-mb-small">
          <h2>{{ jobPost.function.name }}</h2>
        </div>
        <p v-if="jobPost.function.name !== jobPost.function_template.name" class="t-text t-text--bold">
          {{ jobPost.function_template.name }}
        </p>
        <p v-if="jobPost">{{ getAddress(jobPost.employer_location) }}</p>
        <p class="t-text t-text--small">
          <DateRange :date-range="jobPost" :locale="locales[locale]"/>
          <br class="mobile-line-break"/>
          <template v-if="hasSchedule(jobPost)">
            {{ $t('van') }} {{ jobPost.schedule[0].start }} {{ $t('tot') }} {{ jobPost.schedule[0].end }}
          </template>
        </p>
      </div>
      <p>
        <strong class="color-first">{{ jobPost.pending_applications_count || 0 }}</strong>
        {{ $t(jobPost.pending_applications_count === 1 ? 'reactie' : 'reacties') }}
      </p>
    </header>

    <div v-for="application in applications" :key="application.id" class="panel-list-item employee">
      <CollapsiblePanel class="empty" panel-type="parent">
        <template v-slot:panel-header>
          <div class="panel-list-item__header">
            <ProfilePicture :click-to-enlarge="true" :employee="application.employee" type="medium"/>

            <div>
              <p class="panel-list-item__name">
                <strong>{{ application.employee.first_name }}</strong>
              </p>
            </div>
          </div>
        </template>

        <template v-for="slot in ['expand', 'collapse']" v-slot:[slot]>
          <div :key="slot" :class="slot">
            <p v-if="isAccepted(application)" :class="isAccepted(application) ? 'tertiary-status' : 'primary-status'">
                  <span>
                    {{ $t('In behandeling') }}
                  </span>
              <i v-if="isAccepted(application)" class="fas fa-clock icon--large"/>
            </p>
            <span v-if="isPending(application) && isInvited(application)" class="badge badge--small badge--light-alt">
                  {{ $('Uitgenodigd') }}
                </span>
            <i :class="`fas fa-chevron-${slot === 'expand' ? 'down' : 'up'}`"/>
          </div>
        </template>

        <div class="panel-list-item__content">
          <EmployeeDetails
              :employee="application.employee"
              :hide-top-details="true"
              :jobpost="application.job_post"
              :status="application.status"
              hide-bottom
          />

          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t('Motivatie') }}</h1>
          <p class="translate">{{ application.motivation || $t('Geen motivatie bekend') }}</p>
          <hr class="border-b my-4"/>

          <h2 v-if="isGig(jobPost) && isPending(application)">
            {{ $t('Accepteren / Weigeren') }}
          </h2>

          <section class="page-details__section page-details__buttons">
            <RejectReactionModal
                v-if="showReactionModal"
                :reaction="application"
                @submit="handleSubmitRejection"
                @close-modal="closeModalRejection"
            />

            <Button
                v-if="!isAccepted(application)"
                :class="['btn--flatten',
                  { disabled: loadingUpdate || isRejected(application) || (isGig(jobPost) && disableButton) }
                ]"
                button-type="action"
                @click.native="showReactionModal = true"
                :configuration="{
                  buttonText: $t('Weigeren'),
                }">
              <template v-if="isRejected(application)">
                {{ $t('Geweigerd') }}
              </template>
            </Button>

            <Button
                v-if="!isRejected(application)"
                :class="['btn--flatten',
                  { disabled: loadingUpdate || isAccepted(application) || (isGig(jobPost) && disableButton) }
                ]"
                :configuration="{
                  buttonText: $t('Accepteer'),
                }"
                button-type="action"
                @click.native="submitReactionUpdate(application, 'accept')"
            >
              <template v-if="isAccepted(application)">
                {{ $t('In behandeling') }}
              </template>
            </Button>
          </section>

          <FailedReactionsModal v-if="failedReactionsData" :data="failedReactionsData" @toggle-modal="clearModal"/>
        </div>
      </CollapsiblePanel>
    </div>
  </div>
</template>

<script setup>

import { getAddress } from '~/helpers/jobpostHelpers.js';
import * as locales from 'date-fns/locale/index.js';
import RejectReactionModal from '~/components/modals/RejectReactionModal.vue';
import DateRange from '~/components/elements/DateRange.vue';
import CollapsiblePanel from '~/components/elements/CollapsiblePanel.vue';
import Button from '~/components/elements/Button.vue';
import FailedReactionsModal from '~/components/modals/FailedReactionsModal.vue';

const { locale } = useI18n();

const props = defineProps({
  reaction: {
    type: Object,
  },
  jobId: {
    type: String,
  },
});

const userStore = useUserStore();
const reactionStore = useReactionStore();
const applications = computed(
    () => reactionStore.applications[`${props.reaction.function_template.id}~${props.jobId}`] || [],
);
const jobPost = computed(
    () => reactionStore.jobPosts[props.reaction.function_template.id].find(
        jobPost => jobPost.id === parseInt(props.jobId)),
);

const loading = ref(false);
const loadingUpdate = ref(false);
const showReactionModal = ref(false);
const disableButton = ref(true);
const failedReactionsData = ref(null);
const router = useRouter();

const hasSchedule = jobpost => jobpost.type === 'gig' && jobpost.schedule;
const isInvited = application => application.employee.has_flexpool_invite_for_job_post;
const isAccepted = application => application.status === 'accepted';
const isPending = application => application.status === 'pending';
const isRejected = application => application.status === 'rejected';
const isGig = jobpost => jobpost.type === 'gig';

const submitReactionUpdate = async (reaction, type, reason = null) => {
  if (loadingUpdate.value) {
    return;
  }

  loadingUpdate.value = true;

  const body = {
    application_ids: [reaction.id],
    job_post_ids: [reaction.job_post.id],
  };

  if (reason) {
    body.reason_id = +reason;
  }

  const response = await reactionStore.updateReactions(reaction.job_post.function_template.id, type, body);
  loadingUpdate.value = false;

  if (response.failed) {
    failedReactionsData.value = response.failed;
  } else if (response.data[0] && response.data[0].conversation && response.data[0].conversation.id) {
    await router.push({
      path: `/my-account/employee/inbox/${response.data[0].conversation.id}`
    });
  }
};

const handleSubmitRejection = async ({ reaction, reason }) => {
  showReactionModal.value = false;
  await submitReactionUpdate(reaction, 'reject', reason);
};

const closeModalRejection = () => showReactionModal.value = false;
const clearModal = () => failedReactionsData.value = null;
onMounted(async () => {
  if (reactionStore.applications[`${props.reaction.function_template.id}~${props.jobId}`] === undefined) {
    loading.value = true;
    await reactionStore.fetchApplications(
        userStore.user.employer_user.employer.id,
        props.reaction.function_template.id,
        props.jobId,
    );
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
:deep(.panel-list-item) {
  &:first-of-type {
    margin-top: 24px;
  }

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }

  .panel__anchor {
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }

  .panel-list-item__content {
    @include tablet {
      margin-left: 64px;
    }
  }
}
</style>
