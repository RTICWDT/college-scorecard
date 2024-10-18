<template>
  <div :class="class">
    <div v-if="h === 3">
      <h3 class="d-inline">{{ title }}</h3>
      <div class="d-inline position-relative" style="left: -5px; bottom: 8px">
        <Tooltip :definition="definition" :is-pell="pell"/>
      </div>
    </div>

    <div v-if="h === 2">
      <h2 class="d-inline">{{ title }}</h2>
      <div class="d-inline position-relative" style="left: -5px; bottom: 8px">
        <Tooltip :definition="definition" :is-pell="pell"/>
      </div>
    </div>

    <div v-if="h === 1">
      <h1 class="d-inline">{{ title }}</h1>
      <div class="d-inline position-relative" style="left: -5px; bottom: 8px">
        <Tooltip :definition="definition" :is-pell="pell"/>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  definition: {
    type: String,
    default: ''
  },
  h: {
    type: Number,
    default: 3
  },
  class: {
    type: String,
    default: ''
  },
  pell: {
    type: Boolean,
    default: false
  }
});
</script>