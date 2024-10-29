<template>
  <div class="d-flex flex-column align-center justify-center h-100 w-100">
    <!-- <h1 class="navy-text">Test</h1> -->
    <v-container>
      <Spacer :height="100" />
      <v-row>
        <v-card class="pa-8 w-100">
          <SearchFieldOfStudy v-model="selectedItem" />
        </v-card>
        <Spacer :height="700" />
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const selectedItem = ref()

watch(selectedItem, (value) => {
  console.log(value)
})

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