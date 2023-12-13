<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton
                :text="$t('Fill in your personal data. We would like to know your gender, first and last name, date of birth and nationality. We would also like to know whether you possess a BSN, a work permit and a Dutch bank account. Your choices can always be adjusted later.')" />
        </div>

        <form @submit.prevent="storePersonalData">
            <div class="input-row">
                <div class="input-wrapper input--radio_group input--gender">
                    <FormFieldsRadioGroup :input="inputGender" :all-one-line="false"
                        @change="personalFormdata.gender = $event.target.value" />
                    <div v-if="errors && errors.gender" class="text-red-400">{{ $t(errors.gender[0]) }}</div>
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--text input--first_name">
                    <FormFieldsInput :input="inputFirstName" @change="personalFormdata.first_name = $event.target.value" />
                    <div v-if="errors && errors.first_name" class="text-red-400">{{ $t(errors.first_name[0]) }}</div>
                </div>
                <div class="input-wrapper input--text input--last_name">
                    <FormFieldsInput :input="inputLastName" @change="personalFormdata.last_name = $event.target.value" />
                    <div v-if="errors && errors.last_name" class="text-red-400">{{ $t(errors.last_name[0]) }}</div>
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--text input--birthdate">
                    <FormFieldsDateInput :field="{ value: inputBirthday.value, valid: true }" :handle="inputBirthday.handle" :isRequired="true" :label="inputBirthday.label" @setDate="personalFormdata.birthdate = $event.target.value" />
                    <div v-if="errors && errors.birthdate" class="text-red-400">{{ $t(errors.birthdate[0]) }}</div>
                </div>
                <div class="input-wrapper input--select input--nationality">
                    <FormFieldsRWSelect :input="inputNationality"
                        @change="personalFormdata.nationality = $event.target.value" />
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--checkbox input--has_social_security_number">
                    <FormFieldsToggle :input="inputBsn"
                        @change="personalFormdata.has_social_security_number = $event.target.checked" />
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--checkbox input--has_work_permit">
                    <FormFieldsToggle :input="inputHasWorkPermit"
                        @input="personalFormdata.has_work_permit = $event.target.checked" />
                </div>
            </div>

            <div class="input-row">
                <div class="input-wrapper input--checkbox input--has_dutch_bank_account">
                    <FormFieldsToggle :input="inputHasDutchBankAccount"
                        @change="personalFormdata.has_dutch_bank_account = $event.target.checked" />
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />
        </form>

    </div>
</template>
<script setup>
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Personal Data",
        required: false
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

let storePersonalData = async () => {
    errors.value = '';
    try {
        const { data } = await userStore.storeEmployeeProfile(personalFormdata);
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
            durarion: 6000,
        });
    }
}

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
}

let personalFormdata = reactive({
    section: "personal",
    gender: user.employee.gender,
    first_name: user.employee.first_name,
    last_name: user.employee.last_name,
    birthdate: user.employee.birthdate ? formatDate(user.employee.birthdate) : '',
    nationality: user.employee.nationality ? user.employee.nationality : 'NL' ,
    has_social_security_number: user.employee.has_social_security_number ? user.employee.has_social_security_number : false,
    has_work_permit: user.employee.has_work_permit ? user.employee.has_work_permit : false,
    has_dutch_bank_account: user.employee.has_dutch_bank_account ? user.employee.has_dutch_bank_account : false,
});


let inputGender = {
    handle: 'gender',
    label: 'Geslacht',
    value: personalFormdata.gender,
    oneLine: true,
    required: true,
    options: [
        {
            value: "man",
            required: true,
            title: "Man",
            description: "",
            subDescription: ""
        },
        {
            value: "woman",
            required: true,
            title: "Vrouw",
            description: "",
            subDescription: ""
        },
        {
            value: "other",
            required: true,
            title: "Anders",
            description: "",
            subDescription: ""
        }
    ]
}

let inputFirstName = {
    handle: 'first_name',
    label: "First name",
    type: "text",
    value: personalFormdata.first_name,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: true
}

let inputLastName = {
    handle: 'last_name',
    label: "Achternaam",
    type: "text",
    value: personalFormdata.last_name,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: true
}

let inputBirthday = {
    handle: 'birthdate',
    label: "Geboortedatum",
    type: "date",
    value: personalFormdata.birthdate,
    minValue: null,
    maxValue: null,
    minLength: null,
    maxLength: null,
    decimalCount: 1,
    disabled: false,
    required: true
}

const countries = await useRWApi('/countries', 'GET');
const countryOptions = Object.keys(countries.data).map((country, key) => {
    return {
        value: country,
        label: countries.data[country]
    }
});
let inputNationality = {
    handle: 'nationality',
    label: 'Nationaliteit',
    required: true,
    instructions: null,
    options: countryOptions,
    value: personalFormdata.nationality,
}

let inputBsn = {
    handle: 'has_social_security_number',
    label: "Ik heb een BSN",
    value: personalFormdata.has_social_security_number,
}
let inputHasWorkPermit = {
    handle: 'has_work_permit',
    label: "Ik beschik over een werkvergunning",
    value: personalFormdata.has_work_permit,
}
let inputHasDutchBankAccount = {
    handle: 'has_dutch_bank_account',
    label: "Ik heb een Nederlandse bankrekening",
    value: personalFormdata.has_dutch_bank_account,
}
</script>
<style lang="scss" scoped></style>