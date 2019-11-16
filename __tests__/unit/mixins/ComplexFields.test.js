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

    expect(wrapper.vm.id).toEqual(expect.anything());
    expect(wrapper.vm.id).toEqual(130794);

    expect(wrapper.vm.schoolName).toEqual(expect.anything());
    expect(wrapper.vm.schoolName).toEqual("Yale University");

    expect(wrapper.vm.city).toEqual(expect.anything());
    expect(wrapper.vm.city).toEqual("New Haven");

    expect(wrapper.vm.state).toEqual(expect.anything());
    expect(wrapper.vm.state).toEqual("CT");

    expect(wrapper.vm.schoolUrlDisplay).toEqual(expect.anything());
    expect(wrapper.vm.schoolUrlDisplay).toEqual("https://www.yale.edu");

    expect(wrapper.vm.underInvestigation).toEqual(expect.anything());
    expect(wrapper.vm.underInvestigation).toBeFalsy();

    expect(wrapper.vm.years).toEqual(expect.anything());
    expect(wrapper.vm.years).toStrictEqual(3);

    // TODO - Better coverage
    expect(wrapper.vm.awardLevels).toEqual(expect.anything());
    expect(wrapper.vm.awardLevels).toBeFalsy();

    expect(wrapper.vm.netPrice).toEqual(expect.anything());
    expect(wrapper.vm.netPrice).toEqual(expect.any(Number));

    expect(wrapper.vm.undergraduates).toEqual(expect.anything());
    expect(wrapper.vm.undergraduates).toEqual(expect.any(Number));

    expect(wrapper.vm.publicPrivate).toEqual(expect.anything());
    expect(wrapper.vm.publicPrivate).toEqual("private");

    expect(wrapper.vm.income).toEqual(expect.anything());
    expect(wrapper.vm.income).toEqual({"0-48000":4554,"30001-75000":5706,"30001-48000":4392,"75000-plus":30322,"0-30000":4978,"75001-110000":13223,"48001-75000":6986,"110001-plus":35873});

    // TODO - Better Coverage
    expect(wrapper.vm.specialDesignations).toEqual(expect.anything());
    expect(wrapper.vm.specialDesignations).toEqual([]);

    expect(wrapper.vm.raceEthnicity).toEqual(expect.anything());
    expect(wrapper.vm.raceEthnicity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Unknown"
        })
      ])
    );

    

  })
})