<template>
  <v-app id='index'>

    <scorecard-header active-link="/"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    
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
                Search and compare colleges: their fields of study, costs, admissions, results, and more.
              </p>

            </v-col>
          </v-row>

          <v-row class="px-md-6">

            <!-- Medium and Larger Tabs and Search Content -->
            <v-col
              cols="12"
              class="d-none d-sm-flex pb-10"
            >
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
                  @click="GATrackEvent('Home Tab','Tab','Search Schools')"
                  color="white"
                >
                  Search Schools
                </v-tab>

                <v-tab
                  @click="GATrackEvent('Home Tab','Tab','Search Fields of Study')"
                  color="white"
                >
                  Search Fields of Study
                </v-tab>

                <v-tab
                  @click="GATrackEvent('Home Tab','Tab','Show Me Options')"
                  color="white"
                >
                  Show Me Options
                </v-tab>

                <!-- Institution Search-->
                <v-tab-item>
                  <v-card class="pa-5 homepage-search-container">
                    <name-autocomplete @school-name-selected="handleSchoolNameSelected" />

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
                      Select one or more options to create a list of schools that fit your needs.
                    </p>

                    <canned-search-container @canned-search-submit="directToSearch"></canned-search-container>
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
                    <name-autocomplete @school-name-selected="handleSchoolNameSelected" />
                  </v-expansion-panel-content>

                </v-expansion-panel>
              </v-expansion-panels>


              <!-- Mobile FoS Search-->
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="home-mobile-search-title">Search Fields of Study</span>
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
                    <span class="home-mobile-search-title">Show Me Options</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <p
                      class="my-2"
                    >Select one or more options to create a list of schools that fit your needs.</p>
                    <canned-search-container @canned-search-submit="directToSearch" class="mx-5"></canned-search-container>
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
            <v-col class="homeCallout apprenticeships"
              cols="12"
              md="6"
              sm="12"
            >

              <div class="home-callout-container mr-md-3">

                <div class="home-callout-top mb-12">
                  <div class="home-callout-text">
                    <h2 class="title mt-4 mt-md-0">
                      There's more than one pathway to a career
                    </h2>
                  </div>
                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img :src="`${$baseUrl}/img/icon-pathways.svg`" alt="Pathways Icon">
                    </div>
                  </div>
                </div>

                <p>
                  Start your career and build your skill set through <strong>apprenticeships:</strong>
                </p>

                 <a class="homeCallout-indent" href="https://www.apprenticeship.gov/apprenticeship-finder"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to apprenticeship.gov
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>

                <p>
                  Build your future with O*NET online, your tool for <strong>career exploration and job analysis:</strong>
                </p>

                 <a class="homeCallout-indent" href="https://www.onetonline.org/find/"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to ONETonline.org
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>        

                <p>
                  Discover Career One Stop, your source for <strong>career exploration training and jobs:</strong>
                </p>

                 <a class="homeCallout-indent" href="https://careeronestop.org"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to CareerOneStop.org
                    <v-icon
                      x-small
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                <hr/>                        

                <p>
                  <strong>Find training programs:</strong> compare completion rates, employment rates, and more:
                </p>

                 <a class="homeCallout-indent" href="https://trainingproviderresults.gov"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    Go to TrainingProviderResults.gov
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>
              </div>

            </v-col>

            <!-- paying callout -->
            <v-col class="homeCallout paying"
              cols="12"
              md="6"
              sm="12"
            >

              <div class="home-callout-container ml-md-3">

                <div class="home-callout-top mb-12">
                  <div class="home-callout-text">
                    <h2 class="title mt-4 mt-md-0">
                      Learn More About Paying for College
                    </h2>
                  </div>
                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img :src="`${$baseUrl}/img/icon-financial-aid.svg`" alt="Financial Aid Icon">
                    </div>
                  </div>
                </div>

                <p>
                  You can learn more about the types of financial aid that are available at

                 <a href="https://studentaid.gov"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    StudentAid.gov
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>                  
                </p>

                <p>
                  To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA&#174;) form.
                  You can use

                  <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    FAFSA<em>4caster</em>
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>                     
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
                  >Start Your FAFSA&reg; Application
                    <v-icon
                      x-small
                      color="green"
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </v-btn>
                </p>

                <hr/>

                <p>
                  Veterans are eligible for higher education fudning through the G.I. Bill benefits. Use the 

                  <a
                    href="https://www.vets.gov/gi-bill-comparison-tool"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >
                    GI Bill&reg; comparison tool 
                    <v-icon
                      x-small
                      color="green"
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
        :show-info-text="showInfoText"
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
        @toggle-more-info="showInfoText = !showInfoText"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>

