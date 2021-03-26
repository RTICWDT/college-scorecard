// import "@babel/polyfill";
// import Vue from 'vue';
// import vuetify from './plugins/vuetify'
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueClipboard from 'vue-clipboard2';
Vue.use(vueNumeralFilterInstaller, { locale: 'en' });



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
    compareSchools:null,
    compareFieldsOfStudy:null
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
      this.compareFieldsOfStudy = LocalStorage.selectAll(localStorageKeys.COMPARE_FOS_KEY);
    },
    // Toggle Compare School in local storage.
    toggleCompareSchool(school){
      // Prepare Data, Make a call to the picc function.
      let schoolData = {
        dataset:{
          // bind:"selected_school",
          school:"compare-schools",
          schoolId: (school.schoolId) ? String(school.schoolId) : String(school.id),
          schoolName: (school.schoolName) ? school.schoolName : school['school.name'],
        }
      };

      // picc.school.selection.vueToggle(schoolData);
      LocalStorage.toggleCompare(schoolData, localStorageKeys.COMPARE_KEY);
      this.refreshCompareSchools();
    },
    // General function for adding item to local storage
    toggleCompareItem(item, storageKey = localStorageKeys.COMPARE_KEY){
      // Need where it goes,
      let data = {};

      let previousCompareCount = this.compareSchools.length + this.compareFieldsOfStudy.length;

      switch (storageKey) {
        case localStorageKeys.COMPARE_KEY:
          data = {
            schoolId: (item.schoolId) ? String(item.schoolId) : String(item.id),
            schoolName: (item.schoolName) ? item.schoolName : item['school.name'],
          }
          break;
        case localStorageKeys.COMPARE_FOS_KEY:
          data = {
            institutionName: item.institutionName,
            credentialTitle: item.credentialTitle,
            fosTitle: item.fosTitle,
            id: item.id,
            code: item.code,
            credentialLevel: item.credentialLevel
          }
          break;
        default:
          data = {
            schoolId: (item.schoolId) ? String(item.schoolId) : String(item.id),
            schoolName: (item.schoolName) ? item.schoolName : item['school.name'],
          }
          break;
      }

      LocalStorage.toggleCompare(data, storageKey);
      this.refreshCompareSchools();

      // Toggle compare drawer when first element is added.
      if(previousCompareCount === 0){
        EventBus.$emit('compare-drawer-show', true);
      }
    }
  }
});