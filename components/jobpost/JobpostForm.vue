<template>
  <div>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div v-if="!canPublish && !isEdit" class="warning-banner">
        {{ $t('Only offline vacancies can be created until your profile is verified.') }}
      </div>
      <template v-if="jobpost.id">
        <input type="hidden" name="jobpostId" :value="jobpost.id"/>
        <input type="hidden" name="status" :value="jobpost.status"/>
      </template>

      <div class="table mt-10">
        <div class="table__row table__row--transparent-bg desktop-only">
          <div class="tab__job">
            <div class="tab__page active">
              <div class="input-row">
                <div class="input-wrapper">
                  <FormFieldsInput :input="inputJobTitle" @changed="vacancyForm.name = $event.target.value"/>
                  <div v-if="errors['name']" v-text="$t(errors['name'][0])" class="text-red-500 clear-both"></div>
                </div>
              </div>
              <div class="input-row">
                <div>
                  <FormFieldsWorkingHoursSelect :input="inputWorkingHours"
                                                @changed="vacancyForm.working_hours = $event.target.value"/>
                  <div v-if="errors['working_hours']" v-text="$t(errors['working_hours'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
                <div>
                  <FormFieldsWorkTypeSelect :input="inputWorkType"
                                            @changed="vacancyForm.work_type = $event.target.value"/>
                  <div v-if="errors['work_type']" v-text="$t(errors['work_type'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
              </div>
              <div v-if="inputIndustryFunctions.industryFunctions" class="input-row">
                <!-- <FormFieldsIndustryFunctions :input="inputIndustryFunctions" :template="{}"
                  @industry-changed="industryChanged" @function-changed="brancheChanged" /> -->
                <div class="input-row">
                  <p v-if="loading">{{ $t('Functies worden geladen ...') }}</p>
                  <div class="input-wrapper input--select">
                    <select
                        v-model="vacancyForm.industry_id"
                        :disabled="false"
                        name="industry_id"
                        :required="true"
                        class="pl-4"
                        @change="industryChanged($event)"
                    >
                      <option v-for="industry in industries" :key="industry.id" :value="industry.id">
                        {{ $t(industry.name) }}
                      </option>
                    </select>
                    <div class="c-input-icon c-input-icon--teal">
                      <i class="far fa-chevron-down"></i>
                    </div>

                    <label :class="{ required: false }">{{ $t('Branche') }}</label>
                  </div>
                  <template v-for="industry in industries">
                    <div
                        v-if="vacancyForm.industry_id === industry.id"
                        :key="industry.id"
                        :required="true"
                        class="input-wrapper input--select"
                    >
                      <select class="pl-4" v-model="vacancyForm.function_id" :disabled="false"
                              @change="brancheChanged($event)">
                        <option v-for="(f, i) in industry.functions" :key="i" :value="f.id">
                          {{ $t(f.name) }}
                        </option>
                      </select>
                      <div class="c-input-icon c-input-icon--teal">
                        <i class="far fa-chevron-down"></i>
                      </div>

                      <label :class="{ required: true }">{{ $t('Functie') }}</label>
                    </div>
                  </template>

                  <input type="hidden" name="function_id" :value="vacancyForm.function_id"/>
                </div>
              </div>
              <div class="input-row">
                <div>
                  <!-- <FormFieldsLocationSelect :template="locationInput.template" @changed="vacancyForm.employer_location_id = $event" /> -->
                  <!-- TODO :: put this in component and fix props -->
                  <div class="input-row">
                    <div class="input-wrapper input--select">
                      <select
                          v-model="vacancyForm.employer_location_id"
                          name="employer_location_id"
                          :style='[isEdit ? "height: 55px;" : "height: 100px;"]'
                          class="pl-4"
                      >
                        <option v-for="location in locationInput.locations" :key="location.id" :value="location.id">
                          {{ location.name }}
                        </option>
                      </select>
                      <div class="c-input-icon c-input-icon--teal">
                        <i class="far fa-chevron-down"></i>
                      </div>
                      <label>{{ $t('Voeg toe') }}</label>
                    </div>
                  </div>
                  <p class="cursor-pointer" style="color: #2395d3;" @click="toggleLocationModal()">{{
                      $t('Voeg locatie toe')
                    }}</p>
                  <div
                      v-if="isModalOpen"
                      style="border-top: 1px solid lightgrey; border-bottom: 1px solid lightgrey; border-radius: 5px; padding: 16px 0; margin-bottom: 20px;"
                  >
                    <FormFieldsLocationsForm :toggleForm="toggleLocationModal"/>
                  </div>
                  <div v-if="errors['employer_location_id']" v-text="$t(errors['employer_location_id'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
              </div>

              <div class="input-row">
                <div class="input-wrapper">
                  <FormFieldsTextarea :input="introInput" @changed="vacancyForm.intro = toRaw($event)"/>
                </div>
              </div>

              <div class="input-row">
                <div class="input-wrapper">

                  <FormFieldsRadioGroup :input="isPermanentInput" @on-change="setIsPermanent"/>
                </div>
              </div>

              <div class="input-row" v-if="!isPermanentVacancy">
                <div class="input-wrapper">
                  <FormFieldsDateInput
                      :field="{ value: startDateInput.value, valid: true }"
                      :handle="startDateInput.handle"
                      :is-required="startDateInput.required"
                      :label="startDateInput.label"
                      :placeholder="startDateInput.placeholder"
                      :set-validity-state="true"
                      @setDate="vacancyForm.start_date = $event.target.value"/>
                  <div v-if="errors['start_date']" v-text="$t(errors['start_date'][0])" class="text-red-500 clear-both">
                  </div>
                </div>

                <div class="input-wrapper">
                  <FormFieldsDateInput :field="{ value: endDateInput.value, valid: true }" :handle="endDateInput.handle"
                                       :is-required="endDateInput.required" :label="endDateInput.label"
                                       :placeholder="endDateInput.placeholder" :set-validity-state="true"
                                       @setDate="vacancyForm.end_date = $event.target.value"/>
                  <div v-if="errors['end_date']" v-text="$t(errors['end_date'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
              </div>

              <div class="input-row">
                <div class="input-wrapper">
                  <FormFieldsInput :input="inputNumberOfRequiredCandidates"
                                   @change="vacancyForm.number_of_required_candidates = $event.target.value"/>
                  <div v-if="errors['number_of_required_candidates']"
                       v-text="$t(errors['number_of_required_candidates'][0])" class="text-red-500 clear-both"></div>
                </div>
              </div>

              <div class="input-row">
                <FormFieldsFileUpload
                    :accept="['image']"
                    :aspect-ratio="1"
                    :height="800"
                    :width="800"
                    :input="inputAmbiancePicture"
                    :file="jobpostData && jobpostData.ambiance_picture"
                    @set-crop="img => vacancyForm.ambiance_picture = img"/>
              </div>
              <div class="input-row">
                <div class="input-wrapper">
                  <FormFieldsLanguageSelectFunctionTemplate :input="inputLanguages"
                                                            :template="{ minimum_language_level: 'C1' }"
                                                            @languages-changed="vacancyForm.languages = $event"
                                                            @level-changed="vacancyForm.minimum_language_level = $event.target.value"/>
                  <div v-if="errors['languages']" v-text="errors['languages'][0]" class="text-red-500 clear-both"></div>
                  <div v-if="errors['minimum_language_level']" v-text="$t(errors['minimum_language_level'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
              </div>
              <div class="input-row">
                <div class="input-wrapper">
                  <FormFieldsEducationSelectFunctionTemplate :input="inputEducations"
                                                             @changed="vacancyForm.minimum_education_level = $event.target.value"/>
                </div>
              </div>
              <div class="input-row" v-if='vacancyForm.skill_ids'>
                <div class="input-wrapper">
                  <FormFieldsSkillSelect :name="inputSkills.handle" :title="inputSkills.label"
                                         :skills="inputSkills.skills" :selected-skills="vacancyForm.skill_ids"
                                         @changed="vacancyForm.skill_ids = $event"/>
                  <div v-if="errors['skill_ids']" v-text="$t(errors['skill_ids'][0])"
                       class="text-red-500 clear-both"></div>
                </div>
              </div>

              <br><br>
              
              <div v-if='isEdit && profileData.has_verified_email && canPublish && profileComplete()' class="flex space-x-5">
                  <!-- <button class="btn color-second background-transparent border-third" @click="submitForm({publish: false})">
                    {{ $t('Bewaar') }}
                  </button> -->
                  <button class="btn" @click="submitForm({publish: true})">
                    {{ $t('Bewaar en Publiceer') }}
                  </button>
                </div>

                <div v-else class="flex space-x-5">
                  <button class="btn color-second background-transparent border-third" @click="submitForm({publish: false})">
                    {{ $t('Bewaar') }}
                  </button>
                </div>

                <!-- TODO :: buttons for creating new vacancy -->
                <!-- <div v-if='!isEdit' class="flex space-x-5">
                  <button class="btn color-second background-transparent border-third" :disabled="isSaving" @click="saveVacancy({publish: false})">
                    {{ isSaving ? $t('Aan het opslaan ..') : $t('Bewaar') }}
                  </button>
                  <button class="btn" :disabled="isSaving" @click="saveVacancy({publish: true})">
                    {{ isSaving ? $t('Aan het opslaan ..') : $t('Bewaar en Publiceer') }}
                  </button>
                </div> -->

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { localeOptions } from '@/helpers/languagesHelper';

