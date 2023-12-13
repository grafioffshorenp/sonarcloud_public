<template>
    <div class="modal__backdrop" @click.self.prevent="emit('toggle-modal')">
        <div class="modal__content"
            :class="{ compact: !minHeight, 'has-title-bar': modalTitle, 'fit-content-height': fitContentHeight }">
            <div v-if="modalTitle" class="modal__title-bar">
                {{ $t(modalTitle) }}
            </div>
            <a class="modal__toggler modal__close" @click="emit('toggle-modal')">
                <i class="far fa-times" />
            </a>
            <slot />
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    minHeight: {
        default: true,
        required: false,
        type: Boolean
    },
    fitContentHeight: {
        default: false,
        required: false,
        type: Boolean
    },
    modalTitle: {
        default: null,
        required: false,
        type: String
    }
});

const emit = defineEmits(['toggle-modal']);
</script>
  