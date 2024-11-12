<template>
  <v-autocomplete
    label="Search Academic Fields"
    id="search-form-fos-auto-complete"
    v-model="cip4"
    :items="items"
    :loading="isLoading"
    item-title="field"
    item-value="cip4"
    placeholder="Start typing to search"
    return-object
    autocomplete="off"
    @update:modelValue="change"
    hide-details
    class="pt-0 mt-0"
    color="secondary-green"
    clearable
    @click:clear="clear"
    aria-labelledby="fields-label"
    density="compact"
    variant="outlined"
    style="z-index: 200"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const { CIP4 } = useSiteData()
const isLoading = ref(false)
const cip4 = ref({})

const items = computed(() => {
  return useSortBy(CIP4.value, ["field"])
})

watch(() => props.modelValue, (newValue) => {
  cip4.value = mapValuePropToState(newValue)
})

onMounted(() => {
  // Transform value prop to expected component state.
  cip4.value = mapValuePropToState(props.modelValue)
})

// Digest URL value and look up in program index.
function mapValuePropToState(value) {
  if (!value || value.length != 4) {
    return null
  }

  let groomedKey = value.slice(0, 2) + "." + value.slice(2)
  let locatedCip4 = useFind(items.value, { cip4: groomedKey })

  return locatedCip4 ? locatedCip4 : null
}

function change() {
  if (!isEmpty(cip4.value)) {
    emit("update:modelValue", cip4.value.cip4.replace(".", ""))
  }
}

function clear() {
  cip4.value = {}
  emit("update:modelValue", "")
}
</script>
