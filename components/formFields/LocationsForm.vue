<template>
    <form @submit.prevent="saveLocation()">
            <div>
                <div class="input-row">
                    <div class="input-wrapper input--text input--name">
                        <input type="text" v-model="addLocationForm.name" />
                        <label for="form-input-name" class="required">{{ $t("Locatienaam") }}</label>
                        <div v-if="errors && errors.name" class="text-red-400">{{ $t(errors.name[0]) }}</div>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-wrapper input--text input--postalcode">
                        <input type="text" v-model="addLocationForm.postalcode" />
                        <label for="form-input-postalcode" class="required">{{ $t("Postcode") }}</label>
                        <div v-if="errors && errors.postalcode" class="text-red-400">{{ $t(errors.postalcode[0]) }}</div>
                    </div>

                    <div class="input-wrapper input--text input--house_number">
                        <input type="text" v-model="addLocationForm.house_number" />
                        <label for="form-input-house_number" class="required">{{ $t("Huisnummer") }}</label>
                        <div v-if="errors && errors.house_number" class="text-red-400">{{ $t(errors.house_number[0]) }}</div>
                    </div>
                    <div class="input-wrapper input--text input--house_number_ext">
                        <input type="text" v-model="addLocationForm.house_number_ext" />
                        <label for="form-input-house_number_ext" class="">{{ $t("Toevoeging") }}</label>
                        <div v-if="errors && errors.house_number_ext" class="text-red-400">{{ $t(errors.house_number_ext[0]) }}
                        </div>
                    </div>
                </div>

                <div class="input-row">
                    <div class="input-wrapper input--text input--street">
                        <input type="text" v-model="addLocationForm.street" disabled />
                        <label for="form-input-street" class="required">{{ $t("Straat") }}</label>
                        <div v-if="errors && errors.postalcode" class="text-red-400">{{ $t(errors.postalcode[0]) }}</div>
                    </div>
                    <div class="input-wrapper input--text input--city">
                        <input type="text" v-model="addLocationForm.city" disabled />
                        <label for="form-input-city" class="required">{{ $t("Stad") }}</label>
                        <div v-if="errors && errors.postalcode" class="text-red-400">{{ $t(errors.postalcode[0]) }}</div>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-wrapper input--filee input--logo">
                        <label class="">{{ $t("Afbeelding") }}</label>
                        <input type="file" @change="setLogo" />
                        <div v-if="errors && errors.logo" class="text-red-400">{{ $t(errors.logo[0]) }}
                        </div>
                    </div>
                </div>

                <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" />

                <a class="close-form" @click="closeForm()">{{$t('Annuleren')}}</a>

            </div>

        </form>
</template>

<script setup>
let errors = ref();
const userStore = useUserStore();
const onboardingStore = useOnboardingStore();
await userStore.fetchUser();
const { $toastrBus } = useNuxtApp();
let formIsSaving = ref(false);


const props = defineProps({
    toggleForm: {
        required: true,
        type: Function,
        default: null
        },
    isOnboarding: {
        required: false,
        type: Boolean,
        default: false
    }
    });

    let addLocationForm = reactive({
            name: '',
            house_number: '',
            house_number_ext: '',
            street: '',
            city: '',
            postalcode: '',
            logo: '',
            })

    const getBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

let setLogo = async (data) => {
    addLocationForm.logo = await getBase64(data.target.files[0]);
}

let closeForm = () => {
    return props.toggleForm()
}

let saveLocation = async () => {
    errors.value = '';

    try {
        formIsSaving.value = true;
        const response = await useRWApi(`/employer/${userStore.user.employer_user.employer.id}/locations`, {
            method: 'POST',
            body: addLocationForm
        });
        formIsSaving.value = false;

        if (props.isOnboarding) {
            onboardingStore.nextStep();
        }

        $toastrBus.$emit('show', {
            type: 'success',
            message: 'Je gegevens zijn opgeslagen'
        });

        // Empty the form
        addLocationForm.name = '';
        addLocationForm.house_number = '';
        addLocationForm.house_number_ext = '';
        addLocationForm.street = '';
        addLocationForm.city = '';
        addLocationForm.postalcode = '';
        addLocationForm.logo = '';

        closeForm();
    } catch (e) {
        errors.value = e.data.data.errors
        $toastrBus.$emit('show', {
            type: 'error',
            message: 'Formulier kon niet worden opgeslagen'
        });
    }
}

        watch(addLocationForm, async (prev, next) => {
            if(next.postalcode !== '' && next.postalcode.length === 6 && next.house_number !== '') {
                try {
                    const data = await useRWApi(`/postalcode/${next.postalcode}/${next.house_number}`, 'GET');
                    addLocationForm.street = data.data.street;
                    addLocationForm.city = data.data.city;
                } catch(error) {
                    // Not necessary to deal with this as the saveProfile API will give the message
                    // console.log("No match found for address", error)
                    throw error;
                }
            }
        });

</script>
