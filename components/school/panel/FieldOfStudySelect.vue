<template>
  <div :id="containerId" class="field-of-study-select-search-container">
    <v-text-field
      id="field-of-study-select-search-text"
      aria-label="Field Of Study Select"
      v-model="searchText"
      @update:modelValue="filterObject"
      @change="handleChange"
      @focus="handleSelectFocus"
      @click="handleSelectFocus"
      @click:append="handleSelectFocus"
      @click:clear="handleInputClear"
      placeholder="Enter a Field of Study"
      clearable
      variant="outlined"
      hide-details
      prepend-inner-icon="fa:fas fa-search"
      class="mx-11"
      bg-color="white"
    >
      <template #append>
        <v-icon class="fos-search-text-icon">
          {{ displayMenu ? 'mdi-menu-up' : 'mdi-menu-down' }}
        </v-icon>
      </template>
    </v-text-field>

    <v-card
      class="field-of-study-select-search-result pr-2 mx-11"
      :id="resultId"
      v-show="displayMenu"
      max-width="92.5%"
    >
      <v-list v-show="displayFOS.length > 0">
        <v-list-group v-for="cip2 in displayFOS" :key="cip2.name">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title
                class="field-of-study-search-item-title"
                v-text="cip2.name"
              >
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            class="field-of-study-search-item-list-content"
            v-for="cip4 in cip2.fields"
            :key="cip4.text"
            @click="handleFieldOfStudySelectClick(cip4)"
          >
            <v-list-item-title
              v-text="cip4.text"
              class="field-of-study-search-item-body"
            ></v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>

      <span v-show="displayFOS.length <= 0">
        No Results
      </span>
    </v-card>
  </div>
</template>

<script setup>
const props = defineProps({
  cipTwoNestedCipFour: {
    type: Array,
    default: () => [],
    required: true,
  },
  modelValue: {},
  containerId: {
    type: String,
    default: "field-of-study-select-search-container",
  },
  resultId: {
    type: String,
    default: "field-of-study-select-search-result",
  },
})

const emit = defineEmits(['update:modelValue', 'input-clear'])
const displayFOS = ref([])
const displayMenu = ref(false)
const searchText = ref('')

watch(() => props.modelValue, (newVal) => {
  if (newVal && typeof newVal === 'object' && newVal.text) {
    searchText.value = newVal.text
  } else {
    searchText.value = ''
  }
}, { immediate: true })

watch(displayMenu, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const container = document.getElementById(props.containerId)
      const result = document.getElementById(props.resultId)
      if (container && result) {
        result.style.width = `${container.clientWidth}px`
      }
    })
  }
})

const handleChange = (event) => {
  if (event && typeof event === "object" && typeof event.level !== "undefined") {
    emit('update:modelValue', event)
    displayFOS.value = useCloneDeep(props.cipTwoNestedCipFour)
  }
}

const handleInputClear = (e) => {
  searchText.value = ''
  displayFOS.value = useCloneDeep(props.cipTwoNestedCipFour)
  emit('update:modelValue', null)
  emit('input-clear', e)
}

const handleFieldOfStudySelectClick = (cip4) => {
  displayFOS.value = useCloneDeep(props.cipTwoNestedCipFour)
  displayMenu.value = false
  searchText.value = cip4.text
  emit('update:modelValue', cip4)
}

const handleSelectFocus = (event) => {
  event.preventDefault()
  nextTick(() => {
    displayMenu.value = true
  })
}

const filterObject = (value) => {
  if (!value || value === "") {
    displayFOS.value = useCloneDeep(props.cipTwoNestedCipFour)
    return null
  }

  displayFOS.value = props.cipTwoNestedCipFour.reduce((returnArray, cip2) => {
    let tmpFieldsArray = cip2.fields.filter(cip4 =>
      cip4.text.toLowerCase().includes(value.toLowerCase())
    )

    if (tmpFieldsArray.length > 0) {
      returnArray.push({
        ...cip2,
        fields: tmpFieldsArray
      })
    }

    return returnArray
  }, [])
}

onMounted(() => {
  displayFOS.value = useCloneDeep(props.cipTwoNestedCipFour)

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" || e.key === "Escape") {
      displayMenu.value = false
      document.getElementById("field-of-study-select-search-text")?.blur()
    }
  })

  document.addEventListener("click", (e) => {
    const target = e.target
    if (!target || !target.classList) return

    const classList = target.classList

    if (
      !classList.contains("field-of-study-search-item-title") &&
      !classList.contains("field-of-study-search-item-body") &&
      !classList.contains("mdi-chevron-down") &&
      !classList.contains("mdi-chevron-up") &&
      !classList.contains("v-text-field__slot") &&
      !classList.contains("fos-search-text-icon") &&
      target.id !== "field-of-study-select-search-text"
    ) {
      displayMenu.value = false
      document.getElementById("field-of-study-select-search-text")?.blur()
    }
  })
})
</script>

<style lang="scss">
.field-of-study-select-search-container {
  .v-field--variant-outlined .v-field__outline {
    color: var(--fos-color-gold) !important;
    border-width: 2px;
  }
}

.field-of-study-select-search-result {
  position: absolute !important;
  max-height: 400px;
  overflow-y: auto;
  z-index: 8;
  border: 2px var(--fos-color-gold) solid !important;
  border-top: none !important;
  width: 10%;

  .v-list-item-title {
    text-overflow: unset;
    overflow: unset;
    white-space: normal;
    overflow-wrap: break-word;
  }

  .v-list-item-subtitle {
    text-overflow: unset;
    overflow: unset;
    white-space: normal;
    overflow-wrap: break-word;
  }
}

.fos-search-text-icon {
  color: var(--fos-color-gold) !important;
}

.field-of-study-search-item-title {
  font-weight: bold;
}

.field-of-study-search-item-body {
  padding-left: 20px;
}

#field-of-study-select-search-text {
  padding-left: 10px;
}

#field-of-study-select-search-container2 {
  :deep(.v-input__prepend-inner) {
    z-index: 2;
  }
  :deep(fieldset) {
    background: white;
    border: 0;
  }
}
</style>