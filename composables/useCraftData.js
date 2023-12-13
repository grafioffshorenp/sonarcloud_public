import { useCraftStore } from "@/stores/craft";
import { useI18n } from "vue-i18n";

export const useCraftData = async (slug, query, limit = 100) => {
  const craftStore = useCraftStore();
  const localized = useI18n();
  const { siteId } = localized.locales.value.find(
    (locale) => locale.code === localized.locale.value
  );

  const content = computed({
    get: () => craftStore.getContent,
    set: (val) => {
      craftStore.setContent(val);
    },
  });

  const fetchContent = async (slug, query, limit = 100) => {
    const { data } = await useAsyncGql({
      operation: query,
      variables: { limit: limit, siteId: siteId, slug: slug },
    }).catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
    // console.log("get data", data);
    return data.value;
  };

  const getTheData = async () => {
    //if the data does not exist in the state qeury the data and push it into the state
    const data = await fetchContent(slug, query, limit);

    const updateState = {
      ...content.value,
      [localized.locale.value]: {
        ...(content.value && content.value[localized.locale.value]),
        [slug.replace(/-/g, "")]: data,
      },
    };
    content.value = updateState;
    return content.value[localized.locale.value][slug.replace(/-/g, "")];
  };

  //check if the content object contains the query key provided on function call
  const hasPagedata =
    content &&
    content.value &&
    content.value.hasOwnProperty(localized.locale.value) &&
    content.value[localized.locale.value].hasOwnProperty(
      slug.replace(/-/g, "")
    );

  //Return the data from the graphQl query acording to the query string given as input
  return !hasPagedata
    ? await getTheData()
    : content.value[localized.locale.value][slug.replace(/-/g, "")];
};

export default useCraftData;
