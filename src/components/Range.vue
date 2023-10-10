<template>
  <div class="range-container" :style="extraPad">
    <div class="range-chart" :style="rangeChartStyle">
      <div
        v-if="!hideLower"
        :style="{ left: bar_styles.left, right: bar_styles.right }"
        class="picc-range-bar"
        ref="bar"
      ></div>

      <span
        class="picc-range-label picc-range-label-min"
        :style="_min.styles"
        ref="min"
      >
        <span v-html="_min.label"></span>
      </span>

      <span
        class="picc-range-label picc-range-label-max"
        :style="_max.styles"
        ref="max"
      >
        <span v-html="_max.label"></span>
      </span>

      <v-tooltip top v-if="!hideLower" :disabled="!lowertip">
        <template v-slot:activator="{ on }">
          <span
            class="picc-range-label picc-range-label-lower"
            :style="_lower.styles"
            ref="lower"
            v-on="on"
          >
            <span v-html="_lower.label" :style="lowerTipStyleOverride"></span>
          </span>
        </template>

        <div class="hover-tip">
          {{ lowertip }}
        </div>
      </v-tooltip>

      <span
        v-if="!hideMiddle"
        class="picc-range-label picc-range-label-middle"
        :style="_middle.styles"
        ref="middle"
      >
        <span v-html="_middle.label"></span>
      </span>

      <v-tooltip top :disabled="!uppertip">
        <template v-slot:activator="{ on }">
          <span
            class="picc-range-label picc-range-label-upper"
            :style="_upper.styles"
            ref="upper"
            v-on="on"
          >
            <span v-html="_upper.label" :style="upperTipStyleOverride"></span>
          </span>
        </template>

        <div class="hover-tip">
          {{ uppertip }}
        </div>
      </v-tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";
