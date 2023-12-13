<template>
  <div>
    <label v-if="input.label">{{ $t(input.label) }}</label>
    <p v-if="input.instructions">{{ $t(input.instructions) }}</p>
    <div>
      <div class="c-input-row">
        <div class="c-input-row__wrapper">

          <select class="visually-hidden" multiple name="languages[]">
            <option disabled value="">
              {{ $t("Taal") }}
            </option>
            <option
              v-for="language in locales"
              :key="`option-${language.slug}`"
              :selected="selectedLanguage(language.slug)"
              :value="language.slug"
            >
              {{ language.title }}
            </option>
          </select>

          <div
            class="c-chosen-languages-wrapper"
            @click="languageDropdownIsOpen = true"
            @focus="languageDropdownIsOpen = true"
            @focusout="languageDropdownIsOpen = false"
            tabindex="0"
          >
            <button type="button" class="c-chosen-languages">
              <ul class="c-chosen-languages__list">
                <li v-if="!selectedLanguages.length">{{ $t("Taal") }}</li>
                <li v-for="language in selectedLanguages" :key="`lang-${language}`">
                  <div class="c-tag" :data-language="language.toLowerCase()" @click="clickLanguageTagHandler">
                    {{ $t(language) }} <i class="far fa-times"></i>
                  </div>
                </li>
              </ul>
              <div class="c-input-icon c-input-icon--teal">
                <i class="far fa-chevron-down"></i>
              </div>
            </button>

            <ul
              class="c-languages-options-dropdown"
              :class="{ 'c-languages-options-dropdown--is-open': languageDropdownIsOpen }"
            >
              <li
                v-for="language in locales"
                :key="`dropdown-item-${language.slug}`"
                :data-language="language.slug"
                class="c-languages-options-dropdown__item"
                @click="selectLanguageClickHandler"
              >
                {{ $t(language.title) }}
              </li>
            </ul>
          </div>
        </div>

        <div class="c-input-row__wrapper">
          <select name="minimum_language_level" @change="$emit('levelChanged', $event)" class="pl-4">
            <option disabled selected value="">
              {{ $t("Taalvaardigheid") }}
            </option>
            <option
              v-for="(label, key) in proficiencySettings"
              :key="`proficiencySettings-${key}`"
              :selected="selectedProficiency(key)"
              :value="key"
            >
              {{ $t(label) }}
            </option>
          </select>
          <div class="c-input-icon c-input-icon--teal">
            <i class="far fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LanguageSelectFunctionTemplate",
  props: {
    input: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      proficiencySettings: {
        A1: "A1 - Starter",
        A2: "A2 - Elementary",
        B1: "B1 - Intermediate",
        B2: "B2 - Upper intermediate",
        C1: "C1 - Expert",
        C2: "C2 - Mastery (native)"
      },
      locales: null,
      selectedLanguages: [],
      languageDropdownIsOpen: false,
      rows: []
    };
  },
  computed: {
    hiddenInput() {
      return JSON.stringify(this.rows.filter(row => row.lang && row.level));
    }
  },
  mounted() {
    this.locales = this.input.locales; //this.globals.languageOptions;

    this.setSelectedLanguages();
  },
  methods: {
    setSelectedLanguages() {
      if (this.input.languages) {
        this.selectedLanguages = this.input.languages;
      }
    },
    selectedLanguage(slug) {
      if (this.input && this.input.languages) {
        for (let key in this.input.languages) {
          if (this.input.languages.hasOwnProperty(key)) {
            let lang = this.input.languages[key];
            this.selectLanguageClickHandler(lang)
          }
        }
      }

      if (this.languageIsSelected(slug)) return true;
      // if (this.$options.filters.isEmpty(this.$attrs.template.languages)) return false;

      return this.input.languages.indexOf(slug) >= 0;
    },
    selectedProficiency(key) {
      // if (this.$options.filters.isEmpty(this.$attrs.template.minimum_language_level)) return false;

      return this.input.minimum_language_level === key;
    },
    addLanguage(language) {
      if (!this.languageIsSelected(language)) {
        this.selectedLanguages.push(language);
        this.$emit('languagesChanged', this.selectedLanguages);
      }
    },
    removeLanguage(language) {
      if (this.languageIsSelected(language)) {
        const index = this.selectedLanguages.indexOf(language);

        this.selectedLanguages.splice(index, 1);
        this.$emit('languagesChanged', this.selectedLanguages);
      }
    },
    languageIsSelected(language) {
      return this.selectedLanguages.includes(language);
    },

    selectLanguageClickHandler(e) {
      let language
      if(typeof e !== 'string') {
        language = e.target.getAttribute("data-language");
      } else {
        language = e;
      }

      if (language) {
        this.addLanguage(language);
      }
    },

    clickLanguageTagHandler(e) {
      const language = e.target.getAttribute("data-language");

      if (language) {
        this.removeLanguage(language);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.c-chosen-languages-wrapper {
  position: relative;
}

.c-chosen-languages {
  justify-content: flex-start;

  padding: 0.25rem 2.5rem 0.25rem 1rem;
  min-height: 64px;
  height: 100%;
  width: 100%;

  border: 1px solid $light-grey;
  border-radius: 6px;
  background-color: transparent;

  font-family: $font-body;
  font-size: 1rem;
  font-weight: normal;
  color: $black;

  .c-input-icon {
    transform: translateY(calc(-50% - 6px));
  }

  @include on-event {
    border-color: $blue;
    background-color: transparent;

    filter: none;
  }
}

.c-languages-options-dropdown {
  display: none;

  position: absolute;
  z-index: 1;

  width: 100%;
  height: 300px;
  overflow-y: scroll;
  padding: 0.5rem 0;

  background-color: $blue-light;
  border-radius: 6px;

  color: $black;

  &--is-open {
    display: block;
  }
}

.c-languages-options-dropdown__item {
  padding: 0.5rem 1.25rem;

  cursor: pointer;

  @include on-event {
    background-color: $blue;

    color: $white;
  }
}

.c-chosen-languages__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.c-tag {
  padding: 0.5rem;

  background-color: $blue-light;
  border-radius: 0.5rem;

  color: $text-color;

  &::first-letter {
    text-transform: uppercase;
  }

  > i {
    pointer-events: none;

    transition: color 0.2s;
  }

  @include on-event {
    > i {
      color: $color-error;
    }
  }
}
</style>
