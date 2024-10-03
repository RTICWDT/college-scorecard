<template>
  <v-main>
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
                    @click="trackDownload('CollegeScorecardDataDictionary.xlsx')"
                    href='/files/CollegeScorecardDataDictionary.xlsx'
                    target="_blank"
                    size="large"
                    class="my-3"
                  >
                    <v-icon size="x-small" class="pr-1" icon="fa:fas fa-download" />
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
                    variant="outlined"
                    @click="trackDownload('InstitutionDataDocumentation.pdf')"
                    href='/files/InstitutionDataDocumentation.pdf'
                    target="_blank"
                    text
                    outlined
                    class="mb-3 mr-2"
                  >
                    <v-icon size="x-small" class="pr-1" icon="fa:fas fa-file-pdf" />
                    Institution-Level Data Files (.pdf, 520 KB)
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    @click="trackDownload('FieldOfStudyDataDocumentation.pdf')"
                    href='/files/FieldOfStudyDataDocumentation.pdf'
                    target="_blank"
                    text
                    outlined
                    class="mb-3"
                  >
                    <v-icon size="x-small" class="pr-1" icon="fa:fas fa-file-pdf" />
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
                    variant="outlined"
                    @click="trackDownload('EarningsDataErrata.pdf')"
                    href="/files/EarningsDataErrata.pdf"
                    target="_blank"
                    text
                    outlined
                    class="mb-3 mr-2"
                  >
                    <v-icon size="x-small" class="pr-1" icon="fa:fas fa-file-pdf" />
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
              >
                StackExchange
                <v-icon size="x-small" class="ml-2 mr-1" color="#007000" icon="fa:fas fa-external-link-alt"/>
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

<script setup>
const { transitionOutboundLink, trackDownload } = useAnalytics()

useHead({
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
})
</script>