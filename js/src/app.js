import Vue from 'vue';
import Test from './components/vue/Test.vue';
import SearchPage from './SearchPage.vue';

let _ = require('lodash');

new Vue({
  el: '#app',
  data:{
    results:{},
    site:{
      all:null,
      data:{
        states: null,
        programs: null,
      }
    }
  },
  components:{
    'test': Test,
    'search-page': SearchPage
  },
  mounted(){
    let vm = this;
    // Process the search updated event.
    document.addEventListener('search-updated', function (e) {
      console.log("Event Heard From Vue.");
      vm.refreshResults(e.detail.data);
    });

    // Items passed via page variable.
    this.site.all = siteAll;
    this.site.data.states = siteDataStates;
    this.site.data.programs = siteDataPrograms;
  },
  methods:{
    refreshResults(resultsObject){
      this.results = resultsObject;
    }
  }
});