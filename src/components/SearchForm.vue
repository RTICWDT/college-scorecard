<style lang="scss" scoped>
.search-form-dolflag-cb div .v-input__slot {
  align-items: start;
}
.search-form-degree-wrapper {
  .v-messages {
    display: none;
  }
}

.v-application .primary--text {
  color: green !important;
}

.subhead-2 {
  margin-top: 1rem !important;
  margin-bottom: 0.3rem !important;
  font-weight: 600;
  font-family: "Montserrat", sans-serif !important;
}

.search-panel-header {
  background-color: #c5d3e1;
  border-radius: 0px !important;
}

#search-form-sub-degree-container {
  border-left: 1px solid black;
}
.extraFilters {
  padding-bottom: 100px !important;
}

::v-deep .v-chip .v-chip__content {
  word-wrap: break-word;
  white-space: normal;
  padding: 8px;
  line-height: 100%;
}

::v-deep .v-chip.v-size--default {
  height: 100%;
}
</style>

<template>
  <v-form>
    <!--    <div class="px-4 pt-2 pb-2" v-if="displayAllFilters">-->
    <!--      <h4 class="subhead-2 font-weight-bold mb-2">Search by Name</h4>-->
    <!--      <name-autocomplete-->
    <!--        @school-name-selected="handleSchoolNameSelected"-->
    <!--        :initial_school="input.search"-->
    <!--      />-->
    <!--    </div>-->

    <div class="py-2 px-5">
      <div class="" v-show="displayAllFilters">
        <p class="subhead-2">Search by Name</p>
        <name-autocomplete
          @school-name-selected="handleSchoolNameSelected"
          :initial_school="input.search"
          @school-name-cleared="handleSchoolNameSelected"
        />
      </div>

      <p class="subhead-2" id="location-label">Location</p>
      <v-select
        id="search-from-location-select"
        v-model="utility.location"
        @change="handleLocationChange"
        :items="['Near Me', 'ZIP Code', 'State']"
        hide-details
        class="mb-3 mt-0 pt-0"
        aria-labelledby="location-label"
        :placeholder="utility.location ? undefined : 'Select an option'"
        clearable
      />

      <div class="d-flex align-center" v-if="utility.location === 'ZIP Code'">
        <v-text-field
          id="search-form-zip-text"
          v-model="input.zip"
          label="ZIP Code"
          hideDetails
          class="mb-3 mr-3"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="input.distance"
          :rules="[utility.rules.required, utility.rules.numerical]"
          label="Distance in Miles"
          :disabled="!input.zip"
          hideDetails
          class="mb-3"
          type="number"
          min="1"
        ></v-text-field>
      </div>

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
          class="mb-3"
          type="number"
        ></v-text-field>

        <span v-show="location.error" class="overline">{{
          location.error
        }}</span>
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
        :placeholder="input.state.length > 0 ? undefined : 'Select a state...'"
        class="mt-0 pt-0"
        color="secondary"
        deletable-chips
        v-show="utility.location == 'State'"
        aria-label="Select a state"
      ></v-select>

      <!-- cip4 - Degree subfield -->
      <p class="subhead-2" id="fields-label">Academic Fields</p>
      <field-autocomplete v-model="input.cip4"></field-autocomplete>

      <!-- Credential Level -->
      <p class="subhead-2">Degrees/Certificate</p>
      <v-checkbox
        id="search-form-fos-degree-c"
        class="search-form-degree-cb my-0 py-0"
        v-model="input.cip4_degree"
        label="Certificate"
        value="c"
        color="secondary"
        hide-details
      ></v-checkbox>

      <v-checkbox
        id="search-form-fos-degree-a"
        class="search-form-degree-cb my-0 py-0"
        v-model="input.cip4_degree"
        label="Associate's Degree"
        value="a"
        color="secondary"
        hide-details
      ></v-checkbox>

      <v-checkbox
        id="search-form-fos-degree-b"
        class="search-form-degree-cb my-0 py-0"
        v-model="input.cip4_degree"
        label="Bachelor's Degree"
        value="b"
        color="secondary"
        hide-details
      ></v-checkbox>

      <!-- Graduation Rate -->
      <div>
        <check-range
          legend-title="Graduation Rate"
          id="search-form-completion-rate"
          v-model="input.completion_rate"
          :enable="utility.enable.completion_rate"
          @slider-toggle="utility.enable.completion_rate = $event"
          :min="0"
          :max="100"
          :step="5"
          appendText="%"
          class="mt-5"
          andUp
        ></check-range>
      </div>

      <!-- Average Annual Cost -->
      <div>
        <check-range
          legend-title="Average Annual Cost"
          id="search-form-avg-net-price"
          v-model="input.avg_net_price"
          :enable="utility.enable.avg_net_price"
          @slider-toggle="utility.enable.avg_net_price = $event"
          :min="0"
          :max="100"
          :step="5"
          appendText="k"
        ></check-range>
      </div>

      <div v-show="!displayAllFilters" class="subhead-2">
        WIOA Programs&nbsp;<tooltip definition="wioa-participants" />
      </div>
      <v-checkbox
        id="search-form-dolflag"
        class="search-form-dolflag-cb my-0 py-0"
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        value="true"
        color="secondary"
        hide-details
        v-show="!displayAllFilters"
      ></v-checkbox>
    </div>

    <div v-show="displayAllFilters" class="px-5 extraFilters">
      <check-range
        v-model="input.sat_math"
        id="search-form-sat-math"
        :enable="utility.enable.sat_math"
        @slider-toggle="utility.enable.sat_math = $event"
        :min="0"
        :max="800"
        :step="20"
      >
        <template v-slot:label
          >SAT Math</template
        >
      </check-range>

      <check-range
        v-model="input.sat_read"
        id="search-form-sat-read"
        :enable="utility.enable.sat_read"
        @slider-toggle="utility.enable.sat_read = $event"
        :min="0"
        :max="800"
        :step="20"
      >
        <template v-slot:label
          >SAT Critical Reading</template
        >
      </check-range>

      <check-range
        v-model="input.act"
        id="search-form-act"
        :enable="utility.enable.act"
        @slider-toggle="utility.enable.act = $event"
        :min="0"
        :max="36"
        :step="1"
      >
        <template v-slot:label
          >ACT Score</template
        >
      </check-range>

      <check-range
        v-model="input.acceptance"
        id="search-form-acceptance"
        :enable="utility.enable.acceptance"
        @slider-toggle="utility.enable.acceptance = $event"
        :min="0"
        :max="100"
        :step="5"
        appendText="%"
        andUp
      >
        <template v-slot:label
          >Acceptance Rate</template
        >
      </check-range>

      <!-- <p class='overline'>School Characteristics</p> -->

      <p class="subhead-2 mb-3">Size</p>
      <div>
        <v-checkbox
          id="search-form-size-small"
          hide-details
          v-model="input.size"
          label="Small"
          value="small"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>

        <v-checkbox
          id="search-form-size-medium"
          hide-details
          v-model="input.size"
          label="Medium"
          value="medium"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>

        <v-checkbox
          id="search-form-size-large"
          hide-details
          v-model="input.size"
          label="Large"
          value="large"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>
      </div>

      <p class="subhead-2">Type of School</p>
      <div class="search-form-type-container">
        <v-checkbox
          id="search-form-type-public"
          hide-details
          v-model="input.control"
          label="Public"
          value="public"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>

        <v-checkbox
          id="search-form-type-private"
          hide-details
          v-model="input.control"
          label="Private Nonprofit"
          value="private"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>

        <v-checkbox
          id="search-form-type-profit"
          hide-details
          v-model="input.control"
          label="Private For-Profit"
          value="profit"
          color="secondary"
          class="py-0 my-0"
        ></v-checkbox>
      </div>

      <p class="subhead-2">Urbanicity</p>
      <v-checkbox
        id="search-form-locale-city"
        hide-details
        v-model="input.locale"
        label="City"
        value="city"
        color="secondary"
        class="py-0 my-0"
      ></v-checkbox>

      <v-checkbox
        id="search-form-locale-suburban"
        hide-details
        v-model="input.locale"
        label="Suburban"
        value="suburban"
        color="secondary"
        class="py-0 my-0"
      ></v-checkbox>

      <v-checkbox
        id="search-form-locale-town"
        hide-details
        v-model="input.locale"
        label="Town"
        value="town"
        color="secondary"
        class="py-0 my-0"
      ></v-checkbox>

      <v-checkbox
        id="search-form-locale-rural"
        hide-details
        v-model="input.locale"
        label="Rural"
        value="rural"
        color="secondary"
        class="py-0 my-0"
      ></v-checkbox>

      <p class="subhead-2" id="specialized-mission-label">
        Specialized Mission
      </p>
      <v-select
        v-model="input.serving"
        id="search-form-serving"
        :items="cleanSpecializedMission"
        item-text="value"
        item-value="key"
        placeholder="Select one..."
        class="py-0 my-0"
        color="secondary"
        clearable
        aria-labelledby="specialized-mission-label"
      ></v-select>

      <p class="subhead-2" id="religions-affiliation-label">
        Religious Affiliation
      </p>
      <v-select
        v-model="input.religious"
        id="search-form-religous"
        :items="site.data.religious_affiliations"
        item-text="label"
        item-value="value"
        placeholder="Select one..."
        class="py-0 my-0"
        color="secondary"
        clearable
        aria-labelledby="religions-affiliation-label"
      ></v-select>

      <p class="subhead-2">
        WIOA Programs&nbsp;<tooltip definition="wioa-participants" />
      </p>
      <v-checkbox
        id="search-form-dolflag"
        class="search-form-dolflag-cb my-0 py-0"
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        value="true"
        color="secondary"
        hide-details
      ></v-checkbox>
    </div>

    <div
      id="search-submit-container"
      class="pa-2 text-center"
      v-show="!autoSubmit"
    >
      <v-btn
        color="secondary"
        rounded
        @click="$emit('search-query', cleanInput)"
        >Find Schools</v-btn
      >
    </div>
    <v-btn
      type="submit"
      v-show="autoSubmit"
      class="sr-only"
      color="secondary"
      rounded
      @click="$emit('search-query', cleanInput)"
      >Find Schools</v-btn
    >
  </v-form>
