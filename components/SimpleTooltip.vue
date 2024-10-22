<template>
  <span>
    <v-tooltip :text="text" location="top" max-width="600" theme="primary-green">
      <template v-slot:activator="{ props }">
        <v-icon
          v-bind="props"
          size="x-small"
          :color="color"
          icon="fa:fas fa-info-circle"
        />
      </template>
    </v-tooltip>
  </span>
</template>

<script setup>
const props = defineProps({
  text: String,
  color: {
    type: String,
    default: "blue-darken-3"
  }
})
</script>