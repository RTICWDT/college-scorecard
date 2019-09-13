<template>
  <div>
    <!-- Make Whole Search Field Component -->
    <ul id="slide-out" class="sidenav">
      <div class='row'>

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
import SearchResultCard from './components/vue/SearchResultCard.vue';

const querystring = require('querystring');

export default {
  components:{
    'search-result-card': SearchResultCard
  },
  props:{
    'page-permalink': String
  },
  data(){
    return {
      results:{
        schools:[]
      }
    };
  },
  mounted(){
    this.testAPI();
  },
  methods:{
    // This would go up one level to root vue instance.
    testAPI(){
      let params = {state:['MA']};
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

      let vm = this;
      let req = picc.API.search(query, function(error, data) {
        console.log('loaded schools:', data);
        vm.results.schools = data.results;
        
      });
    }
  }
}


</script>