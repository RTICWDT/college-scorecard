<template>
  <tr>
    <td>{{ _.get(school, fields["NAME"]) }}</td>
    <td class="data-cell" v-if="repaymentStatuses[gradSubgroup][this.config.repaymentStatus]">
      {{ repaymentStatuses[gradSubgroup][this.config.repaymentStatus] | numeral("0%") }}
    </td>
    <td class="data-cell" v-else>--</td>
  </tr> 

</template>

<style lang="scss" scoped>
.data-na {
  padding: 0;
  background-color: #fafafa;
  margin: 0 !important;
  font-size: 0.9rem;
  min-height: 30px;
}
.active {
  background-color: #faefd2 !important;
}
.data-cell {
  width:25%;
  text-align:center;
}
</style> 

<script>
import HorizontalBar from "~/components/HorizontalBar.vue"
import Range from "~/components/Range.vue"
import MultiRange from "~/components/MultiRange.vue"
import Sankey from "~/components/Sankey.vue"
import SchoolIcons from "~/components/SmallSchoolIcons.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import Tooltip from "~/components/Tooltip.vue"
import RepaymentRate from "~/components/RepaymentRate.vue"
import HorizontalBarMedian from "~/components/HorizontalBarMedian.vue"
import MedianToggle from "~/components/MedianToggle.vue"
import numeral from "numeral"

export default {
  mixins: [ComplexFields],
  components: {
    "horizontal-bar": HorizontalBar,
    "horizontal-bar-median": HorizontalBarMedian,
    range: Range,
    sankey: Sankey,
    "multi-range": MultiRange,
    "school-icons": SchoolIcons,
    tooltip: Tooltip,
    "repayment-rate": RepaymentRate,
    "median-toggle": MedianToggle,
  },
  props: {
    school: {
      type: Object,
    },
    config: {
      type: Object,
    },
    currentHighlight: {
      type: String,
    },
  },
  computed: {
    classes() {
      return {
        active: "school-" + this.school.id == this.currentHighlight,
        "pb-1": true,
        "px-sm-5": true,
        "px-1": true,
      }
    },
    value() {
      if (this.config.currentRaceEthnicityFilter) {
        let entry = this.raceEthnicity.filter(
          (obj) => obj.label === this.config.currentRaceEthnicityFilter
        )
        return Math.round(entry[0].value * 100)
      } else if (this.config.currentIncomeFilter) {
        return this.income[this.config.currentIncomeFilter]
      } else if (this.config.type == "percent") {
        return Math.round(this[this.config.computedField] * 100)
      } else if (this.config.multiRangeReactive) {
        return this.generateDebtRange(
          this.allFieldsOfStudy,
          this.config.multiRangeAidShowMedianDebtWithPrior,
          this.config.multiRangeAidLoanSelect
        )
      } else {
        return this[this.config.computedField]
      }
    },
    groupName() {
      return _.get(this.school, this.fields["PREDOMINANT_DEGREE"])
    },       
    gradSubgroup() {
      return this.config.showGradOnly ? 'ugcomp' : 'ug'
    },
    repaymentStatusText() {
      return 'Making Progress'
    },
    repaymentStatuses() {
      return _.get(this.school, this.fields["REPAYMENT_RATES"])
    },
  },
  methods: {
    checkTipUpperStyle(upperValue, maxValue, upperStyleTipOverride) {
      // Fixing padding issue on max value
      let additionalPaddingStyles = upperStyleTipOverride

      // Checking for max
      if (Number(upperValue) >= maxValue * 0.85) {
        additionalPaddingStyles.left = "-3.1rem"
      }

      return additionalPaddingStyles
    },
    checkUpperStyle(value, maxValue, upperStyleOverride) {
      let additionalPaddingStyles = upperStyleOverride

      if (Number(value) >= maxValue * 0.97) {
        additionalPaddingStyles.left = "97%"
      }

      return additionalPaddingStyles
    },
  },
}
</script>
