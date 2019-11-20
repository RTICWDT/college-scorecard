import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import SearchResultCard from '../../../js/src/components/vue/SearchResultCard.vue';
import schoolData from '../../mock/school.json';
import {fields as fieldData} from '../../../js/src/vue/constants.js';

describe('Component: SearchResultCard', () => {

  beforeEach(() => {
  })

  // test('is a Vue instance', () => {
  //   const mountOptions = {
  //     propsData:{
  //       school: schoolData,
  //       fields: fieldData
  //     }
  //   }

  //   const wrapper = shallowMountWithConfig(SearchResultCard,mountOptions);
  //   expect(wrapper.isVueInstance()).toBeTruthy()
  // })

  test('Comapre click event is fired',() => {
    const mountOptions = {
      propsData:{
        school: schoolData,
        fields: fieldData
      }
    }
    const wrapper = mountWithConfig(SearchResultCard, mountOptions);

    wrapper.find('.search-result-card-compare').trigger('click');
    expect(wrapper.emitted('toggle-compare-school')).toHaveLength(1);
  });

  test('Monitoring flag is displayed.', () => {
    // Add ed monitoring flag
    const schoolUnderMonitoring = Object.assign({}, schoolData, {school:{under_investigation:1}});

    const mountOptions = {
      propsData:{
        school: schoolUnderMonitoring,
        fields: fieldData
      }
    }

    const wrapper = shallowMountWithConfig(SearchResultCard, mountOptions);
    expect(wrapper.find('strong.white--text').text()).toBe('Under ED Monitoring');
  });

})