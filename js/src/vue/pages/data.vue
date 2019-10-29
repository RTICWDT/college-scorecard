<template>
  <v-app>
    <scorecard-header />

    <v-content class="white">
      <data-navigation current="/data/" />

      <v-container>
        <v-row>
          <v-col cols="12" md="8">
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
            <v-row>
              <v-col cols="12" class="d-flex align-stretch justify-space-between">
                <v-card class='pa-2 ma-2 text-center'>
                  <p class='title'>Download All Data Files</p>
                  <v-btn
                    rounded
                    color="secondary"
                    @click="trackDownload('CollegeScorecard_Raw_Data.zip')"
                    :href="dataBase_url+'/CollegeScorecard_Raw_Data.zip'"
                    class="btn my-2"
                  >
                    <v-icon>mdi-search</v-icon>Download
                  </v-btn>
                  <p>NNN MB ZIP</p>
                </v-card>                
                <v-card class='pa-2 ma-2 text-center'>
                  <p class='title'>Most Recent Institution-Level Data</p>
                  <v-btn
                    rounded
                    color="secondary"
                    @click="trackDownload('Most-Recent-Cohorts-All-Data-Elements.csv')"
                    :href="dataBase_url+'/Most-Recent-Cohorts-All-Data-Elements.csv'"
                    class="btn my-2"
                  >
                    <v-icon>mdi-search</v-icon>Download
                  </v-btn>
                  <p>NNN MB CSV</p>
                </v-card>
                <v-card class='pa-2 ma-2 text-center'>
                  <p class='title'>Most Recent Data by Field of Study</p>
                  <v-btn
                    rounded
                    color="secondary"
                    @click="trackDownload('Most-Recent-Field-Of-Study.csv')"
                    :href="dataBase_url+'/Most-Recent-Field-Of-Study.csv'"
                    class="btn my-2"
                  >
                    <v-icon>mdi-search</v-icon>Download
                  </v-btn>
                  <p>NNN MB CSV</p>
                </v-card>

              </v-col>
            </v-row>
            <p>Looking for help? Visit <a href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"  @click="trackOutboundLink($event)" target="_blank">
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
export default {
  mixins: [AnalyticsEvents],
  components: {
    "data-navigation": DataNavigation
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>