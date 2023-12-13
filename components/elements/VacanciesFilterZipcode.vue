<template>
  <div>
    <ais-configure :around-lat-lng.camel="coordinates" :around-radius.camel="!error ? (rangeValue * 1000) : 'all'"/>
    <div class="input-row">
      <div id="postalcode" class="input-wrapper input--text input--postalcode">
        <input id="form-input-postalcode" class="input input--is-uppercase" :placeholder="$t('Postcode')"
               name="postalcode"
               type="text" v-model="zipcode">
        <label for="form-input-postalcode" class="">{{ $t('Postcode') }}</label>
        <div class="range-wrap">
          <input id="form-input-range" class="range" type="range" min="1" max="100" step="1"
                 style="width: 100%; padding: 16px 0" ref="range" v-model="rangeValue" @input="setBubble">
          <output id="form-input-bubble" class="bubble" for="form-input-range" ref="bubble"></output>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between;">
          <div>1km</div>
          <div>100km</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AisConfigure } from 'vue-instantsearch/vue3/es';

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const zipcode = ref(route.query.postalcode || '');
const range = ref();
const bubble = ref();
const coordinates = ref('');
const rangeValue = ref(20);
const error = ref(false);

const checkPostalCode = (postalcode) => {
  const regex = /^[1-9][0-9]{3} ?((?!sa|sd|ss)[a-z]{2})?$/i;
  return regex.test(postalcode);
};

const setPostalcodeCoordinates = async (postalcode) => {
  // validate postalcode format
  if (!checkPostalCode(postalcode)) {
    error.value = true;
  } else {
    // Get coordinates from Google Maps
    postalcode = postalcode.replace(' ', '');
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalcode}%20Netherlands&key=${config.public.google.apiKey}`,
    );
    const data = await response.json();

    if (data.results.length === 0) {
      error.value = true;
    } else {
      coordinates.value = `${data.results[0].geometry.location.lat},  ${data.results[0].geometry.location.lng}`;
      error.value = false;
    }
  }
};

const setBubble = () => {
  const val = range.value.value;
  const min = range.value.min ? range.value.min : 0;
  const max = range.value.max ? range.value.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));

  bubble.value.innerHTML = val;
  // Sorta magic numbers based on size of the native UI thumb
  bubble.value.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
};

watch(zipcode, newZipcode => {
  router.push({
    query: {
      ...(route.query || {}),
      postalcode: newZipcode,
    },
  });
  setPostalcodeCoordinates(newZipcode);

}, { immediate: true });

onMounted(() => {
  setBubble();
});

</script>

<style lang="scss">
.range-wrap {
  position: relative;
  margin: 2rem 0 0 0;
}

.range {
  width: 100%;
}

.bubble {
  background: #757575;
  color: white;
  padding: 4px 12px;
  position: absolute;
  border-radius: 4px;
  left: 50%;
  transform: translateX(-50%);
  top: -20px;
}

.bubble::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  background: #757575;
  bottom: -1px;
  left: 50%;
}
</style>