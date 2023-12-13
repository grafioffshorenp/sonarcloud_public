<template>
    <div class="progress-bar">
      <div class="progress-bar__meter" :style="{ width: `${progress}%` }" />
    </div>
  </template>
  
  <script>
  export default {
    name: "ProgressBar",
    props: {
      progress: {
        required: true,
        type: Number
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .progress-bar {
    margin: 0 -24px;
  
    @include tablet {
      margin: 0 -32px;
    }
  }
  
  .progress-bar,
  .progress-bar__meter {
    height: 4px;
  
    @include tablet {
      height: 8px;
    }
  }
  
  .progress-bar__meter {
    background: $blue;
    transition: width 1s ease;
    width: 0%;
  }
  </style>
  