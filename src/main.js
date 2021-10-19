// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import Vuetify from 'vuetify'
import Vuex from 'vuex'

import "~/sass/style.scss";
import '~/js/plugins/chartjs.js';

import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueClipboard from 'vue-clipboard2';

import _ from 'lodash';

import ScorecardHeader from '~/components/ScorecardHeader.vue';
import ScorecardFooter from '~/components/ScorecardFooter.vue';

import VuexPersistence from 'vuex-persist'



export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.use(Vuetify)
  Vue.use(VueClipboard);
  Vue.use(Vuex)
  Vue.use(vueNumeralFilterInstaller, { locale: 'en' });
  Vue.component('scorecard-header', ScorecardHeader);
  Vue.component('scorecard-footer', ScorecardFooter);

    const vuexLocal = new VuexPersistence({
      storage: isClient?window.localStorage:null,
      filter: (mutation) => mutation.type != 'toggleDrawer'
    })
  

  appOptions.vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#2B6091',
          secondary: '#216D0A',
          accent: '#8c9eff',
          error: '#b61d1c'
        },
      },
    },
  })

  Vue.prototype._ = _



  appOptions.store = new Vuex.Store({
    state: {
      fos: [],
      institutions: [],
      drawerOpen: false,
      clearForm: false
    },
    getters: {
      getInstitutions: state => state.institutions,
      getFieldsOfStudy: state => state.fos
    },
    mutations: {
      toggleSchool(state, obj) {
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
          if (state.institutions.length < 10)
            state.institutions.push(entry);
        }
      },
      toggleFieldOfStudy(state, obj) {
        let entry;
        //console.log(state);
        //console.log(obj);
        if (obj.fosTitle) {
          entry = obj;
        }
        else {
          entry = {
            code: obj.code,
            credentialTitle: (obj.credential.level === 3 ? "Bachelor's Degree" : obj.credential.title), 
            fosTitle: obj.title,
            id: obj.unit_id,
            institutionName: obj.school.name,
            credentialLevel: obj.credential.level
          }
        }
        if (state.fos.some(fos => { return fos.code == entry.code && fos.id == entry.id && fos.credentialLevel == entry.credentialLevel})) {
          state.fos = state.fos.filter((fos)=>{
            return (
              !(fos.code == entry.code && fos.id == entry.id && fos.credentialLevel == entry.credentialLevel)
            )
          });
        }
        else {
          if (state.fos.length < 10) 
            state.fos.push(entry)
        }
      },
      toggleDrawer(state, value = null) {
        if (!value) {
          state.drawerOpen = !state.drawerOpen;
        }
        else
        {
          state.drawerOpen = value
        }
      },
      clearForm(state) {
        state.clearForm = true;
      }
    },
    plugins: [vuexLocal.plugin]
  })

  
}
