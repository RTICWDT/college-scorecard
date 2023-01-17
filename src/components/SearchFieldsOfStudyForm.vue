<style lang="scss">
.search-form-dolflag-cb div .v-input__slot {
  align-items: start;
}
#fos-chip-container {
  width: 100%;
}

#fos-chip-container {
  .v-chip {
    height: auto;
    white-space: normal;
    width: 100%;
  }
  .v-chip .v-chip__content {
    display: block;
  }
}

#fos-search-form {
  .subhead {
    margin-top: 1rem !important;
    margin-bottom: 0.3rem !important;
    font-weight: 600;
    font-family: "Montserrat", sans-serif !important;
  }

  label.subhead {
    display: inline-block;
  }
}

.fos-limited-data {
  span {
    font-size: 14px;
  }
}
</style>

<template>
  <v-form class="py-2 px-5" id="fos-search-form">
    <!-- Location -->
    <div>
      <label
        class="subhead mb-2"
        id="search-fos-location-select"
        for="search-fos-location-select"
      >
        Location
      </label>

      <v-select
        id="search-fos-location-select"
        name="search-fos-location-select"
        v-model="utility.location"
        @change="handleLocationChange"
        :items="['Near Me', 'ZIP Code', 'State']"
        hide-details
        class="mt-0 pt-0"
        :placeholder="utility.location ? undefined : 'Select an option'"
        clearable
        color="secondary"
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
          :color="locationButtonColor"
          v-html="
            location.isLoading ? 'fas fa-circle-notch fa-spin' : 'mdi-near-me'
          "
        ></v-icon>

        <v-text-field
          v-model="location.miles"
          :rules="[utility.rules.required, utility.rules.numerical]"
          label="Distance in Miles"
          aria-label="Distance in Miles"
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
        aria-label="State Select Menu"
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
        v-if="utility.location == 'State'"
      ></v-select>
    </div>

    <!-- Salary After Completing -->
    <div>
      <label
        class="subhead mb-2"
        id="search-fos-salary"
        for="search-fos-salary"
      >
        Salary After Completing

        <v-btn
          v-if="
            input.fos_salary.join(',') !==
              utility.formDefault.fos_salary.join(',')
          "
          @click="
            input.fos_salary = _.cloneDeep(utility.formDefault.fos_salary)
          "
          icon
          aria-label="Clear Salary After Complete Input"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </label>

      <v-range-slider
        id="search-fos-salary"
        name="search-fos-salary"
        v-model="input.fos_salary"
        :max="utility.fieldOfStudySalary.max"
        :min="utility.fieldOfStudySalary.min"
        hide-details
        class="align-center"
        color="secondary"
        track-color="dark-gray"
        thumb-color="secondary"
        thumb-label
        aria-label="Salary After Complete Range Slider"
      >
        <template v-slot:prepend>
          <div style="display:inline-flex;min-width:100%;">
            <span class="mt-2">$</span>
            <v-text-field
              :value="input.fos_salary[0]"
              class="mt-0 pt-0 ml-2"
              hide-details
              single-line
              type="number"
              style="width: 54px;min-width:54px;"
              suffix="k"
              @change="$set(input.fos_salary, 0, $event)"
              aria-label="Minimum Salary After Complete"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:append>
          <span class="mt-2">$</span>
          <v-text-field
            :value="input.fos_salary[1]"
            class="mt-0 pt-0 ml-2"
            hide-details
            single-line
            type="number"
            style="width: 54px;min-width:54px;"
            suffix="k"
            @change="$set(input.fos_salary, 1, $event)"
            aria-label="Maximum Salary After Complete"
          ></v-text-field>
        </template>
      </v-range-slider>

      <!-- Limited Data Alert -->
      <v-alert
        v-if="
          input.fos_salary.join(',') !==
            utility.formDefault.fos_salary.join(',')
        "
        type="warning"
        color="#D16E00"
        class="fos-limited-data mt-2 mb-2 pa-2"
        colored-border
        border="left"
        dense
        icon=" "
      >
        <div style="margin-top:1px;">
          <span
            >Limited Data&nbsp;<tooltip definition="fos-limited-data"
          /></span>
        </div>
      </v-alert>
    </div>

    <!-- Median Total Debt -->
    <div class="mb-4">
      <label
        class="subhead mb-2"
        id="search-fos-median-debt"
        for="search-fos-median-debt"
      >
        Median Total Debt

        <v-btn
          v-if="
            input.fos_debt.join(',') !== utility.formDefault.fos_debt.join(',')
          "
          @click="input.fos_debt = _.cloneDeep(utility.formDefault.fos_debt)"
          icon
          aria-label="Clear Median Total Debt Input"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </label>

      <v-range-slider
        name="search-fos-median-debt"
        v-model="input.fos_debt"
        :max="utility.fieldOfStudyDebt.max"
        :min="utility.fieldOfStudyDebt.min"
        hide-details
        class="align-center"
        color="secondary"
        track-color="dark-gray"
        thumb-color="secondary"
        thumb-label
        aria-label="Median Total Debt Range Slider"
      >
        <template v-slot:prepend>
          <div style="display:inline-flex;min-width:100%;">
            <span class="mt-2">$</span>
            <v-text-field
              :value="input.fos_debt[0]"
              class="mt-0 pt-0 ml-2"
              hide-details
              single-line
              type="number"
              style="width: 54px;min-width:54px;"
              suffix="k"
              @change="$set(input.fos_debt, 0, $event)"
              aria-label="Minimum Median Total Debt"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:append>
          <span class="mt-2">$</span>
          <v-text-field
            :value="input.fos_debt[1]"
            class="mt-0 pt-0 ml-2"
            hide-details
            single-line
            type="number"
            style="width: 54px;min-width:54px;"
            suffix="k"
            @change="$set(input.fos_debt, 1, $event)"
            aria-label="Maximum Median Total Debt"
          ></v-text-field>
        </template>
      </v-range-slider>

      <!-- Limited Data Alert -->
      <v-alert
        v-if="
          input.fos_debt.join(',') !== utility.formDefault.fos_debt.join(',')
        "
        type="warning"
        color="#D16E00"
        class="fos-limited-data mt-2 mb-2 pa-2"
        colored-border
        border="left"
        dense
        icon=" "
      >
        <div style="margin-top:1px;">
          <span
            >Limited Data&nbsp;<tooltip definition="fos-limited-data"
          /></span>
        </div>
      </v-alert>
    </div>

    <!-- WIOA Programs -->
    <div class="">
      <label
        class="subhead mb-2"
        id="search-fos-dolflag"
        for="search-fos-dolflag"
      >
        WIOA Programs&nbsp; </label
      ><tooltip definition="wioa-participants" />

      <v-checkbox
        id="search-form-dolflag"
        name="search-fos-dolflag"
        class="search-form-dolflag-cb my-0 py-0"
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        value="true"
        color="secondary"
        hide-details
      ></v-checkbox>
    </div>

    <v-btn
      type="submit"
      class="sr-only"
      color="secondary"
      large
      @click="$emit('search-query', cleanInput)"
      >Find Schools</v-btn
    >
  </v-form>
