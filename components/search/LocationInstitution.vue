<template>
  <div :class="{ 'd-flex': props.horizontal }">
    <v-select
      id="search-from-location-select"
      v-model="utility.location"
      @update:modelValue="handleLocationChange"
      @click:clear="handleLocationChange"
      :items="['Near Me', 'ZIP Code', 'State']"
      hide-details
      variant="outlined"
      density="compact"
      aria-labelledby="location-label"
      :placeholder="utility.location ? undefined : 'Select an option'"
      clearable
      min-width="200"
      @keydown.enter.prevent
      :max-width="props.horizontal ? 300 : undefined"
    />

    <div class="d-flex align-center" v-if="utility.location === 'Near Me'">
      <v-btn
        @click="handleLocationCheck"
        :class="[props.horizontal ? 'mr-2 ml-3' : 'my-3 mr-2']"
        color="tertiary"
      >
        <v-icon :icon="location.isLoading ? 'fa:fas fa-circle-notch fa-spin' : 'mdi-near-me'" />
      </v-btn>

      <v-text-field
        v-model="location.miles"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!location.latLon"
        hide-details
        type="number"
        variant="outlined"
        density="compact"
        :class="[props.horizontal ? 'mx-2' : 'my-3']"
        @update:modelValue="handleSearch"
      />

      <span
        v-show="location.error"
        class="overline"
        :class="[props.horizontal ? 'mx-3' : 'my-3 ml-2']"
      >
        {{ location.error }}
      </span>
    </div>

    <div class="d-flex align-center" v-if="utility.location === 'ZIP Code'">
      <v-text-field
        id="search-form-zip-text"
        v-model="input.zip"
        label="ZIP Code"
        hide-details
        :class="[props.horizontal ? 'mx-3' : 'my-3 mr-2']"
        type="number"
        density="compact"
        :rules="[utility.rules.zip]"
        min="0"
        variant="outlined"
        @update:modelValue="handleSearch"
      />
      <v-text-field
        v-model="input.distance"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!input.zip"
        hide-details
        type="number"
        min="1"
        density="compact"
        variant="outlined"
        @update:modelValue="handleSearch"
      />
    </div>

    <v-select
      v-model="input.state"
      id="search-form-state"
      :items="states"
      item-title="title"
      item-value="value"
      multiple
      chips
      hide-details
      :single-line="true"
      :placeholder="input.state && input.state.length > 0 ? undefined : 'Select a state...'"
      :class="[props.horizontal ? 'mx-3 mt-0  pt-0' : 'my-3']"
      color="secondary"
      closable-chips
      v-show="utility.location == 'State'"
      aria-label="Select a state"
      variant="outlined"
      density="compact"
      @update:modelValue="handleSearch"
      min-width="100"
      :max-width="props.horizontal ? 300 : undefined"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  initial_state: {
    type: [String, Array],
    default: null,
  },
  initial_zip: {
    type: String,
    default: null,
  },
  initial_distance: {
    type: String,
    default: null,
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search-query'])

const { site } = useSiteData()
const { location, handleLocationCheck } = useLocationCheck()
const states = site.value.data.states

const utility = reactive({
  location: null,
  rules: {
    required: (value) => !!value || "Required.",
    numerical: (value) => {
      const pattern = /^\d+$/
      return pattern.test(value) || "Numerical"
    },
    zip: (value) =>
      /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value) ||
      "Must be ZIP code format",
  },
})

const input = reactive({
  state: [],
  zip: null,
  distance: null,
  lat: null,
  long: null,
})

// Initialize data based on props
if (props.initial_state) {
  utility.location = "State"
  input.state = props.initial_state
} else if (props.initial_zip) {
  utility.location = "ZIP Code"
  input.zip = props.initial_zip
  input.distance = props.initial_distance
}

watch(() => props.initial_state, (newValue) => {
  input.state = newValue
})

watch(() => props.initial_zip, (newValue) => {
  input.zip = newValue
})

watch(() => props.initial_distance, (newValue) => {
  input.distance = newValue
})

watch(() => location.latLon, (newValue) => {
  if (
    newValue != null &&
    newValue.min_lat &&
    newValue.max_lat &&
    newValue.min_lat &&
    newValue.max_lat
  ) {
    input.lat =
      newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4)
    input.long =
      newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4)
  }
  emit("search-query", input)
})

watch(() => location.miles, () => {
  emit("search-query", input)
})

watch(() => utility.location, (newValue, oldValue) => {
  if (newValue === "Near Me" && oldValue !== "Near Me") {
    handleLocationCheck()
  }
})

onMounted(() => {
  window.addEventListener("search-form-reset", resetFormDefault)
})

function handleLocationChange(e) {
  input.zip = null
  input.state = []
  input.lat = null
  input.long = null
  location.latLon = null
  location.error = null

  if (e == null) {
    utility.location = null
  }

  emit("search-query", input)
}

function resetFormDefault() {
  utility.location = null
}

function handleSearch() {
  let o = Object.fromEntries(
    Object.entries(input).filter(([_, v]) => v != null)
  )

  emit("search-query", o)
}
</script>