<style lang="scss">
.canned-search-wrapper {
  margin-bottom: 8px;
}
.pageBar{
  background-color: rgba(255,255,255,0.7) !important;
}
.searchFab{
  z-index: 500 !important;
}
.v-pagination{
  justify-content: flex-end !important;
}
</style>

<template>
  <div>
    <v-app>
      <scorecard-header />
      <v-navigation-drawer
        v-model="showSidebar"
        app
        width="300"
        class="searchSidebar"
        clipped
      >
        <!-- Search Form Component -->
        <search-form
          :urlParsedParams="urlParsedParams"
          auto-submit
          display-all-filters
          @search-query="searchAPI"
        />
      </v-navigation-drawer>
      <v-content>
        <v-container fluid class="pa-0">
          <div id="search-result-container">
            <div class="search-result-container">
              <v-card  class="mt-2 mb-4 py-1 px-4 elevaton-0 pageBar" v-if="!isLoading">
                <v-row class="pa-0">
                  <v-col cols="12" sm="7" class="py-2 px-4">
                    <div id="search-result-info-count" class>
                      <p class="title mb-0">{{results.meta.total | separator }} Results
                        <v-btn
                          color="primary"
                          text-color="white"
                          @click="clearSearchForm"
                          x-small
                          rounded
                          fab
                          class="d-inline d-sm-none"
                        >
                          <span >
                            <v-icon class=''>mdi-close-circle</v-icon>
                          </span>
                        </v-btn>
                        <v-btn
                          color="primary"
                          text-color="white"
                          @click="clearSearchForm"
                          small
                          rounded
                          class="d-none d-sm-inline"
                        >
                          <span >
                            <v-icon small class='mr-1'>mdi-close-circle</v-icon> Clear
                          </span>
                        </v-btn>
                        <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn rounded color="primary" small v-on="on" class="d-none d-sm-inline">
                            <v-icon small class='mr-1'>fas fa-sort</v-icon> Sort
                          </v-btn>                          
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in sorts"
                            :key="index"
                            @click="resort(item.field);"
                          >
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn rounded color="primary" x-small v-on="on" fab class="d-inline d-sm-none">
                            <v-icon small class=''>fas fa-sort</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in sorts"
                            :key="index"
                            @click="resort(item.field);"
                          >
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                       <share :url="shareUrl" label="Share" small />
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="5" class="py-1 px-1" v-if="!isLoading && results.schools.length > 0">
                    <div class="text-md-right">
                      <v-pagination
                        v-model="input.page"
                        :length="totalPages"
                        :total-visible="7"
                        @input="searchAPI(parseURLParams())"
                        class='pr-0 mr-0'
                        circle
                      ></v-pagination>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            <div id="search-can-query-container" v-if="!isLoading && results.schools.length === 0">
            <!-- <div id="search-can-query-container" v-if="!isLoading"> -->
              <v-row>
                <v-col cols="12">
                  <v-card class='pa-5'>
                    <h3>Show Me Options</h3>
                    <p>Select one or more options below to create a list of schools that fit your needs.</p>
                    <canned-search-container @canned-search-submit="handleCannedSearchClick"></canned-search-container>
                  </v-card>
                </v-col>
             </v-row>
            </div>
              <div class="results-main-alert">
                <div class="show-loading" v-show="isLoading">
                  <v-card class="py-4 px-4 pageBar">
                    <h1 class="title">
                      Loading
                      <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                    </h1>
                  </v-card>
                </div>

                <div class="show-error" v-show="error.message">
                  <h1>Something went wrong:</h1>
                  <p class="error-message">{{error.message}}</p>
                </div>

                <div class="search-result-cards-container" v-if="!isLoading">
                  <v-row>
                    <v-col
                      v-for="school in results.schools"
                      :key="school.id"
                      cols="12"
                      lg="3"
                      md="4"
                      sm="6"
                      class="d-flex align-stretch"
                    >
                      <search-result-card
                        :school="school"
                        @toggle-compare-school="handleToggleCompareSchool"
                        :is-selected="isResultCardSelected(school.id,compareSchools)"
                      />
                    </v-col>
                  </v-row>
                </div>

                <div class="search-result-cards-container" v-else>
                  <!-- Fake Cards -->
                </div>
              </div>
              <!--results-main -->

              <v-card class="mt-4 mb-2 py-1 px-4 pageBar elevation-0"  v-if="!isLoading && results.schools.length > 0">
                <v-row>
                  <v-col cols="12" class='pa-1'>
                    <div class="text-right">
                      <v-pagination
                        v-model="input.page"
                        :length="totalPages"
                        :total-visible="7"
                        @input="searchAPI(parseURLParams())"
                        circle
                      ></v-pagination>
                     
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>

          <v-btn
            fab
            fixed
            bottom
            right
            color="secondary"
            rounded
            @click="showSidebar = !showSidebar"
            v-if="$vuetify.breakpoint.mdAndDown"
            class="searchFab"
          >
            <v-icon>fas fa-search</v-icon>
          </v-btn>
        </v-container>
      </v-content>
      <scorecard-footer />

      <compare-header :showCompare.sync="showCompare" :schools="compareSchools" />
      <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
        <compare-drawer
          :schools="compareSchools"
          @toggle-compare-school="handleToggleCompareSchool"
          v-on:close-modal="closeModal()"
        ></compare-drawer>
      </v-bottom-sheet>
    </v-app>
  </div>
  <!--End of root -->
