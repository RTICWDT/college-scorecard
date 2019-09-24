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
  .search-show-more-header{
    // TODO: negative Margin.
    padding: 10px;
    background-color: purple;
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

  <check-range legend-title="Graduation Rate" v-model="input.completion_rate"
    :enable="utility.enable.completion_rate" @slider-toggle="utility.enable.completion_rate = $event"
    :min="0" :max="100" append-icon="mdi-percent"
  ></check-range>

  <check-range legend-title="Average Annual Cost" v-model="input.avg_net_price"
    :enable="utility.enable.avg_net_price" @slider-toggle="utility.enable.avg_net_price = $event"
    :min="0" :max="100"
  >
    <template v-slot:append-text>
      K
    </template>
  </check-range>

  <div class="search-form-show-more-container">
    <div class="search-show-more-header" @click='utility.showMore = !utility.showMore'>
      <span>More</span>
      <v-icon v-if='utility.showMore'>mdi-chevron-down</v-icon>
      <v-icon v-else>mdi-chevron-up</v-icon>
    </div>

    <div class="search-show-more-body" v-if="utility.showMore">
      <!-- TODO: Transition -->

      <fieldset>
        <legend>Admittance</legend>
        <!-- TODO - These are not working yet -->
        <check-range v-model="input.avg_net_price"
          :enable="utility.enable.avg_net_price" @slider-toggle="utility.enable.avg_net_price = $event"
          :min="0" :max="100"
        >
          <template v-slot:label>
            Composite SAT
          </template>
        </check-range>

        <check-range v-model="input.avg_net_price"
          :enable="utility.enable.avg_net_price" @slider-toggle="utility.enable.avg_net_price = $event"
          :min="0" :max="100"
        >
          <template v-slot:label>
            ACT Score
          </template>
        </check-range>

        <check-range v-model="input.avg_net_price"
          :enable="utility.enable.avg_net_price" @slider-toggle="utility.enable.avg_net_price = $event"
          :min="0" :max="100"
        >
          <template v-slot:label>
            Acceptance Rate (%)
          </template>
        </check-range>
      </fieldset>

      <fieldset>
        <legend>Size</legend>

        <v-btn small :class="{primary: input.size === 'small' }" @click="handleSizeClick('small')">Small</v-btn>
        <v-btn small :class="{primary: input.size === 'medium' }" @click="handleSizeClick('medium')">Medium</v-btn>
        <v-btn small :class="{primary: input.size === 'large' }" @click="handleSizeClick('large')">Large</v-btn>
      </fieldset>

    </div>
  </div>

  <!-- <v-expansion-panels>
    <v-expansion-panel>
          <v-expansion-panel-header>Item</v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels> -->





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
import CheckRange from './CheckRange.vue';

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
  components:{
    'check-range': CheckRange
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
        avg_net_price: null,
        // page:0,
        // sort:""
      },
      utility:{
        // Hold Default state of form data.
        formDefult:{},
        // Helper to activate debounced query after initial load.
        initialized: false,
        showMore: false,
        enable:{
          completion_rate: false,
          avg_net_price: false
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
    },
    urlParsedParams: {
      handler(newValue,oldValue){
        this.mapInputFromProp();
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
      if(groomedInput.completion_rate && groomedInput.completion_rate > 0 && this.utility.enable.completion_rate){
        groomedInput.completion_rate = groomedInput.completion_rate / 100 + '..';
      }else{
        _.unset(groomedInput,'completion_rate'); // TODO: CONST;
      }

      if(groomedInput.avg_net_price && groomedInput.avg_net_price > 0 && this.utility.enable.avg_net_price){
        groomedInput.avg_net_price = '..' + groomedInput.avg_net_price * 1000;
      }else{
        _.unset(groomedInput,'avg_net_price'); // TODO: CONST;
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
    this.mapInputFromProp();

    this.debounceEmitSearchQuery = _.debounce(function() {
      this.$emit('search-query', this.cleanInput);
    }, 1000);

  },
  mounted(){

  },
  methods:{
    mapInputFromProp(){
      this.input = _.mergeWith(this.input,this.urlParsedParams,function(objVal,newObjValue,key){
        if(_.isArray(objVal) && _.isString(newObjValue)){
          return [newObjValue];
        }
        
        // TODO - Are there consts?
        // Perform any URL -> Form data translations
        if(key === 'completion_rate'){
          return parseFloat(newObjValue) * 100;
        }

        if(key === 'avg_net_price'){
          if(parseFloat(newObjValue.substr(2)) > 1000)
          {
            return parseFloat(newObjValue.substr(2)) / 1000;
          }
        }
      });

      // TODO - Refactor to a more elegant. Loop through all utility enables, and trigger on.
      // Set Sliders as active:
      if(this.input.completion_rate > 0){
        this.utility.enable.completion_rate = true;
      }

      if(this.input.avg_net_price > 0){
        this.utility.enable.avg_net_price = true;
      }

    },
    processChangeEvent(){
    },
    handleSizeClick(value){
      if(value === this.input.size){
        this.input.size = ""
      }else{
        this.input.size = value;
      }
    }
  }
}
</script>