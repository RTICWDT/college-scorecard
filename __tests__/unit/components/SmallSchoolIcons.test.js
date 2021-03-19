import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import SmallSchoolIcons from '../../../js/src/components/vue/SmallSchoolIcons.vue';
import schoolData from '../../mock/school.json';
import {fields as fieldData} from '../../../js/src/vue/constants.js';

describe('SmallSchoolIcons.vue', () => {

  beforeEach(() => {
  })

  test('is a Vue instance and displays correct icons', () => {
    const mountOptions = {
      propsData:{
        school: {
          school:{
            ownership: 2,
            locale: 12,
            degrees_awarded:{
              predominant: 3
            }
          },
          latest:{
            student:{
              size: 5742
            }
          }
        },
        fields: fieldData
      }
    }

    const wrapper = mountWithConfig(SmallSchoolIcons,mountOptions);

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.find('.icon-four').exists()).toBe(true);
    expect(wrapper.find('.icon-private').exists()).toBe(true);
    expect(wrapper.find('.icon-city').exists()).toBe(true);
    expect(wrapper.find('.icon-medium').exists()).toBe(true);
  });

  // Test displays properly.
})