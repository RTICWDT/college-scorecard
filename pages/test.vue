<template>
  <div class="d-flex flex-column align-center justify-center h-100 w-100">

    
    
    <h1 class="navy-text">Test</h1>

    <v-container>
      <v-row>
        <Toggle
          v-model="selectedOption"
          :options="[
            { label: 'SCHOOLS', value: 'low', color: '#007000', activeColor: '#00700024' },
            { label: 'FIELDS OF STUDY', value: 'medium', color: '#fdb022', activeColor: '#fdb02224' },
          ]"
          backgroundColor="white"
          :height="100"
        />
      </v-row>
    </v-container>

    <p>{{ selectedOption }}</p>

  </div>
</template>

<script setup>
const selectedOption = ref(null);
</script>

<style scoped lang="scss">
</style>