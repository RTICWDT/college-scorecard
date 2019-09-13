import Vue from 'vue';
import Test from './components/vue/Test.vue';
import SearchPage from './SearchPage.vue';

new Vue({
  el: '#app',
  data:{
    results:{}
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
  },
  methods:{
    refreshResults(resultsObject){
      this.results = resultsObject;
    }
  }
});