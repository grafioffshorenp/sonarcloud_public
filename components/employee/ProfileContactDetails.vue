<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('Fill in your personal data. We would like to know your gender, first and last name, date of birth and nationality. We would also like to know whether you possess a BSN, a work permit and a Dutch bank account. Your choices can always be adjusted later.')" />
        </div>
        <form @submit.prevent="storeContactDetails">
            <div class="input-row">
                <div class="input-wrapper input--text input--city">
                    <FormFieldsSearchSelect :item-list="cities" :input="inputCity" @on-item-selected="saveCity" />
                    <div v-if="errors && errors.city" class="text-red-400">{{ $t(errors.city[0]) }}</div>
                </div>
                <div class="input-wrapper input--select input--region">
                    <div class="mt-9 relative">
                        <div>
                            <input :id="`form-input-${inputRegion.handle}`" :name="inputRegion.handle" :type="inputRegion.type"
                                step="false" :readonly="inputRegion.disabled" :required="inputRegion.required"
                                class="input" :value="contactDetailsFormData.region">
                            <label for="form-input-region" class="required">Province</label>
                        </div>
                        <div v-if="errors && errors.region" class="text-red-400">{{ $t(errors.region[0]) }}</div>
                    </div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--text input--mobile">
                    <FormFieldsInput :input="inputMobile" @change="contactDetailsFormData.mobile = $event.target.value" />
                    <div v-if="errors && errors.mobile" class="text-red-400">{{ $t(errors.mobile[0]) }}</div>
                </div>
                <div class="input-wrapper input--email input--email">
                    <FormFieldsInput :input="inputEmail" @change="contactDetailsFormData.email = $event.target.value" />
                    <div v-if="errors && errors.email" class="text-red-400">{{ $t(errors.email[0]) }}</div>
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Contact Details",
        required: false,
    },
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const userStore = useUserStore();
const user = await userStore.fetchUser();
const { $toastrBus } = useNuxtApp();
const onboardingStore = useOnboardingStore();

let errors = ref();

let storeContactDetails = async () => {
    errors.value = '';
    try {
        const { data } = await userStore.storeEmployeeProfile(contactDetailsFormData);
        $toastrBus.$emit('show', {
            type: 'success',
            message: 'Je gegevens zijn opgeslagen'
        });
        if (props.isOnboarding) {
            onboardingStore.nextStep();
        }
    } catch (e) {
        errors.value = e.data.data.errors
        $toastrBus.$emit('show', {
            type: 'error',
            message: e.data.data.message,
            duration: 6000
        });
    }
}

let contactDetailsFormData = reactive({
    section: "contact",
    city: user.employee.city,
    region: user.employee.region,
    mobile: user.employee.mobile,
    email: user.email,
});

interface provinceDataResponse {
    data: Array<provinceDataCitiesResponse>
}
interface provinceDataCitiesResponse {
    name: String;
    cities: Array<provinceDataCityResponse>
}
interface provinceDataCityResponse {
    name: String;
    city: String,
    region: String
}

const provinces = <provinceDataResponse>await useRWApi('/employee/province/all', 'GET');


const cities = [];
// Loop through all cities within provinces, and only add the ones to the search-select if the region matches
provinces.data.forEach(r => {
    r.cities.forEach(c => {
        // if (contactDetailsFormData.region !== '' && contactDetailsFormData.region === r.name) {
        cities.push({
            city: c.name,
            region: r.name
        });
        // }
    });
});

const saveCity = (event) => {
    contactDetailsFormData.city = event.city
    contactDetailsFormData.email = event.email
    const region = cities.find((place) => { return place.city === event.city }).region
    contactDetailsFormData.region = region;
}


let inputCity = {
    handle: 'city',
    label: "Woonplaats",
    type: "text",
    value: contactDetailsFormData.city,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: true
}

let inputRegion = {
    handle: 'region',
    label: "Province",
    type: "text",
    value: contactDetailsFormData.region,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: true,
    required: true
}

let inputMobile = {
    handle: 'mobile',
    label: "Mobiele telefoonnummer",
    type: "text",
    value: contactDetailsFormData.mobile,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: false
}

let inputEmail = {
    handle: 'email',
    label: "Emailadres",
    type: "email",
    value: contactDetailsFormData.email,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: true
}

</script>