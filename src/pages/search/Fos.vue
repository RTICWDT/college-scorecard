<style lang="scss" scoped>
@import "~/sass/_variables";

#search-fos-cip-warning,
#search-institutions-dolflag {
  width: 100%;

  p {
    font-size: 13px;
    margin-bottom: 0;
  }

  @media (min-width: 960px) {
    p {
      font-size: 14px;
    }
  }

  a {
    color: white !important;
  }
  .dolflag-chip a {
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

#search-fos-cip-filter-warning {
  p {
    font-size: 13px;
  }

  .v-alert__border {
    border-width: 6px;
  }

  .v-icon {
    font-size: 38px;
  }

  @media (min-width: 960px) {
    p {
      font-size: 16px;
    }
  }
}
.container--fluid {
  max-width: none !important;
}
</style>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";
.dolflag-chip {
  height: auto !important;
  white-space: normal;
  padding: 18px;
  margin-right: 30px;
}
</style>

<template>
  <div>
    <!-- Search Form -->

    <v-main>
      <v-card tile>
        <search-tabs :selected="1" />
      </v-card>
      <div class="bg-blue">
        <v-container fluid>
          <v-row
            ><v-col class="pa-10">
              <h1>Search Fields of Study</h1>

              <p>
                Search and compare the fields of study offered at each college
                by degree type.
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
            <v-card flat class="white d-flex align-center">
              <div class="mx-3">Field of Study:</div>
              <!-- Field Of Study Search and Chips -->
              <div id="fos-search-and-chips">
                <field-of-study-search
                  @field-of-study-selected="handleFieldOfStudySelected"
                  id="fos-search"
                  name="fos-search"
                  :disabled="cipSelectionLimitReached"
                  :dense="true"
                  :rules="[utility.rules.required]"
                >
                </field-of-study-search>

                <p
                  v-if="cipSelectionLimitReached && 0"
                  class="mb-0 mt-2 warning-orange text-center"
                >
                  You may only select one Field of Study
                </p>

                <div
                  id="fos-chip-container"
                  class="mt-2"
                  v-if="utility.cip4Cache.length > 0 && 0"
                >
                  <field-of-study-detail-chip
                    v-for="fieldOfStudy in utility.cip4Cache"
                    :key="fieldOfStudy.cip4"
                    :field-of-study="fieldOfStudy"
                    :cip-six-items="findAllCip6fromCip4(fieldOfStudy.cip4)"
                    @chip-close="handleFieldOfStudyChipClose"
                  />
                </div>
              </div>
              <div class="mx-3" id="location-label">Degree Type:</div>
              <!-- Credential Type -->
              <div class="">
                <v-select
                  v-model="input.cip4_degree"
                  :items="fosDegrees"
                  item-text="label"
                  item-value="value"
                  dense
                  outlined
                  hide-details
                  placeholder="Select one"
                  :rules="[utility.rules.required]"
                >
                </v-select>
              </div>

              <v-btn class="mx-3" @click="showSidebar = !showSidebar">
                <v-icon small class="pr-1">fas fa-sliders-h</v-icon>
                {{ showSidebar ? "Hide" : "Show" }} Filters
              </v-btn>
            </v-card>
          </v-col></v-row
        >
      </v-container>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="3" :class="{ 'd-none': !showSidebar }" class="pr-0">
            <v-navigation-drawer
              v-model="showSidebar"
              :width="$vuetify.breakpoint.smAndDown ? '250' : 'auto'"
              class="searchSidebar elevation-0 pr-0"
              :absolute="$vuetify.breakpoint.smAndDown"
              :temporary="$vuetify.breakpoint.smAndDown"
              :hide-overlay="$vuetify.breakpoint.smAndUp"
            >
            <div class="pl-6 pt-6 pr-6">
              <h2 class="float-left">More Filters</h2>
              <a class="float-right close-filter" @click="showSidebar = !showSidebar"> &lt; Close filters</a>
          </div>            
              <!-- Search Fields of Study Component -->
              <search-fos-form
                :url-parsed-params="urlParsedParams"
                auto-submit
                @search-query="handleFieldOfStudySearch"
              />
            </v-navigation-drawer> </v-col
          ><v-col :cols="showSidebar ? 9 : 12" class="pa-10">
            <div v-if="!isLoading">
              <h2>{{ selectedFoSLabel }}</h2>
              <!-- <div v-if="showDescription">
                A program that prepares individuals to practice the profession
                of accounting and to perform related business functions.
                Includes instruction in accounting principles and theory,
                financial accounting, managerial accounting, cost accounting,
                budget control, tax accounting, legal aspects of accounting,
                auditing, reporting procedures, statement analysis, planning and
                consulting, business information systems, accounting research
                methods, professional standards and ethics, and applications to
                specific for-profit, public, and non-profit organizations.
              </div>
              <div class="py-8">
                <a
                  v-if="!showDescription"
                  v-on:click="showDescription = true"
                  class="pt-8 text-underline"
                  >Show Description</a
                >
                <a
                  v-else
                  v-on:click="showDescription = false"
                  class="pt-8 text-underline"
                  >Hide Description</a
                >
              </div> -->
            </div>
            <div id="search-result-container">
              <div class="search-result-container">
                <!-- Search Result Info and controls -->
                <v-card
                  class="mt-2 mb-4 py-4 px-4 elevation-0 pageBar mb-10"
                  v-show="!isLoading"
                >
                  <v-row class="">
                    <v-col cols="12" sm="7" class="py-2 px-4">
                      <div id="search-result-info-count" class>
                        <p class="title mb-0">
                          {{ results.meta.total | separator }} Results
                          <v-btn
                            color="primary"
                            text-color="white"
                            @click="clearSearchForm"
                            x-small
                            fab
                            class="d-inline d-sm-none mr-2"
                          >
                            <span>
                              <v-icon class="">mdi-close-circle</v-icon>
                              <span class="sr-only">Clear Search</span>
                            </span>
                          </v-btn>

                          <v-btn
                            id="search-button-clear"
                            @click="clearSearchForm"
                            small
                            class="d-none d-sm-inline mr-1"
                            outlined
                          >
                            <span>
                              <v-icon small class="mr-1"
                                >mdi-close-circle</v-icon
                              >
                              Clear
                            </span>
                          </v-btn>

                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                id="search-button-sort"
                                small
                                v-on="on"
                                class="d-none d-sm-inline mr-1"
                                outlined
                              >
                                <v-icon small class="mx-1">fas fa-sort</v-icon>
                                Sort
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
                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="primary"
                                x-small
                                v-on="on"
                                fab
                                class="d-inline d-sm-none"
                              >
                                <v-icon small class="">fas fa-sort</v-icon>
                                <span class="sr-only">Sort</span>
                              </v-btn>
                            </template>
                            <v-list min-width="200">
                              <v-list-item-group
                                v-model="input.sort"
                                color="primary"
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
                      <div class="text-md-right justify-end">
                        <v-pagination
                          flat
                          v-model="input.page"
                          :length="totalPages"
                          :total-visible="7"
                          @input="handlePaginationInput"
                          class="pr-0 mr-0"
                        ></v-pagination>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Field Of Study CIP 4 Information -->
                <div id="search-fos-cip-warning" class="my-2">
                  <v-row>
                    <v-col
                      cols="12"
                      sm="5"
                      md="5"
                      class="py-1 pl-3 pr-1"
                      v-if="
                        displayToggle === 'fos' &&
                          !isLoading &&
                          this.displayFlag
                      "
                    >
                      <v-chip
                        class="dolflag-chip"
                        close
                        @click:close="handleDOLFlag"
                      >
                        <span
                          >Only show schools that have programs that qualify for
                          the Department of Labor's WIOA program.<tooltip
                            definition="wioa-participants"
                          />
                          <br />
                          Learn more about the Department of Labor's WIOA
                          program at
                          <a
                            target="_blank"
                            href="https://collegescorecard.ed.gov/training"
                          >
                            CollegeScorecard.ed.gov/training.
                          </a>
                        </span>
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="7"
                      md="7"
                      class="py-1 px-1"
                      v-if="displayToggle === 'fos'"
                    >
                      <p class="white--text pl-2">
                        <strong>Note:</strong> Field of Study titles are based
                        on the US Department of Education's Classification of
                        Instructional Programs (CIP) and may not match the
                        program titles at a given school.
                        <a
                          target="_blank"
                          :href="$url('/school/transition/')"
                          @click="
                            transitionOutboundLink(
                              $event,
                              'https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56'
                            )
                          "
                        >
                          Learn more about CIP<v-icon
                            x-small
                            color="white"
                            class="pl-1"
                          >
                            fas fa-external-link-alt
                          </v-icon>
                        </a>
                      </p>
                    </v-col>
                  </v-row>
                </div>

                <!-- No Results/Canned Search/ -->
                <div
                  id="search-can-query-container"
                  v-if="!isLoading && results.schools.length === 0"
                >
                  <v-row>
                    <v-col cols="12" v-if="displayToggle === 'fos'">
                      <v-card class="pa-5 text-center elevation-0">
                        <h3 class="text-center">No Results Found</h3>
                        <br />
                        <v-btn
                          id="search-button-clear-filters"
                          color="primary"
                          text-color="white"
                          @click="clearSearchForm"
                        >
                          <span>
                            <v-icon class="mr-2">mdi-close-circle</v-icon> Clear
                            Search Filters
                          </span>
                        </v-btn>
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
                    <v-card class="mx-auto pa-0 " style="width:100%" outlined>
                      <v-card-text class="pa-md-6">
                        <v-row
                          class="mb-2 py-4"
                          style="border-bottom:2px solid #eee"
                        >
                          <v-col class="py-md-0 " cols="12" md="3">
                            School
                            <i class="fa fa-sort" aria-hidden="true"></i>
                          </v-col>
                          <v-col class="py-md-0" cols="12" md="3">
                            Earnings
                            <i class="fa fa-sort" aria-hidden="true"></i>
                          </v-col>
                          <v-col class="py-md-0 " cols="12" md="3">
                            Debt
                            <i class="fa fa-sort" aria-hidden="true"></i>
                          </v-col>
                          <v-col class="py-md-0" cols="12" md="2">
                            Graduates
                            <i class="fa fa-sort" aria-hidden="true"></i>
                          </v-col>
                          <v-col class="py-md-0 pl-md-6" cols="12" md="1">
                            Compare
                          </v-col>
                        </v-row>
                        <!-- Fields of Study Results -->
                        <v-row>
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
                              :fos="school"
                              :selected-fields-of-study="compareFieldsOfStudy"
                              class="my-1 py-1"
                              style="border-bottom: 1px solid #E0E6F1"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
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
                      <div class="text-right">
                        <v-pagination
                          v-model="input.page"
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
          title="Search"
        >
          <v-icon>fas fa-search</v-icon>
        </v-btn>
      </v-container>
    </v-main>
    <!--End of root -->
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

.fa-stack {
  text-align: center;
}

.fa-stack .fa-caret-down {
  position: absolute;
  bottom: 0;
}

.fa-stack .fa-caret-up {
  position: absolute;
  top: 0;
}
</style>
<script>
import Share from "~/components/Share.vue"
import URLHistory from "~/js/mixins/URLHistory.js"
import PrepareParams from "~/js/mixins/PrepareParams.js"
import SearchFieldsOfStudyForm from "~/components/SearchFieldsOfStudyForm.vue"
import FieldOfStudyResultCard from "~/components/FieldOfStudyResultCard.vue"
import Tooltip from "~/components/Tooltip.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import { SiteData } from "~/js/mixins/SiteData.js"
import LocationCheck from "~/js/mixins/LocationCheck.js"

import _ from "lodash"
import { apiGet } from "~/js/api.js"
import { fields, formMappings } from "~/js/constants.js"

import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import FieldOfStudyDetailChip from "~/components/FieldOfStudyDetailChip.vue"
import SearchTabs from "~/components/SearchTabs.vue"

const querystring = require("querystring")

export default {
  components: {
    share: Share,
    "search-fos-form": SearchFieldsOfStudyForm,
    "fos-result-card": FieldOfStudyResultCard,
    tooltip: Tooltip,
    "field-of-study-search": FieldOfStudySearch,
    "field-of-study-detail-chip": FieldOfStudyDetailChip,
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
      default:
        "latest.programs.cip_4_digit.earnings.4_yr.overall.median_earnings:desc",
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
        state: [],
        cip4: [],
        cip4_degree: [],
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
      showDescription: false,
      sorts: [
        { type: "School Name", field: "name:asc" },
        {
          type: "Earnings",
          field:
            "latest.programs.cip_4_digit.earnings.4_yr.overall.median_earnings:asc",
        },
        {
          type: "Debt",
          field:
            "latest.programs.cip_4_digit.debt.staff_grad_plus.all.all_inst.median:desc",
        },
        {
          type: "Graduates",
          field: "latest.programs.cip_4_digit.counts.ipeds_awards1:desc",
        },
      ],
      shareUrl: null,
      fieldOfStudyTotalCountWithoutRangeFilters: 0,
      displayFlag: false,
      degreeTypes: [
        {
          label: "Certificate",
          value: "c",
        },
        {
          label: "Associate's Degree",
          value: "a",
        },
        {
          label: "Bachelor's Degree",
          value: "b",
        },
      ],
      utility: {
        rules: {
          required: (value) => !!value || "Required.",
          numerical: (value) => {
            const pattern = /^\d+$/
            return pattern.test(value) || "Numerical"
          },
          zip: (value) =>
            /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value) ||
            "Must be ZIP code format",
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

        cip4Cache: [],
      },
    }
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input)

    this.urlParsedParams = this.parseURLParams()

    // this.input = this.input.urlParsedParams

    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort

    // if Page is in the url, add it here.
    this.input.page = this.urlParsedParams.page
      ? Number(this.urlParsedParams.page) + 1
      : 1

    this.input.cip4 = this.urlParsedParams.cip4

    // Set Toggle Value - Default to institutions
    if (
      typeof this.urlParsedParams.toggle === "undefined" ||
      this.urlParsedParams.toggle === "institutions"
    ) {
      this.displayToggle = "institutions"
      this.controlTab = 0
      this.controlRadio = "0"
    } else {
      this.displayToggle = "fos"
      this.controlTab = 1
      this.controlRadio = "1"
    }

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
      // this.searchAPI(params, true);

      this.handleFieldOfStudySearch(params)
    }, 1000)
  },
  watch: {
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
  computed: {
    selectedFoSLabel() {
      if (this.input.cip4)
        return _.find(this.site.data.cip_4_digit, [
          "label",
          this.input.cip4.substr(0, 2) + "." + this.input.cip4.substr(2),
        ])["value"].replace(".", "")
      else return ""
    },
    totalPages() {
      if (this.results.meta.per_page && this.results.meta.total) {
        let totalPages = this.results.meta.total / this.results.meta.per_page

        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages)
      }
    },
    showFieldOfStudyWarning() {
      if (this.displayToggle !== "fos") {
        return false
      }

      if (this.isLoading) {
        return false
      }

      if (
        typeof this.utility.previousParams.fos_salary != "undefined" ||
        typeof this.utility.previousParams.fos_debt != "undefined"
      ) {
        return true
      }
    },
    fieldOfStudyRangeFiltersHidingCount() {
      // Total count minus showing count.
      if (
        this.fieldOfStudyTotalCountWithoutRangeFilters > 0 &&
        this.results.meta.total > 0
      ) {
        return (
          this.fieldOfStudyTotalCountWithoutRangeFilters -
          this.results.meta.total
        )
      } else {
        return 0
      }
    },
    contextRadioClass() {
      if (this.controlRadio === "1") {
        return "field-of-study-context-panel"
      } else {
        return "institution-context-panel"
      }
    },
    contextRadioSchoolStyle() {
      if (this.controlRadio === "1") {
        return "normal"
      } else {
        return "bold"
      }
    },
    contextRadioFOSStyle() {
      if (this.controlRadio === "1") {
        return "bold"
      } else {
        return "normal"
      }
    },
    cipSelectionLimitReached() {
      if (this.input.cip4 && this.input.cip4.length >= 1) {
        return true
      }

      return false
    },
    fosDegrees() {
      return formMappings.fosDegrees
    },
  },
  methods: {
    searchAPI(params = {}, returnFields = [], allPrograms = true) {
      // TODO - Clean this method up, It does way more than just SearchAPI.
      // Better Encapsulation.

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

      // let poppingState = false;
      // let alreadyLoaded = false;

      //Add page and sort items into params.
      if (params.page === 0) {
        // Reset page when passed 0
        this.input.page = 1
      } else if (this.input.page >= 1) {
        // Use local page counter;
        // The API function off of a 0 index;
        params.page = this.input.page - 1
      }

      params.sort = this.input.sort ? this.input.sort : this.defaultSort

      let query = this.prepareParams(params)

      query.fields = returnFields

      //Ensure that toggle is not sent to API
      if (query.toggle) {
        delete query.toggle
      }

      // TODO: Need to remove this when API
      // is processing requests better
      if (allPrograms) {
        query["all_programs_nested"] = true
      }

      // Add toggle value + params
      let qs = this.generateQueryString({
        ...params,
        toggle: this.displayToggle,
      })

      history.replaceState(params, "search", qs)

      this.addURLToStorage(qs)

      let request = apiGet("/fos", query)
        .then((response) => {
          console.log("loaded fos:", response.data)

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
    queryAPI(params = {}) {
      // Generic API Query Method that returns API results
      let query = this.prepareParams(params)

      return apiGet("/fos", query)
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
    handleCannedSearchClick(cannedSearchData) {
      if (cannedSearchData) {
        this.urlParsedParams = this.parseURLParams(
          this.generateQueryString(cannedSearchData).substr(1)
        )
      }
    },
    isResultCardSelected(schoolId, compareSchools) {
      if (_.findIndex(compareSchools, ["schoolId", String(schoolId)]) >= 0) {
        return true
      }
      return false
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
      this.handleFieldOfStudySearch(params)
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
        fields.COMPLETION_150_4,
        fields.COMPLETION_150_LT4,

        fields.FIELD_OF_STUDY,
      ].join(",")

      this.searchAPI(params, returnFields)
    },
    handleFieldOfStudySearch(params) {
      // TODO - refine fields
      let returnFields = ""

      // Cache params to power other content
      this.utility.previousParams = params

      this.searchAPI(params, returnFields, false)
    },
    handlePaginationInput() {
      this.handleFieldOfStudySearch(this.parseURLParams())
    },
    handleDOLFlag() {
      this.urlParsedParams = this.parseURLParams()
      delete this.urlParsedParams.dolflag
      this.debounceSearchUpdate(this.urlParsedParams)
      this.$root.$emit("reset-dol-flag")
    },
    // Reset values for sub objects to default
    handleLocationChange(e) {
      // TODO - Check to see if values need to be reset.
      this.input.zip = ""
      this.input.state = []

      this.input.lat = null
      this.input.long = null

      this.location.latLon = null
      this.location.error = null
    },
    locationButtonColor() {
      return this.location.latLon ? "primary" : ""
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      /*this.input.cip4 = _.union(this.input.cip4, [fieldOfStudy.cip4])
      this.utility.cip4Cache = _.unionBy(
        this.utility.cip4Cache,
        [fieldOfStudy],
        "cip4"
      )*/

      this.urlParsedParams = this.parseURLParams()
      //this.input.cip4 = fieldOfStudy.cip4
      this.utility.cip4Cache = fieldOfStudy.cip4
      this.urlParsedParams.cip4 = this.input.cip4
      this.debounceSearchUpdate(this.urlParsedParams)
      //this.$root.$emit("reset-dol-flag")
    },
    handleDegreeSelected(fosDegree) {
      this.urlParsedParams = this.parseURLParams()
      this.input.cip4 = fosDegree.cip4

      this.urlParsedParams.cip4 = this.input.cip4
      this.debounceSearchUpdate(this.urlParsedParams)
      //this.$root.$emit("reset-dol-flag")
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
  metaInfo: {
    title: "Search Fields of Study",
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
