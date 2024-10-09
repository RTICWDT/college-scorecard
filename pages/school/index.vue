<template>
  <div>
    <h1 class="navy-text">School</h1>
    <p v-if="schoolId">School ID: {{ schoolId }}</p>
    <p v-else>No school ID provided</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const schoolId = computed(() => {
  // Get the first key of the query object
  const key = Object.keys(route.query)[0]
  return key ? key : null
})
</script>