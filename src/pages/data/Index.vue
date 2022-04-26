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
              earnings, and more.
            </p>
            <p class="pb-4">
              This data was
              <strong>last updated April 29, 2022</strong>.
            </p>

            <h2 class="my-5">
              All Data Files
              <v-btn
                class="ml-2 green-text"
                href="https://ed-public-download.app.cloud.gov/downloads/CollegeScorecard_Raw_Data_04262022.zip"
                >Download
                <v-icon right dark x-small>
                  fas fa-download
                </v-icon></v-btn
              >
            </h2>

            <ul class="font-weight-regular">
              <li>
                Institution-level data files for 1996-97 through 2020-21
                containing aggregate data for each institution. Includes
                information on institutional characteristics, enrollment,
                student aid, costs, and student outcomes.
              </li>
              <li>
                Field of study-level data files for the pooled 2014-15, 2015-16
                award years through the pooled 2017-18, 2018-19 award years
                containing data at the credential level and 4-digit CIP code
                combination for each institution. Includes information on
                cumulative debt at graduation and earnings one year after
                graduation.
              </li>
              <li>
                Crosswalk files for 2000-01 through 2020-21 that link the
                Department’s OPEID with an IPEDS UNITID for each institution.
              </li>
            </ul>
            <h4 class="my-5">
              Most Recent Institution-Level Data
              <v-btn
                small
                class="ml-2"
                href="https://ed-public-download.app.cloud.gov/downloads/Most-Recent-Cohorts-Institution_04262022.zip"
                >Download
                <v-icon right dark x-small>
                  fas fa-download
                </v-icon></v-btn
              >
            </h4>
            <h4 class="my-5">
              Most Recent Data by Field of Study
              <v-btn
                small
                class="ml-2 btnText"
                href=" https://ed-public-download.app.cloud.gov/downloads/Most-Recent-Cohorts-Field-of-Study_04262022.zip"
                >Download
                <v-icon right dark x-small>
                  fas fa-download
                </v-icon></v-btn
              >
            </h4>
            <hr />
            <p class="mt-8">
              <strong>Looking for help?</strong> Visit
              <a
                :href="
                  $url(
                    '/school/transition/'
                  )
                "
                @click="transitionOutboundLink($event, 'http://opendata.stackexchange.com/questions/tagged/collegescorecard')"
                target="_blank"
                >StackExchange<v-icon x-small class="pl-1" color="#007000">
                  fas fa-external-link-alt
                </v-icon>
              </a>
              or email the help desk at
              <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>.
              For inquiries by members of the press, please contact
              <a href="mailto:press@ed.gov">press@ed.gov</a>.
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
    title: "Data Home",
  },
}
</script>
