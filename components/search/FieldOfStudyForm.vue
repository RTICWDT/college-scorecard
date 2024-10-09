<template>
  <v-form class="px-5 pb-5 pt-3 bg-white" id="fos-search-form" @submit.prevent="handleSubmit">
    <h3 class="my-4">Location</h3>
    <SearchLocationInstitution
      @search-update="handleLocationSelection"
      :horizontal="false"
      :initial_state="input.state"
      :initial_zip="input.zip"
      :initial_distance="input.distance"
    />
    <!-- Salary After Completing -->
    <div>
      <h3 class="my-4" id="search-fos-salary">
        Salary After Completing
        <v-btn
          v-if="input.fos_salary.join(',') !== utility.formDefault.fos_salary.join(',')"
          @click="input.fos_salary = [...utility.formDefault.fos_salary]"
          icon="mdi-close"
          aria-label="Clear Salary After Complete Input"
        ></v-btn>
      </h3>

      <v-range-slider
        v-model="input.fos_salary"
        :max="utility.fieldOfStudySalary.max"
        :min="utility.fieldOfStudySalary.min"
        hide-details
        class="align-center"
        color="primary"
        track-color="grey-darken-1"
        thumb-color="primary"
        thumb-label
      >
        <template v-slot:prepend>
          <v-text-field
            v-model="input.fos_salary[0]"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            density="compact"
            prefix="$"
            suffix="k"
            @update:model-value="updateSalaryMin"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            v-model="input.fos_salary[1]"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            density="compact"
            prefix="$"
            suffix="k"
            @update:model-value="updateSalaryMax"
          ></v-text-field>
        </template>
      </v-range-slider>
    </div>

    <!-- Median Total Debt -->
    <div class="mb-4">
      <h3 class="my-4" id="search-fos-median-debt">
        Median Total Debt
        <v-btn
          v-if="input.fos_debt.join(',') !== utility.formDefault.fos_debt.join(',')"
          @click="input.fos_debt = [...utility.formDefault.fos_debt]"
          icon="mdi-close"
          aria-label="Clear Median Total Debt Input"
        ></v-btn>
      </h3>

      <v-range-slider
        v-model="input.fos_debt"
        :max="utility.fieldOfStudyDebt.max"
        :min="utility.fieldOfStudyDebt.min"
        hide-details
        class="align-center"
        color="primary"
        track-color="grey-darken-1"
        thumb-color="primary"
        thumb-label
      >
        <template v-slot:prepend>
          <v-text-field
            v-model="input.fos_debt[0]"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            density="compact"
            prefix="$"
            suffix="k"
            @update:model-value="updateDebtMin"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            v-model="input.fos_debt[1]"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            density="compact"
            prefix="$"
            suffix="k"
            @update:model-value="updateDebtMax"
          ></v-text-field>
        </template>
      </v-range-slider>
    </div>

    <!-- WIOA Programs -->
    <div>
      <h3 class="my-4" id="search-fos-dolflag">
        WIOA Programs
        <tooltip definition="wioa-participants" />
      </h3>

      <v-checkbox
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        color="secondary"
        hide-details
      ></v-checkbox>
    </div>

    <v-btn
      type="submit"
      class="sr-only"
      color="secondary"
      size="large"
    >Find Schools</v-btn>
  </v-form>
</template>

<script setup>
const props = defineProps({
  urlParsedParams: {
    type: Object,
    default: () => ({})
  },
  autoSubmit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search-update'])

const input = ref({
  fos_salary: [0, 150],
  fos_debt: [0, 50],
  dolflag: null,
  state: null,
  zip: null,
  distance: null,
  lat: null,
  long: null,
})

const utility = ref({
  formDefault: {
    fos_salary: [0, 150],
    fos_debt: [0, 50],
    state: null,
    zip: null,
    distance: 50,
    lat: null,
    long: null,
  },
  rules: {
    required: (value) => !!value || "Required.",
    numerical: (value) => {
      const pattern = /^\d+$/
      return pattern.test(value) || "Numerical"
    },
  },
  fieldOfStudySalary: {
    min: 0,
    max: 150,
  },
  fieldOfStudyDebt: {
    min: 0,
    max: 50,
  },
  initialized: false,
})

// Computed
const cleanInput = computed(() => {
  const defaultValues = useCloneDeep(utility.value.formDefault)
  const groomedInput = {}

  for (const key in input.value) {
    if (!(key in defaultValues)) continue
    if (!isEqual(input.value[key], defaultValues[key]) || key === "cip4_degree") {
      groomedInput[key] = input.value[key]
    } else {
      groomedInput[key] = null
    }
  }

  if (groomedInput.zip) {
    groomedInput.distance = input.value.distance
  } else {
    delete groomedInput.distance
  }

  if (groomedInput.fos_salary) {
    groomedInput.fos_salary = `${groomedInput.fos_salary[0] * 1000}..${groomedInput.fos_salary[1] * 1000}`
  }

  if (groomedInput.fos_debt) {
    groomedInput.fos_debt = `${groomedInput.fos_debt[0] * 1000}..${groomedInput.fos_debt[1] * 1000}`
  }

  return groomedInput
})

// Methods
const mapInputFromProp = () => {
  useMergeWith(input.value, props.urlParsedParams, (objVal, newObjValue, key) => {
    switch (key) {
      case "fos_debt":
      case "fos_salary":
        const valueArray = newObjValue.split("..")
        return valueArray.map(value => Number(value) <= 0 ? 0 : Number(value / 1000))
      default:
        if (isArray(objVal) && typeof newObjValue === 'string') {
          return [newObjValue]
        }
    }
  })
}

const handleLocationSelection = (params) => {
  input.value = { ...input.value, ...params, page: 1 }
}

const resetFormDefault = () => {
  input.value = useCloneDeep(utility.value.formDefault)
  // Add any additional reset logic here
}

const updateSalaryMin = (value) => {
  input.value.fos_salary[0] = Number(value)
}

const updateSalaryMax = (value) => {
  input.value.fos_salary[1] = Number(value)
}

const updateDebtMin = (value) => {
  input.value.fos_debt[0] = Number(value)
}

const updateDebtMax = (value) => {
  input.value.fos_debt[1] = Number(value)
}

const handleSubmit = () => {
  emit('search-update', cleanInput.value)
}

// Watchers
watch(cleanInput, (newValue) => {
  if (!props.autoSubmit) return
  if (utility.value.initialized) {
    debouncedEmitSearchQuery()
  } else {
    emit('search-update', { ...newValue })
    utility.value.initialized = true
  }
}, { deep: true })

watch(() => props.urlParsedParams, () => {
  mapInputFromProp()
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  utility.value.formDefault = useCloneDeep(input.value)
  mapInputFromProp()
  // You may need to implement a global event bus or use provide/inject for this
  // this.$root.$on('search-form-reset', resetFormDefault)
})

// Debounced function
const debouncedEmitSearchQuery = useDebounce(() => {
  emit('search-update', {
    ...cleanInput.value,
    page: 0,
  })
}, 1000)
</script>