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

      <v-tooltip location="top" v-if="!hideLower" :disabled="!lowertip">
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
    default: () => ({ value: 0, label: "0" }),
  },
  max: {
    type: Object,
    default: () => ({ value: 100, label: "100" }),
  },
  lower: {
    type: Object,
    default: () => ({ value: 25, label: "Lower" }),
  },
  median: {
    type: Object,
    default: () => ({ value: 50, label: "Midpoint", show: true }),
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
    default: () => ({ height: "35px" }),
  },
  labelMinMaxStyleOverride: {
    type: Object,
  },
});

const bar_styles = ref({ left: 0, right: 0 });
const label_styles = ref({ left: 0, right: 0 });
const extraPad = ref({ "padding-right": 0 });

const scale = (v) => (v - props.min.value) / (props.max.value - props.min.value);
const percent = (v) => (scale(v) * 100).toFixed(1);

const styleBar = (obj, fixLabels = false) => {
  let newObj = { ...obj };
  newObj.styles = {};
  var min = _min.value.value;
  var max = _max.value.value;
  newObj.styles.left = percent(_lower.value.value) + "%";
  let right = percent(min + max - _upper.value.value);
  newObj.styles.right = right + "%";
  return newObj;
};

const styleLabel = (obj, fixLabels = false) => {
  let newObj = { ...obj };
  newObj.styles = {};
  newObj.styles.display = newObj.label ? "block" : "none";
  let left = percent(newObj.value);
  if (left > 100) {
    left = 100;
    newObj.value = _max.value.value;
  }
  newObj.styles.left = left + "%";
  return newObj;
};

const styleValueLabel = (obj, fixLabels = false) => {
  let newObj = { ...obj };
  newObj.styles = {};
  newObj.styles.display = newObj.label ? "block" : "none";
  let left = percent(newObj.value);
  if (left > 100) {
    left = 100;
    newObj.value = _max.value.value;
  }
  if (left < 0) left = 0;
  newObj.styles.left = left + "%";

  if (50 < left && obj.label) {
    let offset = 40 + obj.label.split('').length * 7
    newObj.styles['transform'] = `translateX(-${offset}px)`;
    newObj.styles.color = '#FFFFFF'
  }

  return newObj;
};

const _bar = computed(() => styleBar(bar_styles.value));
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
const _median = computed(() => {
  let label = styleLabel(props.median);
  label.styles.display = props.median.show ? "block" : "none";
  return label;
});
const _upper = computed(() => {
  let label = styleValueLabel(props.upper, false);
  label.styles = {
    ...label.styles,
    ...props.upper.styles,
  };
  return label;
});

const update = () => {
  bar_styles.value.left = percent(_lower.value.value) + "%";
  let right = percent(
    _min.value.value + _max.value.value - _upper.value.value
  );
  bar_styles.value.right = right + "%";

  if (right < 80 && props.addExtraPadding) {
    // Commented out as per original code
    // extraPad.value["padding-right"] = "60px";
    // var s = _upper.value.styles.left.replace(/[0-9]+%\s?/g, "");
    // _upper.value.styles.left = s - 10 + "%";
  }
};

onMounted(() => {
  update();
});
</script>

<style lang="scss" scoped>
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

  background-color: variables.$bg-bar-chart;
  display: block;
  margin-bottom: 0;
  margin-top: 0;
  max-width: none;
  position: relative;

  .picc-range-bar {
    background-color: variables.$mid-light-blue;
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
        text-align: center;
        color: #000;
        top: 44px !important;
        margin-left: -3.75rem !important;
        font-weight: 400;
        font-size: 12px;
        font-family: "Public Sans", Helvetica, arial, sans-serif !important;
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