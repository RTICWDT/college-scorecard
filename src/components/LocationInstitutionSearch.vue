<template>
  <div :class="{ 'd-flex': horizontal }">
    <v-select
      id="search-from-location-select"
      v-model="utility.location"
      @change="handleLocationChange"
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
      <v-icon
        v-on="on"
        :color="locationButtonColor"
        v-html="
          location.isLoading ? 'fas fa-circle-notch fa-spin' : 'mdi-near-me'
        "
      ></v-icon>

      <v-text-field
        v-model="location.miles"
        :rules="[utility.rules.required, utility.rules.numerical]"
        label="Distance in Miles"
        :disabled="!location.latLon"
        hideDetails
        type="number"
        outlined
        dense
        class="mx-3"
        @change="handleSearch"
      ></v-text-field>

      <span v-show="location.error" class="overline">{{ location.error }}</span>
    </div>
    <div class="d-flex align-center" v-if="utility.location === 'ZIP Code'">
      <v-text-field
        id="search-form-zip-text"
        v-model="input.zip"
        label="ZIP Code"
        hideDetails
        class="mx-3"
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
      :placeholder="
        input.state && input.state.length > 0 ? undefined : 'Select a state...'
      "
      class="mt-0 pt-0 mx-3"
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
    } else if (this.initial_distance) {
      this.utility.location = "Near Me"
    }
  },
  updated(e) {
    console.log(e)
    // if (!this.state && !this.zip && !this.distance) {
    //   this.utility.location = null
    // }
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
      },
    },
    "location.miles"() {
      this.handleLocationCheck()
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
      this.input.zip = ""
      this.input.state = []

      this.input.lat = null
      this.input.long = null

      this.location.latLon = null
      this.location.error = null
    },
    handleLocationCheck() {
      this.$emit("handle-location-selection", this.input)
    },

    locationButtonColor() {
      return this.location.latLon ? "primary" : ""
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
