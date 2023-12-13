<template>
  <div class="c-go-back" @click="onButtonBackClick">
    <IconButton fa-class="fas fa-arrow-left" :aria-label="$t('Ga terug')" />
    <TextElement element="span" :modifiers="['grey']"> {{ $t("Ga terug") }}</TextElement>
  </div>
</template>

<script>
import IconButton from "../atoms/IconButton";
import TextElement from "../atoms/TextElement";

export default {
  name: "GoBack",
  components: { IconButton, TextElement },
  methods: {
    onButtonBackClick() {
      this.$emit("onButtonBackClick");
    }
  }
};
</script>

<style lang="scss" scoped>
.c-go-back {
  display: flex;
  align-items: center;

  padding: 1rem;

  cursor: pointer;

  @include on-event {
    > span {
      color: $blue;
    }
  }
}
</style>
