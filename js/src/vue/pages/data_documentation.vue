<template>
  <v-app>
    <scorecard-header />

    <v-content class="white">
      <data-navigation current="/data/documentation/" />
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <h1 class="display-1 pb-2">Data Documentation</h1>

            <p>College Scorecard provides data at the institution-level and data by field of study. The technical data documents provide in-depth information about these data. The data dictionary includes separate worksheets with institution-level and field of study dictionaries as well as cohort maps describing the timing aspects of each data element.</p>

            <div class='d-flex'>
              <v-card class='pa-5 mr-2 text-center'>
                <a
                  @click="trackDownload('FullDataDocumentation.pdf')"
                  :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
                  target="_blank"
                >Technical Documentation for Institution-Level Data Files</a>
              </v-card>
              <v-card class='pa-5 text-center'>
                <a
                  @click="trackDownload('FullDataDocumentation.pdf')"
                  :href="baseUrl+'/assets/FullDataDocumentation.pdf'"
                  target="_blank"
                >Technical Documentation for Data Files by Field of Study</a>
              </v-card>
              <v-card class='pa-5 ml-2 text-center'>
                <a
                  @click="trackDownload(dataDictionary)"
                  :href="baseUrl+'/assets/'+dataDictionary"
                  target="_blank"
                >Data Dictionary</a>
              </v-card>
            </div>
             <p class='mt-5'>Looking for help? Visit <a href="http://opendata.stackexchange.com/questions/tagged/collegescorecard"  @click="trackOutboundLink($event)" target="_blank">
              StackExchange
            </a> or email the helpdesk at <a href='mailto:scorecarddata@rti.org'>scorecarddata@rti.org</a>.</p>
             <h2 class="display-1 mb-2 mt-5">API Documentation</h2>

            <p>
              The College Scorecard API is a GET API that lives at
              <strong>http://api.data.gov/ed/collegescorecard/</strong>. 
              The endpoint for querying all data is
              <strong>/v1/schools</strong>.
              Developers may register for an API key at
              <a
                href="https://api.data.gov/signup"
                target="_blank"
              >https://api.data.gov/signup</a>.
            </p>

            <h3 class="title">Structure</h3>

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