import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import SearchForm from '../../../js/src/components/vue/SearchForm.vue';

// Ingest of params with proper mapped state
// Testing clean input computed property
// Epected Output


describe('SearchForm.vue', () => {

  beforeEach(() => {
  })
  
  test('Renders correctly', async () => {
    const mountOptions = {
      propsData:{
        displayAllFilters: true,
        autoSubmit: true,
        urlParsedParams:{}
      },
    }

    const wrapper = shallowMountWithConfig(SearchForm,mountOptions);
    expect(wrapper.element).toMatchSnapshot();
  });

  test('is a Vue instance', () => {
    const mountOptions = {
      propsData:{
        displayAllFilters: true,
        autoSubmit: true,
        urlParsedParams:{}
      },
      methods:{
        debounceEmitSearchQuery(){
          this.$emit('search-query', "Test");
        }
      }
    }

    const wrapper = shallowMountWithConfig(SearchForm,mountOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

})