<template>
  <v-app id="index">
    <scorecard-header active-link="/" />

    <v-main>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <!-- Header Info -->
            <v-col cols="12">
              <h1 class="white--text text-uppercase text-center">
                Find the Right Fit.
              </h1>

              <p class="white--text text-center">
                Search and compare colleges: their fields of study, costs,
                admissions, results, and more.
              </p>
            </v-col>
          </v-row>

          <v-row class="px-md-6">
            <!-- Medium and Larger Tabs and Search Content -->
            <v-col cols="12" class="d-none d-sm-flex pb-10">
              <v-tabs
                grow
                background-color="rgba(0,0,0,0)"
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
                  <v-card class="pa-5 homepage-search-container">
                    <name-autocomplete
                      @school-name-selected="handleSchoolNameSelected"
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
                  <v-card class="pa-5 homepage-search-container">
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
                  <v-card style="min-height: 300px" class="px-10 py-5">
                    <p class="my-2 text-center">
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
      <div id="home-content-container" class="mt-5 pa-md-6">
        <v-container class="my-0">
          <v-row class="mt-md-12 px-md-6">
            <!-- apprenticeships callout -->
            <v-col class="homeCallout apprenticeships" cols="12" md="6" sm="12">
              <div class="home-callout-container mr-md-3">
                <div class="home-callout-top mb-12">
                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img src="/img/icon-pathways.svg" alt="Pathways Icon" />
                    </div>
                  </div>

                  <h2 class="title mt-4 mt-md-0">
                    There's More than One Pathway to a Career
                  </h2>
                </div>

                <h3>
                  Jump start your career with an apprenticeship
                </h3>

                <p>
                  Find the right one for you.
                </p>

                <p class="home-callout-button-wrapper">
                  <v-btn
                    block
                    rounded
                    color="secondary"
                    href="https://www.apprenticeship.gov/apprenticeship-finder"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    >Go to apprenticeship.gov</v-btn
                  >
                </p>

                <h3>
                  What career is right for you?
                </h3>

                <p>
                  Curious what careers are out there? O*NET's Career Explorer is
                  here to help!
                </p>

                <p class="home-callout-button-wrapper">
                  <v-btn
                    block
                    rounded
                    color="secondary"
                    href="https://www.onetonline.org/find/"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    >Go to O’NET’s Career explorer</v-btn
                  >
                </p>

                <h3>
                  Discover your future
                </h3>

                <p>
                  Search for training and career opportunities.
                </p>

                <p class="home-callout-button-wrapper">
                  <v-btn
                    block
                    rounded
                    color="secondary"
                    href="https://www.trainingproviderresults.gov/#!/"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    >Visit trainingproviderresults.gov</v-btn
                  >
                </p>
              </div>
            </v-col>

            <!-- paying callout -->
            <v-col class="homeCallout paying" cols="12" md="6" sm="12">
              <div class="home-callout-container ml-md-3">
                <div class="home-callout-top mb-12">
                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img
                        src="/img/icon-financial-aid.svg"
                        alt="Financial Aid Icon"
                      />
                    </div>
                  </div>

                  <h2 class="title mt-4 mt-md-0">
                    Learn More About Paying for College
                  </h2>
                </div>

                <h3>
                  Get started with Financial Aid
                </h3>

                <p>
                  To receive financial aid, you must complete the Free
                  Application for Federal Student Aid (FAFSA). Use the

                  <a
                    href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >
                    FAFSA<em>4caster</em>
                  </a>

                  to see how much aid may be available to you.
                </p>

                <p class="text-center home-callout-button-wrapper">
                  <v-btn
                    block
                    rounded
                    color="secondary"
                    href="https://fafsa.ed.gov/"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    >Start Your FAFSA&reg; Application</v-btn
                  >
                </p>

                <p>
                  Also look into other programs such as

                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >
                    GI Bill&reg; Benefits
                  </a>

                  that may also help you pay for school.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
    <scorecard-footer />

    <compare-header :showCompare.sync="showCompare" />

    <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
      <compare-drawer
        :show-info-text="showInfoText"
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
        @toggle-more-info="showInfoText = !showInfoText"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";
.home-splash {
  min-height: 380px;
  padding-top: 1.5rem;
}
.v-tab {
  font-family: $header-font-family;
  font-size: 1rem;
  font-weight: bold;
  color: #bbbbbb !important;
}
.v-tab.v-tab--active {
  color: #ffffff !important;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: #ffffff !important;
}

.homeContent {
  /*border-top: 20px*/
  /*  solid*/
  /*  #ffffff;*/
  background-color: #b5d7f4;
}

#home-content-container {
  height: auto;

  @media (min-width: 960px) {
    height: 900px;
    background: linear-gradient(to bottom, #97cff5 50%, #0075b2 50%);
  }
}

.home-callout-container {
  margin-bottom: 80px;
  height: 630px;
  background-color: white;
  box-shadow: 0px 3px 6px #00000029;

  @media (min-width: 960px) {
    margin-bottom: inherit;
    height: 720px;
  }
}

.home-callout-top {
  background-color: #c4e4f9;
  height: 120px;

  h2 {
    position: relative;
    bottom: 50px;
  }

  @media (min-width: 960px) {
    height: 180px;
  }
}

.home-icon {
  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 75%;

    @media (min-width: 960px) {
      width: unset;
    }
  }
}

.homepage-search-container {
  min-height: 150px;
}
</style>
<style lang="scss">
.homeCallout {
  /*background-color: #ffffff;*/
  h2 {
    font-weight: bold !important;
    /*color: #ffffff;*/
    text-align: center;
    padding: 1rem;
    /*margin-bottom: 2rem !important;*/
  }

  h3 {
    text-align: center;
    margin-bottom: 0.5rem !important;
  }

  h3 {
    text-align: center;
    margin-bottom: 0.5rem !important;
  }

  p {
    text-align: center;
    padding: 0rem 0.9rem;

    margin-bottom: 2rem !important;
  }
}

.sublink {
  text-decoration: none;
}

.home-icon-wrapper {
  position: relative;
  margin: 0 auto;
  width: 75px;
  height: 75px;
  top: -35px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 3px 6px #00000029;

  @media (min-width: 960px) {
    width: 133px;
    height: 133px;
    top: -50px;
  }
}
.home-callout-button-wrapper {
  margin: unset;

  @media (min-width: 960px) {
    margin: 0 60px;
  }
}

.home-mobile-search-title {
  font-size: 16px;
}
</style>

<script>
import PayingForCollege from "~/components/PayingForCollege.vue"
import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
import querystring from "querystring"
import SearchForm from "~/components/SearchForm.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import { compare } from "~/js/mixins.js"
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import { EventBus } from "~/js/EventBus.js"

export default {
  mixins: [AnalyticsEvents, compare],
  components: {
    "paying-for-college": PayingForCollege,
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
      window.location.href = url
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        window.location = "/search/?search=" + encodeURIComponent(school)
      } else {
        window.location =
          "/search/?search=" +
          encodeURIComponent(school["school.name"]) +
          "&id=" +
          school.id
      }
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      window.location =
        "/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4)
    },
    handleFoSMoreOptionsClick() {
      window.location = `/search/?toggle=fos`
    },
  },
  mounted() {
    EventBus.$on("compare-drawer-show", (showCompareInfo) => {
      this.showCompare = true
      this.showInfoText = showCompareInfo
    })
  },
}
</script>
