<template>
  <div id="search-can-query-items-wrapper">
    <v-row>
      <v-col md="4" sm="12" cols="12" class="text-center canned-search-wrapper py-0 my-0">
        <canned-search-slider
          label="Schools Near Me"
          :add-to-query="[{location:true}]"
          @canned-search-toggle="handleCannedToggle"
          :is-loading="location.isLoading"
        ></canned-search-slider>
        <canned-search-slider
          label="Most People Get In"
          :add-to-query="[{acceptance: '0.9..1'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
      </v-col>
      <!-- <v-col md="4" sm="12" cols="12" class="text-center canned-search-wrapper py-0 my-0">
        <canned-search-slider
          label="I want an Associate's Degree"
          :add-to-query="[{degree:'a'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <canned-search-slider
          label="I want an Bachelor's Degree"
          :add-to-query="[{degree:'b'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
      </v-col> -->
      <v-col md="4" cols="12" class='py-0 my-0'>
        <canned-search-slider
          label="Most People Graduate"
          :add-to-query="[{completion_rate:'0.8..'}]"
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
      if (data.value) {
        // Check for location
        if(data.data[0].location){
          this.handleLocationCheck();
        }else{
          this.query = Object.assign({}, this.query, data.data[0]);
        }
      } else {
        // Remove location
        if(data.data[0].location){
          delete this.query['lat'];
          delete this.query['long'];
        }

        // Handle Everything else
        this.query = _.omitBy(this.query, function(value, key) {
          if (data.data[0][key]) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
  }
};
</script>