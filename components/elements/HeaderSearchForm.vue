<template>
    <div class="c-search-form">
        <div class="c-search-form__inner c-search-form__inner--inline">
            <ElementsAutocompleteSelect :input="{
                handle: 'autocomplete',
                placeholder: $t(labels.autocomplete),
                value: fields.search,
                classes: inlineFields ? 'c-input--rounded-left' : ''
            }" :list="list" @on-enter="search" @on-change="setBranchValue" />
            <input v-model="fields.postalcode.value" class="c-input" :class="{
                invalid: !fields.postalcode.valid && !fields.postalcode.focused,
                'c-input--grey-border': inlineFields
            }" :placeholder="$t(labels.postalcode)" type="text" @blur="setFocus(false)" @focus="setFocus(true)"
                @input="validate" @keydown="checkPostalcodeCharacters" @keyup.enter="search" />

            <button :disabled="isDisabled" class="c-submit c-input" :class="{ 'c-input--rounded-right': inlineFields }"
                @click="search">
                {{ $t(labels.search) }}
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    list: {
        required: true,
        type: Array
    },
    vacanciesUrl: {
        required: true,
        type: String
    },
    inlineFields: {
        required: false,
        type: Boolean
    }
})

const labels = {
    autocomplete: 'allBranches',
    postalcode: 'postalcode',
    search: 'search'
}

let fields = reactive({
    postalcode: { focused: false, value: "", valid: true },
    search: "",
    branch: null
});

const href = computed(() => {
    const { branch, postalcode, search } = fields;
    const valueFromList = props.list.find(listItem => listItem.name === search);
    const query = {};

    if (branch) {
        query.branches = branch;
    }
    if (postalcode.value) {
        query.postalcode = postalcode.value;
    }
    if (valueFromList) {
        query.functions = valueFromList.functions.map(({ name }) => name).join("+");
    }
    return Object.keys(query).length
        ? `${props.vacanciesUrl}?${Object.keys(query)
            .map(key => {
                if (key === "branches") {
                    return "industry[0]=" + encodeURIComponent(query[key]);
                }
                return key + "=" + encodeURIComponent(query[key]);
            })
            .join("&")}`
        : props.vacanciesUrl;
})

const isDisabled = computed(() => {
    return !fields.postalcode.valid;
})

const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
const checkPostalcodeCharacters = ($event) => {
    const { length } = fields.postalcode.value;
    const isDigit = $event.keyCode >= 48 && $event.keyCode <= 57;
    const isLetter = $event.keyCode >= 65 && $event.keyCode <= 90;
    const valMaxChar = length > 5 && (isDigit || isLetter);
    const valFourDigits = length < 4 && isLetter;
    const valTwoLetters = length > 3 && isDigit;

    if (valMaxChar || valFourDigits || valTwoLetters) {
        $event.preventDefault();
    }
}
const postalCodeIsInvalid = () => {
    const { length } = fields.postalcode.value;
    const isInvalid = length > 0 && length < 6;
    fields.postalcode.valid = !isInvalid;
    return isInvalid;
}
const search = () => {
    // if (postalCodeIsInvalid()) {
    //     return;
    // }
    window.location.href = href.value;
}
const setBranchValue = ($event) => {
    fields.branch = $event.name;
}
const setFocus = (state) => {
    fields.postalcode.focused = state;
}
const setSearchValue = (value) => {
    fields.search = value.name;
}
const stripCharacters = () => {
    const { value } = fields.postalcode;
    fields.postalcode.value = value.replace(/[^a-zA-Z0-9-_]/g, "").replace(" ", "");
}
const validate = () => {
    stripCharacters();
    postalCodeIsInvalid();
}

</script>