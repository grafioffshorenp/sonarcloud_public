<template>
  <div>
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ $t("Mijn vacatures") }}</h1>
      </div>
    </header>

    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div v-if="!canPublish" class="warning-banner">
          {{ $t('Only offline vacancies can be created until your profile is verified.') }}
        </div>
        <template v-if="jobpost.id">
          <input type="hidden" name="jobpostId" :value="jobpost.id" />
          <input type="hidden" name="status" :value="jobpost.status" />
        </template>

        <div class="table mt-10">
          <div class="table__row table__row--transparent-bg desktop-only">

            <div class="tab__job">
              <div class="tab__page active">
                <div class="input-row">
                  <div class="input-wrapper">
                    <FormFieldsInput :input="inputJobTitle" @changed="vacancyForm.name = $event.target.value" />
                    <div v-if="errors['name']" v-text="$t(errors['name'][0])" class="text-red-500 clear-both"></div>
                  </div>
                </div>
                <div class="input-row">
                  <div>
                    <FormFieldsWorkingHoursSelect :input="inputWorkingHours"
                      @changed="vacancyForm.working_hours = $event.target.value" />
                    <div v-if="errors['working_hours']" v-text="$t(errors['working_hours'][0])"
                      class="text-red-500 clear-both"></div>
                  </div>
                  <div>
                    <FormFieldsWorkTypeSelect :input="inputWorkType"
                      @changed="vacancyForm.work_type = $event.target.value" />
                    <div v-if="errors['work_type']" v-text="$t(errors['work_type'][0])" class="text-red-500 clear-both"></div>
                  </div>
                </div>
                <div class="input-row">
                  <FormFieldsIndustryFunctions :input="inputIndustryFunctions" :template="{}"
                    @industry-changed="industryChanged" @function-changed="brancheChanged" />
                </div>
                <div class="input-row">
                  <div>
                    <FormFieldsLocationSelect :template="{}" @changed="setLocations($event)" />
                               <p class="cursor-pointer" style="color: #2395d3;" @click="toggleLocationModal()">{{ $t("Voeg locatie toe") }}</p>
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
                    <FormFieldsTextarea :input="introInput" @changed="vacancyForm.intro = toRaw($event)" />
                  </div>
                </div>

                <div class="input-row">
                  <div class="input-wrapper">

                    <FormFieldsRadioGroup :input="isPermanentInput" @on-change="setIsPermanent" />
                  </div>
                </div>

                <div class="input-row" v-if="!isPermanentVacancy">
                  <div class="input-wrapper">
                    <FormFieldsDateInput :field="{ value: startDateInput.value, valid: true }"
                      :handle="startDateInput.handle" :is-required="startDateInput.required" :label="startDateInput.label"
                      :placeholder="startDateInput.placeholder" :set-validity-state="true"
                      @setDate="vacancyForm.start_date = $event.target.value" />
                    <div v-if="errors['start_date']" v-text="$t(errors['start_date'][0])" class="text-red-500 clear-both">
                    </div>
                  </div>

                  <div class="input-wrapper">
                    <FormFieldsDateInput :field="{ value: endDateInput.value, valid: true }" :handle="endDateInput.handle"
                      :is-required="endDateInput.required" :label="endDateInput.label"
                      :placeholder="endDateInput.placeholder" :set-validity-state="true"
                      @setDate="vacancyForm.end_date = $event.target.value" />
                    <div v-if="errors['end_date']" v-text="$t(errors['end_date'][0])" class="text-red-500 clear-both"></div>
                  </div>
                </div>

                <div class="input-row">
                  <div class="input-wrapper">
                    <FormFieldsInput :input="inputNumberOfRequiredCandidates"
                      @change="vacancyForm.number_of_required_candidates = $event.target.value" />
                    <div v-if="errors['number_of_required_candidates']"
                      v-text="$t(errors['number_of_required_candidates'][0])" class="text-red-500 clear-both"></div>
                  </div>
                </div>

                <div class="input-row">
                  <FormFieldsFileUpload :accept="['image']" :aspect-ratio="1" :height="800" :width="800"
                    :input="inputAmbiancePicture" />
                </div>
                <div class="input-row">
                  <div class="input-wrapper">
                    <FormFieldsLanguageSelectFunctionTemplate :input="inputLanguages"
                      :template="{ minimum_language_level: 'C1' }" @languages-changed="vacancyForm.languages = $event"
                      @level-changed="vacancyForm.minimum_language_level = $event.target.value" />
                    <div v-if="errors['languages']" v-text="errors['languages'][0]" class="text-red-500 clear-both"></div>
                    <div v-if="errors['minimum_language_level']" v-text="$t(errors['minimum_language_level'][0])"
                      class="text-red-500 clear-both"></div>
                  </div>
                </div>
                <div class="input-row">
                  <div class="input-wrapper">
                    <FormFieldsEducationSelectFunctionTemplate :input="inputEducations"
                      @changed="vacancyForm.minimum_education_level = $event.target.value" />
                  </div>
                </div>
                <div class="input-row">
                  <div class="input-wrapper">
                    <FormFieldsSkillSelect :name="inputSkills.handle" :title="inputSkills.label"
                      :skills="inputSkills.skills" :selected-skills="vacancyForm.skill_ids"
                      @changed="vacancyForm.skill_ids = $event" />
                    <div v-if="errors['skill_ids']" v-text="$t(errors['skill_ids'][0])" class="text-red-500 clear-both"></div>
                  </div>
                </div>

                <br><br>

                <div class="flex space-x-5">
                  <button class="btn color-second background-transparent border-third" :disabled="isSaving" @click="saveVacancy({publish: false})">
                    {{ isSaving ? $t('Aan het opslaan ..') : $t('Bewaar') }}
                  </button>
                  <button v-if="canPublish" class="btn" :disabled="isSaving" @click="saveVacancy({publish: true})">
                    {{ isSaving ? $t('Aan het opslaan ..') : $t('Bewaar') + ' ' + $t(' en plaats online') }}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>


    </main>


  </div>