const userStore = useUserStore();

const { $toastrBus } = useNuxtApp();

const props = defineProps({
  jobpostData: {
    default: null,
    required: false,
    type: Object,
  },
  industries: {
    default: null,
    required: false,
    type: Object,
  },
  profileData: {
    default: null,
    required: false,
    type: Object,
  },
  isEdit: {
    default: false,
    required: false,
    type: Boolean,
  },
  action: {
    required: true,
    default: null,
    type: Function,
  },
});

const refsProps = toRefs(props);

let locations = refsProps.profileData.value.employer_user.employer_locations;

let jobpost = {
  id: null,
};

let errors = ref([]);

let isSaving = ref(false);

let isPermanentVacancy = ref(false);

let isModalOpen = ref(false);

const canPublish = computed(() => refsProps.profileData.value.employer_user.employer.is_allowed_to_create_job_posts);

const profileComplete = () => {
  return refsProps.profileData.value.employer_user.employer.profile_completeness === 100;
  }

const submitForm = ({publish}) => {
  if (vacancyForm.is_permanent) {
    // TODO :: this should be changed for some reason there are validation on this fileds
    vacancyForm.start_date = '2070-01-01';
    vacancyForm.end_date = '2070-01-01';
  }

  if(!vacancyForm.is_permanent && vacancyForm.start_date && vacancyForm.end_date) {
    if(vacancyForm.start_date.length > 10) {
      vacancyForm.start_date = vacancyForm.start_date.split('T')[0];
    }
    if(vacancyForm.end_date.length > 10) {
      vacancyForm.end_date = vacancyForm.end_date.split('T')[0];
    }
  }

  if(profileComplete()) {
    vacancyForm.status = publish && canPublish.value ? 'open' : 'offline';
  }

  props.action(vacancyForm);
};

