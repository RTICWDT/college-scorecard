// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import DefaultLayout from '~/layouts/Default.vue'
import Vuetify from 'vuetify'
import "~/sass/style.scss";

import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueClipboard from 'vue-clipboard2';

import _ from 'lodash';

import ScorecardHeader from '~/components/ScorecardHeader.vue';
import ScorecardFooter from '~/components/ScorecardFooter.vue';


export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.use(Vuetify, {  
    theme: {
      themes: {
        light: {
          primary: '#2b6091',
          secondary: '#216d09',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    }
  })
  Vue.use(VueClipboard);
  Vue.use(vueNumeralFilterInstaller, { locale: 'en' });
  Vue.component('scorecard-header', ScorecardHeader);
  Vue.component('scorecard-footer', ScorecardFooter);

  appOptions.vuetify = new Vuetify({})
  Vue.component('Layout', DefaultLayout)
  Vue.prototype._ = _
}
