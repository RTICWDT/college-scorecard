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