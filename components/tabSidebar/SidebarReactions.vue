<template>
  <div class="page__content tab__list">
    <ReactionTemplateGroup v-for="(template, i) in reactions" :key="i" :template="template" :job-id="jobId"
                           :template-id="templateId"/>
  </div>
</template>

<script setup>

const props = defineProps({
  reactions: {
    required: true,
    type: Array,
    default: [],
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

</script>

<style lang="scss" scoped>
.panel:not(:last-of-type) {
  margin-bottom: 40px;
}

:deep(.panel__anchor) {
  align-items: flex-end;

  i {
    margin-bottom: 18px;

    @include tablet {
      margin-bottom: 12px;
      margin-right: 32px;
    }
  }
}
</style>