</template>

<script>
// TODO - This needs major cleanup.  How can it be cleaned?, Seperate files for legacy Javascript items?

import SearchResultCard from "../../components/vue/SearchResultCard.vue";
import SearchForm from "../../components/vue/SearchForm.vue";
import CannedSearchButton from "../../components/vue/CannedSearchButton.vue";
import CompareDrawer from "../../components/vue/CompareDrawer.vue";
import CannedSearchContainer from "../../components/vue/CannedSearchContainer.vue";
import CompareHeader from "../../components/vue/CompareHeader.vue";
import Share from "../../components/vue/Share.vue";
import NameAutocomplete from "../../components/vue/NameAutocomplete.vue";
import URLHistory from "../mixins/URLHistory.js";
import PrepareParams from '../mixins/PrepareParams.js';

import _ from "lodash";
// import querystring from 'querystring';
// import { EventBus } from "../js/src/vue/EventBus.js";
import { EventBus } from "../EventBus.js";
import {apiGet} from '../api.js';
import {fields} from '../constants.js';

const querystring = require("querystring");

export default {
  components: {
    "search-result-card": SearchResultCard,
    "search-form": SearchForm,
    "canned-search-button": CannedSearchButton,
    "compare-drawer": CompareDrawer,
    "canned-search-container": CannedSearchContainer,
    "compare-header": CompareHeader,
    "share": Share,
    "name-autocomplete": NameAutocomplete
  },
  mixins:[URLHistory,PrepareParams],
  props: {
    "page-permalink": String,
    states: Array,
    programs: Array,
    religiousAffiliations: Array,
    specializedMission: Object,
    defaultSort: {
      type: String,
      default: "completion_rate:desc"
    },
    isLoading: Boolean,
    compareSchools: Array
  },
  data() {
    return {
      showSidebar: true,
      sidebar: {
        fixed: false,
        absolute: true
      },
      results: {
        schools: [],
        meta: {
          total: 0
        }
      },
      input: {
        sort: null,
        page: 1
      },
      urlParsedParams: {},
      utility: {
        formDefault: {},
        initailized: false,
        sortFAB: null,
      },
      error: {
        message: null
      },
      showCompare: false,
      sorts: [
        { type: "Name", field: "name:asc" },
        { type: "Annual Cost", field: "avg_net_price:asc" },
        { type: "Graduation Rate", field: "completion_rate:desc" }
      ],
      shareUrl: null
    };
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input);

    this.urlParsedParams = this.parseURLParams();

    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort;

    // if Page is in the url, add it here.
    this.input.page = this.urlParsedParams.page
      ? Number(this.urlParsedParams.page) + 1
      : 1;

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function(params) {
      this.searchAPI(params, true);
    }, 1000);
  },
  mounted() {},
  computed: {
    totalPages() {
      if (this.results.meta.per_page && this.results.meta.total) {
        let totalPages = this.results.meta.total / this.results.meta.per_page;

        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages);
      }
    }
  },
  methods: {
    searchAPI(params = {}) {
      // TODO - Clean this method up, It does way more than just SearchAPI.
      // Better Encapsilation.

      this.$emit("loading", true);

      this.error.message = null;

      let poppingState = false;
      let alreadyLoaded = false;

      // Add page and sort items into params.
      if (this.input.page >= 1) {
        // The API function off of a 0 index
        params.page = this.input.page - 1;
      }

      params.sort = this.input.sort;

      // TODO - Remove old call if not needed.
      // let query = picc.form.prepareParams(params);
      let query = this.prepareParams(params);

      query.fields = [
        // we need the id to link it
        fields.ID,
        // basic display fields
        fields.NAME,
        fields.CITY,
        fields.STATE,
        fields.SIZE,
        fields.BRANCHES,
        fields.LOCALE,
        // to get "public" or "private"
        fields.OWNERSHIP,
        // to get the "four_year" or "lt_four_year" bit
        fields.PREDOMINANT_DEGREE,
        // program-reporter offered programs / flag
        fields.PROGRAM_REPORTER_OFFERED,
        // get all of the net price values
        fields.NET_PRICE,
        // completion rate
        fields.COMPLETION_RATE,
        // this has no sub-fields
        fields.MEDIAN_EARNINGS,
        // not sure if we need this, but let's get it anyway
        fields.EARNINGS_GT_25K,
        // under investigation flag
        fields.UNDER_INVESTIGATION,

        // new completion rates
        fields.COMPLETION_OM,
        fields.COMPLETION_200_4,
        fields.COMPLETION_200_LT4,

        fields.FIELD_OF_STUDY
      ].join(",");

      // TODO: Need to remove this when API
      // is processing requests better
      query['all_programs_nested'] = true;
      
      let qs = this.generateQueryString(params);
      history.replaceState(params, "search", qs);

      this.addURLToStorage(qs);

      // TODO Remove if needed.
      let vm = this;

      let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
        console.log("loaded schools:", response.data);
        
        this.results.schools = response.data.results;
        this.results.meta = response.data.metadata;

        this.$emit("loading", false);
        this.shareUrl = window.location.href;
      }).catch((error) => {
        console.warn("Error fetching search.");
        this.$emit("loading", false);
        
        if(error.response.data.errors){
          this.showError(error.response.data.errors[0]);
        }
      });
      
      // let req = picc.API.search(query, function(error, data) {
      //   if (error) {
      //     vm.$emit("loading", false);
      //     vm.showError(error);
      //     return;
      //   }

      //   console.log("loaded schools:", data);

      //   vm.results.schools = data.results;
      //   vm.results.meta = data.metadata;

      //   vm.$emit("loading", false);
      //   vm.shareUrl = window.location.href;
      // });
    },
    showError(error) {
      // TODO: Loop through multiple error messages if needed.
      console.error("error:", error);

      if(error.message){
        this.error.message = error.message
      }else{
        this.error.message = "There was an unexpected API error.";
      }

      // if (typeof error.responseText != "undefined") {
      //   // 500 doesn't have JSON text return.
      //   if (error.status === 500) {
      //     this.error.message = "There was an unexpected API error.";
      //   } else {
      //     var errorText = JSON.parse(error.responseText);
      //     error = errorText.errors[0].message;

      //     this.error.message =
      //       String(error) || "There was an unexpected API error.";
      //   }
      // }
    },
    handleToggleCompareSchool(school) {
      this.$emit("toggle-compare-school", school);
    },
    handleCannedSearchClick(cannedSearchData) {
      if (cannedSearchData) {
        this.urlParsedParams = this.parseURLParams(
          this.generateQueryString(cannedSearchData).substr(1)
        );
      }
    },
    isResultCardSelected(schoolId, compareSchools) {
      if (_.findIndex(compareSchools, ["schoolId", String(schoolId)]) >= 0) {
        return true;
      }
      return false;
    },
    parseURLParams(url = location.search.substr(1)) {
      let query = querystring.parse(url);

      return query || {};
    },
    generateQueryString(params) {
      let qs = querystring.stringify(params);
      return (
        "?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")
      );
    },
    resort(sort) {
      this.input.sort = sort;
      this.debounceSearchUpdate(this.parseURLParams());
    },
    closeModal(){
      this.showCompare = false;
    },
    clearSearchForm(){
      this.input = {
        page: 0,
        sort: this.defaultSort
      };
      
      EventBus.$emit('search-form-reset');
    }
  }
};
</script>