<template>
  <v-app id="data">
    <scorecard-header active-link="data"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
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
                and more. The data is available on <a href="https://data.ed.gov/dataset/college-scorecard-all-data-files-through-6-2020/resources">data.ed.gov</a> and include the following data files:
              </p>

              <ul>
                <li>All Data Files
                  <ul>
                    <li>Institution-level data files for 1996-97 through 2018-19 containing aggregate data for each institution. Includes information on institutional characteristics, enrollment, student aid, costs, and student outcomes.</li>
                    <li>Field of study-level data files for the pooled 2014-15, 2015-16 award years through the pooled 2015-16, 2016-17 award years containing data at the credential level and 4-digit CIP code combination for each institution. Includes information on cumulative debt at graduation and earnings one year after graduation.</li>
                    <li>Crosswalk files for 2000-01 through 2018-19 that link the Department’s OPEID with an IPEDS UNITID for each institution.</li>
                  </ul>
                </li>
                <li>Most Recent Institution-Level Data</li>
                <li>Most Recent Data by Field of Study</li>
              </ul>

              <p class="pt-4">
                This data was
                <strong>last updated December 1, 2020</strong>.
              </p>
              <v-row>
                <v-col cols="12" sm="10" offset="1">
                  <v-card
                    class="pa-2 text-center fill-height d-flex align-center justify-center"
                    color="grey lighten-4"
                    href="https://data.ed.gov/dataset/college-scorecard-all-data-files-through-6-2020/resources"
                    target="_blank"
                    @click="trackOutboundLink($event)"
                    hover
                  >
                    <div>
                      <p class="title font-weight-bold">
                        Visit data.ed.gov To Download The Data&nbsp;
                      </p>
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
                <a href="mailto:scorecarddata@rti.org">scorecarddata@rti.org</a>. For inquiries by members of the press, please contact <a href="mailto:press@ed.gov">press@ed.gov</a>.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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


<script>
import DataNavigation from "components/vue/DataNavigation.vue";
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
import SimpleTooltip from "components/vue/SimpleTooltip.vue";
import { compare } from "vue/mixins.js";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { EventBus } from "../EventBus.js";

export default {
  mixins: [AnalyticsEvents, compare],
  components: {
    "data-navigation": DataNavigation,
    "simple-tooltip": SimpleTooltip,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary",'compareSchools','compareFieldsOfStudy'],
  mounted() {
    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });
  }
};
</script>