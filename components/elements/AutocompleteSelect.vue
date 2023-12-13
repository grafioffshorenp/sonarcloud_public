<template>
    <div ref="autocompleter" class="c-form-input-container">
        <input :id="`form-input-${input.handle}`" v-model="inputValue" autocomplete="off" class="c-input c-input--with-icon"
            :class="input.classes" type="text" :disabled="input.disabled" :name="input.handle"
            :placeholder="initialValue || input.placeholder || input.label" :required="input.required" @blur="onBlur"
            @focus="onFocus" @input="onInput" @keydown.tab="onTab" />
        <label v-if="input.label" :for="`form-input-${input.handle}`" :class="{ required: input.required }">
            {{ $t(input.label) }}
        </label>
        <i class="fas fa-chevron-down c-input__icon" @click="toggleAutocomplete" />
        <ul v-if="showAutocomplete" class="autocomplete-list">
            <li v-for="item in autocompleteList" :key="item.id" @mousedown="setValue(item)"
                v-html="$t(highlightMatch(item.name))" />
        </ul>
    </div>
</template>

<script setup>
const emit = defineEmits(['on-change']);

const props = defineProps({
    input: {
        required: true,
        default: null,
        type: Object
    },
    list: {
        required: true,
        default: [],
        type: Array
    }
})

let initialValue = "";
let inputValue = ""
let showAutocomplete = ref(false);

const autocompleteList = computed(() => {
    return initialValue
        ? props.list
        : props.list.filter(item => item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
})

const listItem = computed(() => {
    return props.list.find(listItem => listItem.name === inputValue || listItem.name === initialValue);
})

onMounted(() => {
    inputValue = props.input.value;
    initialValue = props.input.value;
})

const highlightMatch = (value) => {
    const match = new RegExp("(" + (initialValue || inputValue) + ")", "gi");
    return value.replace(match, "<span class='highlight'>$1</span>");
}
const inputListener = (e) => {
    if (showAutocomplete && !this.$refs.autocompleter.contains(e.target)) {
        toggleAutocomplete(false);
    }
}

// if(typeof window !== 'undefined') {
//   window.addEventListener("click", inputListener);
//   window.addEventListener("touchend", inputListener);
//
//   onBeforeUnmount(() => {
//     window.removeEventListener("click", inputListener);
//     window.removeEventListener("touchend", inputListener);
//   })
// }

const onBlur = () => {
    if (initialValue) {
        inputValue = initialValue || listItem;
    }
    onChange();
}
const onChange = () => {
    emit("on-change", listItem || {});

    if (!listItem) {
        inputValue = "";
    }
}
const onFocus = () => {
    inputValue = "";
    toggleAutocomplete(true);
}
const onInput = () => {
    initialValue = "";
}
const onTab = () => {
    toggleAutocomplete();
    onChange();
}
const setValue = (listItem) => {
    inputValue = listItem.name;
    initialValue = inputValue;
    toggleAutocomplete();
    emit("on-change", listItem);
}
const toggleAutocomplete = () => {
    showAutocomplete.value = !showAutocomplete.value;
}
</script>

<style lang="scss" scoped>
.input--with-icon {
    width: 100%;

    .input {
        text-overflow: ellipsis;

        &:not(:disabled)~label {
            background: $white;
        }
    }

    i {
        color: $icon-color;
        font-size: 18px;
        padding: 22px 16px;

        @include tablet {
            font-size: 20px;
        }

        &:hover {
            cursor: pointer;
        }
    }

    .input:disabled~i {
        color: $light-grey;
    }
}
</style>
  