</template>

<script>
import FieldAutocomplete from "~/components/FieldAutocomplete.vue"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import FieldOfStudyDetailChip from "~/components/FieldOfStudyDetailChip.vue"
import Tooltip from "~/components/Tooltip.vue"
import LocationCheck from "~/js/mixins/LocationCheck.js"
import { SiteData } from "~/js/mixins/SiteData.js"
import _ from "lodash"

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
  },
  components: {
    "field-autocomplete": FieldAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
    "field-of-study-detail-chip": FieldOfStudyDetailChip,
    tooltip: Tooltip,
  },
  data() {
    return {
      input: {
        cip4: [],
        cip4_degree: ["c", "a", "b"],
        zip: "",
        distance: 10,
        lat: null,
        long: null,
        state: [],
        fos_salary: [0, 150],
        fos_debt: [0, 50],
        dolflag: null,
      },
      utility: {
        formDefault: {},
        location: null,
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
        cip4Cache: [],
      },
    }
  },
  computed: {
    cleanInput() {
      let defaultValues = _.cloneDeep(this.utility.formDefault)

      // Pick only values that are different from default state.
      let groomedInput = _.pickBy(this.input, (value, key) => {
        // If it does not exist in the default state object, remove.
        if (!_.has(defaultValues, key)) {
          return false
        }

        //If the input value is not equal to default, return value.
        if (!_.isEqual(value, defaultValues[key]) || key === "cip4_degree") {
          return value
        }
      })

      // Handle edge case for distance :(
      if (groomedInput.zip) {
        groomedInput.distance = this.input.distance
      } else {
        _.unset(groomedInput, "distance")
      }

      // Format Sliders - Happens here to ensure if shows up in url in desired format
      if (groomedInput.fos_salary) {
        groomedInput.fos_salary =
          groomedInput.fos_salary[0] * 1000 +
          ".." +
          groomedInput.fos_salary[1] * 1000
      }

      if (groomedInput.fos_debt) {
        groomedInput.fos_debt =
          groomedInput.fos_debt[0] * 1000 +
          ".." +
          groomedInput.fos_debt[1] * 1000
      }

      return groomedInput
    },
    locationButtonColor() {
      return this.location.latLon ? "primary" : ""
    },
    cipSelectionLimitReached() {
      if (this.input.cip4.length >= 5) {
        return true
      }

      return false
    },
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
  created() {
    // Set default Form Object
    this.utility.formDefault = _.cloneDeep(this.input)

    // Map Input from passed values
    this.mapInputFromProp()

    // Debounce search event
    this.debounceEmitSearchQuery = _.debounce(function() {
      // Send new param object, reset page
      this.$emit("search-query", {
        ...this.cleanInput,
        page: 0,
      })
    }, 1000)
  },
  mounted() {
    this.$root.$on("search-form-reset", (e) => {
      this.resetFormDefault()
    })
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
    mapInputFromProp() {
      // Merge import data object (used for v-models) with items passed from the URL
      _.mergeWith(this.input, this.urlParsedParams, function(
        objVal,
        newObjValue,
        key
      ) {
        // Perform Any alterations or validations with the URL components
        switch (key) {
          case "fos_debt":
          case "fos_salary":
            // Format range sliders from backend value to frontend value
            let valueArray = newObjValue.split("..")

            return valueArray.map((value) => {
              if (Number(value) <= 0) {
                return 0
              } else {
                return Number(value / 1000)
              }
            })
            break
          default:
            if (_.isArray(objVal) && _.isString(newObjValue)) {
              return [newObjValue]
            }
            break
        }
      })

      // Validate and fill chips
      if (this.input.cip4.length > 0) {
        this.input.cip4.forEach((cip4Code) => {
          let locatedCip4Field = this.locateCip4Field(cip4Code)

          // Attempt to locate cip4 in site data;
          if (locatedCip4Field) {
            // console.log(locatedCip4Field);
            this.utility.cip4Cache.push({
              cip4: cip4Code,
              field: locatedCip4Field,
            })
          } else {
            // remove from input if not found;
            this.input.cip4 = this.input.cip4.splice(
              this.input.cip4.indexOf(cip4Code),
              1
            )
          }
        })
      }

      //Validate and fill range sliders
      // if(this.input.fos_debt){
      //
      // }

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
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      this.input.cip4 = _.union(this.input.cip4, [fieldOfStudy.cip4])
      this.utility.cip4Cache = _.unionBy(
        this.utility.cip4Cache,
        [fieldOfStudy],
        "cip4"
      )
    },
    handleFieldOfStudyChipClose(fieldOfStudy) {
      //console.log(fieldOfStudy)

      // Remove from arrays
      this.input.cip4 = this.input.cip4.filter((cip4) => {
        return Number(cip4) !== Number(fieldOfStudy.cip4)
      })

      this.utility.cip4Cache = this.utility.cip4Cache.filter((item) => {
        return Number(item.cip4) !== Number(fieldOfStudy.cip4)
      })
    },
    handleClearAllChips() {
      this.input.cip4 = []
      this.utility.cip4Cache = []
    },
    resetFormDefault() {
      this.input = _.cloneDeep(this.utility.formDefault)
      this.utility.location = null
      this.utility.cip4Cache = []
    },
  },
}
</script>
