import Vue from 'vue';
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import vueNumeralFilterInstaller from 'vue-numeral-filter';


import Test from './components/vue/Test.vue';
import SchoolPage from './SchoolPage.vue';
import SchoolProgramsPage from './SchoolProgramsPage.vue';

import './vue/filters.js'
import './plugins/chartjs.js';

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
    'school-page': SchoolPage,
    'school-programs-page': SchoolProgramsPage,
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