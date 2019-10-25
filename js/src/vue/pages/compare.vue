<template>
  <v-app id="app" class="compare-page">
    <scorecard-header />
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12" lg="9" class="school-left">
            <div v-if="loading" class="show-loading">
              <v-card class="pa-5">
                <h1 class="title">
                  Loading
                  <v-icon color="#0e365b">fas fa-circle-notch fa-spin</v-icon>
                </h1>
              </v-card>
            </div>

            <div v-else class="show-loaded" id="school">
              <v-card class="pb-5 px-3">
                <v-row class='csGreenBg'>
                  <v-col cols="6">
                     <v-btn
                      small
                      color="white"
                      text
                      id="referrer-link"
                      class="link-more"
                      :href="referrerLink"
                    >&laquo; Back</v-btn>

                  </v-col>
                  <v-col cols="6" class='text-right'>
                    <share small text color="white" label="Share this Comparison" :url="shareUrl" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class='pa-sm-5'>
                <compare-section
                  :schools="schools"
                  title="Average Annual Cost"
                  definition="avg-cost"
                  :currentHighlight="currentHighlight"
                  @update-highlight="currentHighlight = $event"
                  :config="{ 
                    computedField: 'netPrice', 
                    color: '#0e365b', 
                    max: 150000, 
                    type: 'currency',
                    chart: 'HorizontalBar'
                  }"
                />

                <compare-section
                  :schools="schools"
                  title="Graduation Rate"
                  definition="graduation-rate"
                  :currentHighlight="currentHighlight"
                  @update-highlight="currentHighlight = $event"
                  :config="{ 
                    computedField: 'completionRate', 
                    color: '#0e365b', 
                    max: 100, 
                    type: 'percent',
                    chart: 'HorizontalBar' 
                  }"
                />

                <compare-section
                  :schools="schools"
                  :currentHighlight="currentHighlight"
                  @update-highlight="currentHighlight = $event"
                  title="Salary After Completing"
                  definition="fos-median-earnings"
                  :config="{ 
                    computedField: 'earningsRange', 
                    color: '#0e365b', 
                    chart: 'MultiRange',
                    multiRangeVariable: 'earnings.median_earnings'
                  }"
                />  
                  </v-col>
                </v-row>
              </v-card>
              <v-row>
                <v-col class="text-right mt-5">
                  <v-btn primary @click="all">Expand All</v-btn>
                  <v-btn primary @click="none">Close All</v-btn>
                </v-col>
              </v-row>
              <v-expansion-panels class="" multiple focusable v-model="panels">
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('College Information')">College Information</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <compare-section
                      :schools="schools"
                      title="Full Time Enrollment"
                      definition="full-time"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                    computedField: 'fullTimeEnrollment', 
                    color: '#0e365b', 
                    max: 100, 
                    type: 'percent',
                    chart: 'HorizontalBar' 
                  }"
                    />

                    <compare-section
                      :schools="schools"
                      title="School Information"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        chart: 'SchoolInfo' 
                       }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Socio-Economic Diversity"
                      definition="socio-eco"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                    computedField: 'socioEconomicDiversity', 
                    color: '#0e365b', 
                    max: 100, 
                    type: 'percent',
                    chart: 'HorizontalBar' 
                  }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Race/Ethnicity"
                      definition="race-eth"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                    computedField: 'raceEthnicity', 
                    color: '#0e365b', 
                    max: 100, 
                    type: 'percent',
                    chart: 'HorizontalBar',
                    currentRaceEthnicityFilter: currentRaceEthnicity 
                  }"
                    >
                      <v-select
                        :items="[
                            {label: 'American Indian/Alaska Native', value:'American Indian/Alaska Native'},
                            {label: 'Asian', value:'Asian'},
                            {label: 'Black', value:'Black'},
                            {label: 'Hispanic', value:'Hispanic'},
                            {label: 'Native Hawaiian/Pacific Islander', value:'Native Hawaiian/Pacific Islander'},
                            {label: 'Non-resident alien', value:'Non-resident alien'},         
                            {label: 'Two or more races', value:'Two or more races'},
                            {label: 'Unknown', value:'Unknown'},
                            {label: 'White', value:'White'},
                        ]"
                        item-text="label"
                        item-value="value"
                        label="Race/Ethnicity"
                        v-model="currentRaceEthnicity"
                        color="secondary"
                        outlined
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Costs')">Costs</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <compare-section
                      :schools="schools"
                      title="Average Annual Cost"
                      definition="avg-cost"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'netPrice', 
                        color: '#0e365b', 
                        max: 150000, 
                        type: 'currency',
                        chart: 'HorizontalBar' 
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="By Family Income Category"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                    computedField: 'income', 
                    color: '#0e365b', 
                    max: 60000, 
                    type: 'currency',
                    chart: 'HorizontalBar',
                    currentIncomeFilter: currentIncomeFilter 
                  }"
                    >
                      <p>Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
                      <v-select
                        :items="[
                            {label: '$0-$30,000', value:'0-30000'},
                            {label: '$30,001-$48,000', value:'30001-48000'},
                            {label: '$48,001-$75,000', value:'48001-75000'},
                            {label: '$75,001-$110,000', value:'75001-110000'},
                            {label: '$110,001+', value:'110001-plus'},
                        ]"
                        item-text="label"
                        item-value="value"
                        label="What's your family income?"
                        v-model="currentIncomeFilter"
                        color="secondary"
                        outlined
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Graduation &amp; Retention')">Graduation & Retention</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <compare-section
                      :schools="schools"
                      title="Graduation Rate"
                      definition="graduation-rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'completionRate', 
                        color: '#0e365b', 
                        max: 100, 
                        type: 'percent',
                        chart: 'HorizontalBar' 
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="Students Who Return After Their First Year"
                      definition="retention-rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'retentionRate', 
                        color: '#0e365b', 
                        max: 100, 
                        type: 'percent',
                        chart: 'HorizontalBar' 
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="Outcomes 8 Years After Attending"
                      definition="outcome-measures"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        color: '#0e365b', 
                        chart: 'Sankey',
                        currentSankey: currentSankey
                      }"
                    >
                      <sankey-buttons v-on:update-sankey="currentSankey = $event" />
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Financial Aid &amp; Debt')">Financial Aid & Debt</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <compare-section
                      :schools="schools"
                      title="Students Receiving Federal Loans"
                      definition="student-aid"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'studentsReceivingLoans', 
                        color: '#0e365b', 
                        max: 100, 
                        type: 'percent',
                        chart: 'HorizontalBar' 
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="Median Total Debt After Graduation"
                      definition="avg-debt"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'debtRange', 
                        color: '#0e365b', 
                        chart: 'MultiRange',
                        multiRangeVariable: 'debt.median_debt'
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Typical Monthly Loan Payment"
                      definition="avg-loan-payment"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'debtRange', 
                        color: '#0e365b', 
                        chart: 'MultiRange',
                        multiRangeVariable: 'debt.monthly_debt_payment',
                        max: { value: 2000, label: '$2,000' }
                      }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Salary after Completing by Field of Study')">Salary after Completing by Field of Study</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <compare-section
                      :schools="schools"
                      title="Salary Ranges by Field of Study"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                    computedField: 'earningsRange', 
                    color: '#0e365b', 
                    chart: 'MultiRange',
                    multiRangeVariable: 'earnings.median_earnings'
                  }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Test Scores & Acceptance')">Test Scores & Acceptance</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <h2 class='pt-5 pb-3'>Test Scores <tooltip definition="test-scores" :isCompare="true" /></h2>
                    <p>Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>
                    <compare-section
                      :schools="schools"
                      title="SAT Reading"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'satReading', 
                        color: '#0e365b', 
                        chart: 'Range',
                      }"
                    />
                    <compare-section
                      :schools="schools"
                      title="SAT Math"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'satMath', 
                        color: '#0e365b', 
                        chart: 'Range',
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="ACT"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'act', 
                        color: '#0e365b', 
                        chart: 'Range',
                      }"
                    />

                    <compare-section
                      :schools="schools"
                      title="Acceptance Rate"
                      :currentHighlight="currentHighlight"
                      @update-highlight="currentHighlight = $event"
                      :config="{ 
                        computedField: 'acceptanceRate', 
                        color: '#0e365b', 
                        max: 100, 
                        type: 'percent',
                        chart: 'HorizontalBar' 
                      }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="3">
            <v-card class="pa-5">
              <paying-for-college />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <scorecard-footer />
    
    <compare-header :showCompare.sync="showCompare" :schools="compareSchools" />
    <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
      <compare-drawer
        :schools="compareSchools"
        @toggle-compare-school="handleToggleCompareSchool"
        v-on:close-modal="closeModal()"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import Tooltip from "components/vue/Tooltip.vue";
