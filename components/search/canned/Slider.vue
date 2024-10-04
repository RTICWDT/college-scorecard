<template>
  <v-switch
    :label="label"
    inset
    base-color="#c1c1c1"
    color="#007000"
    @update:model-value="handleChange"
    hide-details
    :loading="isLoading"
    :id="id"
  >
    <template #label>
      {{ label }}
      <SimpleTooltip v-if="tip" color="#1565c0" class="ml-2" :text="tip" text-color="white" />
    </template>
  </v-switch>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: String,
  addToQuery: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
  tip: {
    type: String,
    default: '',
  },
  id: String,
})

const emit = defineEmits(['canned-search-toggle'])

const handleChange = (value) => {
  emit('canned-search-toggle', { value, data: props.addToQuery })
}
</script>

<style lang="scss" scoped>
:deep(label) {
  color: green !important;
  font-weight: bold;
  opacity: 1;
}
</style>