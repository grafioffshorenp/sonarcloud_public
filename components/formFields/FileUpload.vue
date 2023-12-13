<template>
  <div :class="{ 'file-upload-container--wide': placeholderWidth === 'wide' }">
    <div v-if="input.instructions && showInstructions" class="u-mb-medium">
      <small class="instructions">{{ $t(input.instructions) }}</small>
    </div>
    <label v-if="!hideLabel" :class="{ required: input.required }">{{ $t(input.label) }}</label>

    <div class="file-upload">
      <img
        v-if="(savedFile || prefilledFile) && fileIsImage"
        class="file-upload__image"
        :src="savedFile || prefilledFile"
        :alt="$t('Gekozen afbeelding')"
      />

      <div class="file-upload__input" :class="{ active: !selectedFile }">
        <div class="input--file" :class="{ 'input--file--wide': placeholderWidth === 'wide' }">
          <input :name="input.handle" type="text" :value="savedFile" />
          <input :id="id" :accept="mapAccepted" type="file" :required="input.required" @change="pickFile" />
          <div class="input--file__substitute" />
          <div
            v-if="placeholderType === 'profilePicture' && !savedFile"
            class="bg-fallback-employee bg-fallback-employee--darker-bg placeholder placeholder--profile-picture"
          />
        </div>

        <label :for="id" class="inline-label">
          {{ $t(label) }}
        </label>
      </div>

      <template v-if="selectedFile">
        <vue-cropper
          ref="cropper"
          :aspect-ratio="aspectRatio"
          :auto-crop-area="1"
          :crop-box-resizable="true"
          drag-mode="move"
          :min-container-height="240"
          :src="selectedFile"
          :view-mode="1"
        />

        <p class="description">
          {{ $t("Snijd eventueel de afbeelding bij op het gewenste formaat") }}
        </p>

        <a class="btn background-fourth" @click="saveImage()">
          {{ $t("Bevestig") }}
        </a>
      </template>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import _ from "lodash";

export default {
  name: "FileUpload",
  components: {
    VueCropper
  },
  props: {
    accept: {
      default: () => ["image"],
      required: false,
      type: Array
    },
    aspectRatio: {
      required: false,
      type: Number,
      default: 1
    },
    input: {
      required: true,
      type: Object
    },
    file: {
      default: "",
      required: false,
      type: String
    },
    height: {
      default: 170,
      required: false,
      type: Number
    },
    width: {
      default: 170,
      required: false,
      type: Number
    },
    placeholderType: {
      default: null,
      required: false,
      type: String
    },
    placeholderWidth: {
      default: "wide",
      required: false,
      type: String
    },
    showInstructions: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      id: null,
      hideLabel: false,
      fileName: "",
      fileIsImage: false,
      label: "",
      prefilledFile: null,
      savedFile: null,
      selectedFile: null
    };
  },
  computed: {
    mapAccepted() {
      const accepted = {
        image: ["image/*"],
        pdf: ["application/pdf"],
        word: [
          ".doc",
          ".docx",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
      };
      return this.accept.map(ext => accepted[ext] || ext);
    }
  },
  watch: {
    placeholderType: {
      handler(val) {
        this.placeholder = val.toLowerCase();
      }
    }
  },
  mounted() {
    if (["profile_picture", "ambiance_picture"].includes(this.input.handle)) {
      this.label = this.file
        ? "Wijzig afbeelding"
        : "Selecteer afbeelding"
      this.hideLabel = true;
    } else {
      this.label = this.file
        ? "Wijzig bestand"
        : "Selecteer bestand"
    }

    if (this.file) {
      this.prefilledFile = this.file;
      this.fileIsImage = this.file.includes("data:image/jpeg;base64") || this.file.includes("https://");
    }
    this.id = _.uniqueId();
  },
  methods: {
    blobToBase64(image, cb) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = cb;
    },
    pickFile({ target }) {
      this.savedFile = null;

      if (target.files && target.files.length) {
        const file = target.files[0];
        this.fileName = file.name;
        this.fileIsImage = file.type.includes("image");
        this.blobToBase64(file, this.fileIsImage ? this.resolveImage : this.resolveFile);
      }
    },
    resolveFile({ target }) {
      this.label = this.fileName;
      this.savedFile = target.result;
    },
    resolveImage({ target }) {
      this.selectedFile = target.result;
      this.$emit('cropping', true);
    },
    async saveImage() {
      const image = this.$refs.cropper
        .getCroppedCanvas({
          fillColor: "#fff",
          height: this.height,
          imageSmoothingQuality: "high",
          width: this.width
        })
        .toDataURL("image/jpeg");

      this.savedFile = image;
      this.selectedFile = null;
      this.$emit('cropping', false);
      this.$emit('setCrop', this.savedFile);
      this.$refs.cropper.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.file-upload-container {
  &--wide {
    width: 100%;
  }
}

.file-upload {
  width: 100%;

  label {
    color: $anchor-color;
    text-decoration: underline;
  }

  .file-upload__image {
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.3);
  }

  input[type="text"] {
    display: none;
  }

  input[type="file"] {
    position: absolute;
    height: 100%;

    + .input--file__substitute {
      color: rgba($bg-color-fifth-light, 0.8);
      text-decoration: none;
      height: 100%;
    }

    &:hover + .input--file__substitute {
      background-color: $white;
    }
  }

  &__input {
    display: none;
    position: relative;

    &.active {
      display: block;
    }
  }

  label {
    margin-right: 0;
    position: absolute;
    text-align: center;
    top: calc(50% - 12px);
    width: 100%;
    z-index: 1;

    img {
      animation: hide 2.5s ease;
      margin-bottom: -4px;
      margin-left: 8px;
      opacity: 0;
      width: 20px;
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  .description {
    font-size: 13px;
    margin: 5px 0 0 0;
  }

  &__image {
    border-radius: 6px;
    display: block;
    max-width: 100%;

    + .file-upload__input {
      margin-top: 16px;
    }
  }

  .btn {
    margin-top: 16px;
  }

  .placeholder {
    border-radius: 6px;
    opacity: 0.175;

    &__title {
      position: absolute;
      top: 16px;
      z-index: 2;
      font-size: 14px;
      font-weight: 600;
      color: $anchor-color;
    }

    &--id {
      height: 131px;
      margin: 25px 0;
      object-fit: contain;
      opacity: 0.5;
      width: 188px;
      z-index: 1;
    }

    &--profile-picture {
      width: 140px;
      height: 140px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
