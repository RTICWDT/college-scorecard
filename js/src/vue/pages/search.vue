<style lang="scss">
  .canned-search-wrapper {
    margin-bottom: 8px;
  }

  .pageBar{
    background-color: rgba(255,255,255,0.7) !important;
  }

  .searchFab{
    z-index: 500 !important;
    bottom: 64px;
  }

  #search-fos-cip-warning{
    width: 100%;

    p{
      font-size: 13px;
      margin-bottom: 0;
    }

    @media (min-width: 960px){
      p{
        font-size: 14px;
      }
    }

    a{
      color: white !important;
    }

    @media (min-width: 960px){
      width: 60%;
    }
  }

  #search-fos-cip-filter-warning{
    p{
      font-size: 13px;
    }

    .v-alert__border{
      border-width: 6px;
    }

    .v-icon{
      font-size: 38px;
    }

    @media (min-width: 960px){
      p{
        font-size: 16px;
      }
    }

  }
</style>

<template>
  <div>
    <v-app id="search">

      <scorecard-header active-link="search"/>

      <!-- Search Form -->
      <v-navigation-drawer
        v-model="showSidebar"
        app
        width="300"
        class="searchSidebar"
        clipped
      >
        <div class="context-toggle-container pa-5 grey lighten-3">
          <h3 class="mb-2">
            Showing Results For:
          </h3>

          <context-toggle
            :display-toggle="displayToggle"
            :control-tab="controlTab"
            @context-switch-click="handleContextToggle"
            @context-tab-change="handleContextToggle"
          />
        </div>


        <!-- Search Form Component -->
        <search-form
          v-if="displayToggle === 'institutions'"
          :urlParsedParams="urlParsedParams"
          auto-submit
          display-all-filters
          @search-query="handleInstitutionSearch"
        />

        <!-- Search Fields of Study Component -->
        <search-fos-form
          v-else-if="displayToggle === 'fos'"
          :url-parsed-params="urlParsedParams"
          auto-submit
          @search-query="handleFieldOfStudySearch"
        />

      </v-navigation-drawer>

      <v-content>
        <v-container fluid class="pa-0">
          <div id="search-result-container" class='pa-sm-8 pa-2'>

            <div class="search-result-container">

              <!-- Search Result Info and controls -->
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
                            <span class='sr-only'>Clear Search</span>
                          </span>
                        </v-btn>
                        <v-btn
                          id="search-button-clear"
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
                          <v-btn id="search-button-sort" rounded color="primary" small v-on="on" class="d-none d-sm-inline">
                            <v-icon small class='mr-1'>fas fa-sort</v-icon> Sort
                          </v-btn>                          
                        </template>
                        <v-list min-width="200">
                          <v-list-item-group v-model="input.sort" color="primary">
                            <v-list-item
                              v-for="(item, index) in sorts"
                              :key="item.field"
                              @click="resort(item.field);"
                              :value="item.field"                              
                              
                            >
                              <v-list-item-title>{{ item.type }}</v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn rounded color="primary" x-small v-on="on" fab class="d-inline d-sm-none">
                            <v-icon small class=''>fas fa-sort</v-icon>
                            <span class='sr-only'>Sort</span>
                          </v-btn>
                        </template>
                        <v-list min-width="200">
                          <v-list-item-group v-model="input.sort" color="primary">
                            <v-list-item
                              v-for="(item, index) in sorts"
                              :key="item.field"
                              @click="resort(item.field);"
                              :value="item.field"
                            >
                              <v-list-item-title>{{ item.type }}</v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                       <share :url="shareUrl" label="Share" small show-copy :hide="['email']" />
                      </p>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="5" class="py-1 px-1" v-if="!isLoading && results.schools.length > 0">
                    <div class="text-md-right">
                      <v-pagination
                        v-model="input.page"
                        :length="totalPages"
                        :total-visible="7"
                        @input="handlePaginationInput"
                        class='pr-0 mr-0'
                        circle
                      ></v-pagination>
                    </div>
                  </v-col>

                </v-row>
              </v-card>

              <!-- Canned Search Container -->
              <div id="search-can-query-container" v-if="!isLoading && results.schools.length === 0">
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

              <!-- Main Search Results -->
              <div class="results-main-alert">

                <!-- Loading -->
                <div class="show-loading mt-2" v-show="isLoading">
                  <v-card class="py-4 px-4 pageBar">
                    <h1 class="title">
                      Loading
                      <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                    </h1>
                  </v-card>
                </div>

                <!-- Search Query Error-->
                <div class="show-error" v-show="error.message">
                  <h1>Something went wrong:</h1>
                  <p class="error-message">{{error.message}}</p>
                </div>

                <!-- Field Of Study CIP 4 Information -->
                <div v-if="displayToggle === 'fos' && !isLoading"
                  id="search-fos-cip-warning"
                   class="my-2"
                >
                  <p class="white--text">
                    <strong>Note:</strong> Field of Study titles are based on the US Department of Education's
                    Classification of Instructional Programs (CIP) and may not match the program titles at a
                    given school. <a target="_blank" href="https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56">Learn more about CIP.</a>
                  </p>
                </div>

                <!-- Field of Study Filter Warning -->
                <v-alert v-if="showFieldOfStudyWarning"
                  id="search-fos-cip-filter-warning"
                  type="warning"
                  color="#D16E00"
                  class="mt-4 mb-2 pa-4"
                  colored-border
                  border="left"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      <v-icon class="warning-orange">mdi mdi-exclamation</v-icon>
                    </div>
                  </template>

                  <h4 if="fieldOfStudyRangeFiltersHidingCount > 0">
                    {{fieldOfStudyRangeFiltersHidingCount}} institutions hidden<br/>
                  </h4>

                  <p class="mb-0">The filter you've selected contains <strong>limited data</strong>. Displayed search results only
                  represent schools for which there is sufficient data.  To see all schools within this field of study,
                  clear search filters.</p>
                </v-alert>

                <!-- Institution Results -->
                <div class="search-result-cards-container" v-if="!isLoading">
                  <!-- Institution Results -->
                  <v-row v-if="displayToggle === 'institutions'">
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

                  <!-- Fields of Study Results -->
                  <v-row v-else>
                    <v-col
                      v-for="school in results.schools"
                      :key="school.id"
                      cols="12"
                      lg="12"
                      md="12"
                      sm="12"
                      class="d-flex align-stretch"
                    >
                      <fos-result-card
                        :school="school"
                        :selected-fields-of-study="compareFieldsOfStudy"
                        @toggle-compare-item="handleToggleCompareItem"
                      />
                    </v-col>

                  </v-row>
                </div>

                <!-- Field of Study Results -->
                <div class="search-result-cards-container" v-else>

                </div>
              </div>

              <!-- Bottom Pagination -->
              <v-card class="mt-4 mb-2 py-1 px-4 pageBar elevation-0"  v-if="!isLoading && results.schools.length > 0">
                <v-row>
                  <v-col cols="12" class='pa-1'>
                    <div class="text-right">
                      <v-pagination
                        v-model="input.page"
                        :length="totalPages"
                        :total-visible="7"
                        @input="handlePaginationInput"
                        circle
                      ></v-pagination>
                     
                    </div>
                  </v-col>
                </v-row>
              </v-card>

            </div>
          </div>

          <!-- Floating Mobile Search Button -->
          <v-btn
            fab
            fixed
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

      <compare-header
        :showCompare.sync="showCompare"
        :schools="compareSchools"
        :fields-of-study="compareFieldsOfStudy"
      />
      <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
        <compare-drawer
          :schools="compareSchools"
          :fields-of-study="compareFieldsOfStudy"
          @toggle-compare-school="handleToggleCompareItem"
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
import ContextToggle from '../../components/vue/ContextToggle.vue';
import SearchFieldsOfStudyForm from '../../components/vue/SearchFieldsOfStudyForm.vue';
import FieldOfStudyResultCard from '../../components/vue/FieldOfStudyResultCard.vue';
import { compare } from "vue/mixins.js";

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
    "name-autocomplete": NameAutocomplete,
    'context-toggle': ContextToggle,
    'search-fos-form': SearchFieldsOfStudyForm,
    'fos-result-card': FieldOfStudyResultCard
  },
  mixins:[URLHistory, PrepareParams, compare],
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
    compareSchools: Array,
    compareFieldsOfStudy: Array
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
        previousParams:{}
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
      shareUrl: null,
      displayToggle: 'institutions',
      controlTab: 1,
      fieldOfStudyTotalCountWithoutRangeFilters: 0
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

    // Set Toggle Value - Default to institutions
    if(typeof this.urlParsedParams.toggle === 'undefined' || this.urlParsedParams.toggle === 'institutions' ){
      this.displayToggle = 'institutions';
      this.controlTab = 0;
    }else{
      this.displayToggle = 'fos';
      this.controlTab = 1;
    }

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function(params) {
      // this.searchAPI(params, true);
      if(this.displayToggle === 'institutions'){
        this.handleInstitutionSearch(params);
      }else{
        this.handleFieldOfStudySearch(params);
      }
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
    },
    showFieldOfStudyWarning(){
      if(this.displayToggle !== 'fos'){
        return false;
      }

      if(this.isLoading){
        return false;
      }

      if(typeof this.utility.previousParams.fos_salary != 'undefined' || typeof this.utility.previousParams.fos_debt != 'undefined'){
        return true;
      }
    },
    fieldOfStudyRangeFiltersHidingCount(){
      // Total count minus showing count.
      if(this.fieldOfStudyTotalCountWithoutRangeFilters > 0 && this.results.meta.total > 0){
        return this.fieldOfStudyTotalCountWithoutRangeFilters - this.results.meta.total;
      }else{
        return 0;
      }
    }
  },
  methods: {
    searchAPI(params = {}, returnFields = [], allPrograms = true) {
      // TODO - Clean this method up, It does way more than just SearchAPI.
      // Better Encapsulation.

      this.$emit("loading", true);

      this.error.message = null;

      // let poppingState = false;
      // let alreadyLoaded = false;

      //Add page and sort items into params.
      if(params.page === 0){
        // Reset page when passed 0
        this.input.page = 1;
      }else if (this.input.page >= 1) {
        // Use local page counter;
        // The API function off of a 0 index;
        params.page = this.input.page - 1;
      }

      params.sort = this.input.sort;

      let query = this.prepareParams(params);

      query.fields = returnFields;

      //Ensure that toggle is not sent to API
      if(query.toggle){
        delete query.toggle;
      }

      // TODO: Need to remove this when API
      // is processing requests better
      if(allPrograms){
        query['all_programs_nested'] = true;
      }

      // Add toggle value + params
      let qs = this.generateQueryString({
        ...params,
        toggle: this.displayToggle
      });

      history.replaceState(params, "search", qs);

      this.addURLToStorage(qs);

      let request = apiGet(window.api.url, window.api.key, "/schools", query).then((response) => {
        console.log("loaded schools:", response.data);
        
        this.results.schools = response.data.results;
        this.results.meta = response.data.metadata;

        this.$emit("loading", false);
        this.shareUrl = window.location.href;
      }).catch((error) => {
        console.warn("Error fetching search.");
        this.$emit("loading", false);
        
        this.results = {
          meta: {},
          schools:[]
        };

        if(error.response.data.errors){
          this.showError(error.response.data.errors[0]);
        }else if(error.response.status === 500){
          this.showError("API 500 Error");
        }
      });
    },
    queryAPI(params={}){
      // Generic API Query Method that returns API results
      let query = this.prepareParams(params);

      return apiGet(window.api.url, window.api.key, "/schools", query);
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
        page: 1,
        sort: this.defaultSort
      };

      this.urlParsedParams = {};
      
      EventBus.$emit('search-form-reset');
    },
    handleContextToggle(toggleValue){
      this.clearSearchForm();
      this.controlTab = toggleValue;
      this.displayToggle = (toggleValue === 0)? 'institutions' : 'fos';
      this.results.schools = []
      this.results.meta = {
        total: 0
      }
      // TODO - What happens to search filters?
    },
    handleInstitutionSearch(params){
      let returnFields = [
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

      this.searchAPI(params, returnFields);
    },
    handleFieldOfStudySearch(params){
      // TODO - refine fields
      let returnFields = [
        fields.ID,
        // basic display fields
        fields.NAME,
        fields.CITY,
        fields.STATE,
        fields.SIZE,
        // Degree size
        fields.PREDOMINANT_DEGREE,
        // to get "public" or "private"
        fields.OWNERSHIP,
        // under investigation flag
        fields.UNDER_INVESTIGATION,
        fields.LOCALE,
        fields.FIELD_OF_STUDY
      ].join(',');

      console.log("Searching FOS");
      console.log(params);

      // Do we need the second query?
      if(Object.keys(params).includes('fos_salary') || Object.keys(params).includes('fos_debt')){
        console.log("Will Second Query");

        // Strip arguments from params to get actual count
        let filteredParams = _.omit(params,['fos_salary','fos_debt']);

        let query = this.queryAPI(filteredParams);

        query.then((response)=>{
          // Store count for alteration
          this.fieldOfStudyTotalCountWithoutRangeFilters = response.data.metadata.total;
        }).catch((error) => {
          // TODO - What does the error look like?
          this.fieldOfStudyTotalCountWithoutRangeFilters = 0;
        });
      }

      // Cache params to power other content
      this.utility.previousParams = params;

      this.searchAPI(params, returnFields, false);
    },
    handlePaginationInput(){
      if(this.displayToggle === 'fos'){
        this.handleFieldOfStudySearch(this.parseURLParams());
      }else{
        this.handleInstitutionSearch(this.parseURLParams());
      }
    }
  }
};
</script>