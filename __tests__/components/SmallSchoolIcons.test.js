import Vue from 'vue';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

import _ from 'lodash';
Vue.prototype._ = _;

import "../../js/src/vue/filters.js";

import SmallSchoolIcons from '../../js/src/components/vue/SmallSchoolIcons.vue';
import schoolData from '../mock/school.json';
import {fields as fieldData} from '../../js/src/vue/constants.js';

import {
  mount,
  shallowMount,
  createLocalVue
} from '@vue/test-utils';

const localVue = createLocalVue();

describe('SearchResultCard.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify();
    // console.log(schoolData);
  })

  test('is a Vue instance', () => {


    const wrapper = shallowMount(SmallSchoolIcons,{
      propsData:{
        // school: schoolData,
        fields: fieldData
      },
      mocks: {
        $vuetify: { breakpoint: {} },
      },
      Vue,
      vuetify,
    });

    console.log(wrapper.html());

    // const wrapper = shallowMount(SearchResultCard)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})