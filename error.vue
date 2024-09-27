<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div>
      <h2>{{ error?.statusCode }}</h2>
      <button @click="handleError">Clear errors</button>
    </div>
  </NuxtLayout>
</template>