<script>
import { HorizontalBar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  extends: HorizontalBar,
  props: {
    value: {
      type: Number,
      default: 50
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: "#333333"
    }
  },
  data() {
    return {
      options: {
        layout: {
          padding: 0
        },
        plugins: [ChartDataLabels],
        legend: false,
        title: false,
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                min: this.min,
                max: this.max
              }
            }
          ],
          yAxes: [
            {
              barThickness: 25,
              display: false,
              stacked: true
            }
          ]
        },
        plugins: {
          datalabels: {
            display: false,
            formatter: function(value, context) {
              console.log(context);
              if (context.datasetIndex == 0 && value > 5) {
                return value + "%";
              } else return null;
            }
          }
        }
      }
    };
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ["Bar"],

        datasets: [
          {
            data: [this.value],
            backgroundColor: this.color
          },
          {
            data: [this.max],
            backgroundColor: "rgba(0,0,0,0.3)"
          }
        ]
      },
      this.options
    );
  }
};
</script>
