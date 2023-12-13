<template>
  <component :is="type" :block="block"></component>
</template>

<script>
import * as components from './contentblocks/index'

export default {

  components: {
    ...components
  },

  props: {
    type: { type: String, required: true },
    block: { type: Object, required: true }
  },
}
</script>