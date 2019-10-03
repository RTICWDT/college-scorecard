<template>
  <div>
    <div>
      <p class="outcomes_intro d-inline-block mb-2">Show data for students who</p>
      <v-btn-toggle v-model="enroll" @change="drawSankeyChart" mandatory color="secondary">
        <v-btn small text value="enroll_first_time">started college here</v-btn>
        <v-btn small text value="enroll_not_first_time">transferred in</v-btn>
        <v-btn small text value="enroll_both">both</v-btn>
      </v-btn-toggle>
    </div>
    <div>
      <p class="outcomes_intro d-inline-block ">and started their studies</p>
      <v-btn-toggle v-model="study" @change="drawSankeyChart" mandatory color="secondary">
        <v-btn small text value="study_full_time">full-time</v-btn>
        <v-btn small text value="study_part_time">part-time</v-btn>
        <v-btn small text value="study_both">both</v-btn>
      </v-btn-toggle>.
    </div>

    <div v-if="has_data" class="om_visualization">
      <div class="om_group">Out of {{ group_count | separator }} students...</div>
      <div class="om_sankey" ref="sankey"></div>
    </div>

    <div v-else class="om_visualization">
      <div class="om_sankey na">Data not Available</div>
    </div>
  </div>
</template>

<style lang="scss">
@import "sass/_variables.scss";
  

.om_visualization{
  display: flex;
  clear:both;
  .om_group{
    width: 32%;
    text-align: center;
    padding-top: 100px;
    padding-right: $base-padding;
  }
  .om_sankey{
    width: 68%;
    height: 300px;
    margin-top: $base-padding;
    text[text-anchor="end"]{
      display:none;
    }
    path[fill="#ffffff"]{
      display:none;
    }
    rect[fill="#ffffff"]{
      display:none;
    }
    &.na{
      border: 1px solid $light-gray;
      text-align: center;
      padding-top: 100px;
      color: $dark-gray;
      border-radius: 2px;
      width: 100%;
    }
  }
  .google-visualization-tooltip{
    display:none;
  }
}



</style>


<script>
export default {
  props: {
    school: Object,
    colors: {
      type: String,
      default: "multi"
    }
  },
  data() {
    return {
      outcomes: Object,
      outcome_cohorts: Object,
      enroll: "enroll_both",
      study: "study_both",
      group_count: 0,
      has_data: true
    };
  },

  mounted() {
    this.extractData();
    google.charts.load("current", {
      packages: ["corechart", "table", "sankey"],
      callback: this.drawSankeyChart
    });
    window.addEventListener("resize", this.drawSankeyChart);
  },

  methods: {
    extractData() {
      this.outcomes = _.get(
        this.school,
        "latest.completion.outcome_percentage_suppressed"
      );
      let outcome_cohort_data = _.get(
        this.school,
        "latest.completion.outcome_cohort"
      );
      this.outcome_cohorts = {
        study_full_time: {
          enroll_first_time:
            outcome_cohort_data.full_time.first_time["8yr_pooled"],
          enroll_not_first_time:
            outcome_cohort_data.full_time.not_first_time["8yr_pooled"],
          enroll_both:
            outcome_cohort_data.full_time.first_time["8yr_pooled"] +
            outcome_cohort_data.full_time.not_first_time["8yr_pooled"]
        },
        study_part_time: {
          enroll_first_time:
            outcome_cohort_data.part_time.first_time["8yr_pooled"],
          enroll_not_first_time:
            outcome_cohort_data.part_time.not_first_time["8yr_pooled"],
          enroll_both:
            outcome_cohort_data.part_time.first_time["8yr_pooled"] +
            outcome_cohort_data.part_time.not_first_time["8yr_pooled"]
        },
        study_both: {
          enroll_first_time:
            outcome_cohort_data.full_time.first_time["8yr_pooled"] +
            outcome_cohort_data.part_time.first_time["8yr_pooled"],
          enroll_not_first_time:
            outcome_cohort_data.full_time.not_first_time["8yr_pooled"] +
            outcome_cohort_data.part_time.not_first_time["8yr_pooled"],
          enroll_both:
            outcome_cohort_data.full_time.first_time["8yr_pooled"] +
            outcome_cohort_data.full_time.not_first_time["8yr_pooled"] +
            outcome_cohort_data.part_time.first_time["8yr_pooled"] +
            outcome_cohort_data.part_time.not_first_time["8yr_pooled"]
        }
      };
    },

    drawSankeyChart() {
      var links = {
        study_full_time: {
          enroll_first_time: {
            variable: "full_time.first_time.8yr",
            text:
              "Out of students who started college here and started their studies full-time..."
          },
          enroll_not_first_time: {
            variable: "full_time.not_first_time.8yr",
            text:
              "Out of students who transferred in and started their studies full-time..."
          },
          enroll_both: {
            variable: "full_time.8yr",
            text: "Out of students who started their studies full-time..."
          }
        },
        study_part_time: {
          enroll_first_time: {
            variable: "part_time.first_time.8yr",
            text:
              "Out of students who started college here and started their studies part-time..."
          },
          enroll_not_first_time: {
            variable: "part_time.not_first_time.8yr",
            text:
              "Out of students who transferred in and started their studies part-time..."
          },
          enroll_both: {
            variable: "part_time.8yr",
            text: "Out of students who started their studies part-time..."
          }
        },
        study_both: {
          enroll_first_time: {
            variable: "first_time.8yr",
            text: "Out of students who started college here..."
          },
          enroll_not_first_time: {
            variable: "not_first_time.8yr",
            text: "Out of students who transferred in..."
          },
          enroll_both: {
            variable: "all_students.8yr",
            text: "Out of all students..."
          }
        }
      };

      var friendlyMetrics = {
        award_pooled: "graduated",
        still_enrolled_pooled: "still enrolled",
        transfer_pooled: "transferred",
        unknown_pooled: "withdrew"
      };

      var currentData = _.get(
        this.outcomes,
        links[this.study][this.enroll].variable
      );
      var rows = [];
      var percent;

      for (var q in currentData) {
        percent = Math.round(currentData[q] * 100);
        if (percent > 0) {
          rows.push([percent + "% " + friendlyMetrics[q], "Group", percent]);
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
            "#880E4F",
            "#FFFFFF",
            "#880E4F",
            "#880E4F",
            "#880E4F",
            "#880E4F"
          ];
        } else {
          colors = [
            "#d37c39",
            "#FFFFFF",
            "#86B33B",
            "#8360ED",
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
              //nodePadding: 0,
              label: {
                fontName:
                  'Public Sans,"Helvetica Neue",Helvetica,arial,sans-serif',
                fontSize: 14,
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
        this.group_count = _.get(
          this.outcome_cohorts,
          this.study + "." + this.enroll
        );
        chart.draw(data, options);
      } else {
        this.has_data = false;
      }

      if (window.ga) {
        try {
          ga(
            "send",
            "event",
            "Outcome",
            "Toggle",
            this.enroll.substring(8).replace(/_/g, " ") +
              " " +
              this.study.substring(7).replace(/_/g, " ")
          );
        } catch (e) {
          console.error("[ga] outcome measure toggle event error");
        }
      }
    }
  }
};
</script>