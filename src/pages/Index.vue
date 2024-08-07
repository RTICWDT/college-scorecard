<template>
  <div>
    <v-main>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-container class="mb-n10 pt-sm-10 pt-5">
          <v-row>
            <!-- Header Info -->
            <v-col cols="12" class="px-6 px-sm-3">
              <h1 class="white--text">
                Find the right fit
              </h1>

              <p class="white--text">
                Search and compare colleges: their fields of study, costs,
                admissions, results, and more.
              </p>
            </v-col>
          </v-row>

          <v-row>
            <!-- Medium and Larger Tabs and Search Content -->
            <v-col cols="12" class="d-none d-sm-flex pb-0">
              <v-tabs
                background-color="transparent"
                color="white"
                slider-size="8"
                slider-color="#74B3E8"
                class="home-tabs ma-0"
                show-arrows
                v-model="desktopTabs"
                @change="colorSlider"
              >
                <v-tab
                  @click="GATrackEvent('Home Tab', 'Tab', 'Search Schools')"
                  color="white"
                >
                  Search Schools
                </v-tab>

                <v-tab
                  @click="
                    GATrackEvent('Home Tab', 'Tab', 'Search Fields of Study')
                  "
                  color="white"
                >
                  Search Fields of Study
                </v-tab>

                <v-tab
                  @click="GATrackEvent('Home Tab', 'Tab', 'Show Me Options')"
                  color="white"
                >
                  Show Me Options
                </v-tab>
                <v-tabs-slider :color="sliderColor" />
                <!-- Institution Search-->
                <v-tab-item>
                  <v-card class="pa-5" flat>
                    <name-autocomplete
                      @school-name-selected="handleSchoolNameSelected"
                      :searchEmptyName="false"
                    />

                    <div class="mt-5 text-right">
                      <v-btn
                        text
                        small
                        @click="toggleCustomSearch = !toggleCustomSearch"
                        class=" text-uppercase"
                      >
                        Custom Search
                        <v-icon v-if="toggleCustomSearch">mdi-menu-up</v-icon>
                        <v-icon v-else>mdi-menu-down</v-icon>
                      </v-btn>
                    </div>

                    <div v-if="toggleCustomSearch">
                      <search-form
                        @search-query="directToSearch"
                        :hideLocation="false"
                      />
                    </div>
                  </v-card>
                </v-tab-item>

                <!-- Field Of Study Search-->
                <v-tab-item>
                  <v-card class="pa-5 homepage-search-container" flat>
                    <v-row>
                      <v-col cols="12" sm="5">
                        <label class="d-block mb-2" for="fosSearch"
                          >Search Fields of Study (Required)</label
                        >
                        <field-of-study-search
                          @field-of-study-selected="handleFieldOfStudySelected"
                          :selected="input.cip4"
                          id="fosSearch"
                          ariaRequired="true"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <label class="d-block  mb-2" for="fosDegree"
                          >Select Degree Type (Required)</label
                        >
                        <v-select
                          :items="fosDegrees"
                          item-text="label"
                          item-value="value"
                          outlined
                          placeholder="Select one"
                          v-model="input.cip4_degree"
                          hide-details
                          id="fosDegree"
                          color="fos-search-color"
                          aria-required="true"
                        >
                        </v-select>
                      </v-col>
                      <v-col col="1" sm="3" class="">
                        <div class="d-none d-sm-block" style="height: 32px">
                          &nbsp;
                        </div>
                        <v-btn
                          @click="handleFormSubmit"
                          width="100%"
                          x-large
                          color="secondary"
                          :disabled="disableSearch"
                        >
                          Search
                          <v-icon>mdi-menu-right</v-icon>
                        </v-btn></v-col
                      >
                    </v-row>
                  </v-card>
                </v-tab-item>

                <!-- Show Me Options-->
                <v-tab-item>
                  <v-card style="min-height: 300px" class="px-10 py-5" flat>
                      <canned-search-container
                        @canned-search-submit="directToSearch"
                      ></canned-search-container>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>

            <!-- Mobile Expansion Panels and Search -->
            <v-col cols="12" class="pa-5 d-block d-sm-none">
              <v-expansion-panels class="mb-2" v-model="mobilePanels">
                <!-- Mobile Institution Search -->
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="home-mobile-search-title">Search Schools</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <name-autocomplete
                      @school-name-selected="handleSchoolNameSelected"
                      :searchEmptyName="false"
                      v-if="$vuetify.breakpoint.smAndDown"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Mobile FoS Search-->
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="home-mobile-search-title"
                      >Search Fields of Study</span
                    >
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" sm="5">
                        <label class="d-block mb-2" for="fosSearch"
                          >Search Fields of Study</label
                        >
                        <field-of-study-search
                          @field-of-study-selected="handleFieldOfStudySelected"
                          :selected="input.cip4"
                          id="fosSearch"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <label class="d-block  mb-2" for="fosDegree"
                          >Select Degree Type</label
                        >
                        <v-select
                          :items="fosDegrees"
                          item-text="label"
                          item-value="value"
                          outlined
                          placeholder="Select one"
                          v-model="input.cip4_degree"
                          hide-details
                          id="fosDegree"
                          color="fos-search-color"
                        >
                        </v-select>
                      </v-col>
                      <v-col col="12" sm="3" class="">
                        <div class="d-none d-sm-block" style="height: 32px">
                          &nbsp;
                        </div>
                        <v-btn
                          @click="handleFormSubmit"
                          width="100%"
                          x-large
                          color="secondary"
                          :disabled="disableSearch"
                        >
                          Search
                          <v-icon>mdi-menu-right</v-icon>
                        </v-btn></v-col
                      >
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Mobile Show me Options-->
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="home-mobile-search-title"
                      >Show Me Options</span
                    >
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <canned-search-container
                      @canned-search-submit="directToSearch"
                      class="mx-5"
                    ></canned-search-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Bottom Content -->
      <div class="home-links pt-sm-15 mb-15">
        <v-container class="mt-8">
          <v-row class="align-stretch">
            <!-- apprenticeships callout -->
            <v-col cols="12" md="6" class="pr-sm-8">
              <v-card flat class="pa-8">
                <h2 class="display-2 d-flex justify-space-between align-center">
                  <span>Alternative Pathways<br />to a Career</span>
                  <v-avatar color="#D1E9FF">
                    <img
                      :src="$url('img/Pathway-Icon.svg')"
                      alt="Pathways Icon"
                      class="pa-2"
                    />
                  </v-avatar>
                </h2>
                <hr />
                <p>
                  Search for apprenticeship jobs and programs on
                  <a
                    class="homeCallout-indent"
                    href="https://www.apprenticeship.gov/apprenticeship-finder"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    apprenticeship.gov<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon> </a
                  >.
                </p>
                <hr />
                <p>
                  Use the
                  <a
                    class="homeCallout-indent"
                    href="https://www.mynextmove.org"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    MyNextMove.org<v-icon x-small class="pl-1" color="#007000">
                      fas fa-external-link-alt
                    </v-icon>
                  </a>
                  tool for career exploration and job analysis.
                </p>
                <hr />
                <p>
                  Find training programs: compare completion rates, employment
                  rates, and more on
                  <a
                    class="homeCallout-indent"
                    href="https://trainingproviderresults.gov"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    TrainingProviderResults.gov<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon> </a
                  >.
                </p>
                <hr />
                <p>
                  Visit
                  <a
                    class="homeCallout-indent"
                    href="https://careeronestop.org"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    CareerOneStop.org<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon> </a
                  >, your source for career exploration training and jobs.
                </p>
                <hr />
                <p>
                  Explore the
                  <a
                    class="homeCallout-indent"
                    href="https://www.bls.gov/ooh/"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    Occupational Outlook Handbook (OOH)<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </a>
                  for detailed information about over 300 occupational profiles.
                </p>
              </v-card>
            </v-col>

            <!-- paying callout -->
            <v-col cols="12" md="6" sm="12" class="pl-sm-8">
              <v-card flat class="pa-8">
                <h2 class="display-2 d-flex justify-space-between align-center">
                  <span class="">Learn More About<br />Paying for College</span>
                  <v-avatar color="#D1E9FF">
                    <img
                      :src="$url('img/icon-financial-aid-black.svg')"
                      alt="Financial Aid Icon"
                      class="pa-2"
                    />
                  </v-avatar>
                </h2>
                <hr />
                <p>
                  You can learn more about the types of financial aid that are
                  available at

                  <a
                    href="https://studentaid.gov"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    StudentAid.gov<v-icon x-small class="pl-1" color="#007000">
                      fas fa-external-link-alt
                    </v-icon>
                  </a>
                </p>

                <p>
                  To receive financial aid, you must complete the Free
                  Application for Federal Student Aid (FAFSA&#174;) form. You
                  can use

                  <a
                    href="https://studentaid.gov/aid-estimator/"
                    target="_blank"
                    @click="transitionOutboundLink($)"
                  >
                    Federal Student Aid Estimator<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </a>

                  to see how much aid may be available to you.
                </p>

                <p class="my-10">
                  <v-btn
                    color="secondary"
                    href="https://studentaid.gov/h/apply-for-aid/fafsa"
                    target="_blank"
                    x-large
                    @click="transitionOutboundLink($event)"
                    >Start Your FAFSA&reg; Application<v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </v-btn>
                </p>

                <hr />

                <p>
                  Veterans are eligible for higher education funding through the
                  G.I. Bill benefits. Use the

                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="transitionOutboundLink($event)"
                  >
                    GI Bill&reg; comparison tool<v-icon
                      x-small
                      class="pl-1"
                      color="#007000"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </a>

                  to learn about education programs and compare benefits by
                  school.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";

h1 {
  font-size: 50px;
  text-transform: none;
}
.v-card {
  height: 100%;
}
.v-tabs .v-card {
  border-top-left-radius: 0px;
}
.home-splash {
  font-family: $base-font-family !important;
  background-color: $bg-blue !important;
}
.home-links {
  background-color: $bg-gray;
}
.v-tab {
  font-family: $header-font-family;
  font-size: 1rem;
  color: #bbbbbb !important;
  letter-spacing: normal;
  font-weight: 700;
  -webkit-font-smoothing: subpixel-antialiased;
}

.v-tab.v-tab--active {
  color: #ffffff !important;
}
.home-mobile-search-title {
  font-size: 16px;
}
.v-tabs-slider {
  border-radius: 5px 5px 0 0;
}

.v-avatar img {
  border-radius: 6px;
}

h2 span {
  font-weight: 600 !important;
}

fieldset {
  border: 0;
}
</style>

<script>
import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
import querystring from "querystring"
import SearchForm from "~/components/SearchForm.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import { formMappings } from "~/js/constants.js"
export default {
  mixins: [AnalyticsEvents],
  components: {
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  data() {
    return {
      mobilePanels: 0,
      desktopTabs: 0,
      toggleCustomSearch: false,
      sliderColor: "#7BD88C",
      input: {
        cip4: null,
        cip4_degree: null,
      },
    }
  },
  computed: {
    fosDegrees() {
      return formMappings.fosDegrees
    },
    disableSearch() {
      return this.input.cip4 === null || this.input.cip4_degree === null
    },
  },
  methods: {
    colorSlider(num) {
      switch (num) {
        case 0:
          this.sliderColor = "#7BD88C"
          break
        case 1:
          this.sliderColor = "#FDB022"
          break
        default:
          this.sliderColor = "#FFFFFF88"
          break
      }
    },
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params)
      let url =
        "/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")

      // Direct to location.
      //window.location.href = this.$url(url)
      this.$router.push(url)
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        this.$router.push("/search/?search=" + encodeURIComponent(school))
      } else {
        this.$router.push(
          "/search/?search=" + encodeURIComponent(school["school.name"]) //+
          //"&id=" +
          //school.id
        )
      }
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      this.input.cip4 = fieldOfStudy.cip4
    },
    handleFormSubmit() {
      this.$router.push(
        `/search/fos?cip4=${encodeURIComponent(
          this.input.cip4
        )}&cip4_degree=${encodeURIComponent(this.input.cip4_degree)}`
      )
    },
  },
  metaInfo: {
    title: "Home",
    meta: [
      {
        name: 'description',
        content: 'The U.S. Department of Education’s College Scorecard has the most reliable data on college costs, graduation rates, and post-college earnings.'
      },
      {
        name: 'keywords',
        content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings'
      }
    ],
  },
}
</script>