const vacancyForm = reactive({
  type: 'job',
  status: null,
  is_paid: true,
  is_permanent: isPermanentVacancy,
  name: null,
  working_hours: null,
  work_type: null,
  industry_id: null,
  function_id: null,
  employer_location_id: null,
  intro: null,
  start_date: null,
  end_date: null,
  number_of_required_candidates: null,
  languages: [],
  minimum_language_level: null,
  minimum_education_level: null,
  skill_ids: [],
  auto_accept_by_rating: false,
  auto_accept_by_invite: false,
  auto_accept_by_flexpool: false,
  ambiance_picture: null,
});

const inputJobTitle = reactive({
  type: 'text',
  handle: 'name',
  value: vacancyForm.name,
  required: true,
  label: 'Name',
});

const inputWorkingHours = reactive({
  value: vacancyForm.working_hours,
});

const inputWorkType = reactive({
  value: vacancyForm.work_type,
});

const inputIndustryFunctions = reactive({
  industryFunctions: refsProps.industries.value,
  industryId: vacancyForm.industry_id,
  functionId: vacancyForm.function_id,
});

let locationInput = ref({
  locations: locations,
  template: {
    employer_location: {
      id: vacancyForm.employer_location_id,
    },
  },
});

let formatDate = (_date) => {
  function join(date, options, separator) {
    function format(option) {
      let formatter = new Intl.DateTimeFormat('en', option);
      return formatter.format(date);
    }

    return options.map(format).join(separator);
  }

  let options = [{ year: 'numeric' }, { month: '2-digit' }, { day: '2-digit' }];
  return join(new Date(_date), options, '-');
};

