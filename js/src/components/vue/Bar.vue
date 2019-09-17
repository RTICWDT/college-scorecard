<script>
import { Bar } from 'vue-chartjs' 
export default {
  extends: Bar,
  props: ['labels', 'data'],
  data(){
      return {
          options: {
             scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        suggestedMax: 100
                    }
                }]
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
          label: 'GitHub Commits',
          backgroundColor: '#f87979',
          data: this.data
        }
      ]
    }, this.options)
  }
}
</script>
