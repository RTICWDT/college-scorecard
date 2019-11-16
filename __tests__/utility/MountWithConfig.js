import Vue from 'vue';
import Vuetify from 'vuetify';
import _ from 'lodash';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import '../../js/src/vue/filters.js';
import '../../js/src/vue/mixins.js'
// import '../../js/src/plugins/chartjs.js';

// Vue.prototype._ = _;
// Vue.use(vueNumeralFilterInstaller, { locale: 'en' });
Vue.use(Vuetify);

import {
  shallowMount,
  mount,
  createLocalVue
} from '@vue/test-utils';

const localVue = createLocalVue();
localVue.prototype._ = _;
localVue.use(vueNumeralFilterInstaller, { locale: 'en' });
document.body.setAttribute('data-app', true); // To stop the vue warn error for some components
// localVue.use(Vuetify);

export function shallowMountWithConfig(componentToMount, options = {}){
  // const localVue = createLocalVue();
  const vuetify = new Vuetify();

  // mount the component with all the options we added
  return shallowMount(componentToMount,{
    mocks: {
      $vuetify: { breakpoint: {} },
    },
    // Vue,
    localVue,
    vuetify,
    ...options
  });
}

export function mountWithConfig(componentToMount, options = {}){
  // const localVue = createLocalVue();
  const vuetify = new Vuetify();

  // mount the component with all the options we added
  return mount(componentToMount,{
    mocks: {
      $vuetify: { breakpoint: {} },
    },
    // Vue,
    localVue,
    vuetify,
    ...options
  });
}