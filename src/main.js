// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import Vuetify from 'vuetify'
import Vuex from 'vuex'

import "~/sass/style.scss";
import 'leaflet/dist/leaflet.css';

import '~/js/plugins/chartjs.js';

import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueClipboard from 'vue-clipboard2';

import _ from 'lodash';
import { FocusTrap } from 'focus-trap-vue';
import ScorecardHeader from '~/components/ScorecardHeader.vue';
import ScorecardFooter from '~/components/ScorecardFooter.vue';

import VuexPersistence from 'vuex-persist'

//import 'bootstrap';

//import { UswdsVue } from 'uswds-vue';



export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.use(Vuetify)
  Vue.use(VueClipboard);
  Vue.use(Vuex)
  Vue.use(vueNumeralFilterInstaller, { locale: 'en' });
  //Vue.use(UswdsVue);
  Vue.component('focus-trap', FocusTrap);
  Vue.component('scorecard-header', ScorecardHeader);
  Vue.component('scorecard-footer', ScorecardFooter);

    const vuexLocal = new VuexPersistence({
      storage: isClient?window.localStorage:null,
      filter: (mutation) => mutation.type != 'toggleDrawer'
    })
  

  appOptions.vuetify = new Vuetify({
    theme: {
      options: { 
        customProperties: true,
        cspNonce: 'dQw4w9WgXcQ'}, 
      themes: {
        light: {
          primary: '#027A48',
          secondary: '#027A48',
          accent: '#8c9eff',
          error: '#b61d1c',
          primaryfos: '#fdb022',
          tertiary: '#ebf0f3',
          darkgrey: '#6c737c'
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
  
  
  /*head.meta.push({
    'http-equiv':'Content-Security-Policy',
content: "default-src 'self' https://www.gstatic.com https//*.typekit.net https://dap.digitalgov.gov https://www.google-analytics.com https://www.gstatic.com https://www.googletagmanager.com; img-src 'self' *.googletagmanager.com data: https://*.basemaps.cartocdn.com/ *.cloud.gov *.googleapis.com *.google-analytics.com; child-src 'none'; script-src-elem * 'unsafe-hashes' 'sha256-gPjlli1HEdLlR0AZTY971/wQVOdSkl9mEinLnxrPpJw=' 'sha256-6egcWvmQP5hRCmW3iDq1X7sXo3/AY4zjQJNgqpm0rAg=' 'sha256-1e5RR2OpHhuX2h0Bat19DsNTmqbo4M3T1pqfeTXCHaA=' https://www.gstatic.com https://*.typekit.net/ https://fonts.googleapis.com 'self'; connect-src  https://api.data.gov https://www.google-analytics.com https://analytics.google.com  https://dap.digitalgov.gov https://stats.g.doubleclick.net 'self' ws:; font-src https://fonts.gstatic.com https://use.typekit.net 'self'; style-src 'unsafe-hashes' 'sha256-IQtfqzo2VPwYVfG45njd1UW4FZvVifJwM9V5cBNhx04=' 'sha256-yQomDylAVvpeRdlKgfqevQZtrtkp244GCzedeISNu5s=' 'sha256-vil6rwz9/3551namkTsVzfkGNkmRnO56lPD53U/pJbE=' 'sha256-cgjVz+andACCIsfeXoiI1/ChFQDlCC4y99sX5rrYseM=' 'sha256-TbrjG17MSiO8IKSlX/5IHYPweVR4+mHPUuUwZ7a5a2Y=' 'sha256-plI3P8SbP3ivQ+UUtO9JmesuN+PeYliWE+cQeiYVmiI=' 'sha256-uaE1UV3pZxXpavOfm/lrrxDNgEh6v+6g5hNCCp9X1bM=' 'sha256-lNOe1Kn+4LzGOr+ToMkETF58zM5uGP6/a0dq4hZYPYw=' 'sha256-xC8juOyOcGVG0BdxV2vy4LlzWOZfFlsV82FV45f1hTY=' 'sha256-hEgUMy467OqNfeKl/LTfR4/dPK2As3gne31r1nSBOEM=' 'sha256-jc9UupO4BKq2JkHD2Z57pylYRnr6PtjiI4FCyFavP+Q=' 'sha256-kwpt3lQZ21rs4cld7/uEm9qI5yAbjYzx+9FGm/XmwNU=' 'sha256-EjeKg7oj5a8SODh/FWP9+TlJK7I4FTcPMbwoz64kK2A=' 'sha256-uKAvZ8WKcIoeRdQwRKBztHzKuBMA3Z138XKPaddC+7w=' 'sha256-0EZqoz+oBhx7gF4nvY2bSqoGyy4zLjNF+SDQXGp/ZrY=' 'sha256-Q+nAeb6+lO7Hw/QTTOowxLK49HpHGB7ZfnCD6jX0qa4=' 'sha256-nr9cKw4ONTUDSB2DE0zh2RD8sdBaUN6T1YZ/cCE2H4M=' 'sha256-dkBZru08USynRApV+V+jfqq9MJtvAq+jnaGQA7L9XxU=' 'sha256-QdHgpwEEnPxZV6ByLX5uZCPOGKmc+SzQikh79cDYreg=' 'sha256-As+VZ5inwpJRs+3gKDhNonRoXR+TkIipyQpjbvYBHrU=' 'sha256-SaalYbFZ07L4qDYZ96HObgI4Re7qfskD24gbLnk5sMs=' 'sha256-jJoo4DNMwMVg4I4IDlg1ChLFJH7BV/MvNBPv6+rWzTc=' 'sha256-ANvVUHrEavvwj4x+omctWvh0ZmreLn18DtrkbfDSiLU=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-OwlOqbP3VnAzYedGO5K7BbLR2YOoHw96wRy+VxYn414=' 'sha256-SpI+QgQY6BCOYLFeTgU/Z7MZ/KACrNlP5nvudg2afjE=' 'sha256-5V9YVuxHIjG6QvEev93hYF1xNxaSY04UZuv2unPU6kI=' 'sha256-3N6czMg79KEwU27zoGyFZ+9tN6u4DjdWchvldaQGfJg=' 'sha256-mJdZhsxUcmqovcijgBWHajUhLFcxaAMgcl8+L3OoSBc=' 'sha256-UqwRKPEI+M9fzyKB+sUpqCjV2m04VhNFznxxOdPnNT0=' 'sha256-Qg5cxQYRx6S39U3W73DTaX6sJi/EsyRIdLpsrCGLU+Y=' 'sha256-45sUMOo34Q00977ekWUyBSJgpDN5q6k0Zj7t5hj2wSU=' 'sha256-712poVmdpVhla4ux+2hRbDwP5Pe8WghkleNxUA/pOOI=' 'sha256-GmQ3CN0FgcQUhYDj7WflBm5F5bTOZ+ULCAWm4lzmk/0=' 'sha256-pntav9oY700kXoHF80b4HDlnZ5BpaA2uhAVk4sV0gKc=' 'sha256-mJdZhsxUcmqovcijgBWHajUhLFcxaAMgcl8+L3OoSBc=' 'sha256-3N6czMg79KEwU27zoGyFZ+9tN6u4DjdWchvldaQGfJg=' 'sha256-UqwRKPEI+M9fzyKB+sUpqCjV2m04VhNFznxxOdPnNT0=' 'sha256-t24ZWXIZFGl0/9Pe+IsJCrOrxTlInar7Shy6lp8vK/A=' 'sha256-45sUMOo34Q00977ekWUyBSJgpDN5q6k0Zj7t5hj2wSU=' 'sha256-d5ZKJjeIRcwBXYLpyLytbE9ZOCaAXeS9GhHav4SwUaU=' 'sha256-EIQncaP5/cVFiCS/xPbpuNkEJ/oPQTms5c7x5rcHMw0=' 'sha256-JjdrXkXswLCxrOYd0x4YdkxIuxCSPyGd9r5+DkA8vjc=' 'sha256-nMxMqdZhkHxz5vAuW/PAoLvECzzsmeAxD/BNwG15HuA=' 'sha256-QMltachGXHWCMp4EqKjbNSh/DzUnnPauieGP1P/ICT8=' 'sha256-o8w/COZUxxk1YqNUesAyJl/MqdlJowzATI/JvM+1xFk=' 'sha256-TiLJM9i1j8TxGJWqhQ/W4PgcKojXXPTDyXe6cvzQeOM=' 'sha256-Cr/3tmZj9QqHn7Cas7RcSIajNiixeOsU+YyOXkNEsN8=' 'sha256-BG0pkMG9Kpet9txBspjL8nYPdJ1wuUo2pO5rkvKWg7A=' 'sha256-0NPSZcnPqpUsOZ1b5gOxuNJNbwzkNo5EoXYbyDVXJ4k=' 'sha256-5CuYvLl5DHQZ7RV1xUDWvP7bDc31+XoHROQ+GZkkyS4=' 'sha256-zFt+GYCSqXznoLwaqrFWKiM2IGeNifFvtoWhDH2+liU=' 'sha256-rrV3jwThzJUINGMpSjRKdVi6IhPrqn0QWdQ+u96+7ag=' 'sha256-7dAoMCVB0OERmvKZIpCFsJmy3n10ttKFIULn2f04yJE=' 'sha256-WtUJNKoD5kG3dRtebXgSr5Co7KJeisNSwP5hVNbrSBw=' 'sha256-EDUsUSiUC2IJbpcuogRTD5Gw0pDpPbYRV4j5MznLFbA=' 'sha256-WhjC19H3Qj6zIR2mv66wqmO6JiFPASWkwVwZwY4SFiQ=' 'sha256-Tc8NB7na72WLSJ+BvD8ZM8nhIWDuG5tx7npQmQowFxg=' 'sha256-qji8O9VzU919S7rA3XIbz3prhtgbZGcuj3BswSr4abs=' 'sha256-rRyULImNYSOOLTnzRXlj+7Ppij/85J4sL02fsXhfEfw=' https://fonts.googleapis.com https://www.gstatic.com https://p.typekit.net https://use.typekit.net 'self'; frame-src https://td.doubleclick.net/ https://www.google.com"
  })*/

  head.meta.push({
    name: 'viewport',
    content: "width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1"
  })
 
  head.meta.push({
    'http-equiv':'Cache-control',
    content: "private, no-store"
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
    content: 'https://collegescorecard.ed.gov/img/CollegeScorecard-Blog-Image-updated.png'
  })   
  head.meta.push({
    name: 'twitter:image',
    content: 'https://collegescorecard.ed.gov/img/CollegeScorecard-Blog-Image-updated.png'  
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
