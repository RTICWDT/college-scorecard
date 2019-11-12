import {shallowMountWithConfig} from '../../utility/ShallowMount';

import SmallSchoolIcons from '../../../js/src/components/vue/SmallSchoolIcons.vue';
import schoolData from '../../mock/school.json';
import {fields as fieldData} from '../../../js/src/vue/constants.js';

describe('SmallSchoolIcons.vue', () => {

  beforeEach(() => {
  })

  test('is a Vue instance', () => {
    const mountOptions = {
      propsData:{
        school: schoolData,
        fields: fieldData
      }
    }

    const wrapper = shallowMountWithConfig(SmallSchoolIcons,mountOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  // Test displays properly.

  // Test what happens


})