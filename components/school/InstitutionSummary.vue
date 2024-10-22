<template>
  <div style="max-width: 600px;">
    <Toggle
      v-model="medianToggle"
      :options="[
        { label: 'Midpoint for School Type', value: 'group', color: color('primary-green'), activeColor: 'transparent' },
        { label: 'Midpoint for All Schools', value: 'all', color: color('primary-green'), activeColor: '#transparent' },
      ]"
      backgroundColor="white"
      borderThickness="5px"
      :height="50"
    >
      <template #default="{ label }">
        <span class="compare-tab-title px-5 text-black">
          {{ label }}
        </span>
      </template>
    </Toggle>
  </div>

  <div class="mb-5" elevation="0">
    <v-row class="mt-3">
      <!-- Graduation Rate -->
      <v-col md="6" cols="12" class="pr-sm-3">
        <v-card class="pa-4 fill-height" flat>
          <div
            id="school-completion-rate-bar"
            class="py-3 pa-sm-3"
          >
            <h2 class="mb-3">
              Graduation Rate&nbsp;
              <TooltipModal
                definition="graduation-rate"
                :version="completionRateFieldDefinition"
              />
            </h2>
            <h2
              class="display-2 medium-light-blue-text font-weight-bold pb-3"
              v-if="completionRate"
            >
              {{ toPercent(completionRate) }}
            </h2>
            <div class="data-na pb-3" v-else>
              Data Not Available
            </div>
            <em
              v-if="
                completionRate &&
                  (medianToggle === 'group'
                    ? toggleGraduationRate[0]
                    : toggleGraduationRate[1])
              "
              >Midpoint for
              {{
                medianToggle === "group"
                  ? yearsText(groupName) +
                    " "
                  : "All"
              }}
              Schools:
              {{
                toPercent(
                  medianToggle === "group"
                    ? toggleGraduationRate[0]
                    : toggleGraduationRate[1],
                )
              }}</em
            >
            <ChartVerticalBarMedian
              v-if="completionRate"
              :value="{
                label: '',
                value: Math.round(
                  parseFloat(completionRate) * 100
                ),
              }"
              :min="{
                label: '0%',
                value: 0,
                style: { height: '60px' },
              }"
              :max="{
                label: '100%',
                value: 100,
                style: { height: '60px' },
              }"
              :median="{
                label:
                  'Midpoint for ' +
                  (medianToggle === 'group'
                    ? yearsText(groupName)
                    : 'All') +
                  ' Schools',
                value:
                  medianToggle === 'group'
                    ? toggleGraduationRate[0] * 100
                    : toggleGraduationRate[1] * 100,
                style: { height: '60px' },
              }"
              :height="500"
              :y-bar-thickness="50"
              :label-font-size="16"
              :labels="true"
              class="mb-4"
            />
            <div v-else class="data-na">Data Not Available</div>
          </div>
        </v-card>
      </v-col>

      <!-- Annual Average Cost & Median Earnings -->
      <v-col cols="12" md="6" class="pr-sm-3">
        <v-card class="pa-4" flat>
          <div id="school-avg-cost" class="mb-4">
            <h2 class="mb-3" v-if="!isProgramReporter">
              Average Annual Cost
              <TooltipModal definition="avg-cost" />
            </h2>
            <h2 v-else class="mb-3">
              Average Annual Cost for Largest Program
              <TooltipModal
                definition="avg-program-cost"
                :isNegative="netPrice < 0"
              />
            </h2>

            <h2
              class="display-2 medium-light-blue-text font-weight-bold pb-3"
              v-if="netPrice"
            >
              {{ toDollar(netPrice) }}
            </h2>
            <div class="data-na pb-3" v-else>
              Data Not Available
            </div>
            <em
              v-if="
                netPrice &&
                  (medianToggle === 'group'
                    ? toggleAverageAnnualCosts[0]
                    : toggleAverageAnnualCosts[1])
              "
              >Midpoint for
              {{
                medianToggle === "group"
                  ? yearsText(groupName)
                  : "All"
              }}
              Schools:
              {{
                toDollar(
                  medianToggle === "group"
                    ? Math.round(
                        parseFloat(
                          toggleAverageAnnualCosts[0]
                        )
                      )
                    : Math.round(
                        parseFloat(
                          toggleAverageAnnualCosts[1]
                        )
                      )
                )
              }}</em
            >

            <ChartHorizontalBarMedian
              v-if="netPrice"
              :value="{
                label: toDollar(netPrice),
                value: netPrice,
              }"
              :min="{
                label: '$0',
                value: 0,
                style: { height: '60px' },
              }"
              :max="{
                label: '$100,000',
                value: 100000,
                style: { height: '60px' },
              }"
              :median="{
                label:
                  'Midpoint for ' +
                  (medianToggle === 'group'
                    ? yearsText(groupName)
                    : 'All') +
                  ' Schools',
                value:
                  medianToggle === 'group'
                    ? toggleAverageAnnualCosts[0]
                    : toggleAverageAnnualCosts[1],
                style: { height: '60px' },
                show: true,
              }"
              :upperTipStyleOverride="{
                display: 'none',
              }"
              :rangeChartStyle="{
                height: '35px',
              }"
              :height="500"
              :y-bar-thickness="50"
              :label-font-size="24"
              :labels="true"
              class="pt-3"
              style="height:100px"
            />
            <div class="data-na" v-else>Data Not Available</div>
          </div>
        </v-card>

        <v-card class="pa-4 mt-4" flat>
          <div id="school-median-earnings" class="mb-4">
            <h2 class="mb-3">
              Median Earnings
              <TooltipModal definition="institution-median-earnings" />
            </h2>

            <h2
              class="display-2 medium-light-blue-text font-weight-bold pb-3"
              v-if="medianEarnings"
            >
              {{ toDollar(medianEarnings) }}
            </h2>
            <div class="data-na pb-3" v-else>
              Data Not Available
            </div>

            <em
              v-if="
                medianEarnings &&
                  (medianToggle === 'group'
                    ? toggleMedianEarnings[0]
                    : toggleMedianEarnings[1])
              "
              >Midpoint for
              {{
                medianToggle === "group"
                  ? yearsText(groupName)
                  : "All"
              }}
              Schools:
              {{
                toDollar(
                  medianToggle === "group"
                    ? Math.round(
                        parseFloat(
                          toggleMedianEarnings[0]
                        )
                      )
                    : Math.round(
                        parseFloat(
                          toggleMedianEarnings[1]
                        )
                      ),
                )
              }}
            </em>

            <ChartHorizontalBarMedian
              v-if="medianEarnings"
              :value="{
                label: toDollar(
                  medianEarnings,
                ),
                value: medianEarnings,
              }"
              :min="{
                label: '$0',
                value: 0,
                style: { height: '60px' },
              }"
              :max="{
                label: '$100,000+',
                value: 100000,
                style: { height: '60px' },
              }"
              :median="{
                label:
                  'Midpoint for ' +
                  (medianToggle === 'group'
                    ? yearsText(groupName)
                    : 'All') +
                  ' Schools',
                value:
                  medianToggle === 'group'
                    ? toggleMedianEarnings[0]
                    : toggleMedianEarnings[1],
                style: { height: '60px' },
                show: true,
              }"
              :upperTipStyleOverride="{
                display: 'none',
              }"
              :height="500"
              :y-bar-thickness="50"
              :label-font-size="24"
              :labels="true"
              class="pt-3"
              style="height:100px"
            />
            <div class="data-na" v-else>Data Not Available</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { toPercent, toDollar } = useNumberFormatter()
