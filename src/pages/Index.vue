<template>
  <div>
    <v-main>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-container class="mb-n10 pt-16">
          <v-row>
            <!-- Header Info -->
            <v-col cols="12">
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
                class="ma-0"
                show-arrows
                v-model="desktopTabs"
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
                      >
                        Custom Search
                        <v-icon v-if="toggleCustomSearch">mdi-menu-up</v-icon>
                        <v-icon v-else>mdi-menu-down</v-icon>
                      </v-btn>
                    </div>

                    <div v-if="toggleCustomSearch">
                      <search-form @search-query="directToSearch" />
                    </div>
                  </v-card>
                </v-tab-item>

                <!-- Field Of Study Search-->
                <v-tab-item>
                  <v-card class="pa-5 homepage-search-container" flat>
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                    />

                    <div class="mt-5 text-right">
                      <v-btn
                        text
                        small
                        role="link"
                        @click="handleFoSMoreOptionsClick"
                      >
                        More Search Options
                        <v-icon>mdi-menu-right</v-icon>
                      </v-btn>
                    </div>
                  </v-card>
                </v-tab-item>

                <!-- Show Me Options-->
                <v-tab-item>
                  <v-card style="min-height: 300px" class="px-10 py-5" flat>
                    <p class="my-5">
                      Select one or more options to create a list of schools
                      that fit your needs.
                    </p>

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
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                    />
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
                    <p class="my-2">
                      Select one or more options to create a list of schools
                      that fit your needs.
                    </p>
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
      <div class="home-links pt-15 mb-15">
        <v-container class="mt-8">
          <v-row class="align-stretch">
            <!-- apprenticeships callout -->
            <v-col cols="12" md="6">
              <v-card flat class="pa-8">
                <h2 class="display-2">
                  Alternative Pathways to a Career
                </h2>
                <hr />
                <p>
                  Search for apprenticeship jobs and programs on
                  <a
                    class="homeCallout-indent"
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://www.apprenticeship.gov/apprenticeship-finder'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://www.mynextmove.org'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://trainingproviderresults.gov'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://careeronestop.org'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink($event, 'https://www.bls.gov/ooh/')
                    "
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
            <v-col cols="12" md="6" sm="12">
              <v-card flat class="pa-8">
                <h2 class="display-2">
                  Learn More About Paying for College
                </h2>
                <hr />
                <p>
                  You can learn more about the types of financial aid that are
                  available at

                  <a
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink($event, 'https://studentaid.gov')
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://studentaid.gov/aid-estimator/'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    x-large
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://studentaid.gov/h/apply-for-aid/fafsa'
                      )
                    "
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
                    :href="$url('/school/transition/')"
                    target="_blank"
                    @click="
                      transitionOutboundLink(
                        $event,
                        'https://www.vets.gov/gi-bill-comparison-tool'
                      )
                    "
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
}
.v-tab.v-tab--active {
  color: #ffffff !important;
}
.home-mobile-search-title {
  font-size: 16px;
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
    }
  },
  methods: {
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
      this.$router.push(
        "/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4)
      )
    },
    handleFoSMoreOptionsClick() {
      this.$router.push("/search/?toggle=fos")
    },
  },
  metaInfo: {
    title: "College Scorecard",
  },
}
</script>
