<style lang="scss">
  .v-speed-dial__list{
    z-index: 99;
  }
  .canned-search-wrapper{
    margin-bottom: 8px;
  }
</style>

<template>
  <div>
    <v-app>
      <v-container fluid class="grey lighten-5" fill-height>
        <v-layout>
          <div id="search-param-container" v-show="$vuetify.breakpoint.mdAndUp || showSidebar">
            
            <!-- TODO - All form fields and layout. -->
            <!-- Search Form Component -->
            <search-form :states="states" :programs="programs"
            :urlParsedParams="urlParsedParams"
            @search-query="searchAPI" />
          
          </div>
        
          <div id="search-result-container" class="d-inline">

            <div id="search-can-query-container">
              <v-row>
                
                <v-col cols="12" md='4' sm='12' xs='12'>
                  <div id="search-can-query-text">
                    <h3>Show Me Options</h3>
                    <p>Selection options on right right to create a list of schools that fit you</p>
                  </div>
                </v-col>
                <v-col md='8' sm='12' xs='12' cols=''>
                  <div id="search-can-query-items-wrapper">
                    <v-row>
                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>

                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>
                      
                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>

                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>

                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>

                      <v-col md='4' sm='12' cols='12' class="text-center canned-search-wrapper">
                        <canned-search-button @canned-search-click="handleCannedSearchClick" :add-to-query="[{state:['MA']}]">
                          Schools In MA
                        </canned-search-button>
                      </v-col>
                    </v-row>
                  </div>  
                </v-col>

              </v-row>
            </div>

            <div class="search-result-container">
              <div id="search-result-info-container">
                <v-row>
                  <v-col col='12' md='4' sm='12'>
                    <div id="search-result-info-count">
                      <h5>{{results.meta.total}} Results</h5> <!-- TODO - Count to display result/results -->
                    </div>
                  </v-col>
                
                  <v-col col='12' md='8' sm='12'>
                    <v-row>

                      <v-col col='12' md='8' sm='12'>
                        <div id="search-pagination-controls">
                          <span>Page:</span>
                          <v-pagination v-model="input.page" :length='totalPages' :total-visible='7' @input="searchAPI(parseURLParams())"></v-pagination>
                        </div>
                      </v-col>

                      <v-col col='12' md="4">
                        <v-speed-dial v-model="utility.sortFAB" direction="bottom" right transition="slide-y-transition">
                            <template v-slot:activator>
                              <v-btn v-model="utility.sortFAB" color="blue darken-2" dark fab>
                                <v-icon v-if="utility.sortFAB">mdi-close</v-icon>
                                <v-icon v-else>mdi-account-circle</v-icon>
                              </v-btn>
                            </template>
                            
                            <v-btn fab dark small color="green" >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn fab dark small color="indigo">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>

                            <v-btn fab dark small color="red">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-speed-dial>

                        <!-- <label for="select-sort">Sort:</label>
                        <select id="select-sort" name="sort" v-model="input.sort" @change="searchAPI(parseURLParams())">
                          <option selected="selected" value="salary:desc">Salary After Attending</option>
                          <option value="avg_net_price:asc">Average Annual Cost</option>
                          <option value="completion_rate:desc">Graduation Rate</option>
                          <option value="name:asc">Name (A to Z)</option>
                        </select> -->

                      </v-col>

                    </v-row>
                  </v-col>
                </v-row>
              </div>

              <div class="results-main-alert">
                <div class="show-loading" v-show="isLoading">
                  <h1>Loading...</h1>
                </div>

                <div class="show-error" v-show="error.message">
                  <h1>Something went wrong:</h1>
                  <p class="error-message">{{error.message}}</p>
                </div>

                <div class="search-result-cards-container" v-if="!isLoading">
                  <v-row>
                    <v-col v-for="school in results.schools" :key="school.id" cols='12' lg='3' md='4' sm='12'>
                      
                      <search-result-card :school="school" 
                        @toggle-compare-school="handleToggleCompareSchool" 
                        :is-selected="isResultCardSelected(school.id,compareSchools)"/>

                    </v-col>
                  </v-row>
                </div>

                <div class="search-result-cards-container" v-else>
                  <!-- Fake Cards -->
                  
                </div>

                

              </div> <!--results-main -->

            </div>
          </div>
        </v-layout>
      </v-container>

    </v-app>
    
    <a class="waves-effect waves-light btn modal-trigger" style="position: fixed; left:120px; bottom: 30px" href="#compare-modal">Compare</a>
  
  
    <!-- Basic Example for now -->
    <!-- <section class="container section section-card_container-results">
      <div class="results-main-schools schools-list">
        <search-result-card v-for="school in results.schools" :key="school.id" :school="school" @toggle-compare-school="handleToggleCompareSchool" :is-selected="isResultCardSelected(school.id,compareSchools)"/>
      </div>
    </section> -->

  <!-- TODO - Make This A Component. -->
  <div id="compare-modal" class="modal bottom-sheet" style='width: 40%; right: 20%; left: auto;'>
    <div class="modal-content">
        <div id="compare_schools-content">
          <fieldset>
            <legend>Compare Schools</legend>
            
            <ul id="edit-compare-list">
              <li class="edit-compare-list-item" v-for="school in compareSchools" :key="school.schoolId">
                <label class="checkbox" data-bind="checkbox_label" data-school :for="`edit-compare-${school.schoolId}`">
                  <input :id="`edit-compare-${school.schoolId}`" type="checkbox" name="_compare" tabindex="0" checked @change="handleToggleCompareSchool(school)">
                  <span tabindex="-1" class="checkbox-focus"></span>
                  <span>{{school.schoolName}}</span>
                </label>
              </li>
            </ul>

          </fieldset>

          <div class=" compare_link">
              <a id="compare-link" class="btn button-primary compare-button_link">Compare Schools</a>
          </div>

        </div>
    </div> <!-- End .compare-modal -->

</div>

  </div><!--End of root -->
</template>

<script>
// TODO - This needs major cleanup.  How can it be cleaned?, Seperate files for legacy Javascript items?

import SearchResultCard from './components/vue/SearchResultCard.vue';
import SearchForm from './components/vue/SearchForm.vue';
import CannedSearchButton from './components/vue/CannedSearchButton.vue';

import _ from 'lodash';
// import querystring from 'querystring';

const querystring = require('querystring');

export default {
  components:{
    'search-result-card': SearchResultCard,
    'search-form': SearchForm,
    'canned-search-button': CannedSearchButton
  },
  props:{
    'page-permalink': String,
    'states': Array,
    'programs': Array,
    'defaultSort':{
      type: String,
      default: "avg_net_price:asc"
    },
    'isLoading': Boolean,
    'compareSchools': Array
  },
  data(){
    return {
      showSidebar: false,
      results:{
        schools:[],
        meta:{
          total:0
        },
      },
      input:{
        sort: null,
        page: 1
      },
      urlParsedParams:{},
      utility:{
        formDefault:{},
        initailized: false,
        sortFAB: null
      },
      error:{
        message:null
      }
    };
  },
  created(){
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input);

    this.urlParsedParams = this.parseURLParams();

    // Add sort to state if it exists
    this.input.sort = (this.urlParsedParams.sort) ? this.urlParsedParams.sort : this.defaultSort;

    // if Page is in the url, add it here.
    this.input.page = (this.urlParsedParams.page) ? Number(this.urlParsedParams.page) + 1 : 1;

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function(params) {
      this.searchAPI(params);
    }, 1000);
  },
  mounted(){
  },
  computed:{
    totalPages(){
      if(this.results.meta.per_page && this.results.meta.total){
        let totalPages = this.results.meta.total / this.results.meta.per_page;
        
        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages);
      }
    }
  },
  methods:{
    searchAPI(params = {}){
      // TODO - Clean this method up, It does way more than just SearchAPI.
        // Better Encapsilation.

      this.$emit('loading',true);
      
      this.error.message = null;

      let poppingState = false;
      let alreadyLoaded = false;
      
      // Add page and sort items into params.
      if(this.input.page >= 1){
        // The API function off of a 0 index
        params.page = this.input.page - 1;
      }

      params.sort = this.input.sort;

      let query = picc.form.prepareParams(params);

      query.fields = [
        // we need the id to link it
        picc.fields.ID,
        // basic display fields
        picc.fields.NAME,
        picc.fields.CITY,
        picc.fields.STATE,
        picc.fields.SIZE,
        picc.fields.BRANCHES,
        // to get "public" or "private"
        picc.fields.OWNERSHIP,
        // to get the "four_year" or "lt_four_year" bit
        picc.fields.PREDOMINANT_DEGREE,
        // program-reporter offered programs / flag
        picc.fields.PROGRAM_REPORTER_OFFERED,
        // get all of the net price values
        picc.fields.NET_PRICE,
        // completion rate
        picc.fields.COMPLETION_RATE,
        // this has no sub-fields
        picc.fields.MEDIAN_EARNINGS,
        // not sure if we need this, but let's get it anyway
        picc.fields.EARNINGS_GT_25K,
        // under investigation flag
        picc.fields.UNDER_INVESTIGATION
      ].join(',');

      let qs = this.generateQueryString(params);
      history.replaceState(params, 'search', qs);

      let vm = this;
      let req = picc.API.search(query, function(error, data) {
        
        if (error){
          vm.$emit('loading',false);
          vm.showError(error);
          return;
        }

        console.log('loaded schools:', data);

        vm.results.schools = data.results;
        vm.results.meta = data.metadata;
        
        vm.$emit('loading',false);
      });
    },
    showError(error){
      // TODO: Loop through multiple error messages if needed.

      console.error('error:', error);

      if (typeof error.responseText != "undefined") {
        // 500 doesn't have JSON text return.
        if(error.status === 500){
          this.error.message = 'There was an unexpected API error.';
        }else{
          var errorText = JSON.parse(error.responseText);
          error = errorText.errors[0].message;

          this.error.message = String(error) || 'There was an unexpected API error.';        
        }
      }
    },
    handleToggleCompareSchool(school){
      // Prepare Data, Make a call to the picc function.    
      let schoolData = {
        dataset:{
          bind:"selected_school",
          school:"compare-schools",
          schoolId: (school.schoolId) ? String(school.schoolId) : String(school.id),
          schoolName: (school.schoolName) ? school.schoolName : school['school.name'],
        }
      };

      picc.school.selection.vueToggle(schoolData);

      // Update vue instance with new current compare school selection.
      this.$emit('compare-update-selection');
    },
    handleCannedSearchClick(cannedSearchData){
      if(cannedSearchData.add[0]){
        this.debounceSearchUpdate(cannedSearchData.add[0]);
      }

      // TODO - Better handling of adding/removing items.
        // Maybe parse current url, add what is not there, remove whatever is passed.
    },
    isResultCardSelected(schoolId,compareSchools){
      if(_.findIndex(compareSchools,['schoolId',String(schoolId)]) >= 0)
      {
        return true;
      }
      return false;
    },
    parseURLParams(){
      let query = querystring.parse(location.search.substr(1));
      return query || {};
    },
    generateQueryString(params){
      let qs = querystring.stringify(params);
      return '?' + qs.replace(/^&+/, '')
        .replace(/&{2,}/g, '&')
        .replace(/%3A/g, ':');
    }
  }
}

</script>