<style lang="scss" scoped>
@import 'sass/_variables.scss';
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
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active){
    color: #FFFFFF !important;
  }

.homeContent {
  /*border-top: 20px*/
  /*  solid*/
  /*  #ffffff;*/
  background-color: #b5d7f4;
}

  #home-content-container{
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

  .home-callout-top{
    background-color: #c4e4f9;
    height: 120px;

    h2{
      position: relative;
      bottom: 50px;
    }

    @media (min-width: 960px) {
      height: 180px;
    }
  }

  .home-icon{
    img{
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

  .homepage-search-container{
    min-height: 150px;
  }

</style>
<style lang="scss">
@import 'sass/_variables.scss';
.homeCallout {
  /*background-color: #ffffff;*/
  a i {
    color:$darker-green;
  }
  hr {
    margin: 2rem 2rem;
    height: 2px;
  }
  a.homeCallout-indent {
    padding:0rem 2rem;
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
    padding: 0rem 2rem;
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

  background: #FFFFFF;

  @media (min-width: 960px) {
    width: 133px;
    height: 133px;

  }
}
  .home-callout-button-wrapper{
    margin: unset;

    @media (min-width: 960px) {
      margin: 0 60px;
    }
  }

  .home-mobile-search-title{
    font-size: 16px;
  }

</style>

<script>
  import PayingForCollege from 'components/vue/PayingForCollege.vue';
  import CannedSearchContainer from 'components/vue/CannedSearchContainer.vue';
  import querystring from 'querystring';
  import SearchForm from 'components/vue/SearchForm.vue';
  import NameAutocomplete from 'components/vue/NameAutocomplete.vue';
  import AnalyticsEvents from 'vue/mixins/AnalyticsEvents.js';
  import FieldOfStudySearch from '../../components/vue/FieldOfStudySearch.vue';
  import { compare } from "vue/mixins.js";
  import CompareDrawer from "components/vue/CompareDrawer.vue";
  import CompareHeader from "components/vue/CompareHeader.vue";
  import { EventBus } from "../EventBus.js";

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
  props: ["baseUrl",'compareSchools','compareFieldsOfStudy'],
  data() {
    return {
      mobilePanels: 0,
      desktopTabs: 0,
      toggleCustomSearch: false
    };
  },
  methods: {
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params);
      let url =
        this.$baseUrl+"/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":");

      // Direct to location.
      window.location.href = url;
    },
    handleSchoolNameSelected(school) {
      if(typeof school == "string")
      {
        // window.location = this.$baseUrl+'/search/?name=' + encodeURIComponent(school);
        window.location = this.$baseUrl+'/search/?search=' + encodeURIComponent(school);
      }else{
        // window.location = this.$baseUrl+'/search/?name=' + encodeURIComponent(school['school.name']) + "&id="+school.id;
        window.location = this.$baseUrl+'/search/?search=' + encodeURIComponent(school['school.name']) + "&id="+school.id;
      }
    },
    handleFieldOfStudySelected(fieldOfStudy){
      window.location = this.$baseUrl+'/search/?toggle=fos&cip4=' + encodeURIComponent(fieldOfStudy.cip4);
    },
    handleFoSMoreOptionsClick(){
      window.location = `${this.$baseUrl}/search/?toggle=fos`;
    }
  },
  mounted() {
    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });
  }
  };
</script>