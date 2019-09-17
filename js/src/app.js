import Vue from 'vue';
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import vueNumeralFilterInstaller from 'vue-numeral-filter';


import Test from './components/vue/Test.vue';
import Donut from './components/vue/Donut.vue';
import NameAutocomplete from './components/vue/NameAutocomplete.vue'
import SchoolPage from './SchoolPage.vue'
import Bar from './components/vue/Bar.vue'
import './vue/filters.js'

Vue.prototype._ = _
Vue.use(vueNumeralFilterInstaller, { locale: 'en' });

new Vue({
  vuetify,
  el: '#app',
  data:{
    results:{}
  },
  components:{
    'test': Test,
    'donut': Donut,
    'name-autocomplete': NameAutocomplete,
    'school-page': SchoolPage,
    'bar-chart': Bar
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