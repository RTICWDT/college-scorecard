<template>
  <div :class="{ 'd-flex': horizontal }">
    <v-select
      id="search-from-location-select"
      v-model="utility.location"
      @change="handleLocationChange"
      @click:clear="handleLocationChange"
      :items="['Near Me', 'ZIP Code', 'State']"
      hide-details
      outlined
      dense
      aria-labelledby="location-label"
      :placeholder="utility.location ? undefined : 'Select an option'"
      clearable
      @keydown.enter="$event.preventDefault()"
    />

    <div class="d-flex align-center" v-if="utility.location === 'Near Me'">
      <v-btn
        @click="handleLocationCheck"
        :class="[horizontal ? 'mr-2 ml-3' : 'my-3 mr-2']"
      >
        <v-icon
          v-html="
            location.isLoading ? 'fas fa-circle-notch fa-spin' : 'mdi-near-me'
          "
        ></v-icon
      ></v-btn>

      <v-text-field
        v-model="location.miles"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!location.latLon"
        hideDetails
        type="number"
        outlined
        dense
        :class="[horizontal ? 'mx-2' : 'my-3']"
        @change="handleSearch"
      ></v-text-field>

      <span
        v-show="location.error"
        class="overline"
        :class="[horizontal ? 'mx-3' : 'my-3 ml-2']"
        >{{ location.error }}</span
      >
    </div>
    <div class="d-flex align-center" v-if="utility.location === 'ZIP Code'">
      <v-text-field
        id="search-form-zip-text"
        v-model="input.zip"
        label="ZIP Code"
        hideDetails
        :class="[horizontal ? 'mx-3' : 'my-3 mr-2']"
        type="number"
        dense
        :rules="[utility.rules.zip]"
        min="0"
        outlined
        @change="handleSearch"
      ></v-text-field>
      <v-text-field
        v-model="input.distance"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!input.zip"
        hideDetails
        type="number"
        min="1"
        dense
        outlined
        @change="handleSearch"
      ></v-text-field>
    </div>

    <v-select
      v-model="input.state"
      id="search-form-state"
      :items="site.data.states"
      item-text="name"
      item-value="abbr"
      multiple
      chips
      hide-details
      :single-line="true"
      :placeholder="
        input.state && input.state.length > 0 ? undefined : 'Select a state...'
      "
      :class="[horizontal ? 'mx-3 mt-0  pt-0' : 'my-3']"
      color="secondary"
      deletable-chips
      v-show="utility.location == 'State'"
      aria-label="Select a state"
      outlined
      dense
      @change="handleSearch"
    ></v-select>
  </div>
</template>

<script>
import { SiteData } from "~/js/mixins/SiteData.js"
import LocationCheck from "~/js/mixins/LocationCheck.js"

export default {
  mixins: [SiteData, LocationCheck],
  props: {
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
  },
  data() {
    return {
      utility: {
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
      },
      input: {
        state: [],
        zip: null,
        distance: null,
      },
    }
  },

  created() {
    if (this.initial_state) {
      this.utility.location = "State"
      this.input.state = this.initial_state
    } else if (this.initial_zip) {
      this.utility.location = "ZIP Code"
      this.input.zip = this.initial_zip
      this.input.distance = this.initial_distance
    }
    //else if (this.initial_distance) {
    //  this.utility.location = "Near Me"
    //}
  },
  watch: {
    initial_state() {
      this.input.state = this.initial_state
    },
    initial_zip() {
      this.input.zip = this.initial_zip
    },
    initial_distance() {
      this.input.distance = this.initial_distance
    },
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
          this.input.lat =
            newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4)
          this.input.long =
            newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4)
        }
        this.$emit("search-query", this.input)
      },
    },
    "location.miles"() {
      this.$emit("search-query", this.input)
    },
    "utility.location"(newValue, oldValue) {
      if (newValue === "Near Me" && oldValue !== "Near Me") {
        this.handleLocationCheck()
      }
    },
  },
  methods: {
    handleLocationChange(e) {
      // TODO - Check to see if values need to be reset.
      this.input.zip = null
      this.input.state = []

      this.input.lat = null
      this.input.long = null

      this.location.latLon = null
      this.location.error = null

      this.$emit("search-query", this.input)
    },

    handleSearch() {
      let o = Object.fromEntries(
        Object.entries(this.input).filter(([_, v]) => v != null)
      )

      this.$emit("search-query", o)
    },
  },
}
</script>
