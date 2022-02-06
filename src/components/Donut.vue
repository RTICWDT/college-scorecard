<script>
import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  props: ["value","color"],
  data() {
    return {
      options: {
        responsive: true,
        cutoutPercentage: 70,
        maintainAspectRatio: true,
        title: false,
        elements: {
            center: {
                text: Math.round(+this.value)+"%",
                color: '#00365e', 
                fontStyle: '"Montserrat", "Helvetica Neue", Helvetica, arial, sans-serif', 
                sidePadding: 40,
            }
        },
        plugins:{
          datalabels:{
              display: false
          }
        }
      }
    };
  },
  mounted() {
    this.addPlugin({
      id: "center",
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          var ctx = chart.chart.ctx;

          //Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || "Arial";
          var txt = centerConfig.text;
          var color = centerConfig.color || "#000";
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated =
            (sidePadding / 100) * (chart.innerRadius * 2);
          //Start with a base font of 30px
          ctx.font = "600 28px " + fontStyle;

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = chart.innerRadius * 2;

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight);

          //Set font settings to draw it correctly.
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          //ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        labels: ["value", ""],
        datasets: [
          {
            backgroundColor: [this.color],
            hoverBackgroundColor: [this.color],
            data: [this.value, 100 - this.value],
            borderWidth:0,
            borderColor: "white",
            borderRadius: {
              outerStart: 10,
              outerEnd: 10,
              innerStart: 10,
              innerEnd: 10,
            },
            cutout: 0,
          }
        ]
      },
      this.options
    );
  }
};
</script>
