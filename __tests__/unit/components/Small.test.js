import {shallowMountWithConfig} from '../../utility/ShallowMount';

import SmallSchoolIcons from '../../../js/src/components/vue/SmallSchoolIcons.vue';
import schoolData from '../../mock/school.json';
import {fields as fieldData} from '../../../js/src/vue/constants.js';

const mountOptions = {
  propsData:{
    school: schoolData,
    fields: fieldData
  }
}

describe('SmallSchoolIcons.vue', () => {

  test('is a Vue instance', () => {
    // const wrapper = shallowMount(SmallSchoolIcons,{
    //   propsData:{
    //     school: schoolData,
    //     fields: fieldData
    //   },
    //   mocks: {
    //     $vuetify: { breakpoint: {} },
    //   },
    //   Vue,
    //   vuetify,
    // });

    const wrapper = shallowMountWithConfig(SmallSchoolIcons,mountOptions);

    console.log(wrapper.html());
    // const wrapper = shallowMount(SearchResultCard)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})