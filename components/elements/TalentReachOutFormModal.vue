<template>
    <div :class="['modal', 'modal--wide', 'active']">
        <ElementsModalWrapper v-if="formSubmitSuccess" :modal-title="$t('Neem contact op')" :fit-content-height="true"
            @toggle-modal="emit('toggle-modal')">
            <h3 class="u-mb-medium">{{ $t("Bedankt voor je bericht!") }}</h3>

            <p class="u-text-align-left">
                {{
                    $t("Nadat de werknemer het conversatieverzoek heeft geaccepteerd, kun je dit terugzien in je Inbox.")
                }}
            </p>
        </ElementsModalWrapper>
        <ElementsModalWrapper v-else :modal-title="'Neem contact op'" @toggle-modal="emit('toggle-modal')">
            <form @submit.prevent="submitReachOutForm($event)">
                <input type="hidden" name="employee_id" :value="employeeId" />

                <div v-if="templates.length" class="u-mb-medium-big">
                    <FormFieldsRadioGroup :has-background="true" :input="templatesInput" :primary-label="true" />
                </div>

                <div v-if="locations.length" class="u-mb-medium-big">
                    <label class="label--primary u-mb-medium">
                        {{
                            $t("Voor welke locatie wil je contact opnemen?")
                        }}
                    </label>

                    <div class="input-wrapper">
                        <FormFieldsRWSelect v-if="locations" :input="locationsInput" />
                    </div>
                </div>

                <div class="u-mb-medium-big">
                    <label class="label--primary u-mb-small">{{ "Voeg een bericht toe" }}</label>
                    <p class="u-text-align-left u-mb-medium">
                        {{ $t("Typ het bericht zo gedetailleerd mogelijk. Berichten kunnen niet bewerkt of opgevolgd worden na versturen.") }}
                    </p>

                    <div class="input-wrapper">
                        <FormFieldsTextarea :input="messageInput" />
                    </div>
                </div>

                <div class="modal__submit">
                    <button class="c-btn bg-orange-500 hover:bg-orange-600" type="submit">
                        {{ $t("Indienen") }}
                    </button>
                </div>
            </form>
        </ElementsModalWrapper>
    </div>
</template>

<script setup>
const props = defineProps({
    employeeId: {
        required: true,
        type: Number
    },
    templates: {
        required: true,
        type: Array
    },
    locations: {
        required: true,
        type: Array
    }
});

let formSubmitSuccess = ref(false);
const emit = defineEmits(['toggle-modal']);
const userStore = useUserStore();
const employer = await userStore.fetchUser();

const templatesInput = computed(() => {
    const options = props.templates.map(template => templateOption(template));

    return {
        handle: "function_template_id",
        label: "Voor welk functieprofiel wil je contact opnemen?",
        oneLine: false,
        options,
        required: true
    };
});

const locationsInput = computed(() => {
    const options = props.locations.map(({ id, name }) => ({ value: id, label: name }));

    return {
        handle: "employer_location_id",
        label: "Locatie",
        required: true,
        options
    };
});

const messageInput = computed(() => {
    return {
        handle: "message",
        label: "Bericht",
        placeholder: "Typ je bericht..."
    }
});

const templateOption = (template) => {
    return {
        value: template.id,
        label: template.function.name
    };
}

const submitReachOutForm = async ($event) => {
    try {
        if (!employer) {
            return;
        }

        const fd = new FormData($event.target);

        const data = {
            employee_id: fd.get("employee_id"),
            employer_location_id: fd.get("employer_location_id"),
            function_template_id: fd.get("function_template_id"),
            message: fd.get("message")
        };

        await reachOut(employer, data);

        formSubmitSuccess.value = true;
    } catch {
        formSubmitSuccess.value = false;
    }
}

const reachOut = async (employer, data) => {
    const endpoint = `/employer/employee/${employer.id}/reach-out`;

    const response = await useRWApi(endpoint, {
        method: 'POST',
        body: data
    });

    return response;
};
</script>