let introInput = reactive({
  handle: 'intro',
  placeholder: '',
  label: 'Intro',
  value: vacancyForm.intro,
});

let setIsPermanent = (isPermanent) => {
  isPermanentVacancy.value = isPermanent;
  vacancyForm.is_permanent = isPermanent;
  if (isPermanent) {
    vacancyForm.start_date = '2070-01-01';
    vacancyForm.end_date = '2070-01-01';
  }
};
let isPermanentInput = reactive({
  handle: 'is_permanent',
  label: 'Permanent',
  required: true,
  value: false,
  options: [
    {
      value: true,
      required: true,
      title: 'Permanent',
      description: '',
      subDescription: '',
    },
    {
      value: false,
      required: true,
      title: 'Tijdelijk',
      description: '',
      subDescription: '',
    },
  ],
});

let startDateInput = reactive({
  value: vacancyForm.start_date,
  handle: 'start_date',
  required: false,
  label: 'Startdate',
  placeholder: '',
});

let endDateInput = reactive({
  value: vacancyForm.end_date,
  handle: 'end_date',
  required: false,
  label: 'Enddate',
  placeholder: '',
});

let inputNumberOfRequiredCandidates = reactive({
  handle: 'number_of_required_candidates_input',
  type: 'number',
  label: 'Number of required candidates',
  value: vacancyForm.number_of_required_candidates,
});

let inputAmbiancePicture = {
  handle: 'ambiance_picture',
  label: 'Selecteer afbeelding',
}; 

let inputLanguages = reactive({
  handle: 'languages',
  label: 'Taalvaardigheden',
  locales: localeOptions,
  minimum_language_level: vacancyForm.minimum_language_level,
  languages: vacancyForm.languages,
});

let inputEducations = reactive({
  handle: 'minimum_education_level',
  label: 'Education',
  value: vacancyForm.minimum_education_level,
});

let inputSkills = reactive({
  handle: 'skill_ids',
  label: 'Skills',
  selectedSkills: vacancyForm.skill_ids,
});

let industryChanged = (event) => {
  vacancyForm.industry_id = parseInt(event.target.value);
  const industriesArray = Object.values(refsProps.industries.value);

  // set branche to first for selected industry
  const selectedIndustry = industriesArray.find(industry => industry.id === parseInt(event.target.value));
  if (selectedIndustry && selectedIndustry.functions.length > 0) {
    vacancyForm.function_id = selectedIndustry.functions[0].id;
    loadSkills();
  }
};

let brancheChanged = (event) => {
  vacancyForm.function_id = Number(event.target.value);
  loadSkills();
};

let loadSkills = async () => {
  if (!vacancyForm.function_id) {
    return;
  }
  // Reset skills
  vacancyForm.skill_ids = [];
  const skills = await useRWApi(
      `/employer/${refsProps.profileData.value.employer_user.employer.id}/functions/${vacancyForm.function_id}/skills`,
      {
        method: 'GET',
      });
  inputSkills.skills = skills.data;
};

