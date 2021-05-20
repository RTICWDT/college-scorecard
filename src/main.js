// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import DefaultLayout from '~/layouts/Default.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

import "~/sass/style.scss";

import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueClipboard from 'vue-clipboard2';

import _ from 'lodash';

import ScorecardHeader from '~/components/ScorecardHeader.vue';
import ScorecardFooter from '~/components/ScorecardFooter.vue';

//import Vuetify from '~/js/plugins/vuetify';

import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.use(Vuetify)
  Vue.use(VueClipboard);
  Vue.use(Vuex)
  Vue.use(vueNumeralFilterInstaller, { locale: 'en' });
  Vue.component('scorecard-header', ScorecardHeader);
  Vue.component('scorecard-footer', ScorecardFooter);

  appOptions.vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#2B6091',
          secondary: '#216D0A',
        },
      },
    },
  })
  Vue.component('Layout', DefaultLayout)
  Vue.prototype._ = _



  appOptions.store = new Vuex.Store({
    state: {
      fos: [],
      institutions: [],
      count: 0
    },
    mutations: {
      toggleSchool(state, obj) {
        console.log(obj);
        let entry;
        if (obj.schoolId) {
          entry = obj
        }
        else
        {
          entry = { schoolId: obj.id, schoolName: obj['school.name'] }
        }
        if (state.institutions.some(inst => inst.schoolId === entry.schoolId)){
          state.institutions = state.institutions.filter((value)=>{
            return value.schoolId != entry.schoolId;
          })  
        } else {
          state.institutions.push(entry);
        }
      },
      toggleFieldOfStudy(state, obj) {
        console.log(obj);
        let entry;
        if (obj.fosTitle) {
          entry = obj;
        }
        else {
          entry = {
            code: obj.code,
            credentialTitle: obj.credential.title,
            fosTitle: obj.title,
            id: obj.unit_id,
            institutionName: obj.school.name,
            credentialLevel: obj.credential.level
          }
        }
        if (state.fos.some(fos => { return fos.code == entry.code && fos.id == entry.id && fos.credentialLevel == entry.credentialLevel})) {
          console.log('remove');
          state.fos = state.fos.filter((fos)=>{
            return (
              !(fos.code == entry.code && fos.id == entry.id && fos.credentialLevel == entry.credentialLevel)
            )
          });
        }
        else {
          state.fos.push(entry)
        }
      },
      increment(state) {
        state.count++;
      }
    },
    plugins: [vuexLocal.plugin]
})
}


/*
export const LocalStorage = {
  selectAll: function (key) {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  },
  // isSelected: function (id, key) {
  //   return (this.selectAll(key).map(function(fav){
  //     return +fav.schoolId;
  //   }).indexOf(id));
  // },
  isSelected: function(data, key){
    return _.findIndex(this.selectAll(key), data);
  },
  // toggleCompare: function (el,key){
  //   let dataset = el.dataset;
  //   let collection = dataset.school;
  //   let isSelected = this.isSelected(+dataset.schoolId, collection);
  //   let selectedSchools = this.selectAll(key);
  //
  //   if (isSelected >= 0) {
  //     selectedSchools.splice(isSelected, 1);
  //
  //     // save the new collection
  //     window.localStorage.setItem(collection, JSON.stringify(selectedSchools));
  //   } else {
  //
  //     if (selectedSchools.length < 10) {
  //       // add school to collection
  //       selectedSchools.push(dataset);
  //
  //       // save the new collection
  //       window.localStorage.setItem(collection, JSON.stringify(selectedSchools));
  //     }
  //   }
  // }

  toggleCompare: function(data,key){
    let isSelected = this.isSelected(data,key);
    let selectedItems = this.selectAll(key);

    console.log("Selected Items");
    console.log(selectedItems);

    if (isSelected >= 0) {
      selectedItems.splice(isSelected, 1);

      // save the new collection
      window.localStorage.setItem(key, JSON.stringify(selectedItems));
    } else {

      if (selectedItems.length < 10) {
        // add school to collection
        selectedItems.push(data);

        // save the new collection
        window.localStorage.setItem(key, JSON.stringify(selectedItems));
      }
    }
  }

   // Refresh Compare Schools from Local Storage.
    refreshCompareSchools(){
      this.compareSchools = LocalStorage.selectAll(localStorageKeys.COMPARE_KEY);
      this.compareFieldsOfStudy = LocalStorage.selectAll(localStorageKeys.COMPARE_FOS_KEY);
    },
    // Toggle Compare School in local storage.
    toggleCompareSchool(school){
      let schoolData = {
        dataset:{
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
*/