<template>
  <div class="d-flex flex-column align-center justify-center h-100 w-100">

    
    
    <h1 class="navy-text">Test</h1>

    <v-container>
      <v-row>
        <SearchFOSNew />
      </v-row>
    </v-container>

    <p>{{ selectedOption }}</p>

  </div>
</template>

<script setup>
const selectedOption = ref(null);
const { site } = useSiteData()
</script>

<style scoped lang="scss">
</style>

