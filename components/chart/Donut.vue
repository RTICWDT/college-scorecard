<template>
  <div :style="{ height: size, width: size }">
    <Doughnut
      :data="chartData"
      :options="options"
      :plugins="[centerTextPlugin]"
    />
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '100%'
  }
})

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const { left, right, top, bottom } = chart.chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    ctx.save();
    ctx.font = '600 28px "neue-haas-grotesk-display", Helvetica, arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color('primary-blue');

    // Access the value from the first dataset
    const value = chart.data.datasets[0].data[0];
    ctx.fillText(`${Math.round(Number(value))}%`, centerX, centerY);
    ctx.restore();
  }
};

const options = ref({
  responsive: true,
  cutout: '70%',
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    },
  },
  elements: {
    arc: {
      borderWidth: 0
    }
  },
})

const { color } = useVuetify()
const chartData = computed(() => ({
  labels: ['value', ''],
  datasets: [
    {
      backgroundColor: [props.color, color('gray-100')],
      hoverBackgroundColor: [props.color, color('gray-100')],
      data: [props.value, 100 - props.value],
      borderWidth: 0,
      borderColor: 'white',
      borderRadius: {
        outerStart: 0,
        outerEnd: 0,
        innerStart: 0,
        innerEnd: 0
      },
      cutout: '70%'
    }
  ]
}))
</script>