<style lang="scss" scoped>
  .search-form-degree-wrapper{
    
    .v-messages{
      display: none;
    }

  }
  .subhead-2{
    margin-top: 1rem !important;
    margin-bottom: 0.3rem !important;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif !important;
  }
  .search-panel-header{
    background-color: #C5D3E1; 
    border-radius: 0px !important;
  }
</style>

<template>

  <v-form>
    <div class='py-2 px-5'>
    <p class='subhead-2'>School Name</p> 
    <name-autocomplate></name-autocomplate>

    <p class='subhead-2'>Location</p>    
    <v-select v-model="input.state"
      :items="site.data.states"
      item-text="name"
      item-value="abbr"
      multiple
      chips
      hide-details
      placeholder="Select one..."
      class='mt-0 pt-0'
      color="secondary"
      ></v-select>
    
    <!-- TODO: Enable for location aware search. -->
    <!-- <p class='subhead-2'>Nearby</p>    
    <v-row>
      <v-col cols="12" md="4" sm="12" xs="12">
        <v-btn text 
          icon 
          color="indigo"
          @click="handleLocationCheck"
        >
          <v-icon>mdi-star</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="8" sm="12" xs="12">
        <v-text-field v-model="location.miles"
          :rules="[utility.rules.required,utility.rules.numerical]"
          :disabled="!location.latLon"
          label="Miles"
        ></v-text-field>
      </v-col>
    </v-row> -->

    <p class='subhead-2'>Field of Study/Major</p>
    <field-autocomplete v-model="input.cip4"></field-autocomplete>

    <!-- <p class='subhead-2'>Length</p>
    <div class="search-form-degree-wrapper">
        <v-checkbox
          class="search-form-degree-cb my-0 py-0"
          v-model="input.degree"
          label="Two Year"
          value="a"
          color="secondary"          
          hide-details
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb my-0 py-0"
          v-model="input.degree"
          label="Four Year"
          value="b"
          color="secondary"
          hide-details
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb my-0 py-0"
          v-model="input.degree"
          label="Less than Two Year"
          value="c"
          color="secondary"
          hide-details
        ></v-checkbox>
    </div> -->

    <check-range legend-title="Graduation Rate" 
      v-model="input.completion_rate"
      :enable="utility.enable.completion_rate" 
      @slider-toggle="utility.enable.completion_rate = $event"
      :min="0"
      :max="100"
      :step="5"
      append-icon="mdi-percent"
      class='mt-5'
    ></check-range>

    <check-range legend-title="Average Annual Cost" 
      v-model="input.avg_net_price"
      :enable="utility.enable.avg_net_price"
      @slider-toggle="utility.enable.avg_net_price = $event"
      :min="0"
      :max="100"
      :step="5"
    >
      <template v-slot:append-text>
        K
      </template>
    </check-range>
    </div>

    <v-expansion-panels v-show="displayAllFilters" class='mt-5'>
      <v-expansion-panel>
        <v-expansion-panel-header class='search-panel-header'>
          More
        </v-expansion-panel-header>
        <v-expansion-panel-content>
     
          <!-- <p class='title mt-3'>Admittance</p> -->

          <check-range v-model="input.sat_math"
            :enable="utility.enable.sat_math" 
            @slider-toggle="utility.enable.sat_math = $event"
            :min="0" 
            :max="800"
            :step="20"
            class='mt-5'
          >
            <template v-slot:label>
              SAT Math
            </template>
          </check-range>

          <check-range v-model="input.sat_read"
            :enable="utility.enable.sat_read" 
            @slider-toggle="utility.enable.sat_read = $event"
            :min="0" 
            :max="800"
            :step="20"
          >
            <template v-slot:label>
              SAT Critical Reading
            </template>
          </check-range>

          <check-range v-model="input.act"
            :enable="utility.enable.act" @slider-toggle="utility.enable.act = $event"
            :min="0" 
            :max="36"
            :step="1"
          >
            <template v-slot:label>
              ACT Score
            </template>
          </check-range>

          <check-range v-model="input.acceptance"
            :enable="utility.enable.acceptance" 
            @slider-toggle="utility.enable.acceptance = $event"
            :min="0"
            :max="100"
            :step="5"
          >
            <template v-slot:label>
              Acceptance Rate (%)
            </template>
          </check-range>
    

        <!-- <p class='overline'>School Characteristics</p> -->
      
          <p class='subhead-2 mb-3'>Size</p>
          <div>
            <!-- TODO - Do we want these to appear as buttons? -->
            <v-checkbox
              hide-details
              v-model="input.size"
              label="Small"
              value="small"
              color="secondary"
              class="py-0 my-0"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.size"
              label="Medium"
              value="medium"
                color="secondary"
                class="py-0 my-0"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.size"
              label="Large"
              value="large"
                color="secondary"
                class="py-0 my-0"
            ></v-checkbox>
          </div>


          <p class='subhead-2'>Type of School</p>
          <div class="search-form-type-container">
            <v-checkbox
              hide-details
              v-model="input.control"
              label="Public"
              value="public"
              color="secondary"
              class="py-0 my-0"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.control"
              label="Private Nonprofit"
              value="private"
              color="secondary"
              class="py-0 my-0"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.control"
              label="Private For-Profit"
              value="profit"
              color="secondary"
              class="py-0 my-0"
            ></v-checkbox>
          </div>

          <p class='subhead-2'>Urbancity</p>
          <!-- TODO - Not working yet -->
          
              <v-checkbox
                hide-details            
                v-model="input.urban"
                label="City"
                value="city"
                color="secondary"
                class="py-0 my-0"
              ></v-checkbox>

              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Suburban"
                value="suburban"
                color="secondary"
                class="py-0 my-0"
              ></v-checkbox>
              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Town"
                value="town"
                color="secondary"
                class="py-0 my-0"
              ></v-checkbox>

              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Rural"
                value="rural"
                color="secondary"
                class="py-0 my-0"
              ></v-checkbox>
 
        <p class='subhead-2'>Specialized Mission</p>
        <v-select v-model='input.serving'
          :items='cleanSpecializedMission'
          item-text="value"
          item-value="key"
          placeholder='Select one...'
          class="py-0 my-0"
          color="secondary"

        ></v-select>


        <p class='subhead-2'>Religious Affiliation</p>
        <v-select v-model='input.religious'
          :items='site.data.religious_affiliations'
          item-text='label'
          item-value='value'
          placeholder='Select one...'
          class="py-0 my-0"
           color="secondary"

        ></v-select>


     
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div id="search-submit-container" class="pa-2 text-center" v-if="!autoSubmit">
      <v-btn color="secondary" rounded @click="$emit('search-query',cleanInput)">Submit</v-btn>
    </div>

  </v-form>
</template>

<script>
import _ from 'lodash';
import querystring from 'querystring';
import CheckRange from './CheckRange.vue';
import NameAutocomplete from './NameAutocomplete.vue';
import FieldAutocomplete from './FieldAutocomplete.vue';
import { SiteData } from '../../vue/mixins/SiteData.js';
import { EventBus } from '../../vue/EventBus.js';

export default {
  mixins:[SiteData],
  props:{
    urlParsedParams: {
      type: Object
    },
    autoSubmit:{
      type: Boolean,
      default: false
    },
    displayAllFilters: {
      type: Boolean,
      default: false
    }
  },
  components:{
    'check-range': CheckRange,
    'name-autocomplate': NameAutocomplete,
    'field-autocomplete': FieldAutocomplete
  },
  data(){
    return{
      input:{
        state:[],
        // degree:[],
        major:"",
        region:[],
        zip:"",
        distance:"",
        size:[],
        name:"",
        control:[], //Type
        serving:"",
        religious:"",
        completion_rate: null,
        avg_net_price: null,
        urban:[],
        cip4: "",
        act: null,
        sat_math: null,
        sat_read: null,
        acceptance:null,
        lat: null,
        long: null,
        // page:0,
        // sort:""
      },
      location:{
        latLon: null,
        miles: 10, //In Miles.
      },
      utility:{
        rules:{
          required: value => !!value || "Required.",
          numerical: value => {
            const pattern = /^\d+$/
            return pattern.test(value) || 'Numerical'
          }
        },
        // Hold Default state of form data.
        formDefault:{},
        // Helper to activate debounced query after initial load.
        initialized: false,
        showMore: false,
        // Hold Default for checkrange enables.
        enableDefault:{},
        // State object
        enable:{
          completion_rate: false,
          avg_net_price: false,
          sat_math: false,
          sat_read: false,
          act: false,
          acceptance: false
        },
      }
    }
  },
  watch:{
    cleanInput: {
      handler(newValue,oldValue){
        // On first load trigger query immediately, then debounce additional queries.
        if(!this.autoSubmit){
          return;
        }

        if(this.utility.initialized){
          this.debounceEmitSearchQuery();
        }else{
          this.$emit('search-query', newValue);
          this.utility.initialized = true;
        }
      },
      deep: true
    },
    urlParsedParams: {
      handler(newValue,oldValue){
        this.mapInputFromProp();
      },
      deep: true
    },
    'location.latLon':{
      // Proccess Lat/Long object for url values.
      handler(newValue,oldValue){
        if(newValue.min_lat && newValue.max_lat && newValue.min_lat && newValue.max_lat){
          this.input.lat = newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4);
          this.input.long = newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4);
        }
      }
    },
    'location.miles'(){
      this.handleLocationCheck();
    },
  },
  computed:{
    // Remove items that are not set
    cleanInput(){
      let defaultValues = _.cloneDeep(this.utility.formDefault);
      // Pick only values that are different from default state.
      let groomedInput =  _.pickBy(this.input,(value,key) => {
        // If it does not exist in the default state object, remove.
        if(!_.has(defaultValues,key)){
          return false;
        }

        //If the input value is not eqaul to default, return value.
        if(!_.isEqual(value,defaultValues[key])){
          return value;
        }
      });

      // Pefrom Input to API data alterations.
      // TODO - Refactor this process. Ingest and egress.  Maybe arrary of objects with string numeral parsing.  Refactor when we have some additional time.

      // Completion rate
      if(groomedInput.completion_rate && groomedInput.completion_rate > 0 && this.utility.enable.completion_rate){
        groomedInput.completion_rate = groomedInput.completion_rate / 100 + '..';
      }else{
        _.unset(groomedInput,'completion_rate'); // TODO: CONST;
      }

      if(groomedInput.avg_net_price && groomedInput.avg_net_price > 0 && this.utility.enable.avg_net_price){
        groomedInput.avg_net_price = '..' + groomedInput.avg_net_price * 1000;
      }else{
        _.unset(groomedInput,'avg_net_price'); // TODO: CONST;
      }

      if(groomedInput.sat_math && groomedInput.sat_math > 0 && this.utility.enable.sat_math){
        groomedInput.sat_math = '..' + groomedInput.sat_math
      }else{
        _.unset(groomedInput,'sat_math'); // TODO: CONST;
      }

      if(groomedInput.sat_read && groomedInput.sat_read > 0 && this.utility.enable.sat_read){
        groomedInput.sat_read = '..' + groomedInput.sat_read
      }else{
        _.unset(groomedInput,'sat_read'); // TODO: CONST;
      }

      if(groomedInput.act && groomedInput.act > 0 && this.utility.enable.act){
        groomedInput.act = '..' + groomedInput.act
      }else{
        _.unset(groomedInput,'act'); // TODO: CONST;
      }

      if(groomedInput.acceptance && groomedInput.acceptance > 0 && this.utility.enable.acceptance){
        groomedInput.acceptance = groomedInput.acceptance / 100 + '..'
      }else{
        _.unset(groomedInput,'acceptance'); // TODO: CONST;
      }


      return groomedInput;
    },
    // Generate a URI string of params for forwarding to search page.
    searchURL(){
      let qs = querystring.stringify(this.cleanInput);
      qs = '?' + qs.replace(/^&+/, '')
        .replace(/&{2,}/g, '&')
        .replace(/%3A/g, ':');
      
      return qs;
    },
    cleanSpecializedMission(){
      return _.map(this.site.data.special_designations,(value,key) => {
        return {
          'key': key,
          'value': value
        }
      })
    }
  },
  created(){
    // Replicate default form state.
    this.utility.formDefault = _.cloneDeep(this.input);
    this.utility.enableDefault = _.cloneDeep(this.utility.enable);

    // TODO - Refactor this aswell
      // For example, percentages for grad rate.
    this.mapInputFromProp();

    this.debounceEmitSearchQuery = _.debounce(function() {
      this.$emit('search-query', this.cleanInput);
    }, 1000);

  },
  mounted(){
    EventBus.$on('search-form-reset', (e) => {
      this.resetFormDefault();
    });
  },
  methods:{
    mapInputFromProp(){
      // Reset form to default, Helps with processing canned search items.
      this.resetFormDefault();

      _.mergeWith(this.input,this.urlParsedParams,function(objVal,newObjValue,key){
      // this.input = _.mergeWith(this.utility.formDefault, this.urlParsedParams,function(objVal,newObjValue,key){
        if(_.isArray(objVal) && _.isString(newObjValue)){
          return [newObjValue];
        }
        
        // TODO - Are there consts?, add inarray check.
        // Perform any URL -> Form data translations
        if(key === 'completion_rate' || key === 'acceptance'){
          return parseFloat(newObjValue) * 100;
        }

        if(key === 'avg_net_price'){
          if(parseFloat(newObjValue.substr(2)) > 1000)
          {
            return parseFloat(newObjValue.substr(2)) / 1000;
          }
        }

        if(key === 'sat_math' || key === 'sat_read' || key === 'act'){
          return parseFloat(newObjValue.substr(2))
        }

      });

      // TODO - Refactor to a more elegant. Loop through all utility enables, and trigger on.
      // Set Sliders as active:
      if(this.input.completion_rate > 0){
        this.utility.enable.completion_rate = true;
      }

      if(this.input.avg_net_price > 0){
        this.utility.enable.avg_net_price = true;
      }

      if(this.input.sat_read > 0){
        this.utility.enable.sat_read = true;
      }

      if(this.input.sat_math > 0){
        this.utility.enable.sat_math = true;
      }

      if(this.input.act > 0){
        this.utility.enable.act = true;
      }

      if(this.input.acceptance > 0){
        this.utility.enable.acceptance = true;
      }

    },
    processChangeEvent(){
    },
    // handleSizeClick(value){
    //   if(value === this.input.size){
    //     this.input.size = ""
    //   }else{
    //     this.input.size = value;
    //   }
    // },
    handleLocationCheck(){
      if (navigator.geolocation) {
        let vm = this;
        navigator.geolocation.getCurrentPosition(function(position){
          vm.location.latLon = vm.calculateBoundingBox(position.coords.latitude,position.coords.longitude, vm.location.miles * 1.609); // Convert miles to KM (Aprroximate)
        });

      } else {
        // TODO: Error Handling.
        console.log("Uh oh, Location no likie.")
      }
    },
    //Distance: Referenced from: https://stackoverflow.com/a/25025590
    calculateBoundingBox(lat,long,distance){
      let MIN_LAT, MAX_LAT, MIN_LON, MAX_LON, R, radDist, degLat, degLon, radLat, radLon, minLat, maxLat, minLon, maxLon, deltaLon;
      
      if (distance < 0) {
        return 'Illegal arguments';
      }

      // helper functions (degrees<–>radians)
      Number.prototype.degToRad = function () {
        return this * (Math.PI / 180);
      };

      Number.prototype.radToDeg = function () {
        return (180 * this) / Math.PI;
      };

      // coordinate limits
      MIN_LAT = (-90).degToRad();
      MAX_LAT = (90).degToRad();
      MIN_LON = (-180).degToRad();
      MAX_LON = (180).degToRad();

      // Earth's radius (km)
      R = 6378.1;

      // angular distance in radians on a great circle
      radDist = distance / R;

      // center point coordinates (deg)
      degLat = lat;
      degLon = long;

      // center point coordinates (rad)
      radLat = degLat.degToRad();
      radLon = degLon.degToRad();

      // minimum and maximum latitudes for given distance
      minLat = radLat - radDist;
      maxLat = radLat + radDist;

      // minimum and maximum longitudes for given distance
      minLon = void 0;
      maxLon = void 0;

      // define deltaLon to help determine min and max longitudes
      deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
      if (minLat > MIN_LAT && maxLat < MAX_LAT) {
        minLon = radLon - deltaLon;
        maxLon = radLon + deltaLon;
        if (minLon < MIN_LON) {
          minLon = minLon + 2 * Math.PI;
        }
        if (maxLon > MAX_LON) {
          maxLon = maxLon - 2 * Math.PI;
        }
      }

      // a pole is within the given distance
      else {
        minLat = Math.max(minLat, MIN_LAT);
        maxLat = Math.min(maxLat, MAX_LAT);
        minLon = MIN_LON;
        maxLon = MAX_LON;
      }

      return{
        min_lat:minLat.radToDeg(),
        max_lat:maxLat.radToDeg(),
        min_lon:minLon.radToDeg(),
        max_lon:maxLon.radToDeg()
      };
    },
    //Reset form to default.
    resetFormDefault(){
      this.input = _.cloneDeep(this.utility.formDefault);
      this.utility.enable = _.cloneDeep(this.utility.formDefault);
    }

  }
}
</script>