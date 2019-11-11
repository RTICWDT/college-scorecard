import {shallowMountWithConfig} from '../../utility/ShallowMount';

import SearchResultCard from '../../../js/src/components/vue/SearchResultCard.vue';
import schoolData from '../../mock/school.json';
import {fields as fieldData} from '../../../js/src/vue/constants.js';

const mountOptions = {
  propsData:{
    school: schoolData,
    fields: fieldData
  }
}

describe('Component: SearchResultCard', () => {

  beforeEach(() => {
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMountWithConfig(SearchResultCard,mountOptions);

    console.log(wrapper.html());
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})