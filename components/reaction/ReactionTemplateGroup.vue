<template>
  <CollapsiblePanel panel-type="parent" :open-on-init="true">
    <template v-slot:panel-header>
      <header class="tab__header">
        <div>
          <h3 class="sidebar__title">
            {{ template.function.name }}
            <template v-if="jobposts.length">({{ jobposts.length }})</template>
          </h3>
          <p v-if="template.function.name !== template.function_template.name" class="t-text">
            {{ template.function_template.name }}
          </p>
          <p>{{ template.employer_location.name }}</p>
        </div>
      </header>
    </template>

    <section class="tab-section">
      <ul>
        <li v-for="jobpost in jobposts" :key="jobpost.id">
          <NuxtLink
              class="tab__anchor tab__anchor--section"
              :class="[
                { active: `${templateId}/${jobId}` === tabName(jobpost) },
                { 'tab__anchor&#45;&#45;less-padding-mobile': hasSchedule(jobpost) }
              ]"
              :to="localePath(`/my-account/employer/reactions/${tabName(jobpost)}`)"
          >
            <JobpostDateBlock :jobpost="jobpost"/>

            <div class="tab__anchor__text">
              <p v-if="hasSchedule(jobpost)">{{ jobpost.schedule[0].start }} - {{ jobpost.schedule[0].end }}</p>
              <p>
                <strong class="color-first">{{ jobpost.pending_applications_count }}</strong>
                {{ $t(jobpost.pending_applications_count === 1 ? 'reactie' : 'reacties') }}
              </p>
              <p>
                <strong class="color-first">
                  <span>{{ jobpost.contracts_count || '0' }}</span>
                </strong>
                {{ $t('gevuld') }}
              </p>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </CollapsiblePanel>
</template>

<script setup>

import CollapsiblePanel from '~/components/elements/CollapsiblePanel.vue';

const reactionStore = useReactionStore();
const userStore = useUserStore();

const props = defineProps({
  template: {
    required: true,
    type: Object,
  },
  templateId: {
    type: String,
    default: '',
  },
  jobId: {
    type: String,
    default: '',
  },
});

if (reactionStore.jobPosts[props.template.function_template.id] === undefined) {
  await reactionStore.fetchJobPosts(userStore.user.employer_user.employer.id, props.template.function_template.id);
}

const jobposts = computed(() => reactionStore.jobPosts[props.template.function_template.id] || []);
const tabName = jobpost => `${props.template.function_template.id}/${jobpost.id}`;
const hasSchedule = jobpost => jobpost.type === 'gig' && jobpost.schedule;

</script>
