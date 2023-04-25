<template>
  <div id="search-can-query-items-wrapper">
    <v-row>
      <v-col md="6" cols="12" class=" canned-search-wrapper py-0 my-0">
        <canned-search-slider
          id="canned-search-near-me"
          label="Schools Near Me"
          :add-to-query="[{ location: true }]"
          @canned-search-toggle="handleCannedToggle"
          :is-loading="location.isLoading"
        ></canned-search-slider>

        <canned-search-slider
          id="canned-search-most-get-in"
          label="Most People Get In"
          :add-to-query="[{ acceptance: '0.5..1' }]"
          @canned-search-toggle="handleCannedToggle"
          tip="Acceptance rate of 50% or higher"
        ></canned-search-slider>

        <canned-search-slider
          id="canned-search-most-grad"
          label="Most People Graduate"
          :add-to-query="[{ completion_rate: '0.5..' }]"
          @canned-search-toggle="handleCannedToggle"
          tip="Graduation rate of 50% or higher"
        ></canned-search-slider>
      </v-col>
      <v-col
        md="6"
        cols="12"
        class="text-center canned-search-wrapper py-0 my-0"
      >
        <canned-search-slider
          id="canned-search-degree-c"
          label="I Want a Certificate"
          :add-to-query="[{ cip4_degree: ['1'] }]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>

        <canned-search-slider
          id="canned-search-degree-a"
          label="I Want an Associate's Degree"
          :add-to-query="[{ cip4_degree: ['2'] }]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>

        <canned-search-slider
          id="canned-search-degree-b"
          label="I Want a Bachelor's Degree"
          :add-to-query="[{ cip4_degree: ['3'] }]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
      </v-col>
      <v-col cols="12" md="12" class=" mt-5">
        <v-btn
          id="canned-search-submit"
          color="secondary"
          large
          @click="$emit('canned-search-submit', query)"
          >Find Schools</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script>
import querystring from "querystring"
// import CannedSearchSlider from "~/components/CannedSearchSlider.vue";
import CannedSearchSlider from "~/components/CannedSearchSlider.vue"
import _ from "lodash"
import LocationCheck from "~/js/mixins/LocationCheck.js"

export default {
  mixins: [LocationCheck],
  data() {
    return {
      query: {},
    }
  },
  components: {
    "canned-search-slider": CannedSearchSlider,
  },
  watch: {
    "location.latLon": {
      // Proccess Lat/Long object for url values.
      handler(newValue, oldValue) {
        if (
          newValue != null &&
          newValue.min_lat &&
          newValue.max_lat &&
          newValue.min_lat &&
          newValue.max_lat
        ) {
          this.query.lat =
            newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4)
          this.query.long =
            newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4)
        }
      },
    },
  },
  methods: {
    // TODO - Refactor using this.query as an array.
    handleCannedToggle(data) {
      // Add to array.
      let newQuery = data.data[0]

      if (data.value) {
        // Check for location
        if (newQuery.location) {
          this.handleLocationCheck()
        } else {
          _.mergeWith(this.query, newQuery, (objValue, srcValue) => {
            if (_.isArray(objValue)) {
              return objValue.concat(srcValue)
            }
          })
        }
      } else {
        // Remove location
        if (newQuery.location) {
          delete this.query["lat"]
          delete this.query["long"]
        }

        // Handle Everything else
        _.forEach(newQuery, (value, key) => {
          // Delete specific element from array.
          if (_.isArray(value)) {
            this.query[key] = _.without(this.query[key], newQuery[key][0])
          } else {
            // Or just delete.
            delete this.query[key]
          }
        })
      }
    },
  },
}
</script>
