<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton :text="'onboarding_employer_info_step6_locations'" />
        </div>

        <div>
            <div class="flex w-full justify-between">
                <div class="w-1/3 font-bold">{{ $t("Locatienaam") }}</div>
                <div class="w-1/3 font-bold">{{ $t("Straat") }}</div>
                <div class="w-1/3 font-bold">{{ $t("Stad") }}</div>
            </div>
        </div>
        <div v-for="location in employerLocations()" :key="location.id">
            <div class="flex justify-between bg-slate-100 p-3 my-3">
                <div class="w-1/3">{{ location.name }}</div>
                <div class="w-1/3">{{ location.street }} {{ location.house_number }}{{ location.house_number_ext }}</div>
                <div class="w-1/3">{{ location.city }}</div>
            </div>
        </div>

        <br /><br />

        <div class="text-center">
            {{ $t("Heeft jouw bedrijf meer dan één locatie, dan is het mogelijk om op deze pagina meerdere locaties aan te maken.") }}
        </div>
        <br /><br />

        <button v-if="!addingLocation" class="btn" @click="addingLocation = true">
            {{ $t("Voeg locatie toe") }}
        </button>

         <FormFieldsLocationsForm v-if='addingLocation' :toggleForm="toggleLocationModal" :isOnboarding='isOnboarding' />
    </div>
</template>
<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "Locations",
        required: false
    },
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const userStore = useUserStore();
await userStore.fetchUser();
await userStore.fetchEmployerLocations(userStore.user.employer_user.employer.id);
const onboardingStore = useOnboardingStore();
const { $toastrBus } = useNuxtApp();

let errors = ref();
let addingLocation = ref(false);
let formIsSaving = ref(false);

const { getEmployerLocations } = toRefs(userStore);

const employerLocations = () => {
    return getEmployerLocations.value.data;
}

const toggleLocationModal = async () => {
      addingLocation = !addingLocation;
      if (!addingLocation) {
        try {
          const resp = await userStore.fetchEmployerLocations(userStore.user.employer_user.employer.id);
        } catch (error) {
          throw error
        }
      }
    }

</script>