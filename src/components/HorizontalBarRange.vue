<template>
  <div class="range-container" :style="extraPad">
    <div class="range-chart" :style="rangeChartStyle">
      <div
        v-if="!hideLower"
        :style="_bar.styles"
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
        v-if="!hideMedian"
        class="picc-range-label picc-range-label-median"
        :style="_median.styles"
        ref="median"
      >
        <span v-html="_median.label"></span>
        <span class="arrow-left"></span>
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
  height: 90px;
  padding-top: 16px;
  padding-right: 0px;
}
.range-chart {
  $label-height: 1.5em;
  $label-offset: 1.5em;
  $label-margin: $label-offset + $label-height;
  $label-width: 10em;
  $bar-width: 100px;
  $arrow-size: 7px;

  background-color: $bg-bar-chart;
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
    top: 4px;
    transition: left 0.5s;
    font-size: 0.85rem;

    span {
      font-weight: 400;
      position: absolute;
      top: 0px;
      //cursor: pointer;
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-middle {
      color: #000;
      font-size: 1rem;
    }

    &.picc-range-label-max,
    &.picc-range-label-lower {
      span {
        right: 0;
        text-align: right;
      }
    }

    &.picc-range-label-median,
    &.picc-range-label-lower,
    &.picc-range-label-upper {
      border-left: none;
    }

    &.picc-range-label-upper {
      border-left: none;
      border-right: none;
      span {
        padding-left: 0.25em;
        font-size: 18px !important;
        font-weight: bold;
      }
    }
    &.picc-range-label-lower {
      span {
        padding-right: 0.25em;

        display: none;
      }
      display: none;
      border-left: none !important;
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-middle {
      top: auto;

      span {
        bottom: 100%;
        top: auto;
        font-size: 12px;
      }
    }

    &.picc-range-label-median {
      top: 0;
      bottom: 0;
      height: $bar-width;
      position: absolute;
      margin-top: 0;
      margin-bottom: 0;
      height: 100%;
      width: 1px;
      background-color: #000;
      border-left: 1px solid #000;
      span {
        top: 35px !important;
        width: $label-width;
      }
      span:not(.arrow-left) {
        //margin-bottom: $bar-width + $arrow-size + 10;
        text-align: center;
        color: #000;
        top: 44px !important;
        margin-left: -3.75rem !important;
        font-weight: 400;
        font-size: 12px;
        font-family: "Public Sans", "Helvetica Neue", Helvetica, arial,
          sans-serif !important;
        font-style: italic;
        line-height: 14px;
      }
      span.arrow-left {
        width: 0;
        height: 0;
        border-left: $arrow-size solid transparent;
        border-bottom: $arrow-size solid black;
        border-right: $arrow-size solid transparent;
        margin-left: -7px;
        margin-top: 0px;
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
    median: {
      type: Object,
      default: function() {
        return { value: 50, label: "Midpoint", show: true }
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
    hideMedian: {
      type: Boolean,
      default: false,
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
          height: "35px",
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
      label_styles: { left: 0, right: 0 },
      extraPad: {
        "padding-right": 0,
      },
    }
  },
  computed: {
    _bar() {
      return this.styleBar(this.bar)
    },
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
    _median() {
      let styleLabel = this.styleLabel(this.median)
      styleLabel.styles.display = this.median.show ? "block" : "none"
      return styleLabel
    },
    _upper() {
      //return this.styleLabel(this.upper);
      let styleLabel = this.styleValueLabel(this.upper, false)
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

      if (right < 80 && this.addExtraPadding) {
        //this.extraPad["padding-right"] = "60px"
        var s = this._upper.styles.left.replace(/[0-9]+%\s?/g, "")
        this._upper.styles.left = s - 10 + "%"
      }
    },
    scale(v) {
      return (v - this.min.value) / (this.max.value - this.min.value)
    },
    percent(v) {
      return (this.scale(v) * 100).toFixed(1)
    },
    styleBar(obj, fixLabels = false) {
      let newObj = { ...obj }
      newObj.styles = {}
      var min = this._min.value
      var max = this._max.value
      newObj.styles.left = this.percent(this._lower.value) + "%"
      let right = this.percent(
        this._min.value + this._max.value - this._upper.value
      )
      newObj.styles.right = right + "%"
      return newObj
    },
    styleLabel(obj, fixLabels = false) {
      let newObj = { ...obj }
      newObj.styles = {}
      newObj.styles.display = newObj.label ? "block" : "none"
      let left = this.percent(newObj.value)
      if (left > 100) {
        left = 100
        //newObj.label = ">" + this._max.label
        newObj.value = this._max.value
      }
      newObj.styles.left = left + "%"
      return newObj
    },
    styleValueLabel(obj, fixLabels = false) {
      let newObj = { ...obj }
      newObj.styles = {}
      newObj.styles.display = newObj.label ? "block" : "none"
      let left = this.percent(newObj.value)
      if (left > 100) {
        left = 100
        //newObj.label = ">" + this._max.label
        newObj.value = this._max.value
      }
      if (left < 0)
        left = 0        
      newObj.styles.left = left + "%"

      if (85 < left) {
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
