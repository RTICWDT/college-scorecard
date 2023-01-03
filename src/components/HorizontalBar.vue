<script>
import { HorizontalBar } from "vue-chartjs"
import ChartDataLabels from "chartjs-plugin-datalabels"
export default {
  extends: HorizontalBar,
  props: {
    value: {
      type: Number,
      default: 50,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    color: {
      type: String,
      default: "#333333",
    },
    labels: {
      type: Boolean,
      default: false,
    },
    labelColor: {
      type: String,
      default: "#333333",
    },
    type: {
      type: String,
      default: "percent",
    },
    yBarThickness: {
      type: Number,
      default: 35,
    },
    labelFontSize: {
      type: Number,
      default: 18,
    },
  },
  data() {
    return {
      options: {
        layout: {
          padding: 0,
        },
        csType: this.type,
        plugins: [ChartDataLabels],
        legend: false,
        title: false,
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                min: this.min,
                max: this.max,
              },
            },
          ],
          yAxes: [
            {
              display: false,
              stacked: true,
            },
          ],
        },
        plugins: {
          datalabels: {
            display: this.labels,
            font: (context) => {
              if (this.labelFontSize != "18") {
                return { 
                  family: '"Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif',
                  weight: 700,                  
                  size: this.labelFontSize }
              } else {
                if (context.chart.height < 20) {
                  return { 
                    family: '"Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif',
                    weight: 700,                    
                    size: 18 }
                } else {
                  return { 
                    family: '"Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif',
                    weight: 700,
                    size: 18 }
                }
              }
            },
            color: function(context) {
              let value = context.dataset.data[context.dataIndex]
              let max = context.chart.options.scales.xAxes[0].ticks.max
              if (value > max - (max / 10)) {
                return "#FFFFFF"
              } else {
                return "#000000"
              }
            },
            align: function(context) {
              let value = context.dataset.data[context.dataIndex]
              let max = context.chart.options.scales.xAxes[0].ticks.max
              if (value > max - (max / 10)) {
                return "start"
              } else {
                return "end"
              }
            },
            anchor: "end",
            clamp: true,
            formatter: function(value, context) {
              if (context.datasetIndex == 0) {
                let type = context.chart.config.options.csType
                if (type == "percent") {
                  return value + "%"
                } else if (type == "currency") {
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
            },
          },
        },
      },
    }
  },
  computed: {
    chartData() {
      return {
        labels: ["Bar"],
        datasets: [
          {
            data: [this.value],
            backgroundColor: this.color,
            barThickness: this.yBarThickness,
          },
          {
            data: [this.max],
            backgroundColor: "#EAEAEA",
            barThickness: this.yBarThickness,
          },
        ],
      }
    },
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.options)
    },
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.options)
  },
}
</script>