import Share from "components/vue/Share.vue";
import PayingForCollege from "components/vue/PayingForCollege.vue";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import HorizontalBar from "components/vue/HorizontalBar.vue";
import CompareSection from "components/vue/compare/Section.vue";
import { compare } from "vue/mixins.js";
import ComplexFields from "vue/mixins/ComplexFields.js";
import SankeyButtons from "components/vue/SankeyButtons.vue";
import { apiGetAll } from '../api.js';
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";

export default {
  mixins: [compare, ComplexFields, AnalyticsEvents],
  props: ["baseUrl", "compareSchools"],
  components: {
    tooltip: Tooltip,
    share: Share,
    "paying-for-college": PayingForCollege,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
    "horizontal-bar": HorizontalBar,
    "compare-section": CompareSection,
    "sankey-buttons": SankeyButtons
  },
  data() {
    return {
      panels: [],
      num_panels: 6,
      schools: {
        "2-year schools": [],
        "4-year schools": [],
        "Certificate schools": []
      },
      currentRaceEthnicity: "American Indian/Alaska Native",
      currentIncomeFilter: "0-30000",
      currentSankey: {
        enroll: "enroll_both",
        study: "study_both"
      },
      currentHighlight: "",
      loading: true
    };
  },
  computed: {
    shareUrl() {
      let url = "";
      this.compareSchools.map(function(itm, idx) {
        url += "&s[]=" + itm.schoolId;
      });
      return window.location.origin+'/compare/?'+encodeURIComponent(url.substr(1));
    },
    referrerLink(){
      return document.referrer || null;
    }
  },
  methods: {
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panels = [];
    }
  },
  mounted() {
    let self = this;

    var params = {};
    params[this.fields.OPERATING] = 1;
    params[
      this.fields.DEGREE_OFFERED + ".assoc_or_bachelors_or_certificate"
    ] = true;
    params[this.fields.SIZE + "__range"] = "0..";
    params[this.fields.PREDOMINANT_DEGREE + "__range"] = "1..3";
    params[this.fields.ID + "__range"] = "..999999";
    params["fields"] = "latest,school,id,location";
    params["keys_nested"] = true;
    params["all_programs"] = true;

    let query = {};
    let schoolArray = [];
    let paramArray = [];
    this.compareSchools.map(function(school) {
      var id = +school.schoolId || +school;
      // query[id] = [picc.API.getSchool, id, params];
      schoolArray.push(id);
      paramArray.push({
        id: id
      });

    });

    this.trackCompareList(schoolArray.join(';'));
    this.loading = true;
    let request = apiGetAll(window.api.url, window.api.key, '/schools/', paramArray).then((responses) => {
      
      let schoolData = responses.map(function(response){
        if(response.data.results[0]){
          return response.data.results[0];
        }
      });

      schoolData.forEach((school) => {
        switch (_.get(school, this.fields["PREDOMINANT_DEGREE"])) {
          case 1:
            this.schools["Certificate schools"].push(school);
            break;
          case 2:
            this.schools["2-year schools"].push(school);
            break;
          case 3:
            this.schools["4-year schools"].push(school);
            break;
        }
        this.loading = false;
      });

    }).catch((responses) => {
      // TODO - How do we want to handle errors?
      console.error("Issue locating schools for compare...");
    });

    // picc.API.getAll(query, function(error, data) {
    //   Object.keys(data).forEach(function(key) {
    //     if (data[key]) {
    //       switch (_.get(data[key], self.fields["PREDOMINANT_DEGREE"])) {
    //         case 1:
    //           self.schools["Certificate schools"].push(data[key]);
    //           break;
    //         case 2:
    //           self.schools["2-year schools"].push(data[key]);
    //           break;

    //         case 3:
    //           self.schools["4-year schools"].push(data[key]);
    //           break;
    //       }
    //     }
    //   });
    // });
  
  }
};
</script>