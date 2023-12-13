<template>
  <div v-if="talent">
    <header>
      <!-- TODO: should give a percentage of selected skills + skills of profile -->
      <h1 v-if="!talent.anonymous_consent" class="c-content-page__title t-title-2 t-title-2--teal capitalize">
        {{ $t('anonymous') }} {{ $t('Profiel') }}
      </h1>
      <div v-else class="header-container">
        <div class="image-div image-div--big">
          <div v-if="talent.profile_picture" class="circle-image circle-image--big">
            <img :src="talent.profile_picture" alt="Profile Image"/>
          </div>
          <div v-else class="circle-image--big img picture bg-fallback-employee bg-fallback-employee--big"></div>
        </div>
        <div class="name-lastname-div">
          <h1 class="c-content-page__title t-title-2 t-title-2--teal capitalize">
            {{ talent.first_name }} {{ talent.last_name }}
          </h1>
        </div>
      </div>
    </header>
        <div class="page-details">
          <section class="page-details__section" v-if="talent.region">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Locatie') }}</h2>
              </div>
              <div class="u-flex-align-center u-mb-small"><i class="fal fa-map-marker-alt talentsearch-icon"></i>
                {{ talent.region }}
              </div>
            </div>
          </section>
          <section class="page-details__section" v-if="doesExistRule(talent.languages)">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Taalniveau') }}</h2>
              </div>
              <div class="body u-mb-small">
                <ul class="l-inline-items l-inline-items--wrap">
                  <li class="u-mb-small" v-for="language in talent.languages" :key='language'>
                    <div class="c-pill c-pill--selected">{{ language.lang }} {{ language.level }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section v-if="doesExistRule(talent.educations)" class="page-details__section">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Opleidingen') }}</h2>
              </div>
              <div class="u-mb-small">
                <ul>
                  <li v-for="(item, index) in talent.educations" :key="`education-${index}`">
                    <div class="flex-start flex items-center">
                      <div class="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300"></div>
                      <h4 class="mb-1.5 text-xl font-semibold text-zinc-800">
                        {{ item.title }}
                        <span v-if="item.level" class="text-neutral-400">[{{ item.level }}]</span>
                      </h4>
                    </div>
                    <div class="mb-6 mt-2 border-l border-neutral-300 pl-4">
                      <p class="mb-3 text-zinc-800">
                        {{ item.institution }}
                      </p>
                      <p class="text-sm text-neutral-400">
                        {{ item.end_period }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section class="page-details__section" v-if="doesExistRule(talent.skills)">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Skills') }}</h2>
              </div>
              <div class="body u-mb-small">
                <ul class="l-inline-items l-inline-items--wrap">
                  <template v-for="skill in talent.skills" :key='skill'>
                    <li class="u-mb-small">
                      <div class="px-3 py-1 rounded-lg border border-sky-500 text-sm text-sky-500">
                        {{ $t(skill.name) }}
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </section>
          <section class="page-details__section"
                   v-if="doesExistRule(talent.work_experiences)">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Recente werkervaring') }}</h2>
              </div>
              <ul>
                <template v-for="experience in talent.work_experiences" :key="experience.id">
                  <li>
                    <div class="flex-start flex items-center">
                      <div class="-ml-[5px] mr-3 h-3 w-3 rounded-full bg-neutral-300"></div>
                      <h4 class="mb-1.5 text-xl font-semibold text-zinc-800">
                        {{ experience.function_title }}
                      </h4>
                    </div>
                    <div class="mb-6 mt-2 border-l border-neutral-300 pl-4">
                      <p class="mb-3 text-zinc-800"></p>
                      <p class="text-sm text-neutral-400">{{ experience.from_date }} - {{
                          experience.to_date
                        }}</p>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </section>
          <section class="page-details__section">
            <div class="page-details__properties">
              <div class="u-mb-small">
                <h2 class="header t-title-2--thin">{{ $t('Availability') }}</h2>
              </div>

                  <ul v-if="talent.work_status_holder">
                    <li class="u-flex-align-center u-mb-small">
                      <i class="fal fa-suitcase talentsearch-icon"></i>
                      {{  $t(talent.work_status_holder) }}
                    </li>
                  </ul>
            </div>
          </section>
        </div>

    <div>
      <button :disabled="buttonDisabled" type="button" class="c-btn c-btn--with-icon"
              :class="{ 'c-btn--disabled': buttonDisabled, 'bg-orange-500 hover:bg-orange-600': !buttonDisabled }"
              @click="toggleModal()">
        Neem contact op<i class="far fa-comment-alt"></i>
      </button>
    </div>

    <ElementsTalentReachOutFormModal v-if="modalIsActive" :employee-id="talent.id" :templates="templates"
                                     :locations="user.employer_user.employer_locations" @toggle-modal="toggleModal()">
    </ElementsTalentReachOutFormModal>

    <div v-if="reachOutDisabledMessage" class="u-mb-small u-mt-small">
      <p>{{ $t(reachOutDisabledMessage) }}</p>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  talent: {
    type: Object || null,
    default: null,
    required: true,
  },
});

const userStore = useUserStore();
const user = await userStore.fetchUser();
const reachOutDisabledMessage = ref();
const templates = ref([]);

onMounted(async () => {
  const { data } = await useRWApi(`/employer/${user.employer_user.employer.id}/talent-pool/function-templates`, {
    method: 'GET',
    params: {
      employer_id: user.employer_user.employer.id,
      'filter[type]': 'soft',
    },
  });
  templates.value = data;
});

const buttonDisabled = computed(() => {
  if (user.employer_user.employer.profile_completeness < 100) {
    reachOutDisabledMessage.value = 'Deze contact-mogelijkheid is beschikbaar als je profiel compleet is.';
    return true;
  } else if (templates.value.length === 0) {
    reachOutDisabledMessage.value = 'Deze contact-mogelijkheid is beschikbaar als je functies hebt aangemaakt.';
    return true;
  }
  return false;
});

const modalIsActive = ref(false);
const toggleModal = () => {
  modalIsActive.value = !modalIsActive.value;
};

const doesExistRule = (data) => {
  return data && data.length > 0;
};
</script>

<style scoped lang='scss'>
.image-div {
  width: 20%;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.image-div--big {
  width: 30%;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.name-lastname-div {
  width: 80%;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.talentsearch-list__header {
  width: 100%;
  overflow: hidden;
}

.circle-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
}

.circle-image--big {
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 50%;
}

.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-fallback-employee,
.bg-fallback-employer {
  background-color: $bg-color-light;
  background-size: cover;

  &--opaque-bg {
    background-color: $bg-color-light-opaque;
  }

  &--darker-bg {
    background-color: $bg-color-darker;
  }
}

.header-container {
  display: flex;
  align-items: center;
}
</style>