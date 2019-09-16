<template>
  <form @submit.prevent="OnSubmit">
      <div class="controls-container">
        <ul class="collapsible"> <!-- TODO: Extra class in main layout? -->
          <li>
              <div id="school-degree" class="collapsible-header" aria-controls="major-content">
                Programs/Degree <i class="material-icons">expand_more</i>
              </div>
              <div class="collapsible-body" id="major-content">
                  <label for="major-type">Choose a degree
                    <select id="major-type" name="degree">
                      <option value="" selected>Any</option>
                      <option value="c">Certificate</option>
                      <option value="a">Two-year (Associate's)</option>
                      <option value="b">Four-year (Bachelor's)</option>
                    </select>
                  </label>
          
                  <label for="major">Choose a program
                    <select id="major" name="major">
                      <option value="" selected>Any</option>
                      <option v-for="program in programs" :value="program.key" :key="program.key">{{program.label }}</option>
                    </select>
                  </label>
              </div>
          </li>


          <li>
            <div id="school-location" class="collapsible-header" aria-controls="location-content">
              Location <i class="material-icons">expand_more</i>
            </div>

            <div class="collapsible-body" id="location-content">

              <div class="input-add group_inline">
                
                <div class="label" id="label-select-state">
                  Select one or more states
                </div>
                
                <select aria-labelledby="label-select-state" class="select-state" name="state" multiple v-model="input.state">
                  <option value="" selected>Any</option>
                  <option v-for="state in states" :value="state.abbr" :key="state.abbr">{{ state.name }}</option>
                </select>

              </div>
            </div>
          </li>

        </ul>
      </div>
  </form>
</template>

<script>
import _ from 'lodash';

// TODO - Remove Sorting and Pagination.
  // TODO - Remove params that are not expected.

// TODO - Add props and methods to generate forward URL + disable debounce.

export default {
  props:{
    states: Array,
    programs: Array,
    urlParsedParams: Object
  },
  data(){
    return{
      input:{
        state:[],
        degree:"",
        major:"",
        region:[],
        zip:"",
        distance:"",
        size:"",
        name:"",
        control:"", //Type
        serving:"",
        religious:"",
        // page:0,
        // sort:""
      },
      utility:{
        // Hold Default state of form data.
        formDefult:{},
      }
    }
  },
  watch:{
    // Watch input changes and debounce for querying.
    cleanInput: {
      handler: _.debounce(function() {
        console.log("Search Updated Emit");
        this.$emit('search-query', this.cleanInput);
      }, 1000),
      deep: true
    },
  },
  computed:{
    // Remove items that are not set
    cleanInput(){
      let defaultValues = this.utility.formDefult;
      // Pick only values that are different from default state.
      return _.pickBy(this.input,(value,key) => {
        // If it does not exist in the default state object, remove.
        if(!_.has(defaultValues,key)){
          return false;
        }

        //If the input value is not eqaul to default, return value.
        if(!_.isEqual(value,defaultValues[key])){
          return value;
        }
      });
    }
  },
  created(){
    // Replicate default form state.
    this.utility.formDefult = _.cloneDeep(this.input);

    this.input = _.mergeWith(this.input,this.urlParsedParams,function(objVal,newObjValue){
      if(_.isArray(objVal) && _.isString(newObjValue)){
        return [newObjValue];
      }
    });
  },
  mounted(){

  },
  methods:{
    processChangeEvent(){
    }
  }
}
</script>