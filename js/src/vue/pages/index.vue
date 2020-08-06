<template>
  <v-app id='index'>
    <scorecard-header />
    <v-content>
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <v-col cols="12">
              <h1 class="white--text text-uppercase text-center">Find the Right Fit.</h1>
              <p
                class="white--text text-center"
              >Find out about colleges: their programs, costs, admissions, results, and more.</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="10"
              offset-sm="1"
              md="8"
              offset-md="2"
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
<!--                <v-tab @click="GATrackEvent('Home Tab','Tab','Custom Search')">-->
<!--                  <span class="hidden-sm-and-down">Custom Search</span>-->
<!--                  <span class="hidden-md-and-up">Search</span>-->
<!--                </v-tab>-->
<!--                <v-tab @click="GATrackEvent('Home Tab','Tab','Name Search')" color="white">Name Search</v-tab>-->
                <v-tab @click="GATrackEvent('Home Tab','Tab','Search Schools')" color="white">Search Schools</v-tab>
                <v-tab @click="GATrackEvent('Home Tab','Tab','Search Fields of Study')" color="white">Search Fields of Study</v-tab>
                <v-tab @click="GATrackEvent('Home Tab','Tab','Show Me Options')" color="white">Show Me Options</v-tab>
                <v-tab-item>
<!--                  <v-card class="px-5 pt-0 pb-5">-->
<!--                    <search-form @search-query="directToSearch" />-->
<!--                  </v-card>-->
                      <v-card class="pa-5 mb-3">
                        <name-autocomplete @school-name-selected="handleSchoolNameSelected" />

                        <div class="mt-5 text-right">
<!--                          <a :href="`${$baseUrl}/search/?toggle=institutions`">Custom Search</a>-->
                          <v-btn text small
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
                <v-tab-item>
<!--                  <v-card class="pa-5 mb-3">-->
<!--                    <name-autocomplete @school-name-selected="handleSchoolNameSelected" />-->
<!--                  </v-card>-->
                  <v-card class="pa-5">
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                    />

                    <div class="mt-5 text-right">
                      <a :href="`${$baseUrl}/search/?toggle=fos`">Custom Search</a>
                    </div>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card style="min-height: 300px" class="px-10 py-5">
                    <p
                      class="my-2 text-center"
                    >Select one or more options to create a list of schools that fit your needs.</p>
                    <canned-search-container @canned-search-submit="directToSearch"></canned-search-container>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>

            <!-- Mobile View -->
            <v-col cols="12" class="pa-5 d-block d-sm-none">
              <v-expansion-panels class="mb-2" v-model="mobilePanels">
                <v-expansion-panel>
                  <v-expansion-panel-header>Search Schools</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <name-autocomplete @school-name-selected="handleSchoolNameSelected" />
                  </v-expansion-panel-content>
<!--                  <v-expansion-panel-header>Name Search</v-expansion-panel-header>-->
<!--                  <v-expansion-panel-content>-->
<!--                    <name-autocomplete @school-name-selected="handleSchoolNameSelected" />-->
<!--                  </v-expansion-panel-content>-->
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-header>Search Field Of study</v-expansion-panel-header>
                  <v-expansion-panel-content class="ma-0 mt-n5 mx-n5">
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                    />
                  </v-expansion-panel-content>
<!--                  <v-expansion-panel-header>Custom Search</v-expansion-panel-header>-->
<!--                  <v-expansion-panel-content class="pa-0 ma-0 mt-n5 mx-n5">-->
<!--                    <search-form @search-query="directToSearch" />-->
<!--                  </v-expansion-panel-content>-->
                </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels class="mb-2">
                <v-expansion-panel>
                  <v-expansion-panel-header>Show Me Options</v-expansion-panel-header>
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
      <div class="homeContent mt-5 pa-6">
        <v-container class="pa-0 my-0">
          <v-row class="pa-0">
            <v-col
              cols="12"
              sm="5"
              offset-sm="1"
              class="homeCallout apprenticeships pa-0 my-0 mr-sm-3"
            >
              <div class="home-icon-wrapper">

              </div>
              <h2 class="title">Alternative Pathways to a Career</h2>
              <p>
                <strong>Apprenticeships</strong> are another great way to jump-start your career.
              </p>
              <p>
                <v-btn
                  rounded
                  color="secondary"
                  href="https://www.apprenticeship.gov/apprenticeship-finder"
                  target="_blank"
                  @click="trackOutboundLink($event)"
                >Find one that's right for you!</v-btn>
              </p>
              <p>
                Curious what careers are out there?
                <strong>O*NET’s career explorer</strong> is there to help!
              </p>
              <p>
                <v-btn
                  rounded
                  color="secondary"
                  href="https://www.onetonline.org/find/"
                  target="_blank"
                  @click="trackOutboundLink($event)"
                >Explore Careers</v-btn>
              </p>
            </v-col>
            <v-col cols="12" sm="5" class="homeCallout paying pa-0 my-0 ml-sm-3">
              <div class="home-icon-wrapper">
              </div>
              <paying-for-college></paying-for-college>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-content>
    <scorecard-footer />
  </v-app>
</template>

<style lang="scss" scoped>
@import 'sass/_variables.scss';
.home-splash {
  min-height: 500px;
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
  p {
    text-align: center;
    padding: 0rem
      2rem
      0.4rem;
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
    margin: 0 auto;
    width: 100px;
    height: 100px;
    background: #FFFFFF;
    border-radius: 50%
  }

</style>

<script>
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CannedSearchContainer from "components/vue/CannedSearchContainer.vue";
import querystring from "querystring";
import SearchForm from "components/vue/SearchForm.vue";
import NameAutocomplete from "components/vue/NameAutocomplete.vue";
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
import FieldOfStudySearch from '../../components/vue/FieldOfStudySearch.vue';

export default {
  mixins: [AnalyticsEvents],
  components: {
    "paying-for-college": PayingForCollege,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
  },
  props: ["baseUrl"],
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
    }
  }
};
</script>