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
        v-if="!hideMiddle"
        class="picc-range-label picc-range-label-middle"
        :style="_middle.styles"
        ref="middle"
      >
        <span v-html="_middle.label"></span>
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
    default: () => ({ value: 0, label: "0" })
  },
  max: {
    type: Object,
    default: () => ({ value: 100, label: "100" })
  },
  lower: {
    type: Object,
    default: () => ({ value: 25, label: "Lower" })
  },
  middle: {
    type: Object,
    default: () => ({ value: 50, label: "Middle" })
  },
  upper: {
    type: Object,
    default: () => ({ value: 75, label: "Upper" })
  },
  lowertip: {
    type: String,
    default: "",
  },
  lowerTipStyleOverride: {
    type: Object,
    default: () => ({})
  },
  uppertip: {
    type: String,
    default: "",
  },
  upperTipStyleOverride: {
    type: Object,
    default: () => ({})
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
    default: () => ({
      height: "15px",
    })
  },
  labelMinMaxStyleOverride: {
    type: Object,
  },
})

const bar_styles = ref({ left: 0, right: 0 })
const extraPad = ref({
  "padding-right": 0,
})

const scale = (v) => (v - props.min.value) / (props.max.value - props.min.value)
const percent = (v) => (scale(v) * 100).toFixed(2)

const styleLabel = (obj, fixLabels = true) => {
  let newObj = { ...obj }
  newObj.styles = {}
  newObj.styles.display = newObj.label ? "block" : "none"
  let left = percent(newObj.value)
  if (left > 100) {
    left = 100
    newObj.label = props.max.label
    newObj.value = props.max.value
  }
  newObj.styles.left = left + "%"
  return newObj
}

const _min = computed(() => styleLabel(props.min))
const _max = computed(() => styleLabel(props.max))
const _lower = computed(() => {
  let label = styleLabel(props.lower, true)
  label.styles = {
    ...label.styles,
    ...props.lower.styles,
  }
  return label
})
const _middle = computed(() => styleLabel(props.middle))
const _upper = computed(() => {
  let label = styleLabel(props.upper, false)
  label.styles = {
    ...label.styles,
    ...props.upper.styles,
  }
  return label
})

const update = () => {
  bar_styles.value.left = percent(_lower.value.value) + "%"
  let right = percent(
    props.min.value + props.max.value - _upper.value.value
  )
  bar_styles.value.right = right + "%"

  if (right < 20 && props.addExtraPadding) {
    // Uncomment if needed:
    // extraPad.value["padding-right"] = "60px"
  }
}

onMounted(() => {
  update()
})
</script>

<style lang="scss" scoped>
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

  background-color: use-theme('gray-400');
  display: block;
  margin-bottom: 0;
  margin-top: 0;
  max-width: none;
  position: relative;

  .picc-range-bar {
    background-color: theem-color('secondary-blue');
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
    font-family: "Public Sans", Helvetica, arial, sans-serif !important;

    span {
      font-weight: 400;
      position: absolute;
      top: $label-height;
      width: $label-width;
    }

    &.picc-range-label-min,
    &.picc-range-label-max,
    &.picc-range-label-middle {
      color: black;
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
      border-left: 3px solid use-theme('secondary-blue');
    }

    &.picc-range-label-upper {
      border-left: none;
      border-right: 3px solid use-theme('secondary-blue');
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
        margin-left: calc($label-width / -2);
        text-align: center;
      }
    }
  }
}
</style>