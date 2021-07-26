<template>
  <v-app id="training">
    <scorecard-header active-link="training"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    <v-main>
    <div class="justify-center text-center" style="background:#fff;">
      
      <div class="text-center justify-center ms-8 py-4" style="width: max-content; margin: auto !important;"> 
        <img :src="`${$baseUrl}/img/icon-Note.svg`" alt="Note Icon" style="vertical-align: middle;"/>  <span>The College Scorecard shows all schools and programs that qualify for Pell Grants <tooltip definition="wioa-participants"/></span>
      </div>        
      </div>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <!-- Header Info -->
            <v-col cols="2"></v-col>
            <v-col cols="8">

              <h1 class="white--text text-uppercase text-center">
                Find the Right Training Program For You.
              </h1>

              <p class="white--text text-center ms-8"> 
                Training programs are a great way to jumpstart or reinvigorate your career. You may be eligible for free money to help pay for higher education!
              </p>

            </v-col>
            <v-col cols="2"></v-col>
          </v-row>

          <v-row class="px-md-6">
            <v-col
              cols="12"
              class="d-flex pb-10"
            >
              <v-card class="pa-8" width="100%">
               <v-container>
                 <v-row align="center">
                   <v-col cols="12" md="6" sm="12">
                     <h3 class="text-left pb-2">Schools with qualifying programs:<tooltip definition="wioa-participants"/></h3>
                     <p>Search nearby schools that accept Pell Grants. These colleges also have eligible training programs for participants in Workforce Innovation and Opportunity Act (WIOA) programs, which are funded by the U.S. Department of Labor and operated by state and local grantees.</p>
                   </v-col>
                   <v-col cols="12" md="6" sm="12" align="center">
                     <div class="search-nearby-container">
                    <p class="text-center home-callout-button-wrapper justify-center" style="padding:10px; margin:20px 10px !important;">

                      <v-btn
                        large
                        color="secondary"
                        @click="handleSearchNearbySchools()"
                      >
                      <img :src="`${$baseUrl}/img/icon-Location.svg`" alt="Department of Labor Icon" style="padding:10px 30px 10px 10px; !important"/> SEARCH NEARBY SCHOOLS

                      </v-btn>
                    </p>    
                    </div>                 
                   </v-col>
                 </v-row>
               </v-container>     
              </v-card> 
            </v-col>

            <!-- Medium and Larger Tabs and Search Content -->
            <v-col
              cols="12"
              class="d-sm-flex pb-10"
            >           
              <v-card class="pa-8" width="100%">
                <h3 class="text-center pb-2">Search fields of study at schools that have WIOA training programs:<tooltip definition="wioa-participants"/></h3>
                <field-of-study-search
                  @field-of-study-selected="handleFieldOfStudySelected"
                />             
              </v-card>
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

                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img :src="`${$baseUrl}/img/Logo-Department-of-Labor.png`" alt="Department of Labor Icon">
                    </div>
                  </div>


                </div>

                <h3>
                  Department of Labor WIOA Program
                </h3>

                <p>
                  Department of Labor WIOA Program Some training programs are eligible for funding through the Workforce Innovation and Opportunity Act (WIOA), depending on your state and local needs. Search all training programs that are funded through WIOA on TrainingProviderResults.gov. This Department of Labor tool provides key outcome data on WIOA programs such as training completion, credential attainment, employment and wages.
                </p>

                <p class="home-callout-button-wrapper text-center">
                  <a
                    href="https://trainingproviderresults.gov"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >TRAININGPROVIDERRESULTS.GOV</a>
                </p>

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

                  <div class="home-icon-wrapper">
                    <div class="home-icon">
                      <img :src="`${$baseUrl}/img/Icon-Financial-Aid-training.svg`" alt="Financial Aid Icon">
                    </div>
                  </div>
                </div>

                <h2>
                  Get started with Financial Aid
                </h2>

                <p>
                  Get Started with Financial Aid To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA). You also may qualify for a Pell Grant, which is a federal program that provides free money for higher education. In order to see if you qualify for a Pell Grant, you must submit a FAFSA. Use the  
                  <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    FAFSA<em>4caster</em>
                  </a>

                  to see how much aid may be available for you.
                </p>

                <p class="text-center home-callout-button-wrapper">
                  <v-btn
                    block
                    color="secondary"
                    href="https://fafsa.ed.gov/"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >Start Your FAFSA&reg; Application 
                    <v-icon
                      x-small
                    >
                      fas fa-external-link-alt
                    </v-icon>
                  </v-btn>
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
  min-height: 200px;
  padding-top: 1.5rem;
}
.search-nearby-container{
  background: #BFDDF2 0% 0% no-repeat padding-box;
  border-radius: 16px;
  padding:15px;
  width:100%;
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
      background: linear-gradient(to bottom, #97CFF5 50%, #0075B2 50%);
    }
  }

  .home-callout-container{
    margin-bottom: 80px;
    height: 630px;
    background-color: white;
    box-shadow: 0px 3px 6px #00000029;

    @media (min-width: 960px) {
      margin-bottom: inherit;
      height: 720px;
    }
  }

  .home-callout-top{
    background-color: #c4e4f9;
    height: 70px;

    h2{
      position: relative;
      bottom: 50px;
    }

    @media (min-width: 960px) {
      height: 70px;
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

.homeCallout {
  /*background-color: #ffffff;*/
  h2 {
    font-weight: bold !important;
    /*color: #ffffff;*/
    text-align: center;
    padding: 1rem;
    /*margin-bottom: 2rem !important;*/
  }

  h3{
    text-align: center;
    margin-bottom: .5rem !important;
  }

  h3{
    text-align: center;
    margin-bottom: .5rem !important;
  }

  p {
    text-align: left;
    padding: 0rem
      0.9rem;

    margin-bottom: 2rem !important;
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
  top: -35px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0px 3px 6px #00000029;

  @media (min-width: 960px) {
    width: 133px;
    height: 133px;
    top: -50px;
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
  import Tooltip from "../../components/vue/Tooltip.vue";
  import LocationCheck from '../../vue/mixins/LocationCheck.js'

  export default {
  mixins: [AnalyticsEvents, compare, LocationCheck],
  components: {
    "paying-for-college": PayingForCollege,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete,
    "field-of-study-search": FieldOfStudySearch,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    'tooltip': Tooltip,
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
      window.location = this.$baseUrl+'/search/?toggle=fos&dolflag=1&cip4=' + encodeURIComponent(fieldOfStudy.cip4);
    },
    handleFoSMoreOptionsClick(){
      window.location = `${this.$baseUrl}/search/?toggle=fos`;
    },
    handleSearchNearbySchools(){
      this.handleLocationCheck(this.$baseUrl+'/search/?toggle=institutions&dolflag=1');
      //window.location = this.$baseUrl+'/search/?toggle=institutions&dolflag=1&lat=0..0&long=0..0';
    },
  },
  mounted() {
    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });
  }
  };
</script>
