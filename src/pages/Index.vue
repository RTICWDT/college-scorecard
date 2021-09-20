<template>
  <div>
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
                  <v-row align="center">
                    <v-col cols="8">
                      <h2 class="title mt-4 mt-md-0 ml-10">
                        There's more than one pathway to a career
                      </h2>
                    </v-col>
                    <v-col cols="4">
                    <div class="home-icon-wrapper  mr-10">
                      <div class="home-icon">
                        <img :src="$url('img/icon-pathways-blue.svg')" alt="Pathways Icon">
                      </div>
                    </div>
                    </v-col>
                  </v-row>
                </div>

                <p class="mx-10">
                  Start your career and build your skill set through <strong>apprenticeships:</strong>
                </p>

                 <a class="homeCallout-indent mx-10" href="https://www.apprenticeship.gov/apprenticeship-finder"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to apprenticeship.gov
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>

                <p class="mx-10">
                  Build your future with O*NET online, your tool for <strong>career exploration and job analysis:</strong>
                </p>

                 <a class="homeCallout-indent mx-10" href="https://www.onetonline.org/find/"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to ONETonline.org
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>        

                <p class="mx-10">
                  Discover Career One Stop, your source for <strong>career exploration training and jobs:</strong>
                </p>

                 <a class="homeCallout-indent mx-10" href="https://careeronestop.org"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to CareerOneStop.org
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>                        

                <p class="mx-10">
                  <strong>Find training programs:</strong> compare completion rates, employment rates, and more:
                </p>

                 <a class="homeCallout-indent mx-10" href="https://trainingproviderresults.gov"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to TrainingProviderResults.gov
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>
              </div>
            </v-col>

            <!-- paying callout -->
            <v-col class="homeCallout paying" cols="12" md="6" sm="12">
              <div class="home-callout-container ml-md-3">
                <div class="home-callout-top mb-12">
                <v-row align="center">
                  <v-col cols="8">
                    <h2 class="title mt-4 mt-md-0 ml-10">
                      Learn More About Paying for College
                    </h2>
                  </v-col>
                  <v-col cols="4">
                  <div class="home-icon-wrapper mr-10">
                    <div class="home-icon">
                      <img
                        :src="$url('img/icon-financial-aid.svg')"
                        alt="Financial Aid Icon"
                      />
                    </div>
                  </div>
                  </v-col>
                  </v-row>
                </div>
                <p class="mx-10">
                  You can learn more about the types of financial aid that are available at

                 <a href="https://studentaid.gov"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    StudentAid.gov
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>                  
                </p>

                <p class="mx-10">
                  To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA&#174;) form.
                  You can use

                  <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    FAFSA<em>4caster</em>
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                     
                  </a>

                  to see how much aid may be available to you.
                </p>

                <p class="text-center home-callout-button-wrapper mx-10 pb-3 pt-9">
                  <v-btn
                    rounded
                    color="secondary"
                    href="https://fafsa.ed.gov/"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >Start Your FAFSA&reg; Application
                    <v-icon
                      x-small
                      color="white"
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </v-btn>
                </p>

                <hr/>

                <p class="mx-10">
                  Veterans are eligible for higher education funding through the G.I. Bill benefits. Use the 

                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >
                    GI Bill&reg; comparison tool
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </a>

                  to learn about education programs and compare benefits by school.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </div>
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
      background: linear-gradient(to bottom, #97CFF5 70%, #0075B2 30%);
    }
  }

  .home-callout-text {
    width:70%;
  }

  .home-callout-container{
    margin-bottom: 80px;
    height: 680px;
    background-color: white;
    box-shadow: 0px 3px 6px #00000029;

    @media (min-width: 960px) {
      margin-bottom: inherit;
      height: 820px;
    }
  }

.home-callout-top {
  background-color: #c4e4f9;
  height: 120px;

    h2{
      bottom: 50px;
    }

    @media (min-width: 960px) {
      height: 160px;
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
<style lang="scss" scoped>
@import '~/sass/_variables.scss';
.homeCallout {
  /*background-color: #ffffff;*/
  a i {
    color:$darker-green !important;
  }
  hr {
    margin: 2rem 56px;
    height: 1px;
    border: none;
    color: #9d9d9d;
    background-color: #9d9d9d;
  }
  a.homeCallout-indent {
    padding:0rem 1rem;
  }

  h2 {
    font-weight: bold !important;
    /*color: #ffffff;*/
    text-align: left;
    padding: 1rem;
    /*margin-bottom: 2rem !important;*/
  }

  h3{
    text-align: left;
    margin-bottom: .5rem !important;
  }

  h3{
    text-align: left;
    margin-bottom: .5rem !important;
  }

  p {
    text-align: left;
    padding: 0rem 1rem;
  }
  &.apprenticeships
    h2 {
    /*background-color: #436692;*/
  }
  &.paying
    h2 {
    /*background-color: #436692;*/
  }
}

.sublink {
  text-decoration: none;
}

.home-icon-wrapper{
  position: relative;
  margin: 0 auto;
  width: 75px;
  height: 75px;

  @media (min-width: 960px) {
    width: 133px;
    height: 133px;

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

export default {
  mixins: [AnalyticsEvents],
  components: {
    "paying-for-college": PayingForCollege,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
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
      window.location.href = this.$url(url)
    },
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        window.location = this.$url("/search/?search=" + encodeURIComponent(school))
      } else {
        window.location =
          this.$url("/search/?search=" +
          encodeURIComponent(school["school.name"]) +
          "&id=" +
          school.id)
      }
    },
    handleFieldOfStudySelected(fieldOfStudy) {
      window.location =
        this.$url("/search/?toggle=fos&cip4=" + encodeURIComponent(fieldOfStudy.cip4))
    },
    handleFoSMoreOptionsClick() {
      window.location = this.$url("/search/?toggle=fos")
    },
  },
}
</script>
