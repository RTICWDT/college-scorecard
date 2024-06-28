<template>
  <v-main>
    <data-navigation :current="$url('/data/documentation/')" />
    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card flat class="py-5 px-10 ma-5">
            <h1 class="display-1 font-weight-bold pb-2">
              Data Documentation
            </h1>
            <hr />
            <p>
              College Scorecard provides data at the institution-level and data
              by field of study. The technical data documents provide in-depth
              information about these data. The data dictionary includes
              separate worksheets with institution-level and field of study
              dictionaries as well as cohort maps describing the timing aspects
              of each data element.
            </p>
            <div class="">
              <v-row>
                <v-col>
                  <v-btn
                    color="secondary"
                    @click="
                      trackDownload('CollegeScorecardDataDictionary.xlsx')
                    "
                    :href="$url('/assets/CollegeScorecardDataDictionary.xlsx')"
                    target="_blank"
                    large
                    class="my-3"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-download
                    </v-icon>
                    Data Dictionary (.xlsx, 703 KB)
                  </v-btn>
                </v-col></v-row
              >
              <v-row>
                <v-col>
                  <h2>Technical Documentation</h2>
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col>
                  <v-btn
                    color="secondary"
                    @click="trackDownload('InstitutionDataDocumentation.pdf')"
                    :href="$url('/assets/InstitutionDataDocumentation.pdf')"
                    target="_blank"
                    text
                    outlined
                    class="mb-3 mr-2"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-file-pdf
                    </v-icon>
                    Institution-Level Data Files (.pdf, 520 KB)
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="trackDownload('FieldOfStudyDataDocumentation.pdf')"
                    :href="$url('/assets/FieldOfStudyDataDocumentation.pdf')"
                    target="_blank"
                    text
                    outlined
                    class="mb-3"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-file-pdf
                    </v-icon>
                    Field of Study Data Files (.pdf, 827 KB)
                  </v-btn>
                </v-col></v-row
              ><v-row>
                <v-col>
                  <h2>Data Errata</h2>
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col>
                  <v-btn
                    color="secondary"
                    @click="trackDownload('EarningsDataErrata.pdf')"
                    :href="$url('/assets/EarningsDataErrata.pdf')"
                    target="_blank"
                    text
                    outlined
                    class="mb-3 mr-2"
                  >
                    <v-icon x-small class="pr-1">
                      fas fa-file-pdf
                    </v-icon>
                    Cohort Alignment on Earnings Calculations (.pdf, 476 KB)
                  </v-btn>
                </v-col></v-row>

            </div>
            <p class="mt-3">
              <strong>Looking for help?</strong> Visit
              <a
                href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"
                @click="transitionOutboundLink($event)"
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

export default {
  mixins: [AnalyticsEvents],
  components: {
    "data-navigation": DataNavigation,
  },
  metaInfo: {
    title: "Documentation",
    meta: [
      {
        name: "description",
        content:
          "Technical documentation provides in-depth information about institution-level and field-of-study-level data files.",
      },
      {
        name: "keywords",
        content:
          "College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS, institution level data, field of study data, API, OPEID, IPEDS UNITID",
      },
    ],
  },
}
</script>
