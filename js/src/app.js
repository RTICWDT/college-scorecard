import "@babel/polyfill";
import Vue from 'vue';
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import vueNumeralFilterInstaller from 'vue-numeral-filter';

import IndexPage from './vue/pages/index.vue';

import SchoolPage from './vue/pages/school.vue';
import SchoolProgramsPage from './vue/pages/school_fields.vue';
import TransitionPage from './vue/pages/school_transition.vue';

import SearchPage from './vue/pages/search.vue';

import DataIndexPage from './vue/pages/data.vue';
import DataChangelogPage from './vue/pages/data_changelog.vue';
import DataDocumentationPage from './vue/pages/data_documentation.vue';
import DataGlossaryPage from './vue/pages/data_glossary.vue';

import ComparePage from './vue/pages/compare.vue';
import FourOhFourPage from './vue/pages/404.vue';

import './vue/filters.js'
import './vue/mixins.js'
import './plugins/chartjs.js';
import {localStorageKeys} from './vue/constants.js';
import {LocalStorage} from './vue/localStoage.js';

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
    'transition-page': TransitionPage,
    'search-page': SearchPage,
    'data-index-page': DataIndexPage,
    'data-changelog': DataChangelogPage,
    'data-documentation': DataDocumentationPage,
    'data-glossary': DataGlossaryPage,
    'compare-page': ComparePage,
    'four-oh-four': FourOhFourPage
  },
  created(){
    this.refreshCompareSchools();
  },
  mounted(){
  },
  methods:{
    // Refresh Compare Schools from Local Storage.
    refreshCompareSchools(){
      this.compareSchools = LocalStorage.selectAll(localStorageKeys.COMPARE_KEY);
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

      // picc.school.selection.vueToggle(schoolData);
      LocalStorage.toggleCompare(schoolData, localStorageKeys.COMPARE_KEY);
      this.refreshCompareSchools();
    }
  }
});