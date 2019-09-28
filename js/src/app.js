import Vue from 'vue';
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import vueNumeralFilterInstaller from 'vue-numeral-filter';

import IndexPage from '../../index.vue';
import SchoolPage from '../../school/index.vue';
import SchoolProgramsPage from '../../school/fields.vue';
import SearchPage from '../../search/index.vue';
import DataIndexPage from '../../data/index.vue';
import DataChangelogPage from '../../data/changelog.vue';
import DataDocumentationPage from '../../data/documentation.vue';
//import ComparePage from '../../compare/index.vue';

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
    'index-page': IndexPage,
    'school-page': SchoolPage,
    'school-programs-page': SchoolProgramsPage,
    'search-page': SearchPage,
    'data-index-page': DataIndexPage,
    'data-changelog': DataChangelogPage,
    'data-documentation': DataDocumentationPage,
    //'compare-page': ComparePage
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
    },
    // Toggle Compare School in local storage.
    toggleCompareSchool(school){
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

      this.refreshCompareSchools();
    }
  }
});