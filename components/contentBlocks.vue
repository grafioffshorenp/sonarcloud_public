<template>
  <div>
    <section
        v-for="(block, index) in props.blocks"
        :key="`content-block_${index}`"
        class="block max-w-full"
        :id="block.typeHandle"
    >
      <DynamicComponent
          :type="block.typeHandle"
          :block="block"
      ></DynamicComponent>
    </section>
  </div>
</template>
<script setup>
import DynamicComponent from "./dynamicComponent.vue";

const props = defineProps({
  blocks: []
});
</script>