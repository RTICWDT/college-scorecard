<template>
  <div :style="{ height: `${props.height}px`, width: '100%' }">
    <Bar
      v-if="chartData"
      id="horizontal-bar"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps({
  value: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: "#333333" },
  bgcolor: { type: String, default: "#EAEAEA" },
  labels: { type: Boolean, default: false },
  labelColor: { type: String, default: "#333333" },
  type: { type: String, default: "percent" },
  yBarThickness: { type: Number, default: 35 },
  labelFontSize: { type: Number, default: 18 },
  height: { type: Number, default: 15 },
})

const chartData = ref(null)

const formatter = (value, context) => {
  if (context.datasetIndex == 0) {
    if (props.type == "percent") {
      return value + "%"
    } else if (props.type == "currency") {
      return Number(value)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
        .slice(0, -3)
    } else {
      return value
    }
  } else {
    return null
  }
}

const chartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    },
    datalabels: {
      display: props.labels,
      formatter: formatter,
      align: 'end',
      anchor: 'end',
      color: props.labelColor,
      font: {
        size: props.labelFontSize
      }
    }
  },
  scales: {
    y: {
      min: props.min,
      max: props.max,
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        display: false
      },
      ticks: {
        display: props.labels,
        color: props.labelColor,
        font: {
          size: props.labelFontSize
        }
      }
    },
    x: {
      display: false,
      grid: {
        display: false
      }
    }
  }
}))

onMounted(() => {
  chartData.value = {
    labels: [""],
    datasets: [
      {
        data: [props.value],
        backgroundColor: props.color,
        barThickness: props.yBarThickness,
      },
      {
        data: [props.max],
        backgroundColor: props.bgcolor,
        barThickness: props.yBarThickness,
      },
    ]
  }
})
</script>