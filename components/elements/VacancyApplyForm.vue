<template>
    <form @submit.prevent="submit($event)">
        <input type="hidden" name="jobpostId" :value="vacancy.id" />

        <div class="input-row">
            <div class="input-wrapper input--motivation">
                <FormFieldsTextarea :input="{
                    handle: 'motivation',
                    placeholder: '',
                    rows: 5,
                    required: true,
                    label: $t('Motivatie (max. 800 karakters)'),
                    maxLength: 800,
                }" />
            </div>
        </div>

        <div class="u-mt-medium">
            <button :class="['c-btn', { disabled: loading }]" type="submit">
                {{ $t("Verstuur") }}
            </button>
        </div>
    </form>
</template>

<script setup>

const props = defineProps({
    vacancy: {
        type: Object,
        default: null,
        required: true,
    }
});

const emit = defineEmits();
const { $toastrBus } = useNuxtApp();
let loading = ref(false);

const submit = async ($event) => {
    try {
        loading.value = true;
        const fd = new FormData($event.target);
        const data = {
            job_post_ids: [parseInt(fd.get("jobpostId"))],
            motivation: fd.get("motivation")
        };
        const response = await useRWApi(`/job_posts/${props.vacancy.id}/apply`, {
            method: 'POST',
            body: data
        });

        if (response && response.data) {
            emit("update-jobpost", response.data);
            // dataLayer.push({
            //     event_type: "form_submit",
            //     event: "job_reaction",
            //     job_application_id: response.data.id
            // });

            $toastrBus.$emit('show', {
                type: 'success',
                message: 'Gegevens succesvol verstuurd'
            });

            emit("form-success");
        } else if (Object.keys(response.errors).length === 1) {
            const errorMessage = response.errors.job_post_ids
                ? "Je hebt al een shift op dit tijdstip. Je kan daarom niet meer reageren op deze shift(s)."
                : response.errors.motivation
                    ? "Motivatie mag niet langer zijn dan 800 tekens."
                    : response.errors.skills
                        ? "Skills moeten hetzelfde zijn als in de opdrachtbeschrijving"
                        : "Er is iets mis gegaan met het reageren. Controleer de gegevens en probeer het nog eens.";

            $toastrBus.$emit('show', {
                type: 'error',
                message: `<strong>Let op!</strong> ${errorMessage}`,
                duration: 6000
            });

            emit("toggle-modal");
        } else {
            const toasterMessage = {
                text: `<strong>Let op!</strong> Er is iets mis gegaan met het reageren. Controleer de gegevens en probeer het nog eens.`,
                type: "error"
            };

            $toastrBus.$emit('show', {
                type: 'error',
                message: toasterMessage,
                duration: 6000
            });

            emit("toggle-modal");
        }
    } catch (err) {
        const toasterMessage = {
            text: `<strong>Let op!</strong> Er is iets mis gegaan met het reageren. Controleer de gegevens en probeer het nog eens.`,
            type: "error"
        };

        $toastrBus.$emit('show', {
            type: 'error',
            message: toasterMessage,
            duration: 6000
        });

        emit("toggle-modal");
        throw err;
    } finally {
        loading.value = false;
        location.reload();
    }
}

</script>

<style lang="scss" scoped></style>