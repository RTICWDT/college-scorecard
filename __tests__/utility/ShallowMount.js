import Vue from 'vue';
import Vuetify from 'vuetify';
import _ from 'lodash';
import numeral from 'numeral';
// import vueNumeralFilterInstaller from 'vue-numeral-filter';
import '../../js/src/vue/filters.js';
import '../../js/src/vue/mixins.js'
// import '../../js/src/plugins/chartjs.js';

Vue.prototype._ = _;
// Vue.use(vueNumeralFilterInstaller, { locale: 'en' });

import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';

export function shallowMountWithConfig(componentToMount, options = {}){
  const localVue = createLocalVue();
  const vuetify = new Vuetify();

  // mount the component with all the options we added
  return shallowMount(componentToMount,{
    mocks: {
      $vuetify: { breakpoint: {} },
    },
    localVue,
    vuetify,
    ...options
  });
}