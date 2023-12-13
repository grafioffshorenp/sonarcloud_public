<template>
  <div class="rating-stars">
    <div class="stars-list" @mouseleave="resetStars()">
      <a v-for="star in stars" :key="star.value" @mouseover="markStarsAsSelected(star)" @click="selectStar(star)">
        <i v-if="!star.active" class="fal fa-star"/>
        <i v-else class="fas fa-star"/>
      </a>
    </div>

    <div class="star-active">
      <p v-if="selectedStarLabel">{{ selectedStarLabel }}</p>
      <input v-if="selectedStar" type="hidden" name="rating" :value="selectedStar.value"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RatingStars',
  data() {
    return {
      selectedStar: null,
      stars: [
        { active: false, label: '1', value: 1 },
        { active: false, label: '2', value: 2 },
        { active: false, label: '3', value: 3 },
        { active: false, label: '4', value: 4 },
        { active: false, label: '5', value: 5 },
      ],
    };
  },
  computed: {
    selectedStarLabel() {
      const activeStars = this.stars.filter(star => star.active);
      if (activeStars.length) {
        return activeStars[activeStars.length - 1].label;
      } else if (this.selectedStar) {
        return this.selectedStar.label;
      }
      return false;
    },
  },
  mounted() {
    if (this.reviewsFields) {
      this.stars = Object.values(this.reviewsFields.ratingLevels).map((label, index) => {
        return { active: false, label, value: index + 1 };
      });
    }
  },
  methods: {
    deselectStar(star) {
      this.selectedStar = null;
      this.resetStars();
      this.markStarsAsSelected(star);
    },
    isSelectedStar({ value }) {
      return this.selectedStar && this.selectedStar.value === value;
    },
    markStarsAsSelected(star) {
      this.stars = this.stars.map(s => ({ ...s, active: s.value <= star.value }));
    },
    resetStars() {
      if (this.selectedStar) {
        this.markStarsAsSelected(this.selectedStar);
      } else {
        this.stars = this.stars.map(s => ({ ...s, active: false }));
      }
    },
    selectStar(star) {
      if (this.isSelectedStar(star)) {
        this.deselectStar(star);
      } else {
        this.selectedStar = star;
      }
      this.$emit('set-rating', this.selectedStar ? this.selectedStar.value : 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.rating-stars {
  background: $bg-color-lightest-alt;
  border-radius: 6px;
  padding: 24px 31px;

  .stars-list {
    display: flex;
    justify-content: space-between;
  }

  .star-active {
    p {
      color: $paragraph-colored;
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 0px;
    }
  }

  i {
    color: $icon-color-third;
    font-size: 24px;

    &:not(:last-of-type) {
      margin-right: 24px;
    }
  }
}
</style>