const { yearsText } = useFilters()
const { color } = useVuetify()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  },
})

const {
  groupName: groupNameMethod,
  medianEarnings: medianEarningsMethod,
  completionRateFieldDefinition: completionRateFieldDefinitionMethod,
  completionRate: completionRateMethod,
  isProgramReporter: isProgramReporterMethod,
  netPrice: netPriceMethod,
  toggleGraduationRate: toggleGraduationRateMethod,
  toggleAverageAnnualCosts: toggleAverageAnnualCostsMethod,
  toggleMedianEarnings: toggleMedianEarningsMethod,
} = useComplexFieldMethods()

const groupName = computed(() => groupNameMethod(props.school))
const medianEarnings = computed(() => medianEarningsMethod(props.school))
const completionRateFieldDefinition = computed(() => completionRateFieldDefinitionMethod(props.school))
const completionRate = computed(() => completionRateMethod(props.school))
const isProgramReporter = computed(() => isProgramReporterMethod(props.school))
const netPrice = computed(() => netPriceMethod(props.school))
const toggleGraduationRate = computed(() => toggleGraduationRateMethod(props.school))
const toggleAverageAnnualCosts = computed(() => toggleAverageAnnualCostsMethod(props.school))
const toggleMedianEarnings = computed(() => toggleMedianEarningsMethod(props.school))
const medianToggle = ref("group")
</script>

<style lang="scss" scoped>
#school-completion-rate-bar {
  margin-bottom: 55px;
  padding-top: 0px !important;
}
</style>