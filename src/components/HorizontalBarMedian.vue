<template>
  <div>
    <div v-if="value">
      <range
        :lower="{ value: 0, label: '0' }"
        :upper="{ value: value.value, label: value.label }"
        :min=min
        :max=max
        :upperTipStyleOverride="upperTipStyleOverride"
        :addExtraPadding="addExtraPadding"
        :rangeChartStyle="rangeChartStyle"
        :median=median        
      ></range>
    </div>
    <div v-else class="data-na">
      <p>Data Not Available</p>
    </div>
  </div>
</template>

<script>
import HorizontalBarRange from "~/components/HorizontalBarRange.vue"
export default {
  components: {
    range: HorizontalBarRange,
  },
  props: {
    min: {
      type: Object,
      default: { value: 0, label: "$0" },
    },
    max: {
      type: Object,
      default: { value: 150000, label: "$150,000" },
    },    
    variable: {
      type: String,
    },
    median: {
      type: Object,
      default: () => ({  }),
    },
    value: {
      type: Object,
      default: { value: 50, label: "50%" },
    },
    // min:{
    //   type: Object,
    //   default: { value: 0, label: '$0' }
    // },
    // lower:{
    //   type: Object,
    //
    // },
    addExtraPadding: {
      type: Boolean,
      default: true,
    },
    rangeChartStyle: {
      type: Object,
      default: () => {
        return {
          height: "40px",
        }
      },
    },
    lowerStyleOverride: {
      type: Object,
      default: () => {
        return {
          height: "22px",
          "border-left": "3px solid #0e365b",
        }
      },
    },
    lowerTipStyleOverride: {
      type: Object,
      default: () => {
        return {}
      },
    },
    upperStyleOverride: {
      type: Object,
      default: () => {
        return {
          height: "22px",
          "border-right": "3px solid #0e365b",
        }
      },
    },
    upperTipStyleOverride: {
      type: Object,
      default: () => {
        return {
          
        }
      },
    },
  },
  computed: {
    _lower() {
      return {
        value: _.get(this.minmax.min, this.variable),
        label: this.$options.filters.numeral(
          _.get(this.minmax.min, this.variable),
          "$0,0"
        ),
        styles: this.lowerStyleOverride,
      }
    },
    _upper() {
      return {
        value: _.get(this.minmax.max, this.variable),
        label: this.$options.filters.numeral(
          _.get(this.minmax.max, this.variable),
          "$0,0"
        ),
        styles: this.upperStyleOverride,
      }
    },
  },
}
</script>