.range-container {
  overflow: visible;
  height: 70px;
  padding-top: 20px;
  padding-right: 0px;
}
.range-chart {
  $label-height: 1.5em;
  $label-offset: 1.5em;
  $label-margin: $label-offset + $label-height;
  $label-width: 10em;

  background-color: $light-gray;
  display: block;
  /*height: 30px;*/
  margin-bottom: 0;
  margin-top: 0;
  max-width: none;
  position: relative;

  .picc-range-bar {
    background-color: $mid-light-blue;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: left 0.5s, right 0.5s;
  }

  .picc-range-label {
    height: 22px;
    position: absolute;
    top: 0;
    transition: left 0.5s;
    font-size: 12px;
    font-family: "Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif !important;

    span {
      font-weight: 400;
      position: absolute;
      top: $label-height;
      width: $label-width;
      //cursor: pointer;
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-middle {
      color: #000;
      font-size: 12px;
    }

    &.picc-range-label-max,
    &.picc-range-label-lower {
      span {
        right: 0;
        text-align: right;
      }
    }

    &.picc-range-label-middle,
    &.picc-range-label-lower,
    &.picc-range-label-upper {
      border-left: 3px solid $medium-blue;
    }

    &.picc-range-label-upper {
      border-left: none;
      border-right: 3px solid $medium-blue;
      span {
        padding-left: 0.25em;
      }
    }
    &.picc-range-label-lower {
      span {
        padding-right: 0.25em;
      }
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-middle {
      top: auto;

      span {
        bottom: 100%;
        top: auto;
      }
    }

    &.picc-range-label-middle {
      span {
        margin-left: - calc($label-width / 2);
        text-align: center;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    min: {
      type: Object,
      default: function() {
        return { value: 0, label: "0" }
      },
    },
    max: {
      type: Object,
      default: function() {
        return { value: 100, label: "100" }
      },
    },
    lower: {
      type: Object,
      default: function() {
        return { value: 25, label: "Lower" }
      },
    },
    middle: {
      type: Object,
      default: function() {
        return { value: 50, label: "Middle" }
      },
    },
    upper: {
      type: Object,
      default: function() {
        return { value: 75, label: "Upper" }
      },
    },
    lowertip: {
      type: String,
      default: "",
    },
    lowerTipStyleOverride: {
      type: Object,
      default: () => {
        return {}
      },
    },
    uppertip: {
      type: String,
      default: "",
    },
    upperTipStyleOverride: {
      type: Object,
      default: () => {
        return {}
      },
    },
    hideMiddle: {
      type: Boolean,
      default: true,
    },
    hideLower: {
      type: Boolean,
      default: false,
    },
    addExtraPadding: {
      type: Boolean,
      default: true,
    },
    rangeChartStyle: {
      type: Object,
      default: () => {
        return {
          height: "15px",
        }
      },
    },
    labelMinMaxStyleOverride: {
      type: Object,
    },
  },
  data() {
    return {
      bar_styles: { left: 0, right: 0 },
      extraPad: {
        "padding-right": 0,
      },
    }
  },
  computed: {
    _min() {
      return this.styleLabel(this.min)
    },
    _max() {
      return this.styleLabel(this.max)
    },
    _lower() {
      // return this.styleLabel(this.lower);
      let styleLabel = this.styleLabel(this.lower, true)
      styleLabel.styles = {
        ...styleLabel.styles,
        ...this.lower.styles,
      }
      return styleLabel
    },
    _middle() {
      return this.styleLabel(this.middle)
    },
    _upper() {
      // return this.styleLabel(this.upper);
      let styleLabel = this.styleLabel(this.upper, false)
      styleLabel.styles = {
        ...styleLabel.styles,
        ...this.upper.styles,
      }
      return styleLabel
    },
  },
  methods: {
    update() {
      var min = this._min.value
      var max = this._max.value
      this.bar_styles.left = this.percent(this._lower.value) + "%"
      let right = this.percent(
        this._min.value + this._max.value - this._upper.value
      )
      this.bar_styles.right = right + "%"

      if (right < 20 && this.addExtraPadding) {
        this.extraPad["padding-right"] = "60px"
      }
    },
    scale(v) {
      return (v - this.min.value) / (this.max.value - this.min.value)
    },
    percent(v) {
      return (this.scale(v) * 100).toFixed(2)
    },
    styleLabel(obj, fixLabels = true) {
      let newObj = { ...obj }
      // console.log(newObj);
      newObj.styles = {}
      newObj.styles.display = newObj.label ? "block" : "none"
      let left = this.percent(newObj.value)
      if (left > 100) {
        left = 100
        //newObj.label = ">" + this._max.label
        newObj.label = this._max.label;
        newObj.value = this._max.value;
      }
      if (left < 0)
        left = 0
      newObj.styles.left = left + "%"

      if (85 < left && obj.label) {
        //let s = left.replace(/[0-9]+%\s?/g, '');
        if (this.$vuetify.breakpoint.xlOnly) {
          if (obj.label.includes("$")) newObj.styles.left = left - 15 + "%"
          else newObj.styles.left = left - 10 + "%"
        }        
        else if (this.$vuetify.breakpoint.lgOnly) {
          if (obj.label.includes("$")) newObj.styles.left = left - 15 + "%"
          else newObj.styles.left = left - 10 + "%"
        }
        else if (this.$vuetify.breakpoint.mdOnly) {
          if (obj.label.includes("$")) newObj.styles.left = left - 27 + "%"
          else newObj.styles.left = left - 15 + "%"
        }            
        else if (this.$vuetify.breakpoint.smOnly) {
          if (obj.label.includes("$")) newObj.styles.left = left - 37 + "%"
          else newObj.styles.left = left - 12 + "%"
        }
        else if (this.$vuetify.breakpoint.xsOnly) {
          if (obj.label.includes("$")) newObj.styles.left = left - 57 + "%"
          else newObj.styles.left = left - 15 + "%"
        }        
        else {
          if (obj.label.includes("$")) newObj.styles.left = left - 15 + "%"
          else newObj.styles.left = left - 15 + "%"
        }
        newObj.styles.color = "#ffffff"
      }      

  
      return newObj
    },
  },

  mounted() {
    this.update()
  },
}
</script>
