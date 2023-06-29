<style lang="scss" scoped>
.data-row {
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom-style: none;
  }
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
            <v-card flat class="white d-sm-flex align-center">
              <div class="mx-sm-3">Field of Study:</div>
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

              <div class="mx-sm-3 mt-2 mt-sm-0" id="location-label">
                Degree Type:
              </div>
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
                  color="fos-search-color"
                >
                </v-select>
              </div>

              <v-btn
                class="mx-sm-3 mx-0 my-2 my-sm-0 ml-sm-auto toggle-sidebar float-right float-sm-none"
                outlined
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
          <v-col cols="3" :class="{ 'd-none': !showSidebar }" class="pr-0">
            <v-navigation-drawer
              v-model="showSidebar"
              :width="$vuetify.breakpoint.smAndDown ? '100%' : 'auto'"
              class="searchSidebar elevation-0 pr-0"
              :absolute="$vuetify.breakpoint.smAndDown"
              :temporary="$vuetify.breakpoint.smAndDown"
              hide-overlay
            >
              <div
                class="px-6 pt-6 white"
                style="border-right: 5px solid #DFE6F0;"
              >
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
              <!-- Search Fields of Study Component -->
              <search-fos-form
                :url-parsed-params="urlParsedParams"
                auto-submit
                @search-query="handleFieldOfStudySearch"
              />

            </v-navigation-drawer>
            ]<v-btn
              v-scroll="onScroll"
              v-show="btt"
              fab
              dark
              fixed
              bottom
              right
              color="primaryfos"
              @click="toTop"
            >
              <v-icon>fas fa-arrow-up</v-icon>
            </v-btn> </v-col
          ><v-col :cols="showSidebar ? 9 : 12" class="pa-8">
            <div v-if="!isLoading">
              <h2 class="mb-4">
                {{ selectedFoSLabel }}
                <v-chip
                  class="ml-0 ml-sm-2 mt-2 mt-sm-0 font-weight-regular text-uppercase"
                  color="#D8DFE8"
                  >{{ selectedFoSDegree }}</v-chip
                >
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
                          <br />
                          <v-btn
                            id="search-button-clear"
                            @click="clearSearchForm"
                            small
                            outlined
                            class=" d-sm-inline mr-3 searchbtn"
                            elevation="1"
                          >
                            <span>
                              <v-icon small class="mr-1"
                                >mdi-close-circle</v-icon
                              >
                              Reset Filters
                            </span>
                          </v-btn>

                          <v-menu  v-if="$vuetify.breakpoint.smAndDown">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                id="search-button-sort"
                                small
                                v-on="on"
                                outlined
                                class="mr-3 mb-1 mb-sm-0 searchbtn"
                                elevation="1"
                              >

                                Sort:
                                {{
                                  sorts.find((el) => el.field === input.sort.split(':')[0]).type + " " + sorts.find((el) => el.field === input.sort.split(':')[0]).direction
                                }}
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
                                  :key="item.type"
                                  @click="changeSort(item.type)"
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
                            color="#eff1f5"
                            :hide="['email']"
                            fos
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
                    <v-col
                      cols="12"
                      v-if="!isLoading && this.input.dolflag == 'true'"
                      class="pl-5"
                    >
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
                      <v-alert class="pl-5">
                        <strong>Note:</strong> Field of Study titles are based
                        on the US Department of Education's Classification of
                        Instructional Programs (CIP) and may not match the
                        program titles at a given school.
                        <a
                          target="_blank"
                          href="https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56"
                          @click="transitionOutboundLink($event)"
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
                  <div
                    class="search-result-cards-container"
                    v-if="!isLoading && results.schools.length > 0"
                  >
                    <v-card class="mx-auto pa-0 " style="width:100%" outlined>
                      <v-card-text>
                        <v-row
                          class="mb-2 py-4"
                          style="border-bottom:2px solid #eee"
                        >
                          <v-col
                            class="py-md-0 pl-5"
                            cols="12"
                            sm="3"
                            v-for="sort in sorts"
                            :key="sort.type"
                            v-if="!$vuetify.breakpoint.smAndDown"
                          >
                            <a
                              :class="{
                                'font-weight-bold': sort.current,
                                'text-decoration-underline': sort.current,
                                'selected-sort': sort.current,
                                'unselected-sort': !sort.current,
                              }"
                              @click="changeSort(sort.type)"
                              >{{ sort.type }}
                              <i
                                class="fa"
                                :class="[
                                  { 'fa-sort': sort.current == false },
                                  {
                                    'fa-sort-up':
                                      sort.current && sort.direction == 'desc',
                                  },
                                  {
                                    'fa-sort-down':
                                      sort.current && sort.direction == 'asc',
                                  },
                                ]"
                                aria-hidden="true"
                              ></i
                            ></a>
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
                            class="d-flex align-stretch data-row pl-5"
                          >
                            <fos-result-card :fos="school" />
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
import { formMappings } from "~/js/constants.js"
import * as forms from "~/js/forms.js"

