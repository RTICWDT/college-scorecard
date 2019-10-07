<template>
  <div id="search-can-query-items-wrapper">
    <v-row>
      <v-col md="4" sm="12" cols="12" class="text-center canned-search-wrapper">
        <canned-search-slider
          label="Schools Near Me (Placeholder)"
          :add-to-query="[{state:['MA']}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <canned-search-slider
          label="Most People Get In"
          :add-to-query="[{acceptance: '0.9..'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <!-- <canned-search-slider
          label="Private Schools"
          :add-to-query="[{control: 'public'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider> -->
      </v-col>

      <v-col md="4" sm="12" cols="12" class="text-center canned-search-wrapper">
        <!-- <canned-search-slider
          label="Medium Sized Schools"
          :add-to-query="[{size:'medium'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider> -->
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
      </v-col>
      <v-col md="4" cols="12">
        <canned-search-slider
          label="Most People Graduate"
          :add-to-query="[{completion_rate:'0.8..'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <!-- <canned-search-slider
          label="I want to live in a city"
          :add-to-query="[{urban:'city'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider>
        <canned-search-slider
          label="I want attend an all woman school"
          :add-to-query="[{serving:'women_only'}]"
          @canned-search-toggle="handleCannedToggle"
        ></canned-search-slider> -->
      </v-col>

      <v-col cols="12" md="12">
        <v-btn color="secondary" rounded @click="$emit('canned-search-submit',query)">Go</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import querystring from "querystring";
import CannedSearchSlider from "components/vue/CannedSearchSlider.vue";
import _ from "lodash";

export default {
  data() {
    return {
      query: {}
    };
  },
  components: {
    "canned-search-slider": CannedSearchSlider
  },
  methods: {
    handleCannedToggle(data) {
      if (data.value) {
        // Add
        this.query = Object.assign({}, this.query, data.data[0]);
      } else {
        // Remove
        let vm = this;
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