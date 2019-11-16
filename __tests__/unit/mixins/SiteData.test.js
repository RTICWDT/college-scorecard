import {
  shallowMount,
  mount,
  createLocalVue
} from '@vue/test-utils';

import {SiteData} from '../../../js/src/vue/mixins/SiteData.js';

const localVue = createLocalVue();

//Create Fake component
const testComponent = {
  template: '<p>Hello World</p>',
  mixins:[SiteData]
}

describe('Mixin: SiteData', () => {
  
  test('Imports file data correctly', () => {
    const wrapper = mount(testComponent,{
      localVue
    });

    const importedData = wrapper.vm.site.data;
    
    expect(importedData.cip_2_digit).toBeDefined();
    expect(importedData.cip_2_digit).toContainEqual({"label":"42","value":"PSYCHOLOGY."});

    expect(importedData.cip_4_digit).toBeDefined();
    expect(importedData.cip_4_digit).toContainEqual({"label":"01.00","value":"Agriculture, General."},);

    expect(importedData.glossary).toBeDefined();
    expect(importedData.glossary['avg-cost']).toBeDefined();

    expect(importedData.race_ethnicity).toBeDefined();
    expect(importedData.race_ethnicity['aian']).toBeDefined();

    expect(importedData.religious_affiliations).toBeDefined();
    expect(importedData.religious_affiliations).toContainEqual({"label":"African Methodist Episcopal","value":"51"});
    
    expect(importedData.special_designations).toBeDefined();
    expect(importedData.special_designations['women_only']).toBeDefined();

    expect(importedData.states).toBeDefined();
    expect(importedData.states).toContainEqual({"abbr":"AL","name":"Alabama"});
  })

  test('Computed properties', () => {
    const wrapper = mount(testComponent,{
      localVue
    });

    expect(wrapper.vm.RELIGIOUS_AFFILIATIONS_BY_NUMBER).toBeDefined();
    expect(wrapper.vm.RELIGIOUS_AFFILIATIONS_BY_NUMBER['99']).toStrictEqual('Other (none of the above)');

    expect(wrapper.vm.CIP2).toBeDefined();
    expect(wrapper.vm.CIP2['01']).toStrictEqual('AGRICULTURAL/ANIMAL/PLANT/VETERINARY SCIENCE AND RELATED FIELDS.');

    expect(wrapper.vm.CIP4).toBeDefined();
    expect(wrapper.vm.CIP4).toContainEqual({"cip4":"01.00","field":"Agriculture, General"});
  })

})
