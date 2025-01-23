<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const is404 = computed(() => props.error?.statusCode === 404)
const handleError = () => clearError({ redirect: '/' })
</script>

<template>

  

  <NuxtLayout>
    <div class="d-flex flex-column align-center justify-center w-100 h-100">


      <h1 class="text-h2 mb-5">{{ is404 ? 'Page Not Found' : 'Something went wrong.' }}</h1>
      <p v-if="is404" class="mb-5">Sorry, the page you are looking for no longer exists.</p>
      <v-btn color="primary-green" @click="handleError">Return to Home</v-btn>

    </div>
  </NuxtLayout>
</template>