const toggleLocationModal = async () => {
  isModalOpen.value = !isModalOpen.value;
  if (!isModalOpen.value) {
    try {
      // const loc = await userStore.fetchEmployerLocations(refsProps.profileData.value.employer_user.employer.id);
      const loc = await useRWApi(`/employer/${refsProps.profileData.value.employer_user.employer.id}/locations?per_page=50`, 'GET');
      locationInput.value.locations = {...loc.data}
    } catch (error) {
      throw error;
    }
  }
};

onMounted(() => {
  if (props.jobpostData) {
    // status
    vacancyForm.status = refsProps.jobpostData.value.status;
    // name
    vacancyForm.name = refsProps.jobpostData.value.name;
    inputJobTitle.value = refsProps.jobpostData.value.name;
    // working_hours
    vacancyForm.working_hours = refsProps.jobpostData.value.working_hours;
    inputWorkingHours.value = refsProps.jobpostData.value.working_hours;
    // work_type
    vacancyForm.work_type = refsProps.jobpostData.value.work_type;
    inputWorkType.value = refsProps.jobpostData.value.work_type;
    // industry_id
    vacancyForm.industry_id = refsProps.jobpostData.value.industry.id;
    inputIndustryFunctions.industryId = refsProps.jobpostData.value.industry.id;
    // function_id
    vacancyForm.function_id = refsProps.jobpostData.value.function.id;
    inputIndustryFunctions.functionId = refsProps.jobpostData.value.function.id;
    // employer_location_id
    vacancyForm.employer_location_id = refsProps.jobpostData.value.employer_location.id;
    locationInput.value.template.employer_location.id = refsProps.jobpostData.value.employer_location.id;
    // intro
    vacancyForm.intro = refsProps.jobpostData.value.intro;
    introInput.value = refsProps.jobpostData.value.intro;
    // start_date, end datem is_permanent
    isPermanentInput.value = refsProps.jobpostData.value.is_permanent;
    isPermanentVacancy.value = refsProps.jobpostData.value.is_permanent;
    if (!refsProps.jobpostData.value.is_permanent) {
      vacancyForm.start_date = refsProps.jobpostData.value.start_date;
      startDateInput.value = formatDate(refsProps.jobpostData.value.start_date);
      vacancyForm.end_date = refsProps.jobpostData.value.end_date;
      endDateInput.value = formatDate(refsProps.jobpostData.value.end_date);
    }
    // number_of_required_candidates
    vacancyForm.number_of_required_candidates = refsProps.jobpostData.value.number_of_required_candidates;
    inputNumberOfRequiredCandidates.value = refsProps.jobpostData.value.number_of_required_candidates;
    // languages, minimum_language_level
    vacancyForm.languages = refsProps.jobpostData.value.languages;
    vacancyForm.minimum_language_level = refsProps.jobpostData.value.minimum_language_level;
    inputLanguages.minimum_language_level = refsProps.jobpostData.value.minimum_language_level;
    inputLanguages.languages = refsProps.jobpostData.value.languages;
    // minimum_education_level
    vacancyForm.minimum_education_level = refsProps.jobpostData.value.minimum_education_level;
    inputEducations.value = refsProps.jobpostData.value.minimum_education_level;
    // skill_ids
    loadSkills();
    refsProps.jobpostData.value.skills.forEach(skill => {
      vacancyForm.skill_ids.push(skill.id);
      inputSkills.selectedSkills.push(skill.id);
    });
    // auto_accept_by_rating
    vacancyForm.auto_accept_by_rating = refsProps.jobpostData.value.auto_accept_by_rating;
    // auto_accept_by_invite
    vacancyForm.auto_accept_by_invite = refsProps.jobpostData.value.auto_accept_by_invite;
    // auto_accept_by_flexpool
    vacancyForm.auto_accept_by_flexpool = refsProps.jobpostData.value.auto_accept_by_flexpool;
  }
});

</script>

<style scoped>
.warning-banner {
  background-color: #ef4444;
  color: white;
  width: 100%;
  padding: 2rem 1rem;
  border-radius: 0.5rem;
}
</style>