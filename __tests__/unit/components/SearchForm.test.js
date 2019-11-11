import {shallowMountWithConfig} from '../../utility/ShallowMount';

import SearchForm from '../../../js/src/components/vue/SearchForm.vue';

describe('SearchForm.vue', () => {

  beforeEach(() => {
  })

  test('is a Vue instance', () => {
    const mountOptions = {
      propsData:{

      }
    }

    const wrapper = shallowMountWithConfig(SearchForm,mountOptions);

    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})