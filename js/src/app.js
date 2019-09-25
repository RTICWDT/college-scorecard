import Vue from 'vue';
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import vueNumeralFilterInstaller from 'vue-numeral-filter';

import SchoolPage from '../../school/index.vue';
import SchoolProgramsPage from '../../school/fields.vue';
import SearchPage from './SearchPage.vue';
import DataIndexPage from '../../data/index.vue';
import DataChangelogPage from '../../data/changelog.vue';
import DataDocumentationPage from '../../data/documentation.vue';

import './vue/filters.js'
import './plugins/chartjs.js';

Vue.prototype._ = _
Vue.use(vueNumeralFilterInstaller, { locale: 'en' });

import style from '../../sass/style.scss';

new Vue({
  vuetify,
  el: '#app',
  data:{
    results:{},
    site:{
      data:{
        all: null,
        states: null,
        programs: null,
        religiousAffiliations:null,
        specializedMission:null,
      }
    },
    isLoading: true,
    compareSchools:null
  },
  components:{
    'school-page': SchoolPage,
    'school-programs-page': SchoolProgramsPage,
    'search-page': SearchPage,
    'data-index-page': DataIndexPage,
    'data-changelog': DataChangelogPage,
    'data-documentation': DataDocumentationPage
  },
  created(){
    this.refreshCompareSchools();
  },
  mounted(){
    let vm = this;
    // Process the search updated event.
    document.addEventListener('search-updated', function (e) {
      console.log("Event Heard From Vue.");
      vm.refreshResults(e.detail.data);
    });

    // Items passed via page variable.
    // TODO - Do we need any more data?
    this.site.data.all = siteDataAll;
    this.site.data.states = this.site.data.all.states;
    this.site.data.programs = this.site.data.all.programs;
    this.site.data.religiousAffiliations = this.site.data.all.religious_affiliations;
    this.site.data.specializedMission = this.site.data.all.special_designations;
  },
  methods:{
    refreshResults(resultsObject){
      this.results = resultsObject;
    },
    // Refresh Compare Schools from Local Storage.
    refreshCompareSchools(){
      this.compareSchools = picc.school.selection.all(picc.school.selection.LSKey);
    }
  }
});