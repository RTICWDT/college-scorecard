<template>
  <div :style="{ height: props.height + 'px' }"></div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  height: {
    type: Number,
    default: 50,
  },
})
</script>