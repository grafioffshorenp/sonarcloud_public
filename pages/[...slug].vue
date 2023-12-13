<template>
  <template v-if="pageData && pageData.entry">
    <Head>
      <Title>RefugeeWork | {{ pageData.entry.title }}</Title>
    </Head>
    <ContentblocksHeader :data="headerData" />
    <ComponentLoader :data="pageData.entry.contentBlocks" v-if="pageData.entry.contentBlocks" />
    <ContentblocksPageContent :data="pageData.entry.pageContent" v-if="pageData.entry.pageContent" />
  </template>
</template>

<script setup>
import ContentBlocks from "../components/contentBlocks.vue";

const route = useRoute();
const router = useRouter();

const getSlug = () => {
  return route.path.split("/").at(-1);
}

const pageData = await useCraftData(getSlug(), 'generic');
const { locale, availableLocales } = useI18n()

const headerData = pageData && pageData.entry ? {
  title: pageData.entry.headerTitle,
  subtitle: pageData.entry.subtitle,
  callToAction: pageData.entry.callToAction,
  images: pageData.entry.backgroundHeader
} : null;

if (!pageData.entry) {
  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true
  })
}

</script>