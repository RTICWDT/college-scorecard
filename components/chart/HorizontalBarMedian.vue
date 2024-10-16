<template>
  <div>
    <div v-if="shouldRender">
      <ChartHorizontalBarRange
        :lower="{ value: 0, label: '0' }"
        :upper="value"
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
const props = defineProps({
  shouldRender: {
    default: true,
  },
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
    default: () => ({}),
  },
  value: {
    type: Object,
    default: () => ({}),
  },
  addExtraPadding: {
    type: Boolean,
    default: true,
  },
  rangeChartStyle: {
    type: Object,
    default: () => ({
      height: "35px",
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