</template>
<script setup>
import { checkPostalCode  } from '~/helpers/stringHelpers.js';

const userStore = useUserStore();
const user = await userStore.fetchUser();
const { $toastrBus } = useNuxtApp();

let jobpost = {
  id: null
};

let errors = ref([]);

let isSaving = ref(false);

let isPermanentVacancy = ref(false);

let isModalOpen = ref(false);

await userStore.fetchEmployerLocations(user.employer_user.employer.id)

const { getEmployerLocations } = toRefs(userStore);

const canPublish = computed(() => user?.employer_user?.employer?.is_allowed_to_create_job_posts);

const config = useRuntimeConfig();

async function getPostalcodeCoordinates(postalcode) { 
    // validate postalcode format 
    if (!checkPostalCode(postalcode)) return false;  
    // Get coordinates from Google Maps 
    postalcode = postalcode.replace(" ", ""); 

    const response = await fetch( 
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postalcode}%20Netherlands&key=${config.public.google.apiKey}` 
    ); 

    const data = await response.json(); 

    if (data.results.length === 0) { 
      throw Error("No location found"); 
    } 

    return {'lng': data.results[0].geometry.location.lng, 'lat': data.results[0].geometry.location.lat, address:data.results[0].formatted_address}; 
} 

const setLocations = (event) => {
  vacancyForm.employer_location_id = event[0]
}

let saveVacancy = async ({publish}) => {
  errors.value = [];
  isSaving.value = true;

  vacancyForm.status = publish && canPublish.value ? 'open' : 'offline';

  try {
    const { data } = await useRWApi('/employer/shifts/function_templates/job_posts/', {
      method: 'POST',
      body: vacancyForm
    });
    $toastrBus.$emit('show', {
      type: 'success',
      message: 'Je gegevens zijn opgeslagen',
      durarion: 6000,
    });

    await navigateTo('/my-account/employer/vacancies');

  } catch (e) {
    errors.value = e.data.data.errors
    $toastrBus.$emit('show', {
      type: 'error',
      message: e.data.data.message,
      durarion: 6000,
    });
  }

  isSaving.value = false;
}

let vacancyForm = reactive({
  type: 'job',
  status: 'open',
  is_paid: true,
  is_permanent: isPermanentVacancy,
  name: null,
  working_hours: null,
  work_type: null,
  industry_id: null,
  function_id: null,
  employer_location_id: [],
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
});

let inputJobTitle = {
  type: 'text',
  handle: 'name',
  value: vacancyForm.name,
  required: true,
  label: 'Name',
}

let inputWorkingHours = {
  value: vacancyForm.working_hours
}

let inputWorkType = {
  value: vacancyForm.work_type
}

const industries = await useRWApi('/industries', 'GET');

let inputIndustryFunctions = {
  industryFunctions: industries.data,
  industryId: vacancyForm.industry_id,
  functionId: vacancyForm.function_id,
}

let locations = await useRWApi(`/employer/${user.employer_user.employer.id}/locations`, {method: 'GET'})

let introInput = {
  handle: 'intro',
  placeholder: '',
  label: 'Intro',
  value: vacancyForm.intro,
}

let setIsPermanent = (isPermanent) => {
  isPermanentVacancy.value = isPermanent
  if (isPermanent) {
    vacancyForm.start_date = "2070-01-01";
    vacancyForm.end_date = "2070-01-01";
  }
}
let isPermanentInput = {
  handle: 'is_permanent',
  label: 'Permanent',
  required: true,
  value: false,
  options: [
    {
      value: true,
      required: true,
      title: "Permanent",
      description: "",
      subDescription: ""
    },
    {
      value: false,
      required: true,
      title: "Tijdelijk",
      description: "",
      subDescription: ""
    }
  ]
}

let startDateInput = {
  value: vacancyForm.start_date,
  handle: "start_date",
  required: false,
  label: "Startdatum",
  placeholder: "",
}

let endDateInput = {
  value: vacancyForm.end_date,
  handle: "end_date",
  required: false,
  label: "Einddatum",
  placeholder: "",
}

let inputNumberOfRequiredCandidates = {
  handle: 'number_of_required_candidates_input',
  type: 'number',
  label: 'Aantal benodigde medewerkers',
  value: vacancyForm.number_of_required_candidates
}

let inputAmbiancePicture = {
  handle: 'ambiance_picture',
  label: 'Selecteer afbeelding'
}

let localeOptions = [
  {
    "title": "Nederlands (Dutch)",
    "slug": "nederlands-dutch"
  },
  {
    "title": "English (English)",
    "slug": "english-english"
  },
  {
    "title": "Français (French)",
    "slug": "français-french"
  },
  {
    "title": "Türkçe (Turkish)",
    "slug": "türkçe-turkish"
  },
  {
    "title": "Русский (Russian)",
    "slug": "русский-russian"
  },
  {
    "title": "Українська (Ukrainian)",
    "slug": "українська-ukrainian"
  },
  {
    "title": "العربية (Arabic)",
    "slug": "العربية-arabic"
  },
  {
    "title": "فارسی (Farsi)",
    "slug": "فارسی-farsi"
  },
  {
    "title": "دری (Dari)",
    "slug": "دری-dari"
  },
  {
    "title": "Af Soomaali (Somali)",
    "slug": "af-soomaali-somali"
  },
  {
    "title": "ትግርኛ (Tigrinya)",
    "slug": "ትግርኛ-tigrinya"
  },
  {
    "title": "Afrikaans (Afrikaans)",
    "slug": "afrikaans-afrikaans"
  },
  {
    "title": "shqip (Albanian)",
    "slug": "shqip-albanian"
  },
  {
    "title": "հայերէն (Armenian)",
    "slug": "հայերէն-armenian"
  },
  {
    "title": "Azərbaycan dili (Azerbaijani)",
    "slug": "azərbaycan-dili-azerbaijani"
  },
  {
    "title": "беларуская мова (Belarusian)",
    "slug": "беларуская-мова-belarusian"
  },
  {
    "title": "বাংলা (Bengali)",
    "slug": "বাংলা-bengali"
  },
  {
    "title": "မြန်မာစာ (Burmese)",
    "slug": "မြန်မာစာ-burmese"
  },
  {
    "title": "Bosanski (Bosnian)",
    "slug": "bosanski-bosnian"
  },
  {
    "title": "български (Bulgarian)",
    "slug": "български-bulgarian"
  },
  {
    "title": "Dansk (Danish)",
    "slug": "dansk-danish"
  },
  {
    "title": "Deutsch (German)",
    "slug": "deutsch-german"
  },
  {
    "title": "Eesti Keel (Estonian)",
    "slug": "eesti-keel-estonian"
  },
  {
    "title": "Suomi (Finnish)",
    "slug": "suomi-finnish"
  },
  {
    "title": "ქართული ენა (Georgian)",
    "slug": "ქართული-ენა-georgian"
  },
  {
    "title": "Ελληνικά (Greek)",
    "slug": "ελληνικά-greek"
  },
  {
    "title": "עִבְרִית‎ (Hebrew)",
    "slug": "עִבְרִית-hebrew"
  },
  {
    "title": "हिन्दी (Hindi)",
    "slug": "हिन्दी-hindi"
  },
  {
    "title": "Magyar nyelv (Hungarian)",
    "slug": "magyar-nyelv-hungarian"
  },
  {
    "title": "Bahasa Indonesia (Indonesian)",
    "slug": "bahasa-indonesia-indonesian"
  },
  {
    "title": "Italiano (Italian)",
    "slug": "italiano-italian"
  },
  {
    "title": "日本語 (Japanese)",
    "slug": "日本語-japanese"
  },
  {
    "title": "ייִדיש (Yiddish)",
    "slug": "ייִדיש-yiddish"
  },
  {
    "title": "қазақша (Khazakh)",
    "slug": "қазақша-khazakh"
  },
  {
    "title": "Kurdî (Kurdish)",
    "slug": "kurdî-kurdish"
  },
  {
    "title": "한국어 (Korean)",
    "slug": "한국어-korean"
  },
  {
    "title": "Hrvatski (Croatian)",
    "slug": "hrvatski-croatian"
  },
  {
    "title": "ລາວ (Lao)",
    "slug": "ລາວ-lao"
  },
  {
    "title": "Latviešu valoda (Latvian)",
    "slug": "latviešu-valoda-latvian"
  },
  {
    "title": "Lietuvių kalba (Lithuanian)",
    "slug": "lietuvių-kalba-lithuanian"
  },
  {
    "title": "македонски (Macedonian)",
    "slug": "македонски-macedonian"
  },
  {
    "title": "Bahasa Melayu (Malay)",
    "slug": "bahasa-melayu-malay"
  },
  {
    "title": "官話 (Mandarin)",
    "slug": "官話-mandarin"
  },
  {
    "title": "नेपाली (Nepali)",
    "slug": "नेपाली-nepali"
  },
  {
    "title": "Norsk (Norwegian)",
    "slug": "norsk-norwegian"
  },
  {
    "title": "پښتو (Pashto)",
    "slug": "پښتو-pashto"
  },
  {
    "title": "język polski (Polish)",
    "slug": "język-polski-polish"
  },
  {
    "title": "Português (Portugese)",
    "slug": "português-portugese"
  },
  {
    "title": "ਪੰਜਾਬੀ (Punjabi)",
    "slug": "ਪੰਜਾਬੀ-punjabi"
  },
  {
    "title": "Limba română (Romanian)",
    "slug": "limba-română-romanian"
  },
  {
    "title": "српски језик (Serbian)",
    "slug": "српски-језик-serbian"
  },
  {
    "title": "Slovenčina (Slovak)",
    "slug": "slovenčina-slovak"
  },
  {
    "title": "Slovenski jezik (Slovene)",
    "slug": "slovenski-jezik-slovene"
  },
  {
    "title": "Español (Spanish)",
    "slug": "español-spanish"
  },
  {
    "title": "Kiswahili (Swahili)",
    "slug": "kiswahili-swahili"
  },
  {
    "title": "Tagalog (Tagalog)",
    "slug": "tagalog-tagalog"
  },
  {
    "title": "தமிழ் (Tamil)",
    "slug": "தமிழ்-tamil"
  },
  {
    "title": "ภาษาไทย (Thai)",
    "slug": "ภาษาไทย-thai"
  },
  {
    "title": "čeština (Czech)",
    "slug": "čeština-czech"
  },
  {
    "title": "اُردُو (Urdu)",
    "slug": "اُردُو-urdu"
  },
  {
    "title": "tiếng Việt (Vietnamese)",
    "slug": "tiếng-việt-vietnamese"
  },
  {
    "title": "Svenska (Swedish)",
    "slug": "svenska-swedish"
  }
]

let inputLanguages = {
  handle: 'languages',
  label: 'Taalvaardigheden',
  locales: localeOptions,
  minimum_language_level: vacancyForm.minimum_language_level,
  languages: vacancyForm.languages
}

let inputEducations = {
  handle: 'minimum_education_level',
  label: 'Education'
}

let inputSkills = reactive({
  handle: 'skill_ids',
  label: 'Skills',
  selectedSkills: vacancyForm.skill_ids
})

let industryChanged = (event) => {
  vacancyForm.industry_id = event;
}
let brancheChanged = (event) => {
  vacancyForm.function_id = event;
  loadSkills()
}

let loadSkills = async () => {
  if (!vacancyForm.function_id) {
    return;
  }
  // Reset skills
  vacancyForm.skill_ids = [];
  const skills = await useRWApi(`/employer/${user.employer_user.employer.id}/functions/${vacancyForm.function_id}/skills`, {
    method: 'GET'
  });
  inputSkills.skills = skills.data
}


const toggleLocationModal = async () => {
      isModalOpen.value = !isModalOpen.value;
      if (!isModalOpen.value) {
        try {
          userStore.fetchEmployerLocations(user.employer_user.employer.id);
        } catch (error) {
          throw error
        }
      }
    }

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
