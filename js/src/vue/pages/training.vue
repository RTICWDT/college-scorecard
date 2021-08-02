<template>
  <v-app id="training">
    <scorecard-header active-link="training"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    <v-main>
    <div class="justify-center" style="background:#fff;width:100%;">    
        <v-container><v-row>
          <v-col cols="1" class="justify-end"><img :src="`${$baseUrl}/img/icon-Note.svg`" alt="Note Icon" style="vertical-align: middle;float:right;"/></v-col>
          <v-col cols="11"><p class="align-left text-left" style="">CollegeScorecard.ed.gov/training provides information on colleges that provide Pell Grants<tooltip definition="pell-grant" style="vertical-align: text-bottom;"/> and that also have workforce programs approved by the Department of Labor. For the full list of colleges, click <a href="/">here</a>.</p></v-col>
          </v-row></v-container>     
      </div>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row class="pb-16 dol-header">
            <!-- Header Info -->
            <v-col cols="2"></v-col>
            <v-col cols="8">

              <h1 class="white--text text-uppercase text-center">
                Find the Right Training Program For You.
              </h1>

              <p class="white--text text-center ms-8"> 
                Training programs are a great way to jumpstart or reinvigorate your career. You may be eligible for funding to help pay for higher education!
              </p>

            </v-col>
            <v-col cols="2"></v-col>
          </v-row>

          <v-row class="px-md-6">
            <v-col
              cols="12"
              class="d-flex pb-10 pt-0"
            >
              <v-card class="pa-8" width="100%">
               <v-container>
                 <v-row align="center">
                   <v-col cols="12" md="6" sm="12">
                     <h3 class="text-left pb-2">Schools with WIOA eligible programs<tooltip definition="wioa-participants"/></h3>
                     <p>Search nearby schools that both accept Pell Grants and are Workforce Innovation and Opportunity Act (WIOA) eligible training providers.</p>
                     <p>These colleges have eligible training programs where participants may be able to receive funding from WIOA in addition to Pell Grants. <em>In some states, Unemployment Insurance (UI) recipients can attend school or training and continue to receive UI benefits (<a href="https://www.dol.gov/general/topic/unemployment-insurance"
                        target="_blank"
                        @click="trackOutboundLink($event)">learn more about UI benefits</a> in your state).</em></p>
                   </v-col>
                   <v-col cols="12" md="6" sm="12" align="center">
                     <div class="search-nearby-container">
                    <p class="text-center home-callout-button-wrapper justify-center py-3 my-5">

                      <v-btn
                        large
                        color="secondary"
                        @click="handleSearchNearbySchools()"
                      >
                      <img :src="`${$baseUrl}/img/icon-Location.svg`" alt="Department of Labor Icon" class="py-3 pl-3 pr-1"/> SEARCH NEARBY SCHOOLS

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
                <h3 class="text-center pb-2">Search fields of study at schools that have WIOA training programs<tooltip definition="wioa-participants"/></h3>
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

                <h3 class="pb-5 mx-10">
                  Department of Labor WIOA Program
                </h3>

                <p class="mx-10">
                  Some training programs are eligible for funding through the Workforce Innovation and Opportunity Act (WIOA), depending on your state and local needs. Search all training programs that are funded through WIOA on TrainingProviderResults.gov. This Department of Labor tool provides key outcome data on WIOA programs such as training completion, credential attainment, employment and wages.
                </p>

                <p class="home-callout-button-wrapper text-center">
                  <a
                    href="https://trainingproviderresults.gov"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                  >TrainingProviderResults.gov
                    <v-icon
                      x-small
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                  
                  </a>
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
                      <img :src="`${$baseUrl}/img/icon-Financial-Aid-training.svg`" alt="Financial Aid Icon">
                    </div>
                  </div>
                </div>

                <h3 class="pb-5  mx-10">
                  Get Started with Financial Aid
                </h3>

                <p class="mx-10">
                  To receive financial aid, you must complete the Free Application for Federal Student Aid (FAFSA). You also may qualify for a Pell Grant, which is a federal program that provides free money for higher education. In order to see if you qualify for a Pell Grant, you must submit a FAFSA. Use the  
                  <a href="https://fafsa.ed.gov/FAFSA/app/f4cForm"
                     target="_blank"
                     @click="trackOutboundLink($event)"
                  >
                    FAFSA<em>4caster</em>
                    <v-icon
                      x-small
                      class="green-link pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>                    
                  </a>

                  to see how much aid may be available for you.
                </p>

                <p class="text-center home-callout-button-wrapper white--text mx-10">
                  <v-btn
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
.v-application {
    background-repeat: repeat !important;
    background-color: #2771ad !important;
    background-image: linear-gradient(to bottom, rgb(39, 113, 173, .24) 30%, rgb(0, 54, 94, 1) 30% 65%, rgb(39, 113, 173, 1) 65% 100%), url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%233d82b1' fill-opacity='0.24' fill-rule='evenodd'/%3E%3C/svg%3E") !important;  
}
.home-splash {
  min-height: 200px;
  padding-top: 5rem;
  h1 {
    font-size:30px;
  }
}
.dol-header {
  background-image: url("/img/background-2.svg") !important;
  background-position:center;
  background-repeat: no-repeat;
  background-attachment: fixed;
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
      //background-image: url(""), linear-gradient(to bottom, #00365E 50%, #0075B2 50%);
    }
  }

  .home-callout-container{
    margin-bottom: 80px;
    padding-bottom: 60px;

    background-color: white;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 4px;

    @media (min-width: 960px) {
      margin-bottom: inherit;

    }
  }

  .home-callout-top{
    background-color: #c4e4f9;
    height: 75px;

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
    handleFieldOfStudySelected(fieldOfStudy){
      this.handleLocationCheck(this.$baseUrl+'/search/?toggle=fos&dolflag=true&sort=avg_net_price:asc&cip4=' + encodeURIComponent(fieldOfStudy.cip4));
    },
    handleSearchNearbySchools(){
      this.handleLocationCheck(this.$baseUrl+'/search/?toggle=institutions&dolflag=true&sort=avg_net_price:asc');
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
