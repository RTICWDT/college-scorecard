<template>
  <div>
    <v-main>
      <div class="home-splash">
        <v-card tile>
          <search-tabs :selected="1" />
        </v-card>
        <v-container class="mb-n10 pt-sm-16 pt-5">
          <v-row>
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
            <v-col cols="12" class="pb-0">
              <v-card class="pa-5 homepage-search-container" flat>
                <v-row>
                  <v-col cols="12" sm="5">
                    <p>Search Fields of Study</p>
                    <field-of-study-search
                      @field-of-study-selected="handleFieldOfStudySelected"
                      :selected="input.cip4"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <p>Select Degree Type</p>
                    <v-select
                      :items="fosDegrees"
                      item-text="label"
                      item-value="value"
                      outlined
                      placeholder="Select one"
                      v-model="input.cip4_degree"
                      hide-details
                    >
                    </v-select>
                  </v-col>
                  <v-col col="1" class="">
                    <p class="d-none d-sm-block">&nbsp;</p>
                    <v-btn
                      @click="handleFormSubmit"
                      width="100%"
                      x-large
                      color="secondary"
                      :disabled="disableSearch"
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
      <div class="home-links pt-sm-15 mb-sm-15">
        <v-container class="mt-8">
          <v-row class="align-stretch">
            <v-col cols="12" md="6" class="pr-sm-8 pt-8 pt-sm-0">
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

            <v-col cols="12" md="6" sm="12" class="pl-sm-8 pt-sm-0">
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
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
import FieldOfStudySearch from "~/components/FieldOfStudySearch.vue"
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import SearchTabs from "~/components/SearchTabs.vue"
import { formMappings } from "~/js/constants.js"

export default {
  mixins: [AnalyticsEvents],
  components: {
    FieldOfStudySearch,
    CompareDrawer,
    CompareHeader,
    SearchTabs,
  },
  data() {
    return {
      input: {
        cip4: null,
        cip4_degree: null,
      },
    }
  },
  computed: {
    fosDegrees() {
      return formMappings.fosDegrees
    },
    disableSearch() {
      return this.input.cip4 === null || this.input.cip4_degree === null
    },
  },
  methods: {
    handleFieldOfStudySelected(fieldOfStudy) {
      this.input.cip4 = fieldOfStudy.cip4
    },
    handleFormSubmit() {
      this.$router.push(
        `/search/fos?cip4=${encodeURIComponent(
          this.input.cip4
        )}&cip4_degree=${encodeURIComponent(this.input.cip4_degree)}`
      )
    },
  },
  metaInfo: {
    title: "Field of Study Search",
  },
}
</script>
