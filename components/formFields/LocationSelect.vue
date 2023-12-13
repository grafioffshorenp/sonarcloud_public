<template>
  <div class="input-row">
    <div class="input-wrapper input--select">
      <select
        v-model="locationId"
        name="employer_location_id[]"
        class="pl-4 pt-2"
        :disabled="disabled()"
        multiple
        style="height: 100px;"
      >
        <option v-for="locationOption in locationOptions()" :key="locationOption.id" :value="locationOption.id">
          {{ locationOption.name }}
        </option>
      </select>
      <div class="c-input-icon c-input-icon--teal">
        <i class="far fa-chevron-down"></i>
      </div>
      <label>{{ $t("Voeg toe") }}</label>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['changed'])
let errors = ref();
const userStore = useUserStore();
const { $toastrBus } = useNuxtApp();
const { getEmployerLocations } = toRefs(userStore);

let locationId = ref(null);

const props = defineProps({
    template: {
      required: false,
      type: Object,
      default() {
        return null;
      }
    }
})

const mode = (value = 'create') => {
  return value
  }

const disabled = () => {
  if (mode() === "create") {
    return false
  }
    return true
  }

const locationOptions = () => {
  return getEmployerLocations.value.data
}

onMounted(() => {
  if (mode() === "create") {
      return;
    }

    if (!("employer_location" in props.template)) {
      return;
    }

    locationId = props.template.employer_location.id;
})

watch(locationId, (value) => {
  emit('changed', [value]);
})


</script>