</template>

<script>
import _ from "lodash"
import querystring from "querystring"
import CheckRange from "~/components/CheckRange.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import FieldAutocomplete from "~/components/FieldAutocomplete.vue"
import { SiteData } from "~/js/mixins/SiteData.js"
import LocationCheck from "~/js/mixins/LocationCheck.js"
import Tooltip from "~/components/Tooltip.vue"

export default {
  mixins: [SiteData, LocationCheck],
  props: {
    urlParsedParams: {
      type: Object,
    },
    autoSubmit: {
      type: Boolean,
      default: false,
    },
    displayAllFilters: {
      type: Boolean,
      default: false,
    },
    condenseSliders: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "check-range": CheckRange,
    "name-autocomplete": NameAutocomplete,
    "field-autocomplete": FieldAutocomplete,
    tooltip: Tooltip,
  },
  data() {
    return {
      input: {
        id: null,
        state: [],
        // degree:[],
        major: "",
        region: [],
        zip: "",
        distance: 10,
        size: [],
        name: "",
        control: [], //Type
        serving: "",
        religious: "",
        completion_rate: null,
        avg_net_price: null,
        urban: [],
        cip4: "",
        cip4_degree: [],
        act: null,
        sat_math: null,
        sat_read: null,
        acceptance: null,
        lat: null,
        long: null,
        locale: [],
        search: "",
        dolflag: null,
      },
      utility: {
        rules: {
          required: (value) => !!value || "Required.",
          numerical: (value) => {
            const pattern = /^\d+$/
            return pattern.test(value) || "Numerical"
          },
        },
        // Hold Default state of form data.
        formDefault: {},
        // Helper to activate debounced query after initial load.
        initialized: false,
        showMore: false,
        // Hold Default for checkrange enables.
        enableDefault: {},
        // State object
        enable: {
          completion_rate: false,
          avg_net_price: false,
          sat_math: false,
          sat_read: false,
          act: false,
          acceptance: false,
        },
        location: null,
      },
    }
  },
  watch: {
    cleanInput: {
      handler(newValue, oldValue) {
        // On first load trigger query immediately, then debounce additional queries.
        if (!this.autoSubmit) {
          return
        }

        if (this.utility.initialized) {
          this.debounceEmitSearchQuery()
        } else {
          this.$emit("search-query", { ...newValue })
          this.utility.initialized = true
        }
      },
      deep: true,
    },
    urlParsedParams: {
      handler(newValue, oldValue) {
        this.mapInputFromProp()
      },
      deep: true,
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
  computed: {
    // Remove items that are not set
    cleanInput() {
      let defaultValues = _.cloneDeep(this.utility.formDefault)
      // Pick only values that are different from default state.
      let groomedInput = _.pickBy(this.input, (value, key) => {
        // If it does not exist in the default state object, remove.
        if (!_.has(defaultValues, key)) {
          return false
        }

        //If the input value is not eqaul to default, return value.
        if (!_.isEqual(value, defaultValues[key])) {
          return value
        }
      })

      // Pefrom Input to API data alterations.
      // TODO - Refactor this process. Ingest and egress.  Maybe arrary of objects with string numeral parsing.  Refactor when we have some additional time.

      // Completion rate
      if (
        groomedInput.completion_rate &&
        groomedInput.completion_rate > 0 &&
        this.utility.enable.completion_rate
      ) {
        groomedInput.completion_rate = groomedInput.completion_rate / 100 + ".."
      } else {
        _.unset(groomedInput, "completion_rate") // TODO: CONST;
      }

      if (
        groomedInput.avg_net_price &&
        groomedInput.avg_net_price > 0 &&
        this.utility.enable.avg_net_price
      ) {
        groomedInput.avg_net_price = ".." + groomedInput.avg_net_price * 1000
      } else {
        _.unset(groomedInput, "avg_net_price") // TODO: CONST;
      }

      if (
        groomedInput.sat_math &&
        groomedInput.sat_math > 0 &&
        this.utility.enable.sat_math
      ) {
        groomedInput.sat_math = ".." + groomedInput.sat_math
      } else {
        _.unset(groomedInput, "sat_math") // TODO: CONST;
      }

      if (
        groomedInput.sat_read &&
        groomedInput.sat_read > 0 &&
        this.utility.enable.sat_read
      ) {
        groomedInput.sat_read = ".." + groomedInput.sat_read
      } else {
        _.unset(groomedInput, "sat_read") // TODO: CONST;
      }

      if (groomedInput.act && groomedInput.act > 0 && this.utility.enable.act) {
        groomedInput.act = ".." + groomedInput.act
      } else {
        _.unset(groomedInput, "act") // TODO: CONST;
      }

      if (
        groomedInput.acceptance &&
        groomedInput.acceptance > 0 &&
        this.utility.enable.acceptance
      ) {
        groomedInput.acceptance = groomedInput.acceptance / 100 + "..1"
      } else {
        _.unset(groomedInput, "acceptance") // TODO: CONST;
      }

      // Handle edgecase for distance :(
      if (groomedInput.zip) {
        groomedInput.distance = this.input.distance
      } else {
        _.unset(groomedInput, "distance")
      }

      return groomedInput
    },
    // Generate a URI string of params for forwarding to search page.
    searchURL() {
      let qs = querystring.stringify(this.cleanInput)
      qs =
        "?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")

      return qs
    },
    cleanSpecializedMission() {
      return _.map(this.site.data.special_designations, (value, key) => {
        return {
          key: key,
          value: value,
        }
      })
    },
    locationButtonColor() {
      return this.location.latLon ? "primary" : ""
    },
  },
  created() {
    // Replicate default form state.
    this.utility.formDefault = _.cloneDeep(this.input)
    this.utility.enableDefault = _.cloneDeep(this.utility.enable)

    // TODO - Refactor this aswell
    // For example, percentages for grad rate.
    this.mapInputFromProp()

    this.debounceEmitSearchQuery = _.debounce(function() {
      // Send new param object, reset page
      this.$emit("search-query", { ...this.cleanInput, page: 0 })
    }, 1000)
  },
  mounted() {
    this.$root.$on("search-form-reset", (e) => {
      this.resetFormDefault()
    })
  },
  methods: {
    mapInputFromProp() {
      // Reset form to default, Helps with processing canned search items.
      this.resetFormDefault()

      // TODO - Refactor this method. Maybe add switch.
      _.mergeWith(this.input, this.urlParsedParams, function(
        objVal,
        newObjValue,
        key
      ) {
        // this.input = _.mergeWith(this.utility.formDefault, this.urlParsedParams,function(objVal,newObjValue,key){
        if (_.isArray(objVal) && _.isString(newObjValue)) {
          return [newObjValue]
        }

        // Alter values to accomidate form inputs.
        switch (key) {
          case "completion_rate":
          case "acceptance":
            return parseFloat(newObjValue) * 100
            break
          case "avg_net_price":
            if (parseFloat(newObjValue.substr(2)) > 1000) {
              return parseFloat(newObjValue.substr(2)) / 1000
            }
            break
          case "sat_math":
          case "sat_read":
          case "act":
            return parseFloat(newObjValue.substr(2))
            break
        }
      })

      // TODO - Refactor to a more elegant. Loop through all utility enables, and trigger on.
      // Set Sliders as active:
      if (this.input.completion_rate > 0) {
        this.utility.enable.completion_rate = true
      }

      if (this.input.avg_net_price > 0) {
        this.utility.enable.avg_net_price = true
      }

      if (this.input.sat_read > 0) {
        this.utility.enable.sat_read = true
      }

      if (this.input.sat_math > 0) {
        this.utility.enable.sat_math = true
      }

      if (this.input.act > 0) {
        this.utility.enable.act = true
      }

      if (this.input.acceptance > 0) {
        this.utility.enable.acceptance = true
      }

      // Check if these values are set, perform side effects.
      // TODO - Remove values that cannot exist at the same time.
      if (this.input.lat && this.input.long) {
        this.utility.location = "Near Me"
        this.location.latLon = true
      }

      if (this.input.zip) {
        this.utility.location = "ZIP Code"
      }

      if (!_.isEmpty(this.input.state)) {
        this.utility.location = "State"
      }

      if (this.input.name != "") {
        this.input.search = this.input.name
        this.input.name = ""
      }
    },
    processChangeEvent() {},
    //Reset form to default.
    resetFormDefault() {
      // TODO - Create reset value method, pass desired fields to method, return default values from object.
      this.input = _.cloneDeep(this.utility.formDefault)
      this.utility.enable = _.cloneDeep(this.utility.formDefault)
      this.location.latLon = null
      this.location.error = null
      this.utility.location = null
    },
    // Reset values for sub objects to default
    handleLocationChange(e) {
      // TODO - Check to see if values need to be reset.
      this.input.zip = ""
      this.input.state = []

      this.input.lat = null
      this.input.long = null

      this.location.latLon = null
      this.location.error = null
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        // this.input.name = school;
        this.input.search = school
        // this.input.id = null
      } else {
        // this.input.name = school['school.name'];
        this.input.search = school["school.name"]
        // this.input.id = school.id
      }
    },
  },
}
</script>
