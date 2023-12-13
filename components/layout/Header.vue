<template>
  <header class="main-header main-header--account main-header--transparent">
    <div class="main-header__inner inner-row--large main-header__inner--no-padding">
      <section class="main-header__titles">
        <div class="u-mb-medium">
          <h1 v-if="title" class="t-heading-1">{{ $t(title) }}</h1>
          <p v-if="subtitle" class="subtitle">{{ $t(subtitle) }}</p>
        </div>
      </section>
      <div v-if="showBackButton" class="c-button-back">
        <a href="javascript:history.back()">
          <div class="c-button-back__icon">
            <i class="fas fa-arrow-left"></i>
          </div>
        </a>
        <a href="javascript:history.back()">{{ $t('Ga terug') }}</a>
      </div>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  props: {
    title: String,
    subtitle: String,
    showBackButton: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.main-header {
  &--until-desktop {
    display: block;

    @include until-desktop {
      display: none;
    }
  }
}

a.show-sidebar,
.main-header__back {
  color: $text-color;
  font-weight: 300;
  text-decoration: none;

  i {
    margin-right: 0.25rem;
    padding: 0.5rem;

    background-color: $color-fourth;
    border-radius: 50%;

    color: $white;
  }

  @include until-desktop {
    font-size: 14px;
  }

  @include tablet {
    font-size: 24px;

    i {
      font-size: 20px;
    }
  }
}

a.show-sidebar {
  &.hidden {
    display: none;
  }

  @include desktop {
    display: none;
  }
}
</style>
