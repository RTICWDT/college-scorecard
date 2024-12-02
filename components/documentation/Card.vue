<template>
  <v-container class="px-0">
    <v-row>
      <v-col cols="12">
        <v-card flat class="py-5 px-4 px-md-10 my-5 mx-2 mx-sm-5">
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ title }}
          </h1>
          <hr />
          <slot />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  title: String,
})
</script>

<style scoped lang="scss">
:deep(p), :deep(li) {
  max-width: 800px;
}
</style>