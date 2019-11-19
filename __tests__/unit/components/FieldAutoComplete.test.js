import {shallowMountWithConfig, mountWithConfig} from '../../utility/MountWithConfig.js';

import FieldAutocomplete from '../../../js/src/components/vue/FieldAutocomplete.vue';
import { getConsoleOutput } from '@jest/console';

describe('FieldAutocomplete.vue', () => {

  test('Renders correctly', () => {
    const mountOptions = {
      attachToDocument: true,
    }

    const wrapper = mountWithConfig(FieldAutocomplete, mountOptions);
    expect(wrapper.element).toMatchSnapshot();
    wrapper.destroy();
  });

  test('MapValueToProp', () => {
    const mountOptions = {
    }

    const wrapper = shallowMountWithConfig(FieldAutocomplete, mountOptions);
    let cip4Test = wrapper.vm.mapValuePropToState('0402');

    expect(cip4Test).toStrictEqual({
      "cip4":"04.02",
      "field":"Architecture"
    });

    // With wrong input
    cip4Test = wrapper.vm.mapValuePropToState('123');
    expect(cip4Test).toStrictEqual(null);

    cip4Test = wrapper.vm.mapValuePropToState('9999');
    expect(cip4Test).toStrictEqual(null);
  });

});