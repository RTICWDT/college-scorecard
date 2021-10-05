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
@import "~/sass/_variables.scss";

.om_visualization {
  display: flex;
  clear: both;
  justify-content: center;
  .om_group {
    width: 0%;
    text-align: center;
    padding-top: 0px;
    padding-right: $base-padding;
  }
  .om_sankey {
    width: 330px;
    height: 300px;

    text[text-anchor="end"] {
      display: none;
    }
    path[fill="#ffffff"] {
      display: none;
    }
    rect[fill="#ffffff"] {
      display: none;
    }
    rect {
      fill-opacity: 1 !important;
    }
  }
  .google-visualization-tooltip {
    display: none;
  }
}
.na {
  height: 250px;
}
</style>

<script>
import { GoogleCharts } from "google-charts"
import "~/sass/_variables.scss";

export default {
  props: {
    school: Object,
    colors: {
      type: String,
      default: "multi",
    },
    gradOnly: {
      type: Boolean,
    },
  },
  data() {
    return {
      outcomes: Object,
      outcome_cohorts: Object,
      has_data: false,
    }
  },
  computed: {
    showGradOnly() {
      return this.gradOnly
    },
  },

  mounted() {
    this.extractData()
    GoogleCharts.load("current", {
      packages: ["corechart", "table", "sankey"],
      callback: this.drawSankeyChart,
    })
    window.addEventListener("resize", this.drawSankeyChart)
  },
  watch: {
    showGradOnly: function() {
      this.drawSankeyChart()
    },
  },

  methods: {
    extractData() {
      var repayment_field = "latest.repayment.2_yr_bb_fed_repayment_suppressed"
      this.outcomes = _.get(this.school, repayment_field)
      console.log(this.outcomes)
    },

    drawSankeyChart() {
      var links = {
        ugcomp: {
          variable: "ugcomp",
          text:
            "Out of students who started college here and started their studies full-time...",
        },
        ug: {
          variable: "ug",
          text:
            "Out of students who started college here and started their studies full-time...",
        },
      }

      var friendlyMetrics = {
        fullypaid: "Paid In Full",
        makingprogress: "Making Progress",
        noprogress: "Not Making Progress",
        deferment: "Deferment",
        delinquent: "Delinquent",
        default: "Defaulted",
        discharge: "Discharged",
        forbearance: "Forbearance",
      }

      var metricVariable = this.gradOnly
        ? links.ugcomp.variable
        : links.ug.variable
      var currentData = _.get(this.outcomes, metricVariable)

      delete currentData["count"]
      this.has_data = false

      var rows = []
      var percent

      var colors = []
      var sortable = []
      for (var node in currentData) {
        sortable.push([node, currentData[node]])
      }

      sortable.sort(function(a, b) {
        return b[1] - a[1]
      })

      sortable.forEach(function(item, index) {
        if (index == 1) {
          colors.push("#FFFFFF")
        }
        if (sortable[index][1] == null) {
          colors.push("#E4E4E4")
        } else {
          colors.push("#00365e")
        }
      })

      for (var q in sortable) {
        percent = Math.round(sortable[q][1] * 100)
        if (sortable[q][1] == null && friendlyMetrics[sortable[q][0]]) {
          rows.push([
            "Data Not Available - " + friendlyMetrics[sortable[q][0]],
            "Group",
            2,
          ])
        } else if (percent > 1 && friendlyMetrics[sortable[q][0]]) {
          rows.push([
            percent + "% " + friendlyMetrics[sortable[q][0]],
            "Group",
            percent,
          ])
          this.has_data = true
        } else if (0 <= percent <= 1 && friendlyMetrics[sortable[q][0]]) {
          rows.push([
            percent + "% " + friendlyMetrics[sortable[q][0]],
            "Group",
            2,
          ])
          this.has_data = true
        } else if (!percent && friendlyMetrics[sortable[q][0]]) {
          rows.push([
            "Data Not Available - " + friendlyMetrics[sortable[q][0]],
            "Group",
            2,
          ])
          this.has_data = true
        }
      }
      if (rows.length > 0 && this.has_data) {
        var data = new GoogleCharts.api.visualization.DataTable()
        data.addColumn("string", "From")
        data.addColumn("string", "To")
        data.addColumn("number", "Percent")
        data.addRows(rows)
        /* if (this.colors == "solid") {
          colors = [
            "#ff0000",
            "#FFFFFF",
            "#00ff00",
            "#0000ff",
            "#00365e",
            "#00365e",
            "#00365e",
            "#00365e",
            "#00365e",            
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
            "#37608D",
            "#37608D"         
          ];
        }*/

        // Sets chart options.
        var options = {
          width: "100%",
          tooltip: {
            trigger: "selection",
            isHtml: true,
          },
          sankey: {
            node: {
              colors: colors,
              width: 80,
              nodePadding: "10px",
              label: {
                fontName:
                  'Public Sans,"Helvetica Neue",Helvetica,arial,sans-serif',
                fontSize: 12,
                color: "#040404",
              },
              interactivity: false,
              colorMode: "unique",
            },
            link: {
              color: "#FFFFFF",
            },
            tooltip: false,
          },
        }
        var chart = new GoogleCharts.api.visualization.Sankey(
          this.$refs["sankey"]
        )

        // delay this so the height can get setup before the
        // chart is drawn when transitioning from no data
        setTimeout(function() {
          chart.draw(data, options)
        }, 100)
      } else {
        this.has_data = false
      }
    },
  },
}
</script>
