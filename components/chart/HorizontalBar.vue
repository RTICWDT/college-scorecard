<template>
  <div :style="{ height: `${props.height}px`, width: '100%' }">
    <Bar
      v-if="chartData"
      id="horizontal-bar"
      :options="chartOptions"
      :data="chartData"
      :plugins="plugins"
    />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'

const props = defineProps({
  value: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: "gray-400" },
  bgcolor: { type: String, default: "gray-100" },
  labels: { type: Boolean, default: false },
  labelColor: { type: String, default: "primary-blue" },
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

const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const datasets = chart.data.datasets;
    const meta = chart.getDatasetMeta(0);

    ctx.save();
    ctx.font = `bold ${props.labelFontSize}px "neue-haas-grotesk-display", Helvetica, arial, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color(props.labelColor);

    datasets[0].data.forEach((value, index) => {
      const element = meta.data[index];
      const { x, y } = element;
      
      let formattedValue;
      if (props.type === "percent") {
        formattedValue = `${Math.round(value)}%`;
      } else if (props.type === "currency") {
        formattedValue = Number(value)
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
          .slice(0, -3);
      } else {
        formattedValue = value.toString();
      }

        if (value > props.max - (props.max / 10)) {
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffffff'
          ctx.fillText(formattedValue, x - 5, y);
        } else {
          ctx.textAlign = 'left';
          ctx.fillStyle = props.labelColor;
          ctx.fillText(formattedValue, x + 5, y);
        }
    });
    ctx.restore();
  }
};

const plugins = computed(() => props.labels ? [dataLabelsPlugin] : [])

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
    },
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
        display: false,
        color: props.labelColor,
      }
    },
    x: {
      display: false,
      grid: {
        display: false
      }
    }
  },
  layout: {
    padding: {
      left: -10,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
}))

const { color } = useVuetify()
onMounted(() => {
  chartData.value = {
    labels: [""],
    datasets: [
      {
        data: [props.value],
        backgroundColor: color(props.color),
        barThickness: props.yBarThickness,
      },
      {
        data: [props.max],
        backgroundColor: color(props.bgcolor),
        barThickness: props.yBarThickness,
      },
    ]
  }
})
</script>