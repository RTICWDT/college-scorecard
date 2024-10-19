<template>
  <div>
    <div v-if="value">
      <ChartVerticalBarRange
        :lower="{ value: 0, label: '0' }"
        :upper="{ value: value.value, label: value.label }"
        :min="min"
        :max="max"
        :upperTipStyleOverride="upperTipStyleOverride"
        :addExtraPadding="addExtraPadding"
        :rangeChartStyle="rangeChartStyle"
        :median="median"
        :hideMedian="!median.value"
      />
    </div>
    <div v-else class="data-na">
      <p>Data Not Available</p>
    </div>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();

const props = defineProps({
  min: {
    type: Object,
    default: () => ({ value: 0, label: "$0" }),
  },
  max: {
    type: Object,
    default: () => ({ value: 150000, label: "$150,000" }),
  },
  variable: {
    type: String,
  },
  median: {
    type: Object,
    default: () => ({ value: 30, label: "30%" }),
  },
  value: {
    type: Object,
    default: () => ({ value: 50, label: "50%" }),
  },
  addExtraPadding: {
    type: Boolean,
    default: true,
  },
  rangeChartStyle: {
    type: Object,
    default: () => ({
      width: "100px",
    }),
  },
  lowerStyleOverride: {
    type: Object,
    default: () => ({
      height: "22px",
      "border-left": "3px solid #00365e",
    }),
  },
  lowerTipStyleOverride: {
    type: Object,
    default: () => ({}),
  },
  upperStyleOverride: {
    type: Object,
    default: () => ({
      height: "22px",
      "border-right": "3px solid #00365e",
    }),
  },
  upperTipStyleOverride: {
    type: Object,
    default: () => ({}),
  },
});
</script>