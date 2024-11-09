<template>
  <v-form class="px-5 pb-5 pt-3 bg-white" @submit.prevent="handleSubmit">
    <h3 class="my-4">Location</h3>
    <SearchLocationInstitution
      ref="searchLocationRef"
      @search-update="handleLocationSelection"
      :horizontal="false"
      :initial_state="input.state"
      :initial_zip="input.zip"
      :initial_distance="input.distance"
    />

    <Spacer :height="20" />

    <!-- Salary After Completing -->
    <div>
      <h3 class="my-4" id="search-fos-salary">
        Salary After Completing
        <v-btn
          icon
          :readonly="fosSalaryIsDefault"
          @click="input.fos_salary = [...formDefault.fos_salary]"
          aria-label="Clear Salary After Complete Input"
          class="ml-1"
        >
          <v-icon :color="fosSalaryIsDefault ? '#00000022' : 'black'">mdi-close</v-icon>
        </v-btn>
      </h3>

      <v-range-slider
        v-model="input.fos_salary"
        @update:model-value="updateSalarySlider"
        :max="utility.fieldOfStudySalary.max"
        :min="utility.fieldOfStudySalary.min"
        hide-details
        class="align-center mx-0"
        track-color="grey-darken-1"
        color="primary-yellow"
        thumb-color="primary-yellow"
        thumb-label
      >
        <template #prepend>
          <v-text-field
            v-model="input.fos_salary[0]"
            hide-details
            type="number"
            style="width: 100px"
            density="compact"
            variant="outlined"
            prefix="$"
            suffix="k"
            @update:model-value="updateSalaryMin"
            :max="150"
            :min="0"
          />
        </template>
        <template #append>
          <v-text-field
            v-model="input.fos_salary[1]"
            hide-details
            single-line
            type="number"
            style="width: 100px"
            density="compact"
            variant="outlined"
            prefix="$"
            suffix="k"
            @update:model-value="updateSalaryMax"
            :max="150"
            :min="0"
          />
        </template>
      </v-range-slider>
    </div>

    <Spacer :height="20" />

    <!-- Median Total Debt -->
    <div class="mb-4">
      <h3 class="my-4">
        Median Total Debt
        <v-btn
          :readonly="fosDebtIsDefault"
          @click="input.fos_debt = [...formDefault.fos_debt]"
          icon="mdi-close"
          aria-label="Clear Median Total Debt Input"
          class="ml-1"
        >
          <v-icon :color="fosDebtIsDefault ? '#00000022' : 'black'">mdi-close</v-icon>
        </v-btn>
      </h3>

      <v-range-slider
        v-model="input.fos_debt"
        @update:model-value="updateMedianDebtSlider"
        :max="utility.fieldOfStudyDebt.max"
        :min="utility.fieldOfStudyDebt.min"
        hide-details
        class="align-center mx-0"
        track-color="grey-darken-1"
        color="primary-yellow"
        thumb-color="primary-yellow"
        thumb-label
      >
        <template #prepend>
          <v-text-field
            v-model="input.fos_debt[0]"
            hide-details
            single-line
            type="number"
            style="width: 100px"
            density="compact"
            variant="outlined"
            prefix="$"
            suffix="k"
            :max="50"
            :min="0"
            @update:model-value="updateDebtMin"
          ></v-text-field>
        </template>
        <template #append>
          <v-text-field
            v-model="input.fos_debt[1]"
            hide-details
            single-line
            type="number"
            style="width: 100px"
            density="compact"
            variant="outlined"
            prefix="$"
            suffix="k"
            :max="50"
            :min="0"
            @update:model-value="updateDebtMax"
          ></v-text-field>
        </template>
      </v-range-slider>
    </div>

    <Spacer :height="10" />

    <!-- WIOA Programs -->
    <div>
      <h3 class="my-4" id="search-fos-dolflag">
        WIOA Programs
        <TooltipModal definition="wioa-participants" />
      </h3>

      <v-checkbox
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        color="secondary-green"
        hide-details
      ></v-checkbox>
    </div>

    <v-btn
      type="submit"
      class="sr-only"
      color="secondary-green"
      size="large"
    >
      Find Schools
    </v-btn>

    <Spacer :height="10" />
  </v-form>
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['search-update', 'update:modelValue'])
const searchLocationRef = ref(null)

const formDefault = ref({
  fos_salary: [0, 150],
  fos_debt: [0, 50],
  state: null,
  zip: null,
  distance: 50,
  lat: null,
  long: null,
  dolflag: false,
})

const utility = ref({
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
})

const input = reactive(useCloneDeep(formDefault.value))

// Computed
const fosSalaryIsDefault = computed(() => input.fos_salary.join(',') === formDefault.value.fos_salary.join(','))
const fosDebtIsDefault = computed(() => input.fos_debt.join(',') === formDefault.value.fos_debt.join(','))


const groomedInput = computed(() => {
  const defaultValues = useCloneDeep(formDefault.value)
  const inputToGroom = {}

  for (const key in input) {
    
    if (!(key in defaultValues)) continue
    if (!isEqual(input[key], defaultValues[key]) || key === "cip4_degree") {
      inputToGroom[key] = input[key]
    } else {
      inputToGroom[key] = null
    }
  }

  if (inputToGroom.zip || (inputToGroom.lat && inputToGroom.long)) {
    inputToGroom.distance = input.distance
  } else {
    delete inputToGroom.distance
  }

  if (inputToGroom.fos_salary) {
    inputToGroom.fos_salary = `${inputToGroom.fos_salary[0] * 1000}..${inputToGroom.fos_salary[1] * 1000}`
  }

  if (inputToGroom.fos_debt) {
    inputToGroom.fos_debt = `${inputToGroom.fos_debt[0] * 1000}..${inputToGroom.fos_debt[1] * 1000}`
  }

  return inputToGroom
})

// Methods
const mapInputFromQuery = () => {
  useMergeWith(input, route.query, (objVal, newObjValue, key) => {
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
  Object.assign(input, { ...input, ...params, page: 1 })
}

const resetForm = () => {
  searchLocationRef.value.resetForm()
  Object.assign(input, useCloneDeep(formDefault.value))
}

const updateSalarySlider = (value) => {
  input.fos_salary = [Math.round(value[0]), Math.round(value[1])]
}

const updateMedianDebtSlider = (value) => {
  input.fos_debt = [Math.round(value[0]), Math.round(value[1])] 
}

const updateSalaryMin = (value) => {
  input.fos_salary[0] = Number(value).toFixed(1)
}

const updateSalaryMax = (value) => {
  input.fos_salary[1] = Number(value)
}

const updateDebtMin = (value) => {
  input.fos_debt[0] = Number(value)
}

const updateDebtMax = (value) => {
  input.fos_debt[1] = Number(value)
}

const handleSubmit = () => {
  emit('search-submit', groomedInput.value)
}

mapInputFromQuery()

onMounted(() => {
  emit("search-update", { ...groomedInput.value, page: 1 })
})

watch(groomedInput, (newValue, oldValue) => {
  if (isEqual(newValue, oldValue)) { return }
  emit("search-update", { ...groomedInput.value, page: 1 })
}, { deep: true })

defineExpose({
  resetForm
})
</script>

<style scoped lang="scss">
:deep(.v-text-field__suffix) {
  font-size: 14px;
  margin-left: 2px;
  padding-right: 10px;
}
</style>