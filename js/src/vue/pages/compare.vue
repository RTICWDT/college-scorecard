<template>
  <v-app id="compare" class="compare-page">
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

            <div v-else-if="!loading && !showSearchForm" class="show-loaded" id="school">
              <v-card class="pb-5 px-3">
                <v-row class="csGreenBg">
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
                  <v-col cols="6" class="text-right">
                    <share small text color="white" label="Share this Comparison" :url="shareUrl" :hide="hideShare" show-copy/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pa-sm-5">
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
                    ><p class='my-n3'>Cost includes tuition, living costs, books, and fees minus the average grants and scholarships for federal financial aid recipients.</p></compare-section>

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
              <v-expansion-panels class multiple focusable v-model="panels">
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('College Information')"
                  >College Information</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
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
                      <p class="overline mb-1">Race/Ethnicity</p>

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
                        solo
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="trackAccordion('Costs')">Costs</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
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
                    ><p>Cost includes tuition, living costs, books, and fees minus the average grants and scholarships for federal financial aid recipients.</p></compare-section>

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
                      <p class="overline mb-1">What's your family income?</p>
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
                        solo
                      ></v-select>
                    </compare-section>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('Graduation &amp; Retention')"
                  >Graduation & Retention</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
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
                  <v-expansion-panel-header
                    @click="trackAccordion('Financial Aid &amp; Debt')"
                  >Financial Aid & Debt</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
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
                        max: { value: 1000, label: '$1,000' }
                      }"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header
                    @click="trackAccordion('Salary after Completing by Field of Study')"
                  >Salary after Completing by Field of Study</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
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
                  <v-expansion-panel-header
                    @click="trackAccordion('Test Scores & Acceptance')"
                  >Test Scores & Acceptance</v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-5 mx-n4 mx-sm-5">
                    <h2 class="pt-5 pb-3">
                      Test Scores
                      <tooltip definition="test-scores" :isCompare="true" />
                    </h2>
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

            <!-- Search Form Component -->
            <div v-show="!loading && showSearchForm">
              <v-card class="pa-5 mb-2">
                <h1 class="text-center pt-3">No schools selected to compare.</h1>
                <p class="text-center mt-2">Try searching for schools and clicking the <v-icon>fa fa-plus-circle</v-icon> to add a school for comparison.</p>

              </v-card>
              <v-card class="px-5 pt-0 pb-5">
                <search-form @search-query="directToSearch" />
              </v-card>
            </div>

          </v-col>

          <v-col lg="3">
            <v-card v-if="showShareUpdate" class="pa-5 mb-3">
              <p>You are viewing a shared comparison.</p>
              <v-btn small color="secondary" rounded @click="saveCompareList()">Update Your List</v-btn>
            </v-card>
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
import CannedSearchContainer from "components/vue/CannedSearchContainer.vue";
import querystring from "querystring";
import SearchForm from "components/vue/SearchForm.vue";
import NameAutocomplete from "components/vue/NameAutocomplete.vue";

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
    "sankey-buttons": SankeyButtons,
    "canned-search-container": CannedSearchContainer,
    "search-form": SearchForm,
    "name-autocomplete": NameAutocomplete
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
      loading: true,
      mobilePanels: 0,
      desktopTabs: 1,
      passedSchools: [],
      cacheList: [],
      hideShare:['email']
    };
  },
  computed: {
    shareUrl() {
      const compareBaseURL = window.location.origin + this.$baseUrl + '/compare/?';

      // Default to passed schools
      if(this.passedSchools.length > 0){
        return compareBaseURL + encodeURIComponent(querystring.stringify({s: this.passedSchools}));
      }else{
        // Alter to desired structure
        let schoolIDArray = this.compareSchools.map((school) => {return school.schoolId});
        return compareBaseURL + encodeURIComponent(querystring.stringify({s: schoolIDArray}));
      }
    },
    referrerLink() {
      return document.referrer || null;
    },
    showSearchForm(){
      if(this.schools['2-year schools'].length > 0 || this.schools['4-year schools'].length > 0 || this.schools['Certificate schools'].length > 0){
        return false;
      }else{
        return true;
      }
    },
    showShareUpdate(){
      // Check to see if passed school matches local storage, only show "update compare" if they do not match
      if(this.compareSchools.length === 0 && this.passedSchools.length > 0){
        return true;
      }

      if(this.compareSchools.length > 0 && this.passedSchools.length > 0){
        let compareSchoolsIDs = this.compareSchools.map((school) => {return school.schoolId});
        if(!_.isEqual(compareSchoolsIDs, this.passedSchools)){
          return true;
        }
      }

      return false;
    }
  },
  methods: {
    all() {
      this.panels = [...Array(this.num_panels).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panels = [];
    },
    directToSearch(params) {
      // Generate URL based on params,
      let qs = querystring.stringify(params);
      let url =
        this.$baseUrl+"/search/?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":");

      // Direct to location.
      window.location.href = url;
    }, 
    saveCompareList(){
      let i=0;
      // remove existing schools
      for(i=0; i<this.compareSchools.length; i++)
      {
        this.$emit('toggle-compare-school',{ schoolId: this.compareSchools[i].schoolId, schoolName: this.compareSchools[i].schoolName });
      }
      // add compare schools
      for(i=0; i<this.cacheList.length; i++)
      {
        this.$emit('toggle-compare-school',{ schoolId: this.cacheList[i].schoolId, schoolName: this.cacheList[i].schoolName });
      };
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

    let passed = querystring.parse(decodeURIComponent(window.location.search.substr(1)));

    // Check for passed schools first
    if(passed['s']){
      // Always set to array, if not convert to array
      this.passedSchools = (typeof(passed['s']) == 'string') ? [passed['s']] : passed['s'];
    }

    // Create lookup object, default to url passed schools or use compare drawer
    if(this.passedSchools.length > 0){
      this.passedSchools.map(function (id){
        // TODO: Add number check?
        if(parseInt(id)){
          schoolArray.push(parseInt(id));
          paramArray.push({
            id: parseInt(id)
          });
        }
      })

    }else{
      this.compareSchools.map(function (school) {
        let id = +school.schoolId || +school;
        schoolArray.push(id);
        paramArray.push({
          id: id
        });
      });

      // Update URL with schools from compare drawer using the share URL computed property.  Grabbing only query string from url string
      history.replaceState({},"", "/compare?" + decodeURIComponent(this.shareUrl.substring(this.shareUrl.indexOf('?') + 1 )));
    }

    // console.log(this.passedSchools);
    this.trackCompareList(schoolArray.join(';'));
    
    this.loading = true;
    let request = apiGetAll(window.api.url, window.api.key, '/schools/', paramArray).then((responses) => {

      let schoolData = responses.map(function (response) {
        if (response.data.results[0]) {
          return response.data.results[0];
        }
      });

      schoolData.forEach((school) => {
        // if you are passing in some, generate an object 
        // of passed in schools so they can be saved
        if(this.passedSchools)
        {
          this.cacheList.push({ schoolId: _.get(school, this.fields["ID"]), schoolName: _.get(school, this.fields["NAME"])})  
        }
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
      });

      this.loading = false;

    }).catch((responses) => {
      // TODO - How do we want to handle errors?
      console.error("Issue locating schools for compare...");
      this.loading = false;
    });
  }
};
</script>