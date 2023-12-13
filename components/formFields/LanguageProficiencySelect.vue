<template>
  <div>
    <label v-if="input.label">{{ $t(input.label) }}</label>
    <p v-if="input.instructions">{{ $t(input.instructions) }}</p>
    <input v-model="hiddenInput" type="hidden" :name="input.handle" />
    <div v-for="(row, index) in rows" :key="`row-language-proficiency-${index}`">
      <div class="c-input-row c-input-row--columns-2 mb-0">
        <div class="flex-row">
          <span>{{ $t('Language') }}</span>
          <span class="text-red-700 pl-1">*</span>
        </div>
        <div class="flex-row">
          <span>{{ $t('Language proficiency') }}</span>
          <span class="text-red-700 pl-1">*</span>
        </div>
      </div>
      <div class="c-input-row c-input-row--columns-2">
        <div class="c-input-row__wrapper">
          <select v-model="row.lang" class="pl-4">
            <option value="" disabled selected>
              {{ $t("Taal") }}
            </option>
            <option
              v-for="language in locales"
              v-show="remainingLocalesOptions.includes(language)"
              :key="`option-${language.slug}`"
              :value="language.slug"
            >
              {{ $t(language.title) }}
            </option>
          </select>
          <div class="c-input-icon c-input-icon--teal">
            <i class="far fa-chevron-down"></i>
          </div>
        </div>

        <div class="c-input-row__wrapper">
          <select v-model="row.level" class="c-input-select pl-4">
            <option value="" disabled selected>
              {{ $t("Taalvaardigheid") }}
            </option>
            <option v-for="(label, key) in proficiencySettings" :key="`proficiencySettings-${key}`" :value="key">
              {{ $t(label) }}
            </option>
          </select>
          <div class="c-input-icon c-input-icon--teal">
            <i class="far fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <a class="c-form-link u-mt-small u-mb-big u-flex" @click.prevent="deleteRow(index)">
        {{ $t("Verwijder taal") }}
        <div class="c-form-link__icon">
          <i class="far fa-trash-alt"></i>
        </div>
      </a>
    </div>
    <a v-if="showAddRow" class="c-form-link u-mt-big u-flex" @click.prevent="addRow()">
      {{ $t("+ nog een taal toevoegen") }}
    </a>
  </div>
</template>
<script>
const emptyRow = {
  lang: "",
  level: ""
};

