<template>
  <Transition>
    <div class="toast-message toast-relative " v-if="showToaster"
      :class="[{'toast-message--open' : showToaster},toasterType === 'success' ? 'bg-[#ff7b02]' : 'bg-[#ff3f3f]']">
      <div class="toast-text">
        {{ $t(toasterText) }}
      </div>
    </div>
  </Transition>
</template>
<script setup>
/*
To use the Toastr:

1) Import the toasterBus:
const { $toastrBus } = useNuxtApp();

2) Emit the show event:
   $toastrBus.$emit('show', {
      type: 'success', // or 'error'
      message: 'Gegevens succesvol opgeslagen',
      duration: 2000 // Determins how long the message should show, defaults to 3000ms
    });

 */
const { $toastrBus } = useNuxtApp();

let showToaster = ref(false)

let toasterText = ref();
let toasterType = ref();

$toastrBus.$on('show', (data) => {
  window.scrollTo(0, 0);

  toasterType.value = data.type;
  toasterText.value = data.message;

  showToaster.value = true;

  let duration = 3000;
  if (data.duration) {
    duration = data.duration
  }
  setTimeout(() => {
    showToaster.value = false;
  }, duration)

});
</script>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>