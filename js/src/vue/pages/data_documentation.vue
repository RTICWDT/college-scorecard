<template>
  <v-app>
    <scorecard-header />

    <v-content class="white">
      <data-navigation current="/data/documentation/" />
      <v-container>
        <v-row>
          <v-col cols="12" md="7">
            <h1 class="display-1 pb-2">Data Documentation</h1>

            <p>This page provides more details about the robust data set behind the College Scorecard efforts. You can get information on accessing and understanding the API; download the entire dataset spanning nearly 20 years of data and covering multiple sources including IPEDS, NSLDS, and Department of Treasury; or download smaller data sets, including the data provided on the College Scorecard.</p>

            <ul>
              <li>
                <a
                  @click="trackDownload('FullDataDocumentation.pdf')"
                  :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
                  target="_blank"
                >Technical Documentation for Institution-Level Data Files</a>
              </li>
              <li>
                <a
                  @click="trackDownload('FullDataDocumentation.pdf')"
                  :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
                  target="_blank"
                >Technical Documentation for Data Files by Field of Study</a>
              </li>
              <li>
                <a
                  @click="trackDownload(dataDictionary)"
                  :href="baseUrl+'/assets/'+dataDictionary"
                  target="_blank"
                >Data Dictionary</a>
              </li>
            </ul>

            <h2 class="title mt-5">Accuracy and Privacy</h2>

            <p>Note that for many elements, we have taken additional steps to ensure data are stable from year to year and representative of a certain number of students. For most elements, data are pooled across years to reduce year-over-year variability in figures (i.e. repayment rate, completion rate, earnings). Moreover, for elements that we expect to publish for consumer use, a separate version of the element is available that suppresses the data for schools with fewer than 30 students in the denominator. All National Student Loan Data System (NSLDS) and Treasury elements are protected for privacy purposes; any data not reported in order to protect an individual’s privacy are shown as PrivacySuppressed.</p>

            <p>Additionally, many elements are available only for Title IV recipients, or students who receive federal grants and loans. While these data are reported at the individual level to NSLDS and used to distribute federal aid, they are published only at the aggregate institutional level. While some schools report these data at the campus level (8-digit OPE ID), we have rolled those up to the institution level (6-digit OPE ID).</p>
          </v-col>
          <v-col cols="12" md="4" offset-md="1">
            <h2 class="display-1 mb-2">API Documentation</h2>

            <p>
              The College Scorecard API is a GET API that lives at
              <span>http://api.data.gov/ed/collegescorecard/</span>
            </p>
            <p>
              The endpoint for querying all data is
              <span>/v1/schools</span>
            </p>
            <p class="data-docs">
              Developers may register for an API key at
              <a
                href="https://api.data.gov/signup"
                target="_blank"
              >https://api.data.gov/signup</a>.
            </p>

            <h3 class="title">Structure</h3>

            <!--<p>The basic structure of an API call is <span>year.dev-category.dev-friendly-variable-name</span>,-->
            <!--except that the <span>school</span> category has no year and <span>id</span>, <span>ope6_id</span>,-->
            <!--<span>ope8_id</span> and <span>location</span>-->
            <!--have no category or year.</p>-->
            <p>
              The basic structure of an API call is
              <span>year.dev-category.dev-friendly-variable-name</span>.
            </p>
            <ul class="my-3">
              <li>
                The
                <span>year</span> may be any year of data available (example: 2012), or use the word
                <span>latest</span> to get the most recent data available from the API.
                Using the "latest" key will allow your application to access the new data as soon as it is released.
              </li>
              <li>
                The
                <strong>school</strong> category has no year.
              </li>
              <li>
                <span>id</span>,
                <span>ope6_id</span>,
                <span>ope8_id</span> and
                <span>location</span> have no category or year.
              </li>
            </ul>

            <p>All variables are listed in the Data Dictionary.</p>

            <p>
              <v-btn
                @click="trackDownload(dataDictionary)"
                rounded
                color="secondary"
                :href="baseUrl+'/assets/'+dataDictionary"
                class="button data-home-button"
              >Download the Data Dictionary</v-btn>
            </p>

            <p class="data-docs">
              For guidance on querying the API and extracting results, see the
              <a
                href="https://github.com/RTICWDT/open-data-maker/blob/master/API.md"
                target="_blank"
              >HTTP API documentation</a>.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <scorecard-footer />
  </v-app>
</template>

<script>
import DataNavigation from 'components/vue/DataNavigation.vue';
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";

export default {
  mixins: [AnalyticsEvents],
  components: {
    'data-navigation': DataNavigation
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"]
};
</script>