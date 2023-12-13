<template>
  <template v-if="pageData && pageData.entry">
    <Head>
      <Title>RefugeeWork | Home</Title>
    </Head>
    <ContentblocksHeader :data="headerData" />
    <ComponentLoader :data="pageData.entry.contentBlocks" />
  </template>
</template>

<script setup>

import { useCraftData } from "@/composables/useCraftData";

const pageData = await useCraftData('homepage', 'homepage');

const headerData = pageData && pageData.entry ? {
  title: pageData.entry.headerTitle,
  subtitle: pageData.entry.subtitle,
  callToAction: pageData.entry.callToAction,
  images: pageData.entry.backgroundHeader
} : null;
</script>

<style scoped lang="scss"></style>
