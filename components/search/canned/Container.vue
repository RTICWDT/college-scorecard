<template>
  <div
    id="search-can-query-items-wrapper"
    role="group"
    class="group_checkbox"
    aria-checked="mixed"
    aria-controls="canned-search-near-me canned-search-most-get-in canned-search-most-grad canned-search-degree-c canned-search-degree-a canned-search-degree-b"
  >
    <v-row>
      <v-col md="6" cols="12" class="py-0 my-0">
        <SearchCannedSlider
          id="canned-search-near-me"
          label="Schools Near Me"
          :add-to-query="[{ location: true }]"
          @canned-search-toggle="handleCannedToggle"
          :is-loading="location.isLoading"
        />
        <SearchCannedSlider
          id="canned-search-most-get-in"
          label="Most People Get In"
          :add-to-query="[{ acceptance: '0.5..1' }]"
          @canned-search-toggle="handleCannedToggle"
          tip="Acceptance rate of 50% or higher"
        />
        <SearchCannedSlider
          id="canned-search-most-grad"
          label="Most People Graduate"
          :add-to-query="[{ completion_rate: '0.5..' }]"
          @canned-search-toggle="handleCannedToggle"
          tip="Graduation rate of 50% or higher"
        />
      </v-col>

      <v-col md="6" cols="12" class="text-center py-0 my-0">
        <SearchCannedSlider
          id="canned-search-degree-c"
          label="I Want a Certificate"
          :add-to-query="[{ cip4_degree: ['1'] }]"
          @canned-search-toggle="handleCannedToggle"
        />
        <SearchCannedSlider
          id="canned-search-degree-a"
          label="I Want an Associate's Degree"
          :add-to-query="[{ cip4_degree: ['2'] }]"
          @canned-search-toggle="handleCannedToggle"
        />
        <SearchCannedSlider
          id="canned-search-degree-b"
          label="I Want a Bachelor's Degree"
          :add-to-query="[{ cip4_degree: ['3'] }]"
          @canned-search-toggle="handleCannedToggle"
        />
      </v-col>

      <v-col cols="12" md="12">
        <v-btn
          color="secondary"
          size="large"
          @click="$emit('canned-search-submit', query)"
        >
          Find Schools
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const emit = defineEmits(['canned-search-submit'])
const query = ref({})
const { location, handleLocationCheck } = useLocationCheck()

const handleCannedToggle = (data) => {
  const newQuery = data.data[0]

  if (data.value) {
    if (newQuery.location) {
      handleLocationCheck()
    } else {
      useMergeWith(query.value, newQuery, (objValue, srcValue) => {
        if (isArray(objValue)) {
          return objValue.concat(srcValue)
        }
      })
    }
  } else {
    if (newQuery.location) {
      delete query.value.lat
      delete query.value.long
    }

    useForEach(newQuery, (value, key) => {
      if (isArray(value)) {
        query.value[key] = useWithout(query.value[key], newQuery[key][0])
      } else {
        delete query.value[key]
      }
    })
  }
}

watch(() => location.latLon, (newValue) => {
  if (
    newValue != null &&
    newValue.min_lat &&
    newValue.max_lat &&
    newValue.min_lon &&
    newValue.max_lon
  ) {
    query.value.lat = `${newValue.min_lat.toFixed(4)}..${newValue.max_lat.toFixed(4)}`
    query.value.long = `${newValue.min_lon.toFixed(4)}..${newValue.max_lon.toFixed(4)}`
  }
}, { deep: true })
</script>