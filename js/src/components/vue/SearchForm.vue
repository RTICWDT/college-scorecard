<style lang="scss" scoped>
  .search-form-degree-wrapper{
    
    .v-messages{
      display: none;
    }

  }
  .subhead-2{
    margin-top: 1rem !important;
    margin-bottom: 0.3rem !important;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif !important;
  }
</style>

<template>

  <v-form>
    <div class='pa-5'>
    <p class='subhead-2'>School Name</p> 
    <name-autocomplate></name-autocomplate>

    <p class='subhead-2'>Location</p>    
    <v-select v-model="input.state"
      :items="site.data.states"
      item-text="name"
      item-value="abbr"
      multiple
      chips
      hide-details
      placeholder="Select one..."
      ></v-select>
    
    <p class='subhead-2'>Field of Study/Major</p>
    <field-autocomplete v-model="input.cip4"></field-autocomplete>

    <p class='subhead-2'>Length</p>
    <div class="search-form-degree-wrapper">
        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Two Year"
          value="a"
          color="primary"          
          hide-details
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Four Year"
          value="b"
          color="primary"
          hide-details
        ></v-checkbox>

        <v-checkbox
          class="search-form-degree-cb"
          v-model="input.degree"
          label="Less than Two Year"
          value="c"
          color="primary"
          hide-details
        ></v-checkbox>
    </div>

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
    </div>

    <v-expansion-panels v-if="displayAllFilters">
      <v-expansion-panel>
        <v-expansion-panel-header style='background-color: #ccc; border-radius: 0px !important;'>
          More
        </v-expansion-panel-header>
        <v-expansion-panel-content>
     
          <p class='title mt-3'>Admittance</p>
          <!-- TODO - These are not working yet -->
          <check-range v-model="input.sat"
            :enable="utility.enable.sat" 
            @slider-toggle="utility.enable.sat = $event"
            :min="0" 
            :max="1600"
            :step="100"
          >
            <template v-slot:label>
              Composite SAT
            </template>
          </check-range>

          <check-range v-model="input.act"
            :enable="utility.enable.act" @slider-toggle="utility.enable.act = $event"
            :min="0" 
            :max="36"
            :step="1"
          >
            <template v-slot:label>
              ACT Score
            </template>
          </check-range>

          <check-range v-model="input.acceptance"
            :enable="utility.enable.acceptance" 
            @slider-toggle="utility.enable.acceptance = $event"
            :min="0"
            :max="100"
            :step="5"
          >
            <template v-slot:label>
              Acceptance Rate (%)
            </template>
          </check-range>
    



        <p class='title'>School Characteristics</p>
      
          <p class='subtitle-2'>Size</p>
          <div>
          <v-btn small :class="{primary: input.size === 'small' }" @click="handleSizeClick('small')">Small</v-btn>
          <v-btn small :class="{primary: input.size === 'medium' }" @click="handleSizeClick('medium')">Medium</v-btn>
          <v-btn small :class="{primary: input.size === 'large' }" @click="handleSizeClick('large')">Large</v-btn>
          </div>
              
    
          <p class='subtitle-2 mt-5'>Type of School</p>
          <div class="search-form-type-container">
            <v-checkbox
              hide-details
              v-model="input.control"
              label="Public"
              value="public"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.control"
              label="Private Nonprofit"
              value="private"
            ></v-checkbox>

            <v-checkbox
              hide-details
              v-model="input.control"
              label="Private For-Profit"
              value="profit"
            ></v-checkbox>
          </div>

          <p class='subtitle-2 mt-5'>Urbancity</p>
          <!-- TODO - Not working yet -->
          
              <v-checkbox
                hide-details            
                v-model="input.urban"
                label="City"
                value="city"
              ></v-checkbox>

              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Suburban"
                value="suburban"
              ></v-checkbox>
              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Town"
                value="town"
              ></v-checkbox>

              <v-checkbox
                hide-details
                v-model="input.urban"
                label="Rural"
                value="rural"
              ></v-checkbox>
 
        <p class='subtitle-2 pt-5'>Specialized Mission</p>
        <v-select v-model='input.serving'
          :items='cleanSpecializedMission'
          item-text="value"
          item-value="key"
          placeholder='Select one...'
        ></v-select>


        <p class='subtitle-2 pt-5'>Religious Affiliation</p>
        <v-select v-model='input.religious'
          :items='site.data.religious_affiliations'
          item-text='label'
          item-value='value'
          placeholder='Select one...'
        ></v-select>


     
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div id="search-submit-container" class="pa-2 text-center" v-if="!autoSubmit">
      <v-btn color="secondary" rounded @click="$emit('search-query',cleanInput)">Submit</v-btn>
    </div>

  </v-form>
</template>

<script>
import _ from 'lodash';
import querystring from 'querystring';
import CheckRange from './CheckRange.vue';
import NameAutocomplete from './NameAutocomplete.vue';
import FieldAutocomplete from './FieldAutocomplete.vue';
import { SiteData } from '../../vue/mixins/SiteData.js';

export default {
  mixins:[SiteData],
  props:{
    urlParsedParams: {
      type: Object
    },
    autoSubmit:{
      type: Boolean,
      default: false
    },
    displayAllFilters: {
      type: Boolean,
      default: false
    }
  },
  components:{
    'check-range': CheckRange,
    'name-autocomplate': NameAutocomplete,
    'field-autocomplete': FieldAutocomplete
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
        control:[], //Type
        serving:"",
        religious:"",
        completion_rate: null,
        avg_net_price: null,
        urban:[],
        cip4: "",
        act: null,
        sat: null,
        acceptance:null
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
          avg_net_price: false,
          sat: false,
          act: false,
          acceptance: false
        },
      }
    }
  },
  watch:{
    cleanInput: {
      handler(newValue,oldValue){
        // On first load trigger query immediately, then debounce additional queries.
        if(!this.autoSubmit){
          return;
        }

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
      // TODO - Refactor this process. Ingest and egress.  Maybe arrary of objects with string numeral parsing.  Refactor when we have some additional time.

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

      if(groomedInput.sat && groomedInput.sat > 0 && this.utility.enable.sat){
        groomedInput.sat = '..' + groomedInput.sat
      }else{
        _.unset(groomedInput,'sat'); // TODO: CONST;
      }

      if(groomedInput.act && groomedInput.act > 0 && this.utility.enable.act){
        groomedInput.act = '..' + groomedInput.act
      }else{
        _.unset(groomedInput,'act'); // TODO: CONST;
      }

      if(groomedInput.acceptance && groomedInput.acceptance > 0 && this.utility.enable.acceptance){
        groomedInput.acceptance = groomedInput.acceptance / 100 + '..'
      }else{
        _.unset(groomedInput,'acceptance'); // TODO: CONST;
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
    cleanSpecializedMission(){
      return _.map(this.site.data.special_designations,(value,key) => {
        return {
          'key': key,
          'value': value
        }
      })
    }
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
        
        // TODO - Are there consts?, add inarray check.
        // Perform any URL -> Form data translations
        if(key === 'completion_rate' || key === 'acceptance'){
          return parseFloat(newObjValue) * 100;
        }

        if(key === 'avg_net_price'){
          if(parseFloat(newObjValue.substr(2)) > 1000)
          {
            return parseFloat(newObjValue.substr(2)) / 1000;
          }
        }

        if(key === 'sat' || key === 'act'){
          return parseFloat(newObjValue.substr(2))
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

      if(this.input.sat > 0){
        this.utility.enable.sat = true;
      }

      if(this.input.act > 0){
        this.utility.enable.act = true;
      }

      if(this.input.acceptance > 0){
        this.utility.enable.acceptance = true;
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