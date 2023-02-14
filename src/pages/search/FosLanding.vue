<template>
  <div>
    <v-main>
      <!-- Top Splash and Search-->
      <div class="home-splash">
        <v-card tile>
          <search-tabs :selected="1" />
        </v-card>
        <v-container class="mb-n10 pt-sm-16 pt-5">
          <v-row>
            <!-- Header Info -->
            <v-col cols="12" class="px-6 px-sm-3">
              <h1 class="white--text">
                Search Fields of Study
              </h1>

              <p class="white--text">
                Search and compare the fields of study offered at each college
                by degree type.
              </p>
            </v-col>
          </v-row>

          <v-row>
            <!-- Medium and Larger Tabs and Search Content -->
            <v-col cols="12" class="pb-0">
              <v-card class="pa-5 homepage-search-container" flat>
                <v-row>
                  <v-col cols="6">
                    <p>Search Fields of Study</p>
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                    />
                  </v-col>
                  <v-col cols="4">
                    <p>Select Degree Type</p>
                    <v-select
                      :items="fosDegrees"
                      item-text="label"
                      item-value="value"
                      outlined
                      placeholder="Select one"
                    >
                    </v-select>
                  </v-col>
                  <v-col col="1" class="">
                    <p>&nbsp;</p>
                    <v-btn
                      @click="handleFoSMoreOptionsClick"
                      width="100%"
                      x-large
                      color="secondary"
                    >
                      Search
                      <v-icon>mdi-menu-right</v-icon>
                    </v-btn></v-col
                  >
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Bottom Content -->
      <div class="home-links pt-sm-15 mb-15">
        <v-container class="mt-8">
          <v-row class="align-stretch">
            <!-- apprenticeships callout -->
            <v-col cols="12" md="6" class="pr-8">
              <v-card flat class="pa-8">
                <h2 class="display-2 d-flex justify-space-between align-center">
                  What are Fields of Study?
                </h2>
                <hr />
                <p>
                  Fields of study are areas of academic concentration, or a
                  discipline. Often known as majors, or programs.
                </p>
              </v-card>
            </v-col>

            <!-- paying callout -->
            <v-col cols="12" md="6" sm="12" class="pl-8">
              <v-card flat class="pa-8">
                <h2 class="display-2 d-flex justify-space-between align-center">
                  Explore Fields of Study
                </h2>
                <hr />
                <p>
                  College Scorecard’s Field of Study search allows you to
                  explore the subject areas of Certificate, Associate’s,
                  Bachelor’s, and even advanced degrees offered at colleges all
                  over the United States. Use College Scorecard to compare
                  costs, earnings, and debt burdens between fields of study.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";

h1 {
  font-size: 50px;
  text-transform: none;
}
.v-card {
  height: 100%;
}

.home-splash {
  font-family: $base-font-family !important;
  background-color: $bg-blue !important;
}
.home-links {
  background-color: $bg-gray;
}
</style>

<script>
import querystring from "querystring"
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import FieldOfStudySearchNameAndDegree from "~/components/FieldOfStudySearchNameAndDegree.vue"
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import SearchTabs from "~/components/SearchTabs.vue"
import { formMappings } from "~/js/constants.js"

export default {
  mixins: [AnalyticsEvents],
  components: {
    "field-of-study-search": FieldOfStudySearch,
    "field-of-study-search-name-and-degree": FieldOfStudySearchNameAndDegree,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    SearchTabs,
  },
  data() {
    return {
      toggleCustomSearch: false,
      sliderColor: "#7BD88C",
    }
  },
  computed: {
    fosDegrees() {
      return formMappings.fosDegrees
    },
  },
  methods: {
    colorSlider(num) {
      switch (num) {
        case 0:
          this.sliderColor = "#7BD88C"
          break
        case 1:
          this.sliderColor = "#FDB022"
          break
        default:
          this.sliderColor = "#FFFFFF88"
          break
      }
    },
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params)
      let url =
        "/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")

      // Direct to location.
      //window.location.href = this.$url(url)
      this.$router.push(url)
    },

    handleFieldOfStudySelected(fieldOfStudy) {
      this.$router.push(
        "/search/fos?cip4=" + encodeURIComponent(fieldOfStudy.cip4)
      )
    },
  },
  metaInfo: {
    title: "College Scorecard",
  },
}
</script>
