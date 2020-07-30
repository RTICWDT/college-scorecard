<style lang="scss">
  #fos-chip-container{
    width: 280px;
  }

  #fos-chip-container .v-chip {
    margin: 8px;
    height: auto;
    white-space: normal;
  }
</style>
<template>
  <v-form class="pa-2">
    <div class="mt-2">
      <p class="subhead-2" id="fields-label">Search By Fields Of Study</p>
<!--      <field-autocomplete v-model="input.cip4"></field-autocomplete>-->
      <field-of-study-search
        @field-of-study-selected="handleFieldOfStudySelected"
      />

      <!--TODO: Chips-->
      <div id="fos-chip-container">
        <v-chip
          v-for="fieldOfStudy in utility.cip4Cache"
          :key="fieldOfStudy.cip4"
          close
          @click:close="handleFieldOfStudyChipClose(fieldOfStudy)"
        >
          {{fieldOfStudy.field}}
        </v-chip>
      </div>

    </div>

    <!-- Credential Type -->
    <div class="mt-4">
      <p class="subhead-2">Credential Type</p>
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
    </div>

    <!-- Location -->
    <div class="mt-4">
      <p class="subhead-2" id="location-label">Location</p>
      <v-select
        id="search-from-location-select"
        v-model="utility.location"
        @change="handleLocationChange"
        :items="['Near Me','ZIP Code','State']"
        hide-details
        class="mb-3 mt-0 pt-0"
        aria-labelledby="location-label"
        :placeholder="utility.location ? undefined : 'Select an option'"
        clearable
      />

      <div class="d-flex align-center" v-if="utility.location==='ZIP Code'">
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
          :rules="[utility.rules.required,utility.rules.numerical]"
          label="Distance in Miles"
          :disabled="!input.zip"
          hideDetails
          class="mb-3"
          type="number"
          min="1"
        ></v-text-field>
      </div>

      <div class="d-flex align-center" v-if="utility.location==='Near Me'">
        <v-tooltip bottom max-width="250" color="rgba(0,0,0,0.95)">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="handleLocationCheck">
              <v-icon
                v-on="on"
                :color="locationButtonColor"
                v-html="location.isLoading ? 'fas fa-circle-notch fa-spin' : 'mdi-near-me'"
              ></v-icon>
            </v-btn>
          </template>
          Click the arrow to find your location based on your browser settings and then enter a distance to find schools near you.
        </v-tooltip>
        <v-text-field
          v-model="location.miles"
          :rules="[utility.rules.required,utility.rules.numerical]"
          label="Distance in Miles"
          :disabled="!location.latLon"
          hideDetails
          class="mb-3"
          type="number"
        ></v-text-field>
        <span v-show="location.error" class="overline">{{location.error}}</span>
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
        placeholder="Select a state..."
        class="mt-0 pt-0"
        color="secondary"
        deletable-chips
        v-if="utility.location=='State'"
      ></v-select>
    </div>

    <div class="mt-4">
      <p class="subhead-2" id="fos-salary-after-completing">Salary After Completing</p>
      <v-range-slider
        v-model="input.salary"
        :max="utility.salary.max"
        :min="utility.salary.min"
        hide-details
        class="align-center"
      >
        <template v-slot:prepend>
          <v-text-field
            :value="input.salary[0]"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            @change="$set(input.salary, 0, $event)"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            :value="input.salary[1]"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            @change="$set(input.salary, 1, $event)"
          ></v-text-field>
        </template>
      </v-range-slider>
    </div>

    <div class="mt-4">
      <p class="subhead-2" id="fos-median-total-debt">Median Total Debt</p>
      <v-range-slider
        v-model="input.debt"
        :max="utility.debt.max"
        :min="utility.debt.min"
        hide-details
        class="align-center"
      >
        <template v-slot:prepend>
          <v-text-field
            :value="input.debt[0]"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            @change="$set(input.debt, 0, $event)"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            :value="input.debt[1]"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            @change="$set(input.debt, 1, $event)"
          ></v-text-field>
        </template>
      </v-range-slider>
    </div>

  </v-form>
</template>

<script>
  import FieldAutocomplete from './FieldAutocomplete.vue';
  import FieldOfStudySearch from './FieldOfStudySearch.vue';
  import Tooltip from "./Tooltip.vue";
  import LocationCheck from '../../vue/mixins/LocationCheck.js';
  import { SiteData } from '../../vue/mixins/SiteData.js';
  import _ from 'lodash';


  export default{
    mixins: [SiteData, LocationCheck],
    props:{
      urlParsedParams: {
        type: Object
      },
      autoSubmit: {
        type: Boolean,
        default: false
      },
    },
    components:{
      'field-autocomplete': FieldAutocomplete,
      'field-of-study-search': FieldOfStudySearch,
      'tooltip': Tooltip
    },
    data(){
      return{
        input:{
          cip4:[],
          cip4_degree: [],
          zip: '',
          distance: 10,
          lat: null,
          long: null,
          state: [],
          salary:[0,50000],
          debt:[0,10000]
        },
        utility:{
          formDefault: {},
          location: null,
          rules: {
            required: value => !!value || "Required.",
            numerical: value => {
              const pattern = /^\d+$/
              return pattern.test(value) || 'Numerical'
            }
          },
          salary:{
            min:0,
            max:150000
          },
          debt:{
            min:0,
            max:50000
          },
          initialized: false,
          cip4Cache:[]
        }
      }
    },
    computed:{
      cleanInput(){
        let defaultValues = _.cloneDeep(this.utility.formDefault);

        // Pick only values that are different from default state.
        let groomedInput = _.pickBy(this.input, (value, key) => {
          // If it does not exist in the default state object, remove.
          if (!_.has(defaultValues, key)) {
            return false;
          }

          //If the input value is not equal to default, return value.
          if (!_.isEqual(value, defaultValues[key])) {
            return value;
          }
        });

        // Handle edge case for distance :(
        if (groomedInput.zip) {
          groomedInput.distance = this.input.distance;
        } else {
          _.unset(groomedInput, 'distance');
        }

        return groomedInput;
      },
      locationButtonColor() {
        return (this.location.latLon ? 'primary' : '');
      },
    },
    watch: {
      cleanInput: {
        handler(newValue, oldValue) {
          // On first load trigger query immediately, then debounce additional queries.
          if (!this.autoSubmit) {
            return;
          }

          if (this.utility.initialized) {
            this.debounceEmitSearchQuery();
          } else {
            this.$emit('search-query', {...newValue});
            this.utility.initialized = true;
          }
        },
        deep: true
      },
      urlParsedParams: {
        handler(newValue, oldValue) {
          this.mapInputFromProp();
        },
        deep: true
      },
      'location.latLon': {
        // Proccess Lat/Long object for url values.
        handler(newValue, oldValue) {
          if (newValue != null && newValue.min_lat && newValue.max_lat && newValue.min_lat && newValue.max_lat) {
            this.input.lat = newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4);
            this.input.long = newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4);
          }
        }
      },
      'location.miles'() {
        this.handleLocationCheck();
      },
    },
    created() {
      // Set default Form Object
      this.utility.formDefault = _.cloneDeep(this.input);

      // Map Input from passed values
      this.mapInputFromProp();

      // Debounce search event
      this.debounceEmitSearchQuery = _.debounce(function () {
        // Send new param object, reset page
        this.$emit('search-query', {
          ...this.cleanInput,
          page:0
        });
      }, 1000);

    },
    methods:{
      handleLocationChange(e) {
        // TODO - Check to see if values need to be reset.
        this.input.zip = "";
        this.input.state = [];

        this.input.lat = null;
        this.input.long = null;

        this.location.latLon = null;
        this.location.error = null;
      },
      mapInputFromProp(){
        // Merge import data object (used for v-models) with items passed from the URL
        _.mergeWith(this.input, this.urlParsedParams, function (objVal, newObjValue, key) {
          if (_.isArray(objVal) && _.isString(newObjValue)) {
            return [newObjValue];
          }

          // Perform Any alterations from URL to frontend items
          // TODO - Translate URL values for: Salary After Completing + medium total debt

          // switch (key) {
          //   case 'completion_rate':
          //   case 'acceptance':
          //     return parseFloat(newObjValue) * 100;
          //     break;
          //   case 'avg_net_price':
          //     if (parseFloat(newObjValue.substr(2)) > 1000) {
          //       return parseFloat(newObjValue.substr(2)) / 1000;
          //     }
          //     break;
          //   case 'sat_math':
          //   case 'sat_read':
          //   case 'act':
          //     return parseFloat(newObjValue.substr(2))
          //     break;
          // }
        });

        // TODO - Look up cip and set cache for CHIPS
        // TODO - Validate?
        if(this.input.cip4.length > 0){
          // Add to cache and look up name
          // Look up
          // this.utility.cip4Cache = this.input.cip4.reduce((returnArray, cip4Code) => {
          //   let locatedCip4Field = this.locateCip4Field(cip4Code);
          //
          //   if(locatedCip4Field){
          //     returnArray.push({
          //       cip4: cip4Code,
          //       field: locatedCip4Field
          //     })
          //   }else{
          //     // remove
          //     this.input.cip4 = this.input.cip4.splice(this.input.cip4.indexOf(cip4Code));
          //   }
          //
          //   return returnArray;
          // },[]);

          this.input.cip4.forEach((cip4Code) => {
            let locatedCip4Field = this.locateCip4Field(cip4Code);

            // Attempt to locate cip4 in site data;
            if(locatedCip4Field) {
              console.log(locatedCip4Field);
              this.utility.cip4Cache.push({
                cip4: cip4Code,
                field: locatedCip4Field
              });
            }else{

              // remove from input if not found;
              this.input.cip4 = this.input.cip4.splice(this.input.cip4.indexOf(cip4Code),1);
            }
          });
        }

        if (this.input.lat && this.input.long) {
          this.utility.location = "Near Me";
          this.location.latLon = true;
        }

        if (this.input.zip) {
          this.utility.location = "ZIP Code";
        }

        if (!_.isEmpty(this.input.state)) {
          this.utility.location = "State";
        }
      },
      handleFieldOfStudySelected(fieldOfStudy){
        this.input.cip4 = _.union(this.input.cip4,[fieldOfStudy.cip4]);
        this.utility.cip4Cache = _.unionBy(this.utility.cip4Cache,[fieldOfStudy],'cip4');
      },
      handleFieldOfStudyChipClose(fieldOfStudy){
        console.log(fieldOfStudy);

        // Remove from arrays
        this.input.cip4 = this.input.cip4.filter((cip4)=>{
          return Number(cip4) !== Number(fieldOfStudy.cip4);
        });

        this.utility.cip4Cache = this.utility.cip4Cache.filter((item)=>{
          return Number(item.cip4) !== Number(fieldOfStudy.cip4)
        });
      }
    }
  }
</script>