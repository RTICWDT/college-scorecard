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
      clearForm: false,
      outboundUrl: null,
    },
    getters: {
      getInstitutions: state => state.institutions,
      getFieldsOfStudy: state => state.fos,
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
      if (value != null) {
          state.drawerOpen = value
        }
        else
        {
          state.drawerOpen = !state.drawerOpen;
        }
      },
      clearForm(state) {
        state.clearForm = true;
      },
      setOutboundUrl(state, value = null) {
        state.outboundUrl = value;
      }      
    },
    plugins: [vuexLocal.plugin]
  })

  // Google Analytics and Console verification codes
  head.meta.push({
    name: 'google-site-verification',
    content: 'joZQgj-M8GQ05V29ojfVsbsNk44SRgGqJfws9tBcnPU'
  })

  head.meta.push({
    name: 'google-site-verification',
    content: 'V-KEdRwSWd6GSLEWRBddZy6B5yLCs6vkRRflrImQiKE'
  })

  // Legacy mobile metas
  head.meta.push({
    name: 'HandheldFriendly',
    content: 'True'
  })
  head.meta.push({
    name: 'MobileOptimized',
    content: '320'
  })   

  //Twitter and OpenGraph
  head.meta.push({
    'http-equiv':'Content-Security-Policy',
    content: "default-src 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:; child-src 'none'; script-src-elem * 'unsafe-inline'; style-src-elem 'self' 'unsafe-inline'; prefetch-src 'self'; connect-src https://api.data.gov 'self'; font-src 'self'"
  })
  head.meta.push({
    name: 'og:type',
    content: 'website'
  })   
  head.meta.push({
    name: 'twitter:card',
    content: 'summary_large_image'
  })  
  head.meta.push({
    name: 'og:description',
    content: 'Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings.'
  })    
  head.meta.push({
    name: 'twitter:description',
    content: 'Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings.'
  })    
  head.meta.push({
    name: 'description',
    content: 'Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings.'
  }) 
  head.meta.push({
    name: 'og:image',
    content: 'https://collegescorecard.ed.gov/img/Scorecard-Preview-2022.jpg'
  })   
  head.meta.push({
    name: 'twitter:image',
    content: 'https://collegescorecard.ed.gov/img/Scorecard-Preview-2022.jpg'  
  })    
  
  head.script.push({
    id: '_fed_an_ua_tag',
    src: 'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
  })  
  head.script.push({
    type: 'text/javascript',
    src: 'https://www.gstatic.com/charts/loader.js',
  })    
  head.script.push({
    type: 'text/javascript',
    src: 'https://www.googletagmanager.com/gtag/js?id=UA-48605964-29',
    async: true,
  })    
  head.script.push({
    type: 'text/javascript',
    src: 'https://www.googletagmanager.com/gtag/js?id=UA-48605964-29',
    async: true,
  })    
}
