<template>
    <div>
        <h2 class="form-title">{{ $t(title) }}</h2>

        <div class="input-row relative">
            <FormFieldsInfoButton :text="$t('onboarding_employee_info_step9_profilepicture')" />
        </div>

        <form @submit.prevent="storePhoto">
            <div class="input-row">
                <!-- input--profile_picture input--file -->
                <div class="input-wrapper input--profile_picture">

                    {{ $t("Upload een duidelijke foto van jezelf en vergroot je kansen!") }}<br />

                    <FormFieldsFileUpload :accept="['image']" :input="inputPicture" :placeholder-type="`profilePicture`"
                        :placeholder-width="!isOnboarding ? 'wide' : ''"
                        @setCrop="setPhoto"
                        @cropping="setCanContinue"
                        :file="photoFormData.profile_picture" />

                    <div v-if="errors && errors.profile_picture" class="text-red-400">{{
                        errors.profile_picture
                    }}
                    </div>
                    <br />
                </div>
            </div>

            <ElementsAccountOnboardingButtons :isOnboarding="isOnboarding" :skipStep="true" :canContinue="canContinue" />
        </form>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const props = defineProps({
    title: {
        type: String,
        default: "Photo",
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
const onboardingStore = useOnboardingStore();
const { $toastrBus } = useNuxtApp();
let errors = ref();

const photoFormData = reactive({
    "section": "profile_picture",
    profile_picture: user.employee.profile_picture || null,
});

let inputPicture = {
    handle: 'picture',
    label: ''
}

let storePhoto = async () => {
    try {
        const { data } = await userStore.storeEmployeeProfile(photoFormData);
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

let setPhoto = async (data) => {
    photoFormData.profile_picture = data;
}

const canContinue = ref(true);
// From the upload component the `cropping` event is emitted when the user
// enters the crop selection state at which point we want to disable the submit button
let setCanContinue = (e) => {
  console.log("fddf")
  canContinue.value = !e;
}
</script>