import Vue from 'vue';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

import _ from 'lodash';
Vue.prototype._ = _;

import VueNumeralFilterInstaller from 'vue-numeral-filter';
// Vue.use(VueNumeralFilterInstaller, { locale: 'en' });

import "../../js/src/vue/filters.js";

import SearchResultCard from '../../js/src/components/vue/SearchResultCard.vue';
import schoolData from '../mock/school.json';
import {fields as fieldData} from '../../js/src/vue/constants.js';

import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';

const localVue = createLocalVue();

describe('', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify();
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(SearchResultCard,{
      propsData:{

      },
      mocks: {
        $vuetify: { breakpoint: {} },
      },
      Vue,
      vuetify,
    });
    
    console.log(wrapper.html());
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})



// import Vue from 'vue';
// import Vuetify from 'vuetify';
// Vue.use(Vuetify);

// import "../../js/src/vue/filters.js";

// import SearchResultCard from '../../js/src/components/vue/SearchResultCard.vue';

// // import VueNumeralFilterInstaller from 'vue-numeral-filter';
// // Vue.use(VueNumeralFilterInstaller, { locale: 'en' });

// import {
//   mount,
//   shallowMount,
//   createLocalVue
// } from '@vue/test-utils';

// const localVue = createLocalVue();

// describe('SearchResultCard.vue', () => {
//   let vuetify

//   beforeEach(() => {
//     vuetify = new Vuetify();
//     // window.siteDataAll = {};
//     // window.history.pushState({}, 'Test Title', '/test.html?test=tennis');
//   })

//   test('is a Vue instance', () => {


//     const wrapper = mount(SearchResultCard,{
//       propsData:{
        
//       },
//       mocks: {
//         $vuetify: { breakpoint: {} },
//       },
//       localVue,
//       vuetify,
//     });

//     console.log(wrapper.html());

//     // const wrapper = shallowMount(SearchResultCard)
//     expect(wrapper.isVueInstance()).toBeTruthy()
//   })
// })