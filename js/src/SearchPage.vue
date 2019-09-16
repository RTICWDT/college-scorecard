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

    <!-- Sort and Pagination controlls -->
    <div class="container results-main">
      <div class="results-main-alert">
        
        <div class="show-loading" v-show="isLoading">
          <h1>Loading...</h1>
        </div>

        <div class="show-error" v-show="hasError">
          <h1>Error</h1>
          <p class="error-message">{{error.message}}</p> <!-- TODO - Loop through multiple errors. -->
        </div>
        
        <div class="show-loaded" v-show="!isLoading">
          <div class="row">
            <div class="col m6">
              <h5>
                <span>{{results.meta.total}}</span>
                <span>Results</span>
              </h5>

              <div class="school-share-wrapper">
                <div class="button button-primary button-share results-share" data-share-button tabindex="0" role="button" onclick="void(0)">
                  <span class="top yaxis content">Share</span>
                  <ul class="social-share-list bottom yaxis content">
                    <li class="social-item">
                      <a data-href="https://twitter.com/intent/tweet?text=Take%20a%20look%20at%20these%20schools&amp;url={url}" data-bind="search_share_link_twt" data-social="Twitter" title="Share on Twitter" target="_blank">
                        <i class="fa fa-twitter"></i>
                        <span class="sr-only">Share on Twitter</span>
                      </a>
                    </li>
                    <li class="social-item">
                      <a data-href="https://www.facebook.com/sharer/sharer.php?u={url}" data-bind="search_share_link_fb" data-social="Facebook" title="Share on Facebook" target="_blank">
                        <i class="fa fa-facebook"></i>
                        <span class="sr-only">Share on Facebook</span>
                      </a>
                    </li>
                    <li class="social-item">
                      <a data-href="mailto:?subject=Take%20a%20look%20at%20these%20schools&amp;body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A{url}" data-bind="search_share_link_mail" data-social="Email" title="Share via Email" >
                        <i class="fa fa-envelope"></i>
                        <span class="sr-only">Share via Email</span>
                      </a>
                    </li>
                    <li class="social-item">
                      <a data-href="https://www.linkedin.com/shareArticle?mini=true&url={url}" data-bind="search_share_link_li" data-social="LinkedIn" title="Share on LinkedIn" target="_blank">
                        <i class="fa fa-linkedin"></i>
                        <span class="sr-only">Share on LinkedIn</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col m6">
              <label for="select-sort">Sort:</label>
              <select id="select-sort" name="sort" v-model="input.sort">
                <option selected="selected" value="salary:desc">Salary After Attending</option>
                <option value="avg_net_price:asc">Average Annual Cost</option>
                <option value="completion_rate:desc">Graduation Rate</option>
                <option value="name:asc">Name (A to Z)</option>
              </select>
            </div>
          </div> <!-- row -->

          <div class="row">
            <div class="col m6 offset-m6">
                <div class="pagination  show-loaded show-incremental">
                  <ol data-bind="pages">
                    Page:
                    <li><a class="select-page" data-bind="link">1</a></li>
                  </ol>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div> <!-- Results main -->

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
    console.log('diff types:', typeof a, typeof b);
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
    },
    'isLoading': Boolean
  },
  data(){
    return {
      results:{
        schools:[],
        meta:{
          total:0
        },
      },
      input:{
        sort: null,
        page:0
      },
      urlParsedParams:{},
      utility:{
        formDefault:{},
        initialLoad: true
      },
      hasError:null,
      error:{
        message:null
      }
    };
  },
  created(){
    // Copy default form input state.
    this.utility.formDefult = _.cloneDeep(this.input);
  
    // URL Parsing and filling.
    let query = querystring.parse(location.search.substr(1));
    console.log("query: " + JSON.stringify(query));
    
    this.urlParsedParams = query || {};

    // Add sort to state if it exists
    this.input.sort = (this.urlParsedParams.sort) ? this.urlParsedParams.sort : this.defaultSort;

    // if Page is in the url, add it here.
    this.input.page = (this.urlParsedParams.page) ? this.urlParsedParams.page : 0;
    
    // this.testAPI(this.urlParsedParams);
  },
  mounted(){   
    // this.testAPI(this.urlParsedParams);
  },
  methods:{
    testFormChange(event){
      console.log(event);
    },
    // This can stay here, Just needs some clean up.
    testAPI(params = {}){
      // if(this.utility.initialLoad)
      // {

      // }

      // Emit Loading Event.
      this.$emit('loading',true);

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

      history.replaceState(params, 'search', qs);

      // if (poppingState) {
      //   // console.info('popping state');
      //   // history.replaceState(params, 'search', qs);
      // } else if (_.isEqual(this.urlParsedParams, params)) {
      //   console.info('push state:', qs, this.urlParsedParams, '->', params);
      //   // update the URL
      //   history.pushState(params, 'search', qs);
      // } else {
      //   // console.info('replace state:', qs);
      //   history.replaceState(params, 'search', qs);
      // }

      let vm = this;
      let req = picc.API.search(query, function(error, data) {
        console.log('loaded schools:', data);
        vm.results.schools = data.results;
        vm.results.meta = data.metadata;

        vm.$emit('loading',false);
      });
    }
  }
}


</script>