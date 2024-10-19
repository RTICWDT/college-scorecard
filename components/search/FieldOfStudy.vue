<template>
  <v-combobox
    v-model="selectedValue"
    @update:model-value="handleFieldOfStudySelect"
    :items="items"
    item-title="cip4Title"
    item-value="code"
    :label="dense ? '' : 'Type to search'"
    :placeholder="dense ? 'Type to search' : 'Search for a field of study'"
    return-object
    autocomplete="off"
    variant="outlined"
    hide-no-data
    hide-details
    color="#007000"
    prepend-inner-icon="fa:fas fa-search"
    aria-label="Field of Study Search"
    :density="dense ? 'compact' : 'default'"
    required
    aria-required="true"
    min-width="220"
  >
    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props" :max-width="smAndDown ? 300 : 400">
        <v-list-item-subtitle v-html="item.raw.title"></v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from "vuetify"

const { smAndDown } = useBreakpoints()
const { site, CIP4 } = useSiteData()
const emit = defineEmits(['field-of-study-selected'])
const items = computed(() => site.value.data.cip_6_digit)

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: String,
    default: null,
  },
})

const selectedValue = ref(null)

watch(() => props.selected, (newValue) => {
  if (!newValue) {
    selectedValue.value = null
  } else {
    const found = CIP4.value.find(itm => newValue === itm.cip4.replace('.', ''))
    selectedValue.value = found ? { code: found.cip4.replace('.', ''), cip4Title: found.field } : null
  }
}, { immediate: true })

const handleFieldOfStudySelect = (selectedItem) => {
  if (!selectedItem || typeof selectedItem.code !== 'string' || selectedItem.code.length !== 6) {
    emit('field-of-study-selected', { cip4: null, field: null })
    return
  }

  const locateCip4 = CIP4.value.find(element => element.cip4.replace(/\./g, '') === selectedItem.code.slice(0, 4))
  if (!locateCip4 || !locateCip4.field) return null

  emit('field-of-study-selected', {
    cip4: selectedItem.code.slice(0, 4),
    field: locateCip4.field,
  })
}
</script>