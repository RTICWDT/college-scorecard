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
              <div id="fos-search-and-chips">
                <field-of-study-search
                  @field-of-study-selected="handleFieldOfStudySelected"
                  id="fos-search"
                  name="fos-search"
                  :dense="true"
                  :rules="[utility.rules.required]"
                  :selected="input.cip4"
                >
                </field-of-study-search>
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
                  @change="handleDegreeSelected"
                >
                </v-select>
              </div>

              <v-btn class="mx-3 ml-auto" @click="showSidebar = !showSidebar">
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
              <!-- Search Fields of Study Component -->
              <search-fos-form
                :url-parsed-params="urlParsedParams"
                auto-submit
                @search-query="handleFieldOfStudySearch"
              />
            </v-navigation-drawer> </v-col
          ><v-col :cols="showSidebar ? 9 : 12" class="pa-10">
            <div v-if="!isLoading">
              <h2 class="mb-4">
                {{ selectedFoSLabel }}
                <v-chip class="ml-2">{{ selectedFoSDegree }}</v-chip>
              </h2>
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
                  class="mt-2 mb-4 py-4 px-4 elevation-0 pageBar mb-4"
                  v-show="!isLoading"
                >
                  <v-row class="">
                    <v-col cols="12" sm="7" class="py-2 px-4">
                      <div id="search-result-info-count" class>
                        <p class="title mb-0">
                          {{ results.meta.total | separator }} Results

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

                <!-- Field Of Study CIP 4 Information -->
                <div>
                  <v-row>
                    <v-col cols="12" v-if="!isLoading && this.displayFlag">
                      <v-alert
                        color="primary"
                        border="left"
                        colored-border
                        class="mb-0"
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
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-alert>
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
                          Learn more about CIP<v-icon x-small class="pl-1">
                            fas fa-external-link-alt
                          </v-icon>
                        </a>
                      </v-alert>
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
                      <v-card class="pa-5 text-center elevation-0">
                        <h3 class="text-center">No Results Found</h3>
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
    Share,
    "search-fos-form": SearchFieldsOfStudyForm,
    "fos-result-card": FieldOfStudyResultCard,
    Tooltip,
    FieldOfStudySearch,
    FieldOfStudyDetailChip,
    SearchTabs,
  },
  mixins: [URLHistory, PrepareParams, AnalyticsEvents, SiteData, LocationCheck],
  data() {
    return {
      isLoading: true,
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
        cip4: null,
        cip4_degree: null,
        dolflag: false,
      },
      urlParsedParams: {},
      utility: {
        formDefault: {},
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
      displayFlag: false,

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
      },
    }
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input)
    this.urlParsedParams = this.parseURLParams()

    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort

    this.input.cip4 = this.urlParsedParams.cip4
    this.input.cip4_degree = this.urlParsedParams.cip4_degree

    if (!this.input.cip4 || !this.input.cip4_degree) {
      this.$router.push("/search/fos-landing")
    }

    if (
      typeof this.urlParsedParams.dolflag === "undefined" ||
      this.urlParsedParams.dolflag === "false"
    ) {
      this.displayFlag = false
    } else {
      this.displayFlag = true
    }
    this.searchAPI()

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function() {
      this.searchAPI()
    }, 1000)
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
    selectedFoSDegree() {
      if (this.input.cip4_degree) {
        let degree = formMappings.fosDegrees.find((itm) => {
          return itm.value == this.input.cip4_degree
        })
        return degree.label
      } else return ""
    },
    totalPages() {
      if (this.results.meta.per_page && this.results.meta.total) {
        let totalPages = this.results.meta.total / this.results.meta.per_page

        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages)
      }
    },
    fosDegrees() {
      return formMappings.fosDegrees
    },
    displayPage: {
      get() {
        return this.input.page + 1
      },
      set(newValue) {
        this.input.page = newValue - 1
      },
    },
  },
  methods: {
    searchAPI() {
      let params = this.input
      this.isLoading = true

      this.error.message = null

      if (
        typeof params["dolflag"] === "undefined" ||
        params["dolflag"] === "false"
      ) {
        this.displayFlag = false
      } else {
        this.displayFlag = true
      }

      params.sort = this.input.sort ? this.input.sort : this.defaultSort

      let query = this.prepareParams(params)

      // Add toggle value + params
      let qs = this.generateQueryString({
        ...params,
      })

      history.replaceState(params, "search", qs)

      this.addURLToStorage(qs)

      apiGet("/fos", query)
        .then((response) => {
          this.isLoading = false
          console.log("loaded fos:", response.data)

          this.results.schools = response.data.results
          this.results.meta = response.data.metadata

          this.$emit("loading", false)
          this.shareUrl = window.location.href
        })
        .catch((error) => {
          this.isLoading = false
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
    handleFieldOfStudySearch(params) {
      this.input = { ...this.input, ...params }
      this.input = Object.fromEntries(
        Object.entries(this.input).filter(([_, v]) => v != null)
      )

      this.input.page = 0
      this.searchAPI()
    },
    handlePaginationInput() {
      this.searchAPI()
    },
    resort(sort) {
      this.input.page = 0
      this.input.sort = sort
      this.searchAPI()
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      this.input.page = 0
      this.input.cip4 = fieldOfStudy.cip4
      this.debounceSearchUpdate()
    },
    handleDegreeSelected() {
      this.input.page = 0
      this.debounceSearchUpdate()
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