export default {
  name: "LanguageProficiencySelect",
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
      rows: []
    };
  },
  computed: {
    showAddRow() {
      return this.remainingLocalesOptions.length;
    },
    remainingLocalesOptions() {
      if (!this.locales) return [];

      return this.locales.filter(locale => !this.rows.some(row => locale.slug === row.lang));
    },
    hiddenInput() {
      return JSON.stringify(this.rows.filter(row => row.lang && row.level));
    }
  },
  watch: {
    rows(newValue) {
      if (newValue.length === 0) this.addRow();
    }
  },
  mounted() {
    this.locales = [
        {
          "title": "Nederlands (Dutch)",
          "slug": "nederlands-dutch"
        },
        {
          "title": "English (English)",
          "slug": "english-english"
        },
        {
          "title": "Français (French)",
          "slug": "français-french"
        },
        {
          "title": "Türkçe (Turkish)",
          "slug": "türkçe-turkish"
        },
        {
          "title": "Русский (Russian)",
          "slug": "русский-russian"
        },
        {
          "title": "Українська (Ukrainian)",
          "slug": "українська-ukrainian"
        },
        {
          "title": "العربية (Arabic)",
          "slug": "العربية-arabic"
        },
        {
          "title": "فارسی (Farsi)",
          "slug": "فارسی-farsi"
        },
        {
          "title": "دری (Dari)",
          "slug": "دری-dari"
        },
        {
          "title": "Af Soomaali (Somali)",
          "slug": "af-soomaali-somali"
        },
        {
          "title": "ትግርኛ (Tigrinya)",
          "slug": "ትግርኛ-tigrinya"
        },
        {
          "title": "Afrikaans (Afrikaans)",
          "slug": "afrikaans-afrikaans"
        },
        {
          "title": "shqip (Albanian)",
          "slug": "shqip-albanian"
        },
        {
          "title": "հայերէն (Armenian)",
          "slug": "հայերէն-armenian"
        },
        {
          "title": "Azərbaycan dili (Azerbaijani)",
          "slug": "azərbaycan-dili-azerbaijani"
        },
        {
          "title": "беларуская мова (Belarusian)",
          "slug": "беларуская-мова-belarusian"
        },
        {
          "title": "বাংলা (Bengali)",
          "slug": "বাংলা-bengali"
        },
        {
          "title": "မြန်မာစာ (Burmese)",
          "slug": "မြန်မာစာ-burmese"
        },
        {
          "title": "Bosanski (Bosnian)",
          "slug": "bosanski-bosnian"
        },
        {
          "title": "български (Bulgarian)",
          "slug": "български-bulgarian"
        },
        {
          "title": "Dansk (Danish)",
          "slug": "dansk-danish"
        },
        {
          "title": "Deutsch (German)",
          "slug": "deutsch-german"
        },
        {
          "title": "Eesti Keel (Estonian)",
          "slug": "eesti-keel-estonian"
        },
        {
          "title": "Suomi (Finnish)",
          "slug": "suomi-finnish"
        },
        {
          "title": "ქართული ენა (Georgian)",
          "slug": "ქართული-ენა-georgian"
        },
        {
          "title": "Ελληνικά (Greek)",
          "slug": "ελληνικά-greek"
        },
        {
          "title": "עִבְרִית‎ (Hebrew)",
          "slug": "עִבְרִית-hebrew"
        },
        {
          "title": "हिन्दी (Hindi)",
          "slug": "हिन्दी-hindi"
        },
        {
          "title": "Magyar nyelv (Hungarian)",
          "slug": "magyar-nyelv-hungarian"
        },
        {
          "title": "Bahasa Indonesia (Indonesian)",
          "slug": "bahasa-indonesia-indonesian"
        },
        {
          "title": "Italiano (Italian)",
          "slug": "italiano-italian"
        },
        {
          "title": "日本語 (Japanese)",
          "slug": "日本語-japanese"
        },
        {
          "title": "ייִדיש (Yiddish)",
          "slug": "ייִדיש-yiddish"
        },
        {
          "title": "қазақша (Khazakh)",
          "slug": "қазақша-khazakh"
        },
        {
          "title": "Kurdî (Kurdish)",
          "slug": "kurdî-kurdish"
        },
        {
          "title": "한국어 (Korean)",
          "slug": "한국어-korean"
        },
        {
          "title": "Hrvatski (Croatian)",
          "slug": "hrvatski-croatian"
        },
        {
          "title": "ລາວ (Lao)",
          "slug": "ລາວ-lao"
        },
        {
          "title": "Latviešu valoda (Latvian)",
          "slug": "latviešu-valoda-latvian"
        },
        {
          "title": "Lietuvių kalba (Lithuanian)",
          "slug": "lietuvių-kalba-lithuanian"
        },
        {
          "title": "македонски (Macedonian)",
          "slug": "македонски-macedonian"
        },
        {
          "title": "Bahasa Melayu (Malay)",
          "slug": "bahasa-melayu-malay"
        },
        {
          "title": "官話 (Mandarin)",
          "slug": "官話-mandarin"
        },
        {
          "title": "नेपाली (Nepali)",
          "slug": "नेपाली-nepali"
        },
        {
          "title": "Norsk (Norwegian)",
          "slug": "norsk-norwegian"
        },
        {
          "title": "پښتو (Pashto)",
          "slug": "پښتو-pashto"
        },
        {
          "title": "język polski (Polish)",
          "slug": "język-polski-polish"
        },
        {
          "title": "Português (Portugese)",
          "slug": "português-portugese"
        },
        {
          "title": "ਪੰਜਾਬੀ (Punjabi)",
          "slug": "ਪੰਜਾਬੀ-punjabi"
        },
        {
          "title": "Limba română (Romanian)",
          "slug": "limba-română-romanian"
        },
        {
          "title": "српски језик (Serbian)",
          "slug": "српски-језик-serbian"
        },
        {
          "title": "Slovenčina (Slovak)",
          "slug": "slovenčina-slovak"
        },
        {
          "title": "Slovenski jezik (Slovene)",
          "slug": "slovenski-jezik-slovene"
        },
        {
          "title": "Español (Spanish)",
          "slug": "español-spanish"
        },
        {
          "title": "Kiswahili (Swahili)",
          "slug": "kiswahili-swahili"
        },
        {
          "title": "Tagalog (Tagalog)",
          "slug": "tagalog-tagalog"
        },
        {
          "title": "தமிழ் (Tamil)",
          "slug": "தமிழ்-tamil"
        },
        {
          "title": "ภาษาไทย (Thai)",
          "slug": "ภาษาไทย-thai"
        },
        {
          "title": "čeština (Czech)",
          "slug": "čeština-czech"
        },
        {
          "title": "اُردُو (Urdu)",
          "slug": "اُردُو-urdu"
        },
        {
          "title": "tiếng Việt (Vietnamese)",
          "slug": "tiếng-việt-vietnamese"
        },
        {
          "title": "Svenska (Swedish)",
          "slug": "svenska-swedish"
        }
      ]

    if (this.input.value) {
      this.rows = this.input.value;
      return;
    }

    this.rows.push({ ...emptyRow });
  },
  methods: {
    addRow() {
      this.rows.push({ ...emptyRow });
    },
    deleteRow(index) {
      if(index != 0){
        this.rows.splice(index, 1);
      }else{
        this.rows.splice(index, 1);
        this.rows.splice(index, 0, { ...emptyRow });
      }
    }
  }
};
</script>
