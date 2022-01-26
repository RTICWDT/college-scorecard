<template>
  <div>
    <div v-show="has_data" class="om_visualization">
      <div class="om_group">
        Out of {{ group_count | separator }} students...
      </div>
      <div class="om_sankey" ref="sankey"></div>
    </div>

    <div v-show="!has_data" class="data-na">
      <div class="om_sankey na">Data not available.</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";

.om_visualization {
  display: flex;
  clear: both;
  .om_group {
    width: 32%;
    text-align: center;
    padding-top: 100px;
    padding-right: $base-padding;
  }
  .om_sankey {
    width: 68%;
    height: 300px;
    margin-top: $base-padding;
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
  height: 300px;
}
</style>

<script>
import { GoogleCharts } from "google-charts"

export default {
  props: {
    school: Object,
    colors: {
      type: String,
      default: "multi",
    },
    currentSankey: {
      type: Object,
    },
    showPellOnly: {
      type: Boolean,
    }
  },
  data() {
    return {
      outcomes: Object,
      outcome_cohorts: Object,
      group_count: 0,
      has_data: true,
    }
  },
  computed: {
    enroll() {
      return this.currentSankey.enroll
    },
    study() {
      return this.currentSankey.study
    },
    pell() {
      return this.showPellOnly
    }
  },

  mounted() {
    this.extractData(this.showPellOnly)
    GoogleCharts.load("current", {
      packages: ["corechart", "table", "sankey"],
      callback: this.drawSankeyChart,
    })
    window.addEventListener("resize", this.drawSankeyChart)
  },
  watch: {
    study: function() {
      this.drawSankeyChart()
    },
    enroll: function() {
      this.drawSankeyChart()
    },
    pell: function() {
      this.extractData(this.showPellOnly)
      this.drawSankeyChart()
    },
  },

  methods: {
    extractData(showPellOnly) {
      this.outcomes = _.get(
        this.school,
        showPellOnly ? "latest.completion.outcome_percentage_pell_suppressed" : "latest.completion.outcome_percentage_suppressed"
      )
      let outcome_cohort_data = _.get(
        this.school,
        "latest.completion.outcome_cohort"
      )

      let subgroup = "8yr_pooled";
      if (showPellOnly)
        subgroup = "8yr";

      this.outcome_cohorts = {
        study_full_time: {
          enroll_first_time:
            outcome_cohort_data.full_time.first_time[subgroup],
          enroll_not_first_time:
            outcome_cohort_data.full_time.not_first_time[subgroup],
          enroll_both:
            outcome_cohort_data.full_time.first_time[subgroup] +
            outcome_cohort_data.full_time.not_first_time[subgroup],
        },
        study_part_time: {
          enroll_first_time:
            outcome_cohort_data.part_time.first_time[subgroup],
          enroll_not_first_time:
            outcome_cohort_data.part_time.not_first_time[subgroup],
          enroll_both:
            outcome_cohort_data.part_time.first_time[subgroup] +
            outcome_cohort_data.part_time.not_first_time[subgroup],
        },
        study_both: {
          enroll_first_time:
            outcome_cohort_data.full_time.first_time[subgroup] +
            outcome_cohort_data.part_time.first_time[subgroup],
          enroll_not_first_time:
            outcome_cohort_data.full_time.not_first_time[subgroup] +
            outcome_cohort_data.part_time.not_first_time[subgroup],
          enroll_both:
            outcome_cohort_data.full_time.first_time[subgroup] +
            outcome_cohort_data.full_time.not_first_time[subgroup] +
            outcome_cohort_data.part_time.first_time[subgroup] +
            outcome_cohort_data.part_time.not_first_time[subgroup],
        },
      }   
      //console.log(this.outcome_cohorts)   
    },

    drawSankeyChart() {
      var links = {
        study_full_time: {
          enroll_first_time: {
            variable: "full_time.first_time.8yr",
            text:
              "Out of students who started college here and started their studies full-time...",
          },
          enroll_not_first_time: {
            variable: "full_time.not_first_time.8yr",
            text:
              "Out of students who transferred in and started their studies full-time...",
          },
          enroll_both: {
            variable: "full_time.8yr",
            text: "Out of students who started their studies full-time...",
          },
        },
        study_part_time: {
          enroll_first_time: {
            variable: "part_time.first_time.8yr",
            text:
              "Out of students who started college here and started their studies part-time...",
          },
          enroll_not_first_time: {
            variable: "part_time.not_first_time.8yr",
            text:
              "Out of students who transferred in and started their studies part-time...",
          },
          enroll_both: {
            variable: "part_time.8yr",
            text: "Out of students who started their studies part-time...",
          },
        },
        study_both: {
          enroll_first_time: {
            variable: "first_time.8yr",
            text: "Out of students who started college here...",
          },
          enroll_not_first_time: {
            variable: "not_first_time.8yr",
            text: "Out of students who transferred in...",
          },
          enroll_both: {
            variable: "all_students.8yr",
            text: "Out of all students...",
          },
        },
      }

      var friendlyMetrics = {
        award_pooled: "graduated",
        still_enrolled_pooled: "still enrolled",
        transfer_pooled: "transferred",
        unknown_pooled: "withdrew",
      }

      var currentData = _.get(
        this.outcomes,
        links[this.study][this.enroll].variable
      )
      var rows = []
      var percent
      
      for (var q in currentData) {
        percent = Math.round(currentData[q] * 100)
        if (percent > 0) {
          rows.push([percent + "% " + friendlyMetrics[q], "Group", percent])
        }
      }

      if (rows.length > 0) {
        this.has_data = true
        var data = new GoogleCharts.api.visualization.DataTable()
        var colors = []
        data.addColumn("string", "From")
        data.addColumn("string", "To")
        data.addColumn("number", "Percent")
        data.addRows(rows)
        if (this.colors == "solid") {
          colors = [
            "#1874DC",
            "#FFFFFF",
            "#1874DC",
            "#1874DC",
            "#1874DC",
            "#1874DC",
          ]
        } else {
          colors = [
            "#d37c39",
            "#FFFFFF",
            "#86B33B",
            "#8360ED",
            "#49ACEC",
            "#37608D",
          ]
        }

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
              //nodePadding: 0,
              label: {
                fontName:
                  'Public Sans,"Helvetica Neue",Helvetica,arial,sans-serif',
                fontSize: 14,
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

        this.group_count = _.get(
          this.outcome_cohorts,
          this.study + "." + this.enroll)
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
