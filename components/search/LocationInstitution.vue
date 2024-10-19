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
        @click="!location.latLon ? handleLocationCheck : () => {}"
        :class="[props.horizontal ? 'mr-2 ml-3' : 'my-3 mr-2']"
        color="tertiary"
      >
        <v-icon :icon="location.isLoading ? 'fa:fas fa-circle-notch fa-spin' : 'mdi-near-me'" />
      </v-btn>

      <v-text-field
        v-model="input.distance"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!location.latLon"
        :readonly="!input.lat && !input.long"
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
        placeholder="ZIP Code"
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
  initialState: {
    type: [String, Array],
    default: null,
  },
  initialZip: {
    type: String,
    default: null,
  },
  initialDistance: {
    type: String,
    default: "50",
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search-update'])

const { site } = useSiteData()
const { location, handleLocationCheck } = useLocationCheck()
const states = ref(site.value.data.states)

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
  distance: 50,
  lat: null,
  long: null,
})

// Initialize data based on props
if (props.initialState) {
  utility.location = "State"
  input.state = props.initialState
} else if (props.initialZip) {
  utility.location = "ZIP Code"
  input.zip = props.initialZip
  input.distance = props.initialDistance || 50
}

watch(() => props.initialState, (newValue) => input.state = newValue)
watch(() => props.initialZip, (newValue) => input.zip = newValue)
watch(() => props.initialDistance, (newValue) => input.distance = newValue)

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
  emit("search-update", input)
})

watch(() => utility.location, (newValue, oldValue) => {
  if (newValue === "Near Me" && oldValue !== "Near Me") {
    input.distance = 50
    handleLocationCheck()
  }
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
  
  // emit("search-update", input)
}

function resetForm() {
  utility.location = null
  input.zip = null
  input.state = []
  input.lat = null
  input.long = null
  location.latLon = null
  location.error = null
}

function handleSearch() {
  let o = Object.fromEntries(
    Object.entries(input).filter(([_, v]) => v != null)
  )

  if (input.zip) {
    if (!input.distance) {
      return
    }

    if (utility.rules.zip(input.zip) === "Must be ZIP code format") {
      return
    }
  }

  if (input.lat && input.long) {
    if (!input.distance) {
      return
    }
  }

  emit("search-update", o)
}


// auto-populate form on mount is location is available
const route = useRoute()
onMounted(() => {
  if (route.query.lat && route.query.long) {
    utility.location = "Near Me"
    input.distance = route.query.distance || 50
    location.latLon = {
      min_lat: parseFloat(route.query.lat),
      max_lat: parseFloat(route.query.lat),
      min_lon: parseFloat(route.query.long),
      max_lon: parseFloat(route.query.long),
    }
  }
})

defineExpose({
  resetForm,
})
</script>