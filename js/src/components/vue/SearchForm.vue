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
                
                <select aria-labelledby="label-select-state" class="select-state" name="state" multiple v-model="input.state" @change="$emit('form-input-change',input)">
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
 _ = require('lodash');

export default {
  props:{
    states: Array,
    programs: Array,
    urlParsedParams: Object
  },
  data(){
    return{
      input:{
        state:[]
      }
    }
  },
  watch:{
    // Watch prop and clone for local state.
    urlParsedParams(newVal, oldVal){
      this.input = _.cloneDeep(newVal);
    }
  },
  mounted(){
    // this.input = _.deepCopy(this.formState);
  },
  methods:{
    processChangeEvent(){
      // Emit change to par
      // Send all data to paraent.

    }
  }
}
</script>