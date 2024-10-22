<template>
  <div class="range-container" :style="extraPad">
    <div class="range-chart" :style="rangeChartStyle">
      <div
        v-if="!hideLower"
        :style="{ top: bar_styles.top, bottom: bar_styles.bottom }"
        class="picc-range-bar"
        ref="bar"
      ></div>

      <span class="picc-range-label picc-range-label-min" ref="min">
        <span v-html="_min.label"></span>
      </span>

      <span
        class="picc-range-label picc-range-label-max"
        :style="_max.styles"
        ref="max"
      >
        <span v-html="_max.label"></span>
      </span>

      <v-tooltip location="top" v-if="false" :disabled="!lowertip">
        <template v-slot:activator="{ props }">
          <span
            class="picc-range-label picc-range-label-lower"
            :style="_lower.styles"
            ref="lower"
            v-bind="props"
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

      <v-tooltip location="top" :disabled="!uppertip">
        <template v-slot:activator="{ props }">
          <span
            class="picc-range-label picc-range-label-upper"
            :style="_upper.styles"
            ref="upper"
            v-bind="props"
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

<script setup>
const props = defineProps({
  min: {
    type: Object,
    default: () => ({ value: 0, label: "0%" }),
  },
  max: {
    type: Object,
    default: () => ({ value: 100, label: "100%" }),
  },
  lower: {
    type: Object,
    default: () => ({ value: 25, label: "Lower" }),
  },
  median: {
    type: Object,
    default: () => ({ value: 50, label: "Midpoint" }),
  },
  upper: {
    type: Object,
    default: () => ({ value: 75, label: "Upper" }),
  },
  lowertip: {
    type: String,
    default: "",
  },
  lowerTipStyleOverride: {
    type: Object,
    default: () => ({}),
  },
  uppertip: {
    type: String,
    default: "",
  },
  upperTipStyleOverride: {
    type: Object,
    default: () => ({}),
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
    default: () => ({ width: "100px" }),
  },
  labelMinMaxStyleOverride: {
    type: Object,
  },
});

const bar_styles = ref({ top: 0, bottom: 0 });
const extraPad = ref({ "padding-top": "30px" });

const scale = (v) => (v - props.min.value) / (props.max.value - props.min.value);
const percent = (v) => (scale(v) * 100).toFixed(1);

const styleLabel = (obj, fixLabels = false) => {
  let newObj = { ...obj };
  newObj.styles = {};
  newObj.styles.display = newObj.label ? "block" : "none";
  let top = percent(newObj.value);
  if (top > 100) {
    top = 100;
    newObj.label = ">" + _max.value.label;
    newObj.value = _max.value.value;
  }
  newObj.styles.bottom = top + "%";
  return newObj;
};

const _min = computed(() => styleLabel(props.min));
const _max = computed(() => styleLabel(props.max));
const _lower = computed(() => {
  let label = styleLabel(props.lower, true);
  label.styles = {
    ...label.styles,
    ...props.lower.styles,
  };
  return label;
});
const _median = computed(() => styleLabel(props.median));
const _upper = computed(() => {
  let label = styleLabel(props.upper, false);
  label.styles = {
    ...label.styles,
    ...props.upper.styles,
  };
  if (label.value >= 85) {
    label.styles.bottom = "";
    label.styles.top = 100 - percent(label.value) + "%";
  }
  return label;
});

const update = () => {
  bar_styles.value.bottom = percent(_lower.value.value) + "%";
  let top = percent(
    _min.value.value + _max.value.value - _upper.value.value
  );
  bar_styles.value.top = top + "%";
};

onMounted(() => {
  update();
});
</script>

<style lang="scss" scoped>
// The CSS remains largely the same, but we'll update the Vuetify-specific classes
.range-container {
  overflow: visible;
  width: 140px;
  height: 320px;
  padding-left: 20px;
  padding-top: 0px;
  margin-left: auto;
  margin-right: auto;
}
.range-chart {
  $label-height: 1em;
  $label-offset: 1em;
  $label-margin: $label-offset + $label-height;
  $label-width: 4em;
  $bar-width: 100px;
  $arrow-size: 7px;

  background-color: theme-color('gray-200');
  display: block;
  height: 320px;
  margin-bottom: 0;
  margin-top: 0;
  max-height: none;
  position: relative;

  .picc-range-bar {
    background-color: theme-color('secondary-blue');
    width: 100%;
    left: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    transition: bottom 0.5s, right 0.5s;
  }

  .picc-range-label {
    height: 22px;
    position: absolute;
    top: 0;
    transition: bottom 0.5s;
    font-size: 0.85rem;

    span {
      font-weight: 400;
      position: absolute;
      top: $label-height;
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-median {
      color: #000;
      font-size: 0.85rem;
    }

    &.picc-range-label-max,
    &.picc-range-label-lower,
    &.picc-range-label-min {
      span {
        right: 0;
        text-align: center;
        font-size: 12px;
      }
    }

    &.picc-range-label-median,
    &.picc-range-label-lower,
    &.picc-range-label-upper {
      border-bottom: 1px solid #000;
    }

    &.picc-range-label-upper {
      border-bottom: none;
      text-align: center;
      left: 0;
      right: 0;
      margin-left: 0;
      margin-right: 0;

      span {
        position: relative !important;
        font-size: 18px !important;
        font-weight: bold;
      }
    }
    &.picc-range-label-lower {
      span {
        padding-right: 0.25em;
      }
    }

    &.picc-range-label-min,
    &.picc-range-label-max {
      top: auto;
      left: none;
      right: 105px;
      margin-left: 0;
      margin-right: 0;
      text-align: right;
      position: absolute;

      span {
        top: auto;
        position: relative !important;
        font-size: 12px;
      }
    }

    &.picc-range-label-min {
      bottom: 0;
    }

    &.picc-range-label-max {
      top: 0px;
    }

    &.picc-range-label-median {
      top: auto;
      left: 0;
      right: 0;
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      span:not(.arrow-left) {
        margin-left: $bar-width + $arrow-size + 10;
        text-align: center;
        color: #000;
        margin-top: -0px;
        font-size: 12px !important;
        font-family: "Public Sans", Helvetica, arial, sans-serif !important;
        font-style: italic;
        line-height: 14px;
      }
      span.arrow-left {
        width: 0;
        height: 0;
        border-top: $arrow-size solid transparent;
        border-bottom: $arrow-size solid transparent;
        border-right: $arrow-size solid black;
        margin-left: $bar-width;
        margin-top: 0;
      }
    }
  }
}
</style>