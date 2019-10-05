<style lang="scss" scoped>
.subhead-2{
  margin-top: 0.3rem !important;
  margin-bottom: 0.3rem !important;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif !important;
}
</style>

<template>
  <div>
    <p class='subhead-2'>
      <slot name='label'>
        {{legendTitle}}
      </slot>
    </p>

    <v-row justify="space-around" >
      <v-col class='py-0'>
      
      <v-slider v-model="sliderValue"
        class="align-center pa-0 ma-0"
        hide-details
        @input="handleInput"
        :min="min"
        :max="max"
        :step="step"
        color="secondary"
        track-color="grey"
      >
        <template v-slot:append>
          <v-text-field v-model="sliderValue"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            @input="handleInput"
            :append-icon='appendIcon'
          ></v-text-field>

          <slot name="append-text">
          </slot>
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
    appendIcon: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      sliderValue: this.value,
      enableSlider: this.enable
    }
  },
  mounted(){
    EventBus.$on('search-form-reset', () => {
      this.enableSlider = false;
      this.sliderValue = null;
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
    handleEnable(e){1
      this.$emit('slider-toggle', e)
    },
  }
}
</script>