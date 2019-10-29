<template>
  <v-app>
    <scorecard-header />

    <v-content class="white">
      <data-navigation current="/data/" />

      <v-container>
        <v-row>
          <v-col cols="12" lg="8">
            <h2 class="display-1 mb-2">Download the Data</h2>
            <p>
              Download the data that appear on the College Scorecard, as well as
              supporting data on student completion, debt and repayment, earnings,
              and more. 
            </p>

            <p>
              This data was
              <strong>last updated November NN, 2019</strong>.
            </p>
            <p class='title font-weight-bold text-center mb-0'>Data Downloads</p>
            <v-row>
              <v-col cols="12" sm="4">
                <v-card class='pa-2 text-center fill-height' 
                  :href="dataBase_url+'/CollegeScorecard_Raw_Data.zip'"
                  @click="trackDownload('CollegeScorecard_Raw_Data.zip')"
                  hover
                >
                  <p class='title font-weight-bold'>All Data Files&nbsp;<simple-tooltip><p>Contains the following data:</p><ul><li>Institution-level data files for 1996-97 through 2017-18 containing aggregate data for each institution. Includes information on institutional characteristics, enrollment, student aid, costs, and student outcomes.<li>Field of study-level data files for the pooled 2014-15, 2015-16 award years through the pooled 2015-16, 2016-17 award years containing data at the credential level and 4-digit CIP code combination for each institution. Includes information on cumulative debt at graduation and earnings one year after graduation.</li><li>Crosswalk files for 2000-01 through 2017-18 that link the Department’s OPEID with an IPEDS UNITID for each institution.</li></ul></simple-tooltip></p>
                  <p>NNN MB ZIP</p>
                </v-card>    
              </v-col>
              <v-col cols="12" sm="4">
                <v-card class='pa-2 text-center fill-height' @click="trackDownload('Most-Recent-Cohorts-All-Data-Elements.csv')"
                    :href="dataBase_url+'/Most-Recent-Cohorts-All-Data-Elements.csv'" hover>
                  <p class='title font-weight-bold'>Most Recent Institution-Level Data</p>

                  <p>NNN MB CSV</p>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card class='pa-2 text-center fill-height'                     @click="trackDownload('Most-Recent-Field-Of-Study.csv')"
                    :href="dataBase_url+'/Most-Recent-Field-Of-Study.csv'" hover>
                  <p class='title font-weight-bold'>Most Recent Data by Field of Study</p>

                  <p>NNN MB CSV</p>
                </v-card>

              </v-col>
            </v-row>
            <p class='mt-8'>Looking for help? Visit <a href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"  @click="trackOutboundLink($event)" target="_blank">
              StackExchange
            </a> or email the helpdesk at <a href='mailto:scorecarddata@rti.org'>scorecarddata@rti.org</a>.</p>
          </v-col>

        </v-row>
        <v-row class="">
          <v-col cols="12" md="8">
            <h2 class="display-1 mb-2">Outside Organizations Collecting Voluntary&nbsp;Data</h2>
            <p>Some other organizations have recently launched efforts to collect more accurate data on college completion, remedial education and workforce outcomes.</p>
            <ul class="my-3">
              <li>
                <a
                  href="http://www.studentachievementmeasure.org"
                  target="_blank"
                  @click="trackOutboundLink($event)"
                >
                  Student Achievement Measure initiative
                  <i class="fa fa-external-link"></i>
                </a>
              </li>
              <li>
                <a
                  href="http://vfa.aacc.nche.edu/Pages/default.aspx"
                  target="_blank"
                  @click="trackOutboundLink($event)"
                >
                  Voluntary Framework of Accountability initiative
                  <i class="fa fa-external-link"></i>
                </a>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <scorecard-footer />
  </v-app>
</template>


<script>
import DataNavigation from "components/vue/DataNavigation.vue";
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
import SimpleTooltip from "components/vue/SimpleTooltip.vue";
export default {
  mixins: [AnalyticsEvents],
  components: {
    "data-navigation": DataNavigation,
    "simple-tooltip": SimpleTooltip
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>