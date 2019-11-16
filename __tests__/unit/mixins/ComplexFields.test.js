import {
  shallowMount,
  mount,
  createLocalVue
} from '@vue/test-utils';

import ComplexFields from '../../../js/src/vue/mixins/ComplexFields.js'
import schoolData from '../../mock/school.json';

const localVue = createLocalVue();

//Create Fake component
const testComponent = {
  props: ["school"],
  template: '<p>Hello World</p>',
  mixins:[ComplexFields]
}

describe('Mixin: ComplexFields', () => {
  
  test('Computed items are correct', () => {
    const wrapper = mount(testComponent,{
      localVue,
      propsData:{
        school: schoolData
      }
    });

    expect(wrapper.vm.id).not.toBeNull();
    expect(wrapper.vm.id).toEqual(130794);


  })
})