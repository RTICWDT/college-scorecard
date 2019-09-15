<template>
  <div>
    <!-- Make Whole Search Field Component -->
    <ul id="slide-out" class="sidenav">
      <div class='row'>
        
        <!-- Search Form Component -->
        <search-form :states="states" :programs="programs" 
          :urlParsedParams="urlParsedParams"
           @search-query="testAPI"
        />

        <form id="search-form" autocomplete="false"
          :action="pagePermalink" method="GET">
          
          <!-- search-Form component-->

          <!-- Filter Component -->

          <input type="submit" value="Submit" class="sr-only" tabindex="-1">
        </form>
      </div>
    </ul>
    <a href="#" data-target="slide-out" style="position: fixed; left:30px; bottom: 30px" class="sidenav-trigger btn-floating btn-large waves-effect waves-light"><i class="material-icons">search</i></a>
    <a class="waves-effect waves-light btn modal-trigger" style="position: fixed; left:120px; bottom: 30px" href="#compareModal">Compare</a>

    <!-- Basic Example for now -->
    <section class="container section section-card_container-results">
      <div class="results-main-schools schools-list">
        <search-result-card v-for="school in results.schools" :key="school.id" :school="school"/>
      </div>
    </section>

  </div><!--End of root -->
</template>

<script>
// TODO - This needs major cleanup.  How can it be cleaned?, Seperate files?
import SearchResultCard from './components/vue/SearchResultCard.vue';
import SearchForm from './components/vue/SearchForm.vue';
import _ from 'lodash';

const querystring = require('querystring');

function diff(a, b) {
  if ((typeof a) !== (typeof b)) {
    // console.log('diff types:', typeof a, typeof b);
    return true;
  } else if (typeof a === 'object') {
    for (var k in a) if (diff(a[k], b[k])) return true;
    for (var k in b) if (diff(a[k], b[k])) return true;
    return false;
  }
  return a != b;
}

export default {
  components:{
    'search-result-card': SearchResultCard,
    'search-form': SearchForm
  },
  props:{
    'page-permalink': String,
    'states': Array,
    'programs': Array,
    'defaultSort':{
      type: String,
      default: "avg_net_price:asc"
    }
  },
  data(){
    return {
      results:{
        schools:[],
        meta:{},
      },
      input:{
        sort: null,
        page:0
      },
      urlParsedParams:{},
      utility:{
        formDefult:{}
      }
    };
  },
  created(){
    // Copy default form input state.
    this.utility.formDefult = _.cloneDeep(this.input);
  },
  mounted(){   
    // URL Parsing and filling.
    let query = querystring.parse(location.search.substr(1));
    console.log("query: " + JSON.stringify(query));
    
    this.urlParsedParams = query || {};

    // Add sort to state if it exists
    this.input.sort = (this.urlParsedParams.sort) ? this.urlParsedParams.sort : this.defaultSort;

    // if Page is in the url, add it here.
    this.input.page = (this.urlParsedParams.page) ? this.urlParsedParams.page : 0;

    // TODO - Remove this call.  We are testing on load for now.
    this.testAPI(this.urlParsedParams);
  },
  methods:{
    testFormChange(event){
      console.log(event);
    },
    // This can stay here, Just needs some clean up.
    testAPI(params = {}){
      let poppingState = false;
      let alreadyLoaded = false;
      
      // Add page and sort items into params.
      if(this.input.page > 0){
        params.page = this.input.page;
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

      let qs = querystring.stringify(params);
      qs = '?' + qs.replace(/^&+/, '')
        .replace(/&{2,}/g, '&')
        .replace(/%3A/g, ':');

      if (poppingState) {
        // console.info('popping state');
        // history.replaceState(params, 'search', qs);
      } else if (diff(this.urlParsedParams, params)) {
        // console.info('push state:', qs, previousParams, '->', params);
        // update the URL
        history.pushState(params, 'search', qs);
      } else {
        // console.info('replace state:', qs);
        history.replaceState(params, 'search', qs);
      }

      let vm = this;
      let req = picc.API.search(query, function(error, data) {
        console.log('loaded schools:', data);
        vm.results.schools = data.results;  
      });
    }
  }
}


</script>