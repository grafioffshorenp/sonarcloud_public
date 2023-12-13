<template>
  <div class="c-icon--large hover-tooltip">
    <i class="fas fa-question-circle"></i>
    <div class="tooltip">
      {{ tooltip }}
    </div>
  </div>
</template>

<script>
export default {
  name: "IconTooltip",
  props: {
    tooltip: {
      required: true,
      type: String
    }
  }
};
</script>

<style scoped lang="scss">
.hover-tooltip {
  display: inline-block;
  font-size: 26px;
  position: relative;

  &:hover {
    .tooltip {
      display: block;
    }
  }

  .tooltip {
    font-size: 16px;
    display: none;
    position: absolute;
    background: white;
    color: grey;
    z-index: 5;
    min-width: 160px;
    padding: 1rem;
    border: 1px solid lightgrey;
    border-radius: 5px;
    bottom: 110%;
    transform: translate(calc(-50% + 16px));
  }
}
</style>
