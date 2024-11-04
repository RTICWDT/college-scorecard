<template>
  <div class="d-flex flex-column align-center justify-center h-100 w-100">
    <v-container>
      <v-row>
        <v-card class="pa-8 w-100">
          <h1 class="navy-text text-center">Test</h1>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
useHead({
  title: 'Test',
  meta: [
    {
      name: 'description',
      content: 'Test page',
    },
  ],
})
</script>