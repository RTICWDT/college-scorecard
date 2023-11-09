<template>
  <v-form class="px-5 pb-5 pt-3" id="fos-search-form"  novalidate="false">
    <h3 class="my-4">Location</h3>
    <location-institution-search
      @search-query="handleLocationSelection"
      :horizontal="false"
      :initial_state="input.state"
      :initial_zip="input.zip"
      :initial_distance="input.distance"
    />
    <!-- Salary After Completing -->
    <div>
      <h3 class="my-4" id="search-fos-salary" for="search-fos-salary">
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
      </h3>

      <v-range-slider
        id="search-fos-salary"
        name="search-fos-salary"
        v-model="input.fos_salary"
        :max="utility.fieldOfStudySalary.max"
        :min="utility.fieldOfStudySalary.min"
        hide-details
        class="align-center"
        color="primaryfos"
        track-color="dark-gray"
        thumb-color="primaryfos"
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
    </div>

    <!-- Median Total Debt -->
    <div class="mb-4">
      <h3 class="my-4" id="search-fos-median-debt" for="search-fos-median-debt">
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
      </h3>

      <v-range-slider
        name="search-fos-median-debt"
        v-model="input.fos_debt"
        :max="utility.fieldOfStudyDebt.max"
        :min="utility.fieldOfStudyDebt.min"
        hide-details
        class="align-center"
        color="primaryfos"
        track-color="dark-gray"
        thumb-color="primaryfos"
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
    </div>

    <!-- WIOA Programs -->
    <div class="">
      <h3 class="my-4" id="search-fos-dolflag" for="search-fos-dolflag">
        WIOA Programs&nbsp;
        <tooltip definition="wioa-participants" />
      </h3>

      <v-checkbox
        id="search-form-dolflag"
        name="search-fos-dolflag"
        class="search-form-dolflag-cb my-0 py-0"
        v-model="input.dolflag"
        label="Only show schools that have Department of Labor WIOA programs"
        color="secondary"
        hide-details
        value="true"

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
import LocationInstitutionSearch from "~/components/LocationInstitutionSearch.vue"
import { megaMerge } from "~/js/forms.js"

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
    FieldAutocomplete,
    FieldOfStudySearch,
    FieldOfStudyDetailChip,
    Tooltip,
    LocationInstitutionSearch,
  },
  data() {
    return {
      input: {
        fos_salary: [0, 150],
        fos_debt: [0, 50],
        dolflag: null,
        state: null,
        zip: null,
        distance: null,
        lat: null,
        long: null,
      },
      utility: {
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
      },
    }
  },
  computed: {
    cleanInput() {
      let defaultValues = _.cloneDeep(this.utility.formDefault)

      let groomedInput = {}
      for (const key in this.input) {
        if (!_.has(defaultValues, key)) {
          continue
        }
        if (
          !_.isEqual(this.input[key], defaultValues[key]) ||
          key === "cip4_degree"
        ) {
          groomedInput[key] = this.input[key]
        } else {
          groomedInput[key] = null
        }
      }

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
    },

    handleLocationSelection(params) {
      this.input = { ...this.input, ...params }
      //this.$emit("search-query", this.cleanInput)
    },
    resetFormDefault() {
      // TODO - Create reset value method, pass desired fields to method, return default values from object.
      this.input = _.cloneDeep(this.utility.formDefault)
      this.utility.enable = _.cloneDeep(this.utility.formDefault)
      this.location.latLon = null
      this.location.error = null
      this.utility.location = null
    },
    handleLocationSelection(params) {
      this.input = { ...this.input, ...params }
      this.input.page = 1
    },    
  },
}
</script>
