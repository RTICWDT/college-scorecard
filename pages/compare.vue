<template>
  <div>
    <h1 class="navy-text">Compare</h1>
    <p v-if="toggleId">{{ toggleId }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const toggleId = computed(() => {
  // Get the first key of the query object
  const key = route.query.toggle
  return key
})
</script>