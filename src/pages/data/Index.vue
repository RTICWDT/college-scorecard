<template>
  <v-main>
    <data-navigation :current="$url('/data/')" />
    <v-container>
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-card class="py-5 px-10 ma-5">
            <h2 class="display-1 mb-2 font-weight-bold">Download the Data</h2>
            <p>
              Download the data that appear on the College Scorecard, as well as
              supporting data on student completion, debt and repayment,
              earnings, and more. The data is available on
              <a
                :href="$url('/school/transition/?url=' + encodeURIComponent('https://data.ed.gov/dataset/college-scorecard-all-data-files/resources'))"
                target="_blank"
                >data.ed.gov<v-icon
                    x-small
                    class="pl-1"
                    color="#007000"            
                  >
                    fas fa-external-link-alt
                  </v-icon>                  
                </a
              >
              and include the following data files:
            </p>

            <ul>
              <li class="font-weight-bold">
                All Data Files
                <ul class="font-weight-regular">
                  <li>
                    Institution-level data files for 1996-97 through 2019-20
                    containing aggregate data for each institution. Includes
                    information on institutional characteristics, enrollment,
                    student aid, costs, and student outcomes.
                  </li>
                  <li>
                    Field of study-level data files for the pooled 2014-15,
                    2015-16 award years through the pooled 2017-18, 2018-19
                    award years containing data at the credential level and
                    4-digit CIP code combination for each institution. Includes
                    information on cumulative debt at graduation and earnings
                    one year after graduation.
                  </li>
                  <li>
                    Crosswalk files for 2000-01 through 2019-20 that link the
                    Department’s OPEID with an IPEDS UNITID for each
                    institution.
                  </li>
                </ul>
              </li>
              <li class="font-weight-bold">
                Most Recent Institution-Level Data
              </li>
              <li class="font-weight-bold">
                Most Recent Data by Field of Study
              </li>
            </ul>

              <p class="pt-4">
                This data was
                <strong>last updated February 7, 2022</strong>.
              </p>
              <v-row>
                <v-col cols="12" sm="10" offset="1">
                  <v-card
                    class="pa-2 text-center fill-height d-flex align-center justify-center"
                    color="grey lighten-4"
                    :href="$url('/school/transition/?url=' + encodeURIComponent('https://data.ed.gov/dataset/college-scorecard-all-data-files/resources'))"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    hover
                  >
                    <div>
                      <span class="title font-weight-bold">
                        Visit data.ed.gov To Download The Data<v-icon
                              x-small
                              class="pl-1"
                              color="#007000"
                            >
                              fas fa-external-link-alt
                            </v-icon>
                      </span>
                    </div>
                  </v-card>
                </v-col>
                
              </v-row>
              <p class="mt-8">
                <strong>Looking for help?</strong> Visit
                <a
                  :href="$url('/school/transition/?url=' + encodeURIComponent('http://opendata.stackexchange.com/questions/tagged/collegescorecard'))"
                  @click="trackOutboundLink($event)"
                  target="_blank"
                >StackExchange<v-icon
                    x-small
                    class="pl-1"
                    color="#007000"            
                  >
                    fas fa-external-link-alt
                  </v-icon>                  
                </a> or email the help desk at
                <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>. For inquiries by members of the press, please contact <a href="mailto:press@ed.gov">press@ed.gov</a>.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import DataNavigation from "~/components/DataNavigation.vue"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import SimpleTooltip from "~/components/SimpleTooltip.vue"
import { compare } from "~/js/mixins.js"

export default {
  mixins: [AnalyticsEvents, compare],
  components: {
    "data-navigation": DataNavigation,
    "simple-tooltip": SimpleTooltip,
  },
 metaInfo: {
    title: 'Data Home',
  }  
}
</script>
