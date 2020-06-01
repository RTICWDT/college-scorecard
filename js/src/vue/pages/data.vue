<template>
  <v-app id="data">
    <scorecard-header />
    <v-content>
      <data-navigation current="/data/" />
      <v-container>
        <v-row>
          <v-col cols="12" md="10" offset-md="1">
            <v-card class="py-5 px-10 ma-5">
              <h2 class="display-1 mb-2 font-weight-bold">Download the Data</h2>
              <p>
                Download the data that appear on the College Scorecard, as well as
                supporting data on student completion, debt and repayment, earnings,
                and more.
              </p>

              <p>
                This data was
                <strong>last updated June 1, 2020</strong>.
              </p>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-card
                    class="pa-2 text-center fill-height d-flex align-center justify-center"
                    color="grey lighten-4"
                    :href="dataBase_url+'/CollegeScorecard_Raw_Data.zip'"
                    @click="trackDownload('CollegeScorecard_Raw_Data.zip')"
                    hover
                  >
                    <div>
                      <p class="title font-weight-bold">
                        All Data Files&nbsp;
                        <simple-tooltip>
                          <p>Contains the following data:</p>
                          <ul>
                            <li>Institution-level data files for 1996-97 through 2018-19 containing aggregate data for each institution. Includes information on institutional characteristics, enrollment, student aid, costs, and student outcomes.</li>
                            <li>Field of study-level data files for the pooled 2014-15, 2015-16 award years through the pooled 2015-16, 2016-17 award years containing data at the credential level and 4-digit CIP code combination for each institution. Includes information on cumulative debt at graduation and earnings one year after graduation.</li>
                            <li>Crosswalk files for 2000-01 through 2018-19 that link the Department’s OPEID with an IPEDS UNITID for each institution.</li>
                          </ul>
                        </simple-tooltip>
                      </p>
                      <p>289 MB ZIP</p>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card
                    @click="trackDownload('Most-Recent-Cohorts-All-Data-Elements.csv')"
                    :href="dataBase_url+'/Most-Recent-Cohorts-All-Data-Elements.csv'"
                    hover
                    class="pa-2 text-center fill-height d-flex align-center justify-center"
                    color="grey lighten-4"
                  >
                    <div>
                      <p class="title font-weight-bold">Most Recent Institution-Level Data</p>
                      <p>148 MB CSV</p>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card
                    class="pa-2 text-center fill-height d-flex align-center justify-center"
                    color="grey lighten-4"
                    @click="trackDownload('Most-Recent-Field-Data-Elements.csv')"
                    :href="dataBase_url+'/Most-Recent-Field-Data-Elements.csv'"
                    hover
                  >
                    <div>
                      <p class="title font-weight-bold">Most Recent Data by Field of Study</p>
                      <p>51 MB CSV</p>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <p class="mt-8">
                <strong>Looking for help?</strong> Visit
                <a
                  href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
                  @click="trackOutboundLink($event)"
                  target="_blank"
                >StackExchange</a> or email the help desk at
                <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a> For inquiries by members of the press, please contact <a href="mailto:press@ed.gov">press@ed.gov</a>.
              </p>
            </v-card>
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