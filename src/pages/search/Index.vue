<style lang="scss" scoped>
@import "~/sass/_variables.scss";
.dolflag-chip {
  height: auto !important;
  font-size: 16px;
  white-space: normal;
  a {
    color: rgba(0, 0, 0, 0.87) !important;
  }
}
#search-institutions-dolflag {
  width: 100%;
}
.container--fluid {
  max-width: none !important;
}

.tab-card {
  border: none;
}
</style>

<template>
  <div>
    <v-main>
      <v-card tile class="tab-card">
        <search-tabs :selected="0" />
      </v-card>
      <div class="bg-blue">
        <v-container fluid>
          <v-row
            ><v-col class="pa-sm-10 pa-5">
              <h1>Search Schools</h1>
              <p>
                Search schools that might be a good fit, and add to your compare
                list to see how they match up.
              </p></v-col
            ></v-row
          >
        </v-container>
      </div>
      <v-container
        fluid
        class="white elevation-2"
        style="z-index:50; position:relative"
      >
        <v-row>
          <v-col>
            <v-card flat class="white d-sm-flex align-center">
              <div class="mx-1 mx-sm-3 search-label">School:</div>
              <name-autocomplete
                @school-name-selected="handleSchoolNameSelected"
                :initial_school="input.search"
                @school-name-cleared="handleSchoolNameSelected"
                :dense="true"
              />

              <div class="mx-1 mx-sm-3 mt-3 my-sm-0  search-label" id="location-label">
                Location:
              </div>
              <location-institution-search
                @search-query="handleLocationSelection"
                :initial_state="input.state"
                :initial_zip="input.zip"
                :initial_distance="input.distance"
                :horizontal="true"
              />
              <v-btn
                outlined
                class="ml-sm-auto mx-sm-3 my-3 my-sm-0 float-right float-sm-none toggle-sidebar"
                @click="showSidebar = !showSidebar"
              >
                <v-icon small class="pr-1">fas fa-sliders-h</v-icon>
                {{ showSidebar ? "Hide" : "Show" }} Filters
              </v-btn>
            </v-card>
          </v-col></v-row
        >
      </v-container>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col
            cols="3"
            xl="2"
            :class="{ 'd-none': !showSidebar }"
            class="pr-0"
          >
            <v-navigation-drawer
              v-model="showSidebar"
              :width="$vuetify.breakpoint.smAndDown ? '250' : 'auto'"
              class="searchSidebar elevation-0 pr-0"
              :absolute="$vuetify.breakpoint.smAndDown"
              :temporary="$vuetify.breakpoint.smAndDown"
              :hide-overlay="$vuetify.breakpoint.smAndUp"
            >
              <div class="pa-6">
                <a
                  class="float-right close-filter"
                  @click="showSidebar = !showSidebar"
                >
                  &lt; Close filters</a
                >
                <h2>
                  More Filters
                </h2>
              </div>
              <!-- Search Form Component -->
              <search-form
                :urlParsedParams="urlParsedParams"
                auto-submit
                display-all-filters
                @search-query="handleInstitutionSearch"
                :hideLocation="true"
              />
            </v-navigation-drawer> </v-col
          ><v-col :cols="showSidebar ? 9 : 12" xl="10" class="pa-6 pa-sm-8`">
            <div id="search-result-container">
              <div class="search-result-container">
                <!-- Search Result Info and controls -->
                <v-card
                  class="mt-2 mb-4 py-4 px-4 elevation-0 pageBar"
                  v-show="!isLoading"
                >
                  <v-row class="">
                    <v-col cols="12" sm="7" class="py-2 px-4">
                      <div id="search-result-info-count" class>
                        <p class="title mb-0">
                          {{ results.meta.total | separator }} Results

                          <v-btn
                            id="search-button-clear"
                            @click="clearSearchForm"
                            small
                            outlined
                            class=" d-sm-inline mr-3 searchbtn ml-2"
                            elevation="1"
                          >
                            <span>
                              <v-icon small class="mr-1"
                                >mdi-close-circle</v-icon
                              >
                              Reset Filters
                            </span>
                          </v-btn>

                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                id="search-button-sort"
                                small
                                v-on="on"
                                outlined
                                class="mr-3 searchbtn"
                                elevation="1"
                              >
                                <v-icon small class="mx-1">fas fa-sort</v-icon>
                                Sort: {{ sorts.find(el => el.field === input.sort).type }}
                              </v-btn>
                            </template>
                            <v-list min-width="200">
                              <v-list-item-group
                                v-model="input.sort"
                                color="primary"
                                mandatory
                              >
                                <v-list-item
                                  v-for="(item, index) in sorts"
                                  :key="item.field"
                                  @click="resort(item.field)"
                                  :value="item.field"
                                >
                                  <v-list-item-title>{{
                                    item.type
                                  }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>

                          <share
                            :url="encodeURI(shareUrl)"
                            label="Share"
                            small
                            show-copy
                            :hide="['email']"
                            color="#eff1f5"
                          />
                        </p>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="5"
                      class="py-1 px-1"
                      v-show="!isLoading && results.schools.length > 0"
                    >
                      <div class="d-block text-right">
                        <v-pagination
                          v-model="displayPage"
                          :length="totalPages"
                          :total-visible="7"
                          @input="handlePaginationInput"
                          class="pr-0 mr-0 justify-end text-right"
                        ></v-pagination>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Instituition Information -->
                <div
                  v-if="!isLoading && this.displayFlag"
                  id="search-institutions-dolflag"
                  class="my-2"
                >
                  <v-row>
                    <v-col cols="12" sm="6" md="6" class="">
                      <v-chip
                        class="dolflag-chip pa-3"
                        close
                        label
                        @click:close="handleDOLFlag"
                        ><span
                          >Only show schools that have programs that qualify for
                          the Department of Labor's WIOA program.<tooltip
                            definition="wioa-participants"/></span
                      ></v-chip>
                    </v-col>
                    <v-col cols="12" sm="6" md="" class="">
                      <v-card outlined class="pa-3">
                        Learn more about the Department of Labor's WIOA program
                        at
                        <a
                          target="_blank"
                          href="https://collegescorecard.ed.gov/training"
                        >
                          CollegeScorecard.ed.gov/training.
                        </a>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- No Results/Canned Search/ -->
                <div
                  id="search-can-query-container"
                  v-if="!isLoading && results.schools.length === 0"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-card outlined class="pa-5">
                        <h3>Show Me Options</h3>
                        <p>
                          Select one or more options below to create a list of
                          schools that fit your needs.
                        </p>
                        <canned-search-container
                          @canned-search-submit="handleCannedSearchClick"
                        ></canned-search-container>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Main Search Results -->
                <div class="results-main-alert">
                  <!-- Loading -->
                  <div class="show-loading mt-2" v-show="isLoading">
                    <v-card class="py-4 px-4 pageBar elevation-0">
                      <h1 class="title">
                        Loading
                        <v-icon color="#00365e"
                          >fas fa-circle-notch fa-spin</v-icon
                        >
                      </h1>
                    </v-card>
                  </div>

                  <!-- Search Query Error-->
                  <div class="show-error" v-show="error.message">
                    <h1>Something went wrong:</h1>
                    <p class="error-message">{{ error.message }}</p>
                  </div>

                  <!-- Institution Results -->
                  <div class="search-result-cards-container" v-if="!isLoading">
                    <!-- Institution Results -->
                    <v-row>
                      <v-col
                        v-for="school in results.schools"
                        :key="school.id"
                        cols="12"
                        xl="2"
                        lg="3"
                        md="4"
                        sm="6"
                        class="d-flex align-stretch"
                      >
                        <search-result-card :school="school" />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Field of Study Results -->
                  <div class="search-result-cards-container" v-else></div>
                </div>

                <!-- Bottom Pagination -->
                <v-card
                  class="mt-4 mb-2 py-1 px-4 pageBar elevation-0"
                  v-if="!isLoading && results.schools.length > 0"
                >
                  <v-row>
                    <v-col cols="12" class="py-3 px-3">
                      <div class="text-left text-sm-right">
                        <v-pagination
                          v-model="displayPage"
                          :length="totalPages"
                          :total-visible="7"
                          @input="handlePaginationInput"
                          class="pr-0 mr-0"
                        ></v-pagination>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!--End of root -->
  </div>
</template>

<script>
// TODO - This needs major cleanup.  How can it be cleaned?, Seperate files for legacy Javascript items?

import SearchResultCard from "~/components/SearchResultCard.vue"
import SearchForm from "~/components/SearchForm.vue"
import CannedSearchButton from "~/components/CannedSearchButton.vue"
import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
import Share from "~/components/Share.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import URLHistory from "~/js/mixins/URLHistory.js"
import PrepareParams from "~/js/mixins/PrepareParams.js"
import SearchFieldsOfStudyForm from "~/components/SearchFieldsOfStudyForm.vue"
import FieldOfStudyResultCard from "~/components/FieldOfStudyResultCard.vue"
import Tooltip from "~/components/Tooltip.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import { SiteData } from "~/js/mixins/SiteData.js"
import LocationCheck from "~/js/mixins/LocationCheck.js"
import LocationInstitutionSearch from "~/components/LocationInstitutionSearch.vue"
import _ from "lodash"
import { apiGet } from "~/js/api.js"
import { fields } from "~/js/constants.js"
import SearchTabs from "~/components/SearchTabs.vue"

const querystring = require("querystring")

export default {
  components: {
    "search-result-card": SearchResultCard,
    "search-form": SearchForm,
    "canned-search-button": CannedSearchButton,
    "canned-search-container": CannedSearchContainer,
    share: Share,
    "name-autocomplete": NameAutocomplete,
    tooltip: Tooltip,
    NameAutocomplete,
    LocationInstitutionSearch,
    SearchTabs,
  },
  mixins: [URLHistory, PrepareParams, AnalyticsEvents, SiteData, LocationCheck],
  props: {
    "page-permalink": String,
    states: Array,
    programs: Array,
    religiousAffiliations: Array,
    specializedMission: Object,
    defaultSort: {
      type: String,
      default: "threshold_earnings:desc",
    },
    isLoading: Boolean,
    compareSchools: Array,
    compareFieldsOfStudy: Array,
  },
  data() {
    return {
      showSidebar: true,
      sidebar: { fixed: false, absolute: true },
      results: {
        schools: [],
        meta: {
          total: 0,
        },
      },
      input: {
        sort: null,
        page: 1,
      },
      urlParsedParams: {},
      utility: {
        formDefault: {},
        initailized: false,
        sortFAB: null,
        previousParams: {},
      },
      error: {
        message: null,
      },
      showCompare: false,
      sorts: [
        { type: "Name", field: "name:asc" },
        { type: "Annual Cost", field: "avg_net_price:asc" },
        { type: "Graduation Rate", field: "completion_rate:desc" },
        {
          type: "% Earning More Than a High School Grad",
          field: "threshold_earnings:desc",
        },
      ],
      shareUrl: null,
      fieldOfStudyTotalCountWithoutRangeFilters: 0,
      displayFlag: false,
      displayPage: 1,
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
      },
    }
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input)

    this.urlParsedParams = this.parseURLParams()
    this.input = this.urlParsedParams
    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort

    // if Page is in the url, add it here.
    this.input.page = this.urlParsedParams.page
      ? Number(this.urlParsedParams.page) + 1
      : 1

    if (
      typeof this.urlParsedParams.dolflag === "undefined" ||
      this.urlParsedParams.dolflag === "false"
    ) {
      this.displayFlag = false
    } else {
      this.displayFlag = true
    }

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function(params) {
      this.handleInstitutionSearch(params)
    }, 1000)
  },

  computed: {
    totalPages() {
      if (this.results.meta.per_page && this.results.meta.total) {
        let totalPages = this.results.meta.total / this.results.meta.per_page

        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages)
      }
    },
  },
  methods: {
    async searchAPI() {
      // TODO - Clean this method up, It does way more than just SearchAPI.
      // Better Encapsulation.

      // remove null/empty values from the input
      this.input = Object.fromEntries(
        Object.entries(this.input).filter(([_, v]) => v != null)
      )

      let params = this.input

      this.$emit("loading", true)

      this.error.message = null

      if (
        typeof params["dolflag"] === "undefined" ||
        params["dolflag"] === "false"
      ) {
        this.displayFlag = false
      } else {
        this.displayFlag = true
      }

      //Add page and sort items into params.
      params.page = this.input.page ? this.input.page - 1 : 0
      params.sort = this.input.sort ? this.input.sort : this.defaultSort

      let query = this.prepareParams(params)

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
        fields.COMPLETION_150_4,
        fields.COMPLETION_150_LT4,

        fields.FIELD_OF_STUDY,
      ].join(",")

      //Ensure that toggle is not sent to API
      if (query.toggle) {
        delete query.toggle
      }

      query["all_programs_nested"] = true

      // Add toggle value + params
      let qs = this.generateQueryString({
        ...params,
      })

      history.replaceState(params, "search", qs)

      this.addURLToStorage(qs)

      await apiGet("/schools", query)
        .then((response) => {
          this.results.schools = response.data.results
          this.results.meta = response.data.metadata

          this.$emit("loading", false)
          this.shareUrl = window.location.href
        })
        .catch((error) => {
          console.warn("Error fetching search.")
          this.$emit("loading", false)

          this.results = {
            meta: {},
            schools: [],
          }
          if (error == "Error: Request aborted") {
          } else if (error.response.data.errors) {
            this.showError(error.response.data.errors[0])
          } else if (error.response.status === 500) {
            this.showError("API 500 Error")
          }
        })
    },

    showError(error) {
      // TODO: Loop through multiple error messages if needed.
      console.error("error:", error)

      if (error.message) {
        this.error.message = error.message
      } else {
        this.error.message = "There was an unexpected API error."
      }
    },

    parseURLParams(url) {
      if (!url && process.isClient) {
        url = location.search.substr(1)
      }
      let query = querystring.parse(url)

      return query || {}
    },
    generateQueryString(params) {
      let qs = querystring.stringify(params)
      return (
        "?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")
      )
    },
    resort(sort) {
      this.input.sort = sort
      var params = this.parseURLParams()
      params.sort = this.input.sort
      this.debounceSearchUpdate(params)
    },
    clearSearchForm() {
      this.input = {
        page: 1,
        sort: this.defaultSort,
      }
      this.urlParsedParams = {}
      this.$root.$emit("search-form-reset")
    },

    handleInstitutionSearch(params) {
      // merge the search form in with the existing input
      this.input = { ...params }

      // reset the page to the start
      this.input.page = 1
      this.searchAPI()
    },

    handleCannedSearchClick(cannedSearchData) {
      this.input = cannedSearchData
      this.input.page = 1
      this.searchAPI()
      this.urlParsedParams = this.parseURLParams()
    },

    handleLocationSelection(params) {
      this.input = { ...this.input, ...params }
      this.input.page = 1
      this.searchAPI()
    },
    handlePaginationInput(page) {
      this.input.page = page
      this.searchAPI()
    },

    handleDOLFlag() {
      this.urlParsedParams = this.parseURLParams()
      delete this.urlParsedParams.dolflag
      this.debounceSearchUpdate(this.urlParsedParams)
      this.$root.$emit("reset-dol-flag")
    },

    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        this.input.search = school
      } else {
        this.input.search = school["school.name"]
      }
      // reset page
      this.input.page = 1
      this.searchAPI()
    },
  },
  metaInfo: {
    title: "Search Schools",
    meta: [
      {
        key: "og:title",
        name: "og:title",
        content: "Search | College Scorecard",
      },
      {
        key: "twitter:title",
        name: "twitter:title",
        content: "Search | College Scorecard",
      },
    ],
  },
}
</script>
