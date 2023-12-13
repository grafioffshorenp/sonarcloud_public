<template>
  <main id="main">
    <div class="page page-my-applications">
      <TabWrapper v-if="reactions.length > 0" wrapper-class="page__small" class="inner-row--large">
        <template v-slot:tab-sidebar>
          <SidebarReactions :job-id="route.params.jobId" :template-id="route.params.templateId" :reactions="reactions"/>
        </template>
        <template v-slot:tab-panel>
          <section class="page__content">
            <TabPageReactions
                v-if="currentReaction"
                :reaction="currentReaction"
                :job-id="route.params.jobId"
                :template-id="route.params.templateId"/>
          </section>
        </template>
      </TabWrapper>

      <div v-else class="inner-row--small page__box">
        <NoResults title="Je hebt nog geen reacties." :text="$t('Zodra er is gereageerd, verschijnen de reacties hier.')">
          <NuxtLink :to="localePath('/my-account/employer/vacancies')"
                     class="btn--flatten-tablet c-btn btn color-default background-default border-default">
            {{ $t('Vacature aanmaken') }}
          </NuxtLink>
        </NoResults>
      </div>
    </div>

    <ReviewModal
        v-if="showReviewModal"
        context="employee"
        :contract-id="reviewContractId"
        :name="userStore.user.first_name"
        @review-submitted="closeReviewModal"
        @close-modal="closeReviewModal"
    />
  </main>
</template>

<script setup>

import SidebarReactions from '~/components/tabSidebar/SidebarReactions.vue';
import { useReactionStore } from '~/stores/reactions.js';
import NoResults from '~/components/elements/NoResults.vue';
import TabWrapper from '~/components/elements/TabWrapper.vue';
import ReviewModal from '~/components/modals/ReviewModal.vue';

definePageMeta({
  layout: 'account',
  title: 'Mijn reacties',
});

const userStore = useUserStore();
const reactionStore = useReactionStore();
const showReviewModal = ref(false);
const reviewContractId = ref(null);
const reviewEmployeeId = ref(null);

await userStore.fetchUser();

await reactionStore.fetchReactions(userStore.user.employer_user.employer.id);

const reactions = computed(() => reactionStore.reactions);

const route = useRoute();

const currentReaction = computed(
    () => reactionStore.reactions.find(reaction => reaction.function_template.id === parseInt(route.params.templateId)),
);
const closeReviewModal = () => showReviewModal.value = false;

onMounted(async () => {
  if (route.query.review) {
    const reviewData = route.query.review.split('_');
    reviewContractId.value = parseInt(reviewData[0]);
    reviewEmployeeId.value = parseInt(reviewData[1]);

    showReviewModal.value = true;
  }
});

</script>

<style lang="scss">
.page-my-contracts,
.page-my-applications {
  .page-details {
    &__section {
      margin-bottom: 24px;

      &.page-details__buttons {
        border: none;
        display: flex;
        flex-direction: row;
        margin: 24px 0 0 0;
        padding: 0;

        @include until-tablet {
          box-shadow: none;
        }

        @include tablet {
          margin-top: 40px;
        }

        @include desktop {
          flex-direction: row;
        }

        .btn {
          max-width: 50%;

          &:only-of-type {
            max-width: 100%;
          }
        }

        .btn:first-of-type:not(:only-of-type) {
          margin-right: 16px;

          @include tablet {
            flex-direction: row;
          }

          @include desktop-wide {
            margin-right: 32px;
          }
        }
      }
    }
  }
}
</style>
