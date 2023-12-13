<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton :text="$t('onboarding_employer_info_step1_companydetails')" />
        </div>


        <form @submit.prevent="saveCompanyDetails">
            <div class="input-row">
                <div class="input-wrapper input--text input--employer_name">
                    <input type="text" v-model="companyDetailsForm.name" />
                    <label for="form-input-employer_name" class="required">{{ $t("Company name") }}</label>
                    <div v-if="errors && errors.name" class="text-red-400">{{ $t(errors.name[0]) }}</div>
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--text input--employer_postalcode">
                    <input type="text" v-model="companyDetailsForm.postalcode" />
                    <label for="form-input-employer_postalcode" class="required">{{ $t("Postcode") }}</label>
                    <div v-if="errors && errors.postalcode" class="text-red-400">{{ $t(errors.postalcode[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--employer_house_number">
                    <input type="text" v-model="companyDetailsForm.house_number" />
                    <label for="form-input-employer_house_number" class="required">{{ $t("Huisnummer") }}</label>
                    <div v-if="errors && errors.house_number" class="text-red-400">{{ $t(errors.house_number[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--employer_house_number_ext">
                    <input type="text" v-model="companyDetailsForm.house_number_ext" />
                    <label for="form-input-employer_house_number_ext" class="">{{ $t("Toevoeging") }}</label>
                    <div v-if="errors && errors.house_number_ext" class="text-red-400">{{ $t(errors.house_number_ext[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--text input--employer_street">
                    <input type="text" disabled v-model="companyDetailsForm.street" />
                    <label for="form-input-employer_street" class="">{{ $t("Straat") }}</label>
                    <div v-if="errors && errors.street" class="text-red-400">{{ $t(errors.street[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--employer_city">
                    <input type="text" disabled v-model="companyDetailsForm.city" />
                    <label for="form-input-employer_city" class="">{{ $t("Woonplaats") }}</label>
                    <div v-if="errors && errors.city" class="text-red-400">{{ $t(errors.city[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--text input--employer_chamber_of_commerce_number">
                    <input type="text" disabled v-model="companyDetailsForm.chamber_of_commerce_number" />
                    <label for="form-input-employer_chamber_of_commerce_number" class="">{{ $t("Kvk nummer") }}</label>
                    <div v-if="errors && errors.chamber_of_commerce_number" class="text-red-400">{{
                        $t(errors.chamber_of_commerce_number[0])
                    }}
                    </div>
                </div>
                <div class="input-wrapper input--text input--employer_phone">
                    <input type="text" v-model="companyDetailsForm.phone" />
                    <label for="form-input-employer_phone" class="required">{{ $t("Telefoonnummer") }}</label>
                    <div v-if="errors && errors.phone" class="text-red-400">{{ $t(errors.phone[0]) }}</div>
                </div>
            </div>
            <div class="input-row">
                <div class="input-wrapper input--textarea input--employer_company_profile">
                    <textarea name="" id="" cols="30" rows="10"
                        class="pl-4 pt-2"
                        v-model="companyDetailsForm.company_profile">{{ companyDetailsForm.company_profile }}</textarea>
                    <label for="form-input-employer_company_profile" class="required">
                        {{ $t("Bedrijfsprofiel") }}
                    </label>
                    <div v-if="errors && errors.company_profile" class="text-red-400">{{ $t(errors.company_profile[0]) }}</div>
                </div>
            </div>

            <div class="u-mt-medium"><small class="input__helper-text">{{ $t("Geef in het bedrijfsprofiel wat meer informatie over de sfeer binnen jouw bedrijf en waar jullie voor staan, zodat potentiële werknemers een betere indruk krijgen van de organisatie.") }}</small></div>

          <br/>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" :hasErrors="errors ? true : false" />
        </form>
    </div>
</template>
<script setup>
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Company Details",
        required: false
    },
    isOnboarding: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const { $toastrBus } = useNuxtApp();
const userStore = useUserStore();
await userStore.fetchUser();
const onboardingStore = useOnboardingStore();
const employerData = userStore.user.employer_user.employer;

let errors = ref();

const companyDetailsForm = reactive({
    section: "company",
    name: employerData.name,
    postalcode: employerData.postalcode,
    house_number: employerData.house_number,
    house_number_ext: employerData.house_number_ext,
    street: employerData.street,
    city: employerData.city,
    chamber_of_commerce_number: employerData.chamber_of_commerce_number,
    phone: employerData.phone,
    company_profile: employerData.company_profile,
});

const updateAddress = async () => {
    if (
        companyDetailsForm.postalcode &&
        companyDetailsForm.postalcode !== '' &&
        companyDetailsForm.postalcode.length === 6 &&
        companyDetailsForm.house_number &&
        companyDetailsForm.house_number !== ''
        ) {
        try {
            const data = await useRWApi(`/postalcode/${companyDetailsForm.postalcode}/${companyDetailsForm.house_number}`, 'GET');
            companyDetailsForm.street = data.data.street;
            companyDetailsForm.city = data.data.city;
        } catch {
            // Not necessary to deal with this as the saveProfile API will give the message
            console.log("No match found for address");
        }
    }
};

const getLocationInformation = async () => {
    try {
        const { data } = await useRWApi(`/employer/register/companies/${companyDetailsForm.chamber_of_commerce_number}`, 'GET')
        companyDetailsForm.postalcode = data.postal_code;
        companyDetailsForm.house_number = data.house_number;
        companyDetailsForm.house_number_ext = data.house_number_ext;
        updateAddress()
    } catch (error) {
        throw error
    }
}

onMounted(async () => {
    if(props.isOnboarding && companyDetailsForm.chamber_of_commerce_number) {
        getLocationInformation()
    }
    updateAddress();
})

let saveCompanyDetails = async () => {
    errors.value = '';
    try {
        const { data } = await userStore.storeEmployerProfile(companyDetailsForm);
        if (props.isOnboarding) {
            onboardingStore.nextStep();
        }
        $toastrBus.$emit('show', {
            type: 'success',
            message: 'Je gegevens zijn opgeslagen'
        });
    } catch (e) {
        errors.value = e.data.data.errors;
        $toastrBus.$emit('show', {
            type: 'error',
            message: 'Formulier kon niet worden opgeslagen'
        });
    }
}
</script>