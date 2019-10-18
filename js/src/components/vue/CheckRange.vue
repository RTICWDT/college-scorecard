<style lang="scss" scoped>
.subhead-2{
  margin-top: 0.3rem !important;
  margin-bottom: 0.3rem !important;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif !important;
}
.appendedText{
  margin-top: 20px;
  padding: 0 5px;
}
</style>

<template>
  <div>
    <p class='subhead-2'>
      <slot name='label'>
        {{legendTitle}}
      </slot>
    </p>

    <v-row >
      <v-col class='py-0 d-flex justify-space-around align-content-center'>
      
      <v-slider v-model="sliderValue"
        class="align-center pa-0 ma-0"
        hide-details
        @input="handleInput"
        :min="min"
        :max="max"
        :step="step"
        :color="trackColor"
        :track-color="trackBackground"
        thumb-color="secondary"
      >
        <template v-slot:append>
          <v-text-field v-model="sliderValue"
            hide-details
            type="number"
            @input="handleInput"
            solo
            dense
            :prefix="prefix"
            :suffix="appendText"
            style="width: 100px;"
          ></v-text-field>
        </template>
        <template v-slot:prepend>
          <v-checkbox v-model="enableSlider"
            @change="handleEnable" 
            color="secondary"
            class="pa-0 ma-0"
            hide-details
          ></v-checkbox>
        </template>

      </v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { EventBus } from '../../vue/EventBus.js';

export default {
  props:{
    legendTitle:{
      type: String,
      default: "Title"
    },
    value: Number,
    enable: Boolean,
    min: Number,
    max: Number,
    step: Number,
    appendText: {
      type: String,
      default: null
    },
    andUp:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      sliderValue: this.value,
      enableSlider: this.enable,
      trackColor: 'secondary',
      trackBackground: 'grey' 
    }
  },
  computed:{
    prefix(){
      let text = '';
      text += this.andUp? "≥ ":"≤ ";
      text += (this.appendText == 'k')? '$':''
      return text; 
    }
  },
  watch:{
    value(){
      this.sliderValue = this.value;
    },
    enable(){
      this.enableSlider = this.enable;
    }
  },
  mounted(){
    if(this.andUp)    
    {
      this.trackColor = "grey";
      this.trackBackground = "secondary";
    }
    else
    {
      this.trackColor = "secondary";
      this.trackBackground = "grey";
    }
  
    EventBus.$on('search-form-reset', () => {
      // TODO - State is changed in parent component.
      // this.enableSlider = false;
      // this.sliderValue = null;
    });
  },
  methods: {
    handleInput (e) {
      //Activate slider when the slider is moved. Prevent from triggering when clearing form.
      if(!this.enableSlider && e != 0){
        this.enableSlider = true;
        this.handleEnable(this.enableSlider);
      }

      // Prevent from triggering when clearing form.
      if(e != 0){
        this.$emit('input', Number(this.sliderValue));
      }
      
    },
    handleEnable(e){
      this.$emit('slider-toggle', e)
    },
  }
}
</script>