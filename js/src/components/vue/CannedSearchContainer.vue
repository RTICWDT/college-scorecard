<template>
  <div id="search-can-query-items-wrapper">
    <v-row>
      <v-col md="6" cols="12" class="text-center canned-search-wrapper py-0 my-0">
        <canned-search-slider
          label="Schools Near Me"
          :add-to-query="[{location:true}]"
          @canned-search-toggle="handleCannedToggle"
          :is-loading="location.isLoading"
        ></canned-search-slider>
        
        <canned-search-slider
          label="Most People Get In"
          :add-to-query="[{acceptance: '0.5..1'}]"
          @canned-search-toggle="handleCannedToggle"
          tip="Acceptance rate of 50% or higher"
        ></canned-search-slider>
        <canned-search-slider
          label="Most People Graduate"
          :add-to-query="[{completion_rate:'0.5..'}]"
          @canned-search-toggle="handleCannedToggle"
          tip="Graduation rate of 50% or higher"
        ></canned-search-slider>
      </v-col>
      <v-col md="6" cols="12" class="text-center canned-search-wrapper py-0 my-0">
        <canned-search-slider
          label="I want an Associate's Degree"
          :add-to-query="[{cip4_degree:['a']}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <canned-search-slider
          label="I want a Bachelor's Degree"
          :add-to-query="[{cip4_degree:['b']}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <canned-search-slider
          label="I want a Certificate"
          :add-to-query="[{cip4_degree:['c']}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
      </v-col>
      <v-col cols="12" md="12" class='text-center mt-5'>
        <v-btn color="secondary" rounded @click="$emit('canned-search-submit',query)">Find Schools</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import querystring from "querystring";
import CannedSearchSlider from "components/vue/CannedSearchSlider.vue";
import _ from "lodash";
import LocationCheck from '../../vue/mixins/LocationCheck.js';

export default {
  mixins:[LocationCheck],
  data() {
    return {
      query: {},
    };
  },
  components: {
    "canned-search-slider": CannedSearchSlider
  },
  watch:{
    'location.latLon':{
      // Proccess Lat/Long object for url values.
      handler(newValue,oldValue){
        if(newValue != null && newValue.min_lat && newValue.max_lat && newValue.min_lat && newValue.max_lat){
          this.query.lat = newValue.min_lat.toFixed(4) + ".." + newValue.max_lat.toFixed(4);
          this.query.long = newValue.min_lon.toFixed(4) + ".." + newValue.max_lon.toFixed(4);
        }
      }
    },
  },
  methods: {
    handleCannedToggle(data) {
      // Add to array.
      let newQuery = data.data[0];

      if (data.value) {
        // Check for location
        if(newQuery.location){
          this.handleLocationCheck();
        }else{
          // this.query = Object.assign({}, this.query, data.data[0]);
          _.mergeWith(this.query, newQuery, (objValue,srcValue) => {
            if (_.isArray(objValue)) {
              return objValue.concat(srcValue);
            }
          });

        }
      } else {
        // Remove location
        if(newQuery.location){
          delete this.query['lat'];
          delete this.query['long'];
        }

        // Handle Everything else
        
        // Get the keys
        // let queryKeys


        
        this.query = _.reduce(this.query, function(newObject, value, key){
          if(_.isArray(value)){
            newObject[key] = _.without(value,newQuery[key][0]);
            return newObject;
          }else if (value[key] != newQuery[key]) {
            newObject[key] = value;
            return newObject;
          }
        },{});


        // this.query = _.omitBy(this.query, function(value, key) {
        //   if (newQuery[key]) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // });
      }
    }
  }
};
</script>