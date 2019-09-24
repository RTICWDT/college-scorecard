<style lang="scss">
  .search-form-degree-wrapper{
    
    .search-form-degree-cb{
      padding:0px;
      margin:0px;
    }
    .v-messages{
      display: none;
    }

  }
</style>

<template>

  <v-form>
    <slot name="name-auto-complete">
      <v-autocomplete label="Search By Name" append-icon="mdi-database-search"> </v-autocomplete>
    </slot>
    
    <v-select v-model="input.state"
      :items="states"
      item-text="name"
      item-value="abbr"
      label="Location"
      multiple
      chips
      ></v-select>
    
    <v-select v-model='input.major'
      :items='programs'
      item-text='label'
      item-value='key'
        label='Field Of Study'
    >
    </v-select>

  <fieldset>
    <legend>Length</legend>
    <div class="search-form-degree-wrapper">
        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Two Year"
          value="a"
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Four Year"
          value="b"
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Less than Two Year"
          value="c"
        ></v-checkbox>
    </div>
  </fieldset>

  <fieldset>
    <legend>Graduation Rate(%)</legend>

    <v-row justify="space-around">
      <v-checkbox v-model="utility.enable.graduation_rate"></v-checkbox>

      <v-slider v-model="input.completion_rate"
        class="align-center"
        :class="{'v-slider--disabled': !utility.enable.graduation_rate}"
        hide-details
      >
        <template v-slot:append>
          <v-text-field v-model="input.completion_rate"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>

    </v-row>
    
    <!-- Checkbox to activate  -->




  </fieldset>






    <!-- <v-radio-group v-model="input.degree" :mandatory="false"
      label="Length"
    >
      <v-radio label="Two Year" value="a"></v-radio>
      <v-radio label="Four Year" value="b"></v-radio>
      <v-radio label="Less than Two Year" value="c"></v-radio>
    </v-radio-group> -->


  </v-form>

<!-- <form @submit.prevent="OnSubmit"> -->

    <!-- SLOT FOR SEARCH with default markup -->


    <!-- NEED COLLAPSE MENU STUFF -->




      <!-- <div class="controls-container">
        <ul class="collapsible">
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
      </div> -->
  <!-- </form> -->
</template>

<script>
import _ from 'lodash';
import querystring from 'querystring';

// TODO - Add props and methods to generate forward URL + disable debounce & watch

export default {
  props:{
    states: Array,
    programs: Array,
    urlParsedParams: Object,
    generateURL: {
      type: Boolean,
      default: false
    }
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
        completion_rate: null,
        // page:0,
        // sort:""
      },
      utility:{
        // Hold Default state of form data.
        formDefult:{},
        // // Some elements need translation before interacting with the API.
        // mapDataValues:[
        //   {
        //     field: "graduation_rate"
        //   }
        // ]
        // Helper to activate debounced query after initial load.
        initialized: false,
        enable:{
          graduation_rate: false
        },
      }
    }
  },
  watch:{
    cleanInput: {
      handler(newValue,oldValue){
        // On first load trigger query immediately, then debounce additional queries.
        if(this.utility.initialized){
          this.debounceEmitSearchQuery();
        }else{
          this.$emit('search-query', newValue);
          this.utility.initialized = true;
        }
      },
      deep: true
    }
  },
  computed:{
    // Remove items that are not set
    cleanInput(){
      let defaultValues = this.utility.formDefult;
      // Pick only values that are different from default state.
      let groomedInput =  _.pickBy(this.input,(value,key) => {
        // If it does not exist in the default state object, remove.
        if(!_.has(defaultValues,key)){
          return false;
        }

        //If the input value is not eqaul to default, return value.
        if(!_.isEqual(value,defaultValues[key])){
          return value;
        }
      });


      // Pefrom Input to API data alterations.
      // TODO - Refactor this process. Ingest and egress.  Maybe arrary of objects with string numeral parsing.  Is there a more elegant way?

      // Completion rate
      if(groomedInput.completion_rate && groomedInput.completion_rate > 0 && this.utility.enable.graduation_rate){
        groomedInput.completion_rate = groomedInput.completion_rate / 100 + '..';
      }else{
        _.unset(groomedInput,'completion_rate');
      }


      return groomedInput;
    },
    // Generate a URI string of params for forwarding to search page.
    searchURL(){
      let qs = querystring.stringify(this.cleanInput);
      qs = '?' + qs.replace(/^&+/, '')
        .replace(/&{2,}/g, '&')
        .replace(/%3A/g, ':');
      
      return qs;
    },



  },
  created(){
    // Replicate default form state.
    this.utility.formDefult = _.cloneDeep(this.input);

    // TODO - Refactor this aswell
      // For example, percentages for grad rate.

    this.input = _.mergeWith(this.input,this.urlParsedParams,function(objVal,newObjValue,key){
      if(_.isArray(objVal) && _.isString(newObjValue)){
        return [newObjValue];
      }
      
      // TODO - Are there consts?
      // Perform any URL -> Form data translations
      if(key === 'completion_rate'){
        return parseFloat(newObjValue) * 100;
      }

    });

    // TODO - Refactor to a more elegant. Loop through all utility enables, and trigger on.
    // Set Sliders as active:
    if(this.input.completion_rate > 0){
      this.utility.enable.graduation_rate = true;
    }

    this.debounceEmitSearchQuery = _.debounce(function() {
      this.$emit('search-query', this.cleanInput);
    }, 1000);

  },
  mounted(){

  },
  methods:{
    processChangeEvent(){
    }
  }
}
</script>