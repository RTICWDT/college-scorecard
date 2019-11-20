import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import CheckRange from '../../../js/src/components/vue/CheckRange.vue';
import { wrap } from 'module';

describe('CheckRange.vue', () => {
  
  // test('Renders correctly', async () => {
  //   const mountOptions = {
  //     attachToDocument: true,
  //     propsData:{
  //       legendTitle: "Test Title",
  //       appendText: "Test Append Text",
  //       id: "test-check-range"
  //     },
  //   }

  //   const wrapper = mountWithConfig(CheckRange, mountOptions);
  //   expect(wrapper.element).toMatchSnapshot();
  //   wrapper.destroy();
  // });

  // start with no value, Adjust value, check events
  test('Item enables when value is updated', () => {
    const mountOptions = {
      attachToDocument: true,
      propsData:{
        legendTitle: "Test Title",
        appendText: "Test Append Text",
        id: "test-check-range"
      },
    }

    const wrapper = mountWithConfig(CheckRange, mountOptions);
    
    expect(wrapper.vm.enable).toBe(false);

    const inputField = wrapper.find('#test-check-range-field');
    inputField.setValue(50);

    expect(wrapper.vm.enableSlider).toBe(true);
    wrapper.destroy();
  });
})
