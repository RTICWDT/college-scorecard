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
