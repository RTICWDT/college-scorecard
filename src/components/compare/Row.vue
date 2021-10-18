<template>
  <div
    :class="classes"
    @click="$emit('update-highlight', 'school-' + school.id)"
  >
    <p class="subtitle-2 pb-0 mb-0">
      <a :href="$url(schoolLink)">{{ _.get(school, fields["NAME"]) }}</a>
    </p>

    <horizontal-bar-median
      v-if="school && config.chart == 'HorizontalBarMedian' && value && config.type == 'average-annual-cost'"
      :value="{
        label:  this.$options.filters.numeral(netPrice,'$0,0'),
        value: netPrice
      }"
      :min="config.min"
      :max="config.max"
      :median="{
        label: 'Median',
        value: config.medianToggle === 'group' ? fakeAverageAnnualCost[parseInt(groupName)] : fakeAverageAnnualCost[4],
        style: { height: '60px' },
      }"                      
      color="#00365e"
      :height="500"
      :y-bar-thickness="50"
      :label-font-size="24"
      :labels="true"
      class="pt-3"
    ></horizontal-bar-median>
    <horizontal-bar-median
      v-if="school && config.chart == 'HorizontalBarMedian' && value && config.type == 'graduation-rate'"
      :value="{
        label:  this.$options.filters.numeral(completionRate,'0%'),
        value: completionRate * 100
      }"
      :min="config.min"
      :max="config.max"
      :median="{
        label: 'Median',
        value: config.medianToggle === 'group' ? fakeGraduationRate[parseInt(groupName)] * 100 : fakeGraduationRate[4] * 100,
        style: { height: '60px' },
      }"         
      :upperStyleOverride="
        checkUpperStyle(
          completionRate,
          100,
          {}
        )
      "                          
      color="#00365e"
      :height="500"
      :y-bar-thickness="50"
      :label-font-size="24"
      :labels="true"
      class="pt-3"
    ></horizontal-bar-median>    
    <horizontal-bar-median
      v-if="school && config.chart == 'HorizontalBarMedian' && value && config.type == 'median-earnings'"
      :value="{
        label:  this.$options.filters.numeral(netPrice,'$0,0'),
        value: netPrice
      }"
      :min="config.min"
      :max="config.max"
      :median="{
        label: 'Median',
        value: config.medianToggle === 'group' ? fakeMedianEarnings[parseInt(groupName)] : fakeMedianEarnings[4],
        style: { height: '60px' },
      }"
      :upperStyleOverride="
        checkUpperStyle(
          netPrice,
          100000,
          {}
        )
      "                        
      color="#00365e"
      :height="500"
      :y-bar-thickness="50"
      :label-font-size="24"
      :labels="true"
      class="pt-3"
    ></horizontal-bar-median>      
    <div
      v-if="school && config.chart == 'HorizontalBarMedian' && !value"
      class="data-na"
    >
      Data Not Available
    </div>     

    <horizontal-bar
      v-if="school && config.chart == 'HorizontalBar' && value"
      :value="value"
      :min="0"
      :max="config.max"
      :color="config.color"
      :height="25"
      :type="config.type"
      :labels="true"
    ></horizontal-bar>
    <div
      v-if="school && config.chart == 'HorizontalBar' && !value"
      class="data-na"
    >
      Data Not Available
    </div>

    <range
      v-if="school && config.chart == 'Range' && value.available"
      :lower="{ value: value.lower, label: value.lower }"
      :upper="{ value: value.upper, label: value.upper }"
      :min="{ value: value.min, label: value.min }"
      :max="{ value: value.max, label: value.max }"
      lowertip
      uppertip
      hideMiddle
    ></range>
    <div
      v-if="school && config.chart == 'Range' && !value.available"
      class="data-na"
    >
      Data Not Available
    </div>

    <sankey
      v-if="school && config.chart == 'Sankey'"
      :school="school"
      colors="solid"
      :currentSankey="config.currentSankey"
    />

    <!--<repayment-rate
      v-if="school && config.chart == 'RepaymentRate'"
      :school="school"
      colors="solid"
      :gradOnly="config.showGradOnly"
    /> -->                                                                           

    <multi-range
      v-if="school && config.chart == 'MultiRange'"
      :minmax="value"
      :variable="config.multiRangeVariable"
      :max="config.max ? config.max : { label: '$150,000', value: 150000 }"
      :addExtraPadding="false"
      :lowerTipStyleOverride="{ top: 'unset', bottom: '-1.1rem' }"
      :upperStyleOverride="
        checkUpperStyle(
          _.get(this.earningsRange, 'max.earnings.median_earnings'),
          150000,
          {}
        )
      "
      :upperTipStyleOverride="
        checkTipUpperStyle(
          _.get(this.earningsRange, 'max.earnings.median_earnings'),
          150000,
          { top: 'unset', bottom: '-1.1rem' }
        )
      "
    />

    <div v-if="school && config.chart == 'SchoolInfo'">
      <v-row>
        <v-col cols="12" sm="6">
          <school-icons :school="school" :fields="fields" />
        </v-col>
        <v-col cols="12" sm="3" class="text-center">
          <h2 class="navy-text">{{ this.undergraduates | separator }}</h2>
          undergraduates
        </v-col>
        <v-col cols="12" sm="3" class="text-center">
          <v-chip small v-if="underInvestigation == 1" color="error" label>
            <strong>Under ED Monitoring</strong>
            <tooltip
              definition="hcm2"
              color="#FFFFFF"
              class="ml-2"
              :isBranch="isBranch"
            />
          </v-chip>
          <a
            style="word-wrap: break-word;"
            target="_blank"
            :href="'/school/transition/?url=' + schoolUrl"
            >{{
              _.get(school, fields["SCHOOL_URL"], "ed.gov") | formatUrlText
            }}</a
          >
        </v-col>
      </v-row>
    </div>

    <div v-if="school && config.chart == 'estimatedParentBorrowed'">
      <div
        v-if="estimatedParentBorrowedText"
        class="display-2 navy-text font-weight-bold"
      >
        {{ estimatedParentBorrowedText }}
      </div>
      <div v-else class="data-na">Data Not Available</div>
    </div>
  </div>
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
      return this.showGradOnly ? 'ugcomp' : 'ug'
    }    
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
