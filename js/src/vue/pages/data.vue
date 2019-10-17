<template>
  <v-app>
  <v-content class="white">
    <data-navigation current="/data/" />

    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <h2 class="display-1 mb-2">Download the Data</h2>
          <p>
            Download the data that appear on the College Scorecard, as well as
            supporting data on student completion, debt and repayment, earnings,
            and more. The files include data from 1996 through 2017 for all
            undergraduate degree-granting institutions of higher education.
          </p>

          <p>
            This data was
            <strong>last updated August 26, 2019</strong>. Our
            <a :href="baseUrl+'/data/changelog/'">Change Log</a> describes the changes to the
            dataset over time.
          </p>

          <p>
            <v-btn
              rounded
              color="secondary"
              data-download
              :href="dataBase_url+'/CollegeScorecard_Raw_Data.zip'"
              class="btn"
            >
              <v-icon>mdi-search</v-icon>Download All Data
            </v-btn><span class='mx-3'>265 MB zip</span>
          </p>

          <h3 class="display-1 mb-2 mt-5">Featured Downloads</h3>

          <p>
            These data downloads provide quick access to some of the data in which
            users may be most interested, including a file that offers the most
            current data for each element.
          </p>

          <ul class='my-3'>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-Scorecard-Elements.csv'"
              >Scorecard data</a> 8 MB CSV
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-All-Data-Elements.csv'"
              >Most recent data</a> 143 MB CSV
            </li>
            <li>
              <a
                data-download
                :href="dataBase_url+'/Most-Recent-Cohorts-NSLDS-Elements.csv'"
              >What's new from NSLDS</a> 116 MB CSV
            </li>
          </ul>
        </v-col>
        <v-col md="4" offset-md="1">

            <h2 class="display-1 mb-2 mt-3">Data Documentation</h2>

            <p>
              The College Scorecard is designed to increase transparency, putting
              the power in the hands of the public &mdash; from those choosing
              colleges to those improving college quality &mdash; to see how well
              different schools are serving their students. This documentation
              provides more on how to use the data and includes:
            </p>

            <ul class="my-3">
              <li>
                <a
                  data-download
                  :href="dataBase_url+'/assets/FullDataDocumentation.pdf'"
                  target="_blank"
                >Documentation Report</a>
              </li>
              <li>
                <a
                  data-download
                  :href="dataBase_url+'/assets/'+dataDictionary"
                  target="_blank"
                >Data Dictionary</a>
              </li>
              <li>
                <a :href="baseUrl+'/data/changelog/'">Change Log</a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/RTICWDT/open-data-maker"
                >API Documentation</a>
              </li>
            </ul>

            <v-btn color="secondary" rounded :href="baseUrl+'/data/documentation/'" class="link-more">
              View Full Documentation
            </v-btn>

        </v-col>
      </v-row>
      <v-row class="border-top">
        <v-col cols="12" md="7" >
          <h2 class="display-1 mb-2 mt-5">Outside Organizations Collecting Voluntary Data</h2>
          <p>Some other organizations have recently launched efforts to collect more accurate data on college completion, remedial education and workforce outcomes.</p>
          <ul class="my-3">
            <li>
              <a href="http://www.studentachievementmeasure.org" target="_blank">
                Student Achievement Measure initiative
                <i class="fa fa-external-link"></i>
              </a>
            </li>
            <li>
              <a href="http://vfa.aacc.nche.edu/Pages/default.aspx" target="_blank">
                Voluntary Framework of Accountability initiative
                <i class="fa fa-external-link"></i>
              </a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
@import "sass/_variables";
.border-top {
  border-top: 1px solid gray;
}
</style>

<script>
import DataNavigation from "components/vue/DataNavigation.vue";
export default {
  components: {
    "data-navigation": DataNavigation
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>