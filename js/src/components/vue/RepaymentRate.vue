<template>
  <div>
    <div v-show="has_data" class="om_visualization">         
      <div class="om_sankey" ref="sankey"></div>
 
    </div>

    <div v-show="!has_data" class="data-na">
      <div class="om_sankey na">Data not available.</div>
    </div>
  </div>
</template>

<style lang="scss">
@import "sass/_variables.scss";
  

.om_visualization{
  display: flex;
  clear:both;
  justify-content: center;
  .om_group{
    width: 0%;
    text-align: center;
    padding-top: 0px;
    padding-right: $base-padding;
  }
  .om_sankey{
    width: 250px;
    height: 300px;


    text[text-anchor="end"]{
      display:none;
    }
    path[fill="#ffffff"]{
      display:none;
    }
    rect[fill="#ffffff"]{
      display:none;
    }
    rect{
      fill-opacity: 1 !important;
    }
  }
  .google-visualization-tooltip{
    display:none;
  }
}
.na{
  height: 300px;
}

</style>


<script>
export default {
  props: {
    school: Object,
    colors: {
      type: String,
      default: "multi"
    },
    gradOnly:{
      type: Boolean,
    }
  },
  data() {
    return {
      outcomes: Object,
      outcome_cohorts: Object,
      has_data: true
    };
  },
  computed:{
    showGradOnly(){
      return this.gradOnly;
    }
  },

  mounted() {
    this.extractData();
    google.charts.load("current", {
      packages: ["corechart", "table", "sankey"],
      callback: this.drawSankeyChart
    });
    window.addEventListener("resize", this.drawSankeyChart);
  },
  watch:{
    showGradOnly: function(){ this.drawSankeyChart(); }
  },

  methods: {
    extractData() {

      var repayment_field = "latest.repayment.1_yr_bb_fed_repayment"
      this.outcomes = _.get(
        this.school,
        repayment_field
      );

      /*var outcomesString = `{
        "graduates": {
            "paid_in_full": 0.25,
            "making_progress": 0.25,
            "not_making_progress": 0.035,
            "deferment": 0.1000,
            "deqlinquent": 0.0500,
            "defaulted": 0.0500,
            "discharged": 0.0195,
            "forebearance": null
            },
        "all": {
            "paid_in_full": 0.0300,
            "making_progress": 0.0105,
            "not_making_progress": 0,
            "deferment": 0.1000,
            "deqlinquent": 0.100,
            "defaulted": 0.3505,
            "discharged": 0.3500,
            "forebearance": 0.0395
            }
      }`*/
      
     //this.outcomes = JSON.parse(this.outcomes);
    },

    drawSankeyChart() {
      var links = {
        ugcomp: {
            variable: "ugcomp",
            text:
              "Out of students who started college here and started their studies full-time..."
        },
        ug: {
            variable: "ug",
            text:
              "Out of students who started college here and started their studies full-time..."
        }        
      };

      var friendlyMetrics = {
        fullypaid: "Paid In Full",
        makingprogress: "Making Progress",
        noprogress: "Not Making Progress",
        deferment: "Deferment",
        delinquent: "Delinquent",
        default: "Defaulted",
        discharge: "Discharged",
        forbearance: "Forbearance",        
      };
      

      var metricVariable = (this.gradOnly ? links.ugcomp.variable : links.ug.variable);
      var currentData = _.get(
        this.outcomes,
        metricVariable
      );

      console.log(currentData);

      var rows = [];
      var percent;
     
      for (var q in currentData) {
        percent = Math.round(currentData[q] * 100);
        if (currentData[q] == null && friendlyMetrics[q]) {
          rows.push(["N/A - " + friendlyMetrics[q], "Group", 2]);
        }
        else if (percent > 1 && friendlyMetrics[q]) {
          rows.push([percent + "% " + friendlyMetrics[q], "Group", percent]);
        }
        else if (0 <= percent <= 1 && friendlyMetrics[q]) {
          rows.push([percent + "% " + friendlyMetrics[q], "Group", 2]);
        }        
        else if (!percent && friendlyMetrics[q]) {
          rows.push(["N/A - " + friendlyMetrics[q], "Group", 2]);
        }
      }
      if (rows.length > 0) {
        this.has_data = true;
        var data = new google.visualization.DataTable();
        var colors = [];
        data.addColumn("string", "From");
        data.addColumn("string", "To");
        data.addColumn("number", "Percent");
        data.addRows(rows);
        if (this.colors == "solid") {
          colors = [
            "#0e365b",
            "#FFFFFF",
            "#0e365b",
            "#0e365b",
            "#0e365b",
            "#0e365b",
            "#0e365b",
            "#0e365b",
            "#0e365b",            
          ];
        } else {
          colors = [
            "#d37c39",
            "#FFFFFF",
            "#86B33B",
            "#8360ED",
            "#49ACEC",
            "#37608D",
            "#49ACEC",
            "#37608D"            
          ];
        }

        // Sets chart options.
        var options = {
          width: "100%",
          tooltip: {
            trigger: "selection",
            isHtml: true
          },
          sankey: {
            node: {
              colors: colors,
              width: 80,
              nodePadding: '10px',
              label: {
                fontName:
                  'Public Sans,"Helvetica Neue",Helvetica,arial,sans-serif',
                fontSize: 12,
                color: "#040404"
              },
              interactivity: false,
              colorMode: "unique"
            },
            link: {
              color: "#FFFFFF"
            },
            tooltip: false
          }
        };
        var chart = new google.visualization.Sankey(this.$refs["sankey"]);

        // delay this so the height can get setup before the 
        // chart is drawn when transitioning from no data
        setTimeout(function(){
          chart.draw(data, options);
        }, 100);

      } else {
        this.has_data = false;
      }
    }
  }
};
</script>