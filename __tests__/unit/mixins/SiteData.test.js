import {
  shallowMount,
  mount,
  createLocalVue
} from '@vue/test-utils';

import {SiteData} from '../../../js/src/vue/mixins/SiteData.js';

const localVue = createLocalVue();

const testComponent = {
  template: '<p>Hello World</p>',
  mixins:[SiteData]
}

describe('Mixin: SiteData', () => {

  test('Actaully works', () => {
    const wrapper = mount(testComponent,{
      localVue,
    });

  })

})
