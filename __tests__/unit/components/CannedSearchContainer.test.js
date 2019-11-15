import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import CannedContainerSearch from '../../../js/src/components/vue/CannedSearchContainer.vue';

describe('CannedSearchContainer.vue', () => {
  
  test('Renders correctly', async () => {
    const mountOptions = {
      propsData:{
      },
    }

    const wrapper = mountWithConfig(CannedContainerSearch, mountOptions);
    expect(wrapper.element).toMatchSnapshot();
  });

  test('Add items and arrays with handleCannedToggle, Remove items', async() => {
    const mountOptions = {};

    const wrapper = shallowMountWithConfig(CannedContainerSearch, mountOptions);

    wrapper.vm.handleCannedToggle({value: true, data:[{test_1: 'test_1'}]});
    // await wrapper.vm.$nextTick();

    // Add toggle some items
    wrapper.vm.handleCannedToggle({value: true, data:[{test_2: 'test_2'}]});
    wrapper.vm.handleCannedToggle({value: true, data:[{test_2: 'test_2'}]});
    wrapper.vm.handleCannedToggle({value: true, data:[{test_array:['test_1']}]});
    wrapper.vm.handleCannedToggle({value: true, data:[{test_array:['test_2']}]});
    
    expect(wrapper.vm.query).toEqual({ 
      test_1: 'test_1',
      test_2: 'test_2',
      test_array: [ 'test_1', 'test_2' ]
    });

    // Toggle to remove
    wrapper.vm.handleCannedToggle({value: false, data:[{test_2: 'test_2'}]});
    wrapper.vm.handleCannedToggle({value: false, data:[{test_array:['test_1']}]});

    expect(wrapper.vm.query).toEqual({ 
      test_1: 'test_1',
      test_array: ['test_2' ]
    });

  });

})