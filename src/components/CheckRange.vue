<style lang="scss" scoped>
.subhead-2 {
  margin-top: 0.3rem !important;
  margin-bottom: 0.3rem !important;
  font-weight: 600;
  font-family: "Montserrat", sans-serif !important;
}
.appendedText {
  margin-top: 20px;
  padding: 0 5px;
}
</style>

<template>
  <div>
    <p class="subhead-2" :id="generatedId">
      <slot name="label">
        {{ legendTitle }}
      </slot>
    </p>

    <v-row>
      <v-col class="my-2 py-0 d-flex justify-space-around align-content-center">
        <v-slider
          v-model="sliderValue"
          :id="id"
          class="align-center pa-0 ma-0"
          hide-details
          @input="handleInput"
          :min="min"
          :max="max"
          :color="trackColor"
          :track-color="trackBackground"
          thumb-color="secondary"
          :aria-labelledby="generatedId"
          thumb-label
          :title="id"
        >
          <template v-slot:append>
            <v-text-field
              v-model="sliderValue"
              :id="`${id}-field`"
              :title="`${id}-field`"
              hide-details
              type="number"
              min="0"
              @input="handleInput"
              solo
              dense
              :prefix="prefix"
              :suffix="appendText"
              style=""
              :aria-labelledby="generatedId"
            ></v-text-field>
          </template>
          <template v-slot:prepend>
            <div style="display:inline-flex;min-width:100%;">
              <v-checkbox
                v-model="enableSlider"
                :id="`${id}-check`"
                @change="handleEnable"
                color="secondary"
                class="pa-0 ma-0"
                hide-details
                :aria-labelledby="generatedId"
              ></v-checkbox>
            </div>
          </template>
        </v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    legendTitle: {
      type: String,
      default: "Title",
    },
    value: Number,
    enable: Boolean,
    min: Number,
    max: Number,
    step: Number,
    appendText: {
      type: String,
      default: null,
    },
    andUp: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      sliderValue: this.value,
      enableSlider: this.enable,
      trackColor: "secondary",
      trackBackground: "grey",
    }
  },
  computed: {
    prefix() {
      let text = ""
      text += this.andUp ? "≥ " : "≤ "
      text += this.appendText == "k" ? "$" : ""
      return text
    },
    generatedId() {
      return "component-" + this._uid + "-label"
    },
  },
  watch: {
    value() {
      this.sliderValue = this.value
    },
    enable() {
      this.enableSlider = this.enable
    },
  },
  mounted() {
    if (this.andUp) {
      this.trackColor = "grey"
      this.trackBackground = "secondary"
    } else {
      this.trackColor = "secondary"
      this.trackBackground = "grey"
    }
  },
  methods: {
    handleInput(e) {
      //Activate slider when the slider is moved. Prevent from triggering when clearing form.
      if (!this.enableSlider && e != 0) {
        this.enableSlider = true
        this.handleEnable(this.enableSlider)
      }

      // Prevent from triggering when clearing form.
      if (e != 0) {
        this.$emit("input", Number(this.sliderValue))
      }
    },
    handleEnable(e) {
      this.$emit("slider-toggle", e)
    },
  },
}
</script>
