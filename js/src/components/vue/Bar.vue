<script>
import { Bar } from 'vue-chartjs' 
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  extends: Bar,
  props: {
    labels:{
      type: Array,
      default: "Label"
    },
    data:{
      type: Array,
      default: 50
    },
    min:{
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#333333'
    },
  },
  data(){
      return {
          options: {
             plugins: [ChartDataLabels],
             legend: false,
             scales: {
                yAxes: [{
                    ticks: {
                        min: this.min,
                        suggestedMax: this.max,
                        callback: function(value, index, values) {
                          return value.toLocaleString("en-US",{style:"currency", currency:"USD" }).slice(0,-3);
                        }
                    }
                }]
            },
            plugins: {
              datalabels: {
                formatter: function(value, context) {
                  return value.toLocaleString("en-US",{style:"currency", currency:"USD" }).slice(0,-3);
                }
              }
            }
            
          }
      }
  },
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: '',
          hoverBackgroundColor: this.color,
          backgroundColor: this.color, 
          data: [this.data]
        }
      ]
    }, this.options)
  }
}
</script>
