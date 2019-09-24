<template>
  <fieldset>
    <legend>
      <slot name='label'>
        {{legendTitle}}
      </slot>
    </legend>

    <v-row justify="space-around">
      <v-checkbox v-model="enableSlider" @change="handleEnable"></v-checkbox>

      <v-slider v-model="sliderValue"
        class="align-center"
        :class="{'v-slider--disabled': !enableSlider}"
        hide-details
        @input="handleInput"
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
            :step="step"
          ></v-text-field>

          <slot name="append-text">
          </slot>
        </template>
      </v-slider>

    </v-row>
  </fieldset>
</template>

<script>
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
  methods: {
    handleInput (e) {
      this.$emit('input', Number(this.sliderValue));
    },
    handleEnable(e){
      this.$emit('slider-toggle', this.enableSlider)
    },
  }
}
</script>