import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import FieldOfStudyDetailChip from "~/components/FieldOfStudyDetailChip.vue"
import SearchTabs from "~/components/SearchTabs.vue"

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
      showSidebar: false,
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
      showDescription: false,
      sorts: [
        {
          type: "School Name",
          field: "name",
          current: true,
          direction: "asc",
        },
        {
          type: "Earnings",
          field:
            "fos_median_earnings",
          current: false,
          direction: "asc",
        },
        {
          type: "Debt",
          field:
            "fos_debt",
          current: false,
          direction: "asc",
        },
        {
          type: "Graduates",
          field: "fos_graduates",
          current: false,
          direction: "asc",
        },
      ],
      defaultSort: "name:asc",
      shareUrl: null,

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
      btt: false,
    }
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input)
    this.urlParsedParams = forms.parseURLParams()

    if (this.$vuetify.breakpoint.smAndDown) {
      this.showSidebar = false
    } else {
      this.showSidebar = true
    }
    
    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort

    this.input.cip4 = this.urlParsedParams.cip4
    this.input.cip4_degree = this.urlParsedParams.cip4_degree

    if (!this.input.cip4 || !this.input.cip4_degree) {
      this.$router.push("/search/fos-landing")
    }
    this.searchAPI()

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function() {
      this.searchAPI()
    }, 1000)
  },
  mounted() {
    //this.showSidebar = window.innerWidth > 960 ? true : false //this.$vuetify.breakpoint
    if (this.$vuetify.breakpoint.smAndDown) {
      this.showSidebar = false
    } else {
      this.showSidebar = true
    }
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
      params.sort = this.input.sort ? this.input.sort : this.defaultSort

      let query = this.prepareParams(params)

      // Add toggle value + params
      let qs = forms.generateQueryString({
        ...params,
      })

      if (process.isClient) {
        history.replaceState(params, "search", qs)
      }
      this.addURLToStorage(qs)

      apiGet("/fos", query)
        .then((response) => {
          this.isLoading = false
          //console.log("loaded fos:", response.data)

          this.results.schools = response.data.results
          this.results.meta = response.data.metadata

          this.$emit("loading", false)
          if (process.isClient) {
            this.shareUrl = window.location.href
          }

          if (this.$vuetify.breakpoint.smAndDown) {
          this.showSidebar = false
        } else {
          this.showSidebar = true
        }

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

    handleFieldOfStudySearch(params) {
      //console.log(params)
      this.input = { ...this.input, ...params }
      this.input = Object.fromEntries(
        Object.entries(this.input).filter(([_, v]) => v != null)
      )

      this.input.page = 0
      this.searchAPI()
    },
    handlePaginationInput() {
      this.searchAPI()
      this.toTop()
    },
    resort(sort) {
      this.input.page = 0
      this.input.sort = sort
      this.searchAPI()
    },
    clearSearchForm() {
      this.input = {
        page: 1,
        sort: this.defaultSort,
        cip4: this.urlParsedParams.cip4,
        cip4_degree: this.urlParsedParams.cip4_degree,
      }

      this.$root.$emit("search-form-reset")

      /*this.$router.push(
          "/search/fos-landing")   */
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
    changeSort(selected) {
      
      this.sorts.map((itm) => {
        if (itm.type == selected) {
          
          itm.current = true
          itm.direction = itm.direction == "asc" ? "desc" : "asc"
          this.input.sort = `${itm.field}:${itm.direction}`
        } else {
          itm.current = false
        }
      })
      this.input.page = 0
      this.searchAPI()
    },
    onScroll(e) {
      if (typeof window === "undefined") return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.btt = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
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
