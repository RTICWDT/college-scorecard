<template>
  <v-row class="px-0 py-3 pa-sm-5">
    <v-col cols="12" md="6">
      <v-card flat class="pa-4 fill-height">
        <div v-if="!isProgramReporter">
          <h2 class="mb-3">
            Average Annual Cost&nbsp;
            <Tooltip definition="avg-cost" />
          </h2>
          <h2
            v-if="netPrice"
            class="text-h4 medium-light-blue-text font-weight-bold mb-3"
          >
            {{ toDollar(netPrice) }}
          </h2>
          <div v-else class="data-na">
            Data Not Available
          </div>
          <p class="mb-0">
            Cost includes tuition, living costs, books and
            supplies, and fees minus the average grants and
            scholarships for federal financial aid
            recipients.
          </p>

          <div class="d-none d-lg-block mt-3 pt-8 pb-8">
            <MedianToggle
              :display-toggle="medianToggle"
              @median-tab-change="handleMedianToggle"
              :group-name="yearsText(groupName) + ' Schools'"
            />
          </div>
          <ChartHorizontalBarMedian
            class="pt-8 pt-lg-0"
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
                'Midpoint: ' +
                toDollar(
                  medianToggle === 'group'
                    ? Math.round(parseFloat(toggleAverageAnnualCosts[0]))
                    : Math.round(parseFloat(toggleAverageAnnualCosts[1])),
                ),
              value:
                medianToggle === 'group'
                  ? toggleAverageAnnualCosts[0]
                  : toggleAverageAnnualCosts[1],
              style: { height: '60px' },
              show: true,
            }"
            color="#00365e"
            :y-bar-thickness="50"
            :label-font-size="24"
            :labels="true"
          />
          <div v-else class="data-na">
            Data Not Available
          </div>
        </div>
        <div v-else>
          <h2 class="mb-3">
            Average Annual Cost for Largest Program
            <Tooltip
              definition="avg-program-cost"
              :isNegative="netPrice < 0"
            />
          </h2>
          <h2 class="text-h6 my-3">
            <span class="font-weight-bold medium-light-blue-text">{{ programReporter(school)[0].title }}</span>
          </h2>
          <h2 v-if="netPrice" class="text-h6 my-3">
            <span class="medium-light-blue-text font-weight-bold">
              {{ toDollar(netPrice) }}
            </span>
            <span v-if="programReporter(school)[0].annualized == programReporter(school)[0].full_program">
              for a {{ programReporter(school)[0].avg_month_completion }}-month program
            </span>
            <span v-else class="costDescription">
              per year on average
            </span>
          </h2>
          <div v-else class="data-na">
            Data Not Available
          </div>
          <p>
            Cost includes tuition, living costs, books and
            supplies, and fees minus the average grants and
            scholarships for federal financial aid
            recipients.
          </p>

          <div class="pt-8 pb-8 d-none d-lg-block">
            <MedianToggle
              :display-toggle="medianToggle"
              :control-tab="controlTab"
              @median-tab-change="handleMedianToggle"
              :group-name="yearsText(groupName) + ' Schools'"
            />
          </div>
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
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
                  label: '$100,000%',
                  value: 100000,
                  style: { height: '60px' },
                }"
                :median="{
                  label:
                    'Midpoint: ' +
                    toDollar(
                      medianToggle === 'group'
                        ? Math.round(parseFloat(toggleAverageAnnualCosts[0]))
                        : Math.round(parseFloat(toggleAverageAnnualCosts[1]))
                    ),
                  value:
                    medianToggle === 'group'
                      ? toggleAverageAnnualCosts[0]
                      : toggleAverageAnnualCosts[1],
                  style: { height: '60px' },
                  show: true,
                }"
                color="#00365e"
                :height="500"
                :y-bar-thickness="50"
                :label-font-size="24"
                :labels="true"
              />
              <div v-else class="data-na">
                Data Not Available
              </div>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card flat class="pa-4">
        <h2 class="mb-3">By Family Income</h2>
        <p>
          Depending on the federal, state, or institutional
          grant aid available, students in your income
          bracket may pay more or less than the overall
          average costs.
        </p>

        <v-table class="school-table mb-4">
          <caption class="sr-only">
            Average cost by family income
          </caption>
          <thead>
            <tr>
              <th>Family Income</th>
              <th>Average Annual Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>$0-$30,000</td>
              <td v-if="income['0-30000']">
                {{ toDollar(income["0-30000"]) }}
              </td>
              <td v-else>--</td>
            </tr>
            <tr>
              <td>$30,001-$48,000</td>
              <td v-if="income['30001-48000']">
                {{ toDollar(income["30001-48000"]) }}
              </td>
              <td v-else>--</td>
            </tr>
            <tr>
              <td>$48,001-$75,000</td>
              <td v-if="income['48001-75000']">
                {{ toDollar(income["48001-75000"]) }}
              </td>
              <td v-else>--</td>
            </tr>
            <tr>
              <td>$75,001-$110,000</td>
              <td v-if="income['75001-110000']">
                {{ toDollar(income["75001-110000"]) }}
              </td>
              <td v-else>--</td>
            </tr>
            <tr>
              <td>$110,001+</td>
              <td v-if="income['110001-plus']">
                {{ toDollar(income["110001-plus"]) }}
              </td>
              <td v-else>--</td>
            </tr>
          </tbody>
        </v-table>
        <div>
          <v-btn
            color="secondary"
            target="_blank"
            :href="fixedUrl"
            @click="transitionOutboundLink($event)"
            v-if="netPriceCalculatorUrl"
            prepend-icon="fa:fas fa-calculator"
          >
            <span class="d-none d-sm-flex">
              Calculate your personal net price
              <v-icon size="x-s mall" color="white" class="pl-1 pb-1 ml-1 align-self-end" icon="fa:fas fa-external-link-alt" />
            </span>
            <span class="d-block d-sm-none">Calculate net price</span>
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { yearsText } from '~/utils/filters'
const { toDollar } = useNumeral()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  }
})

const {
  isProgramReporter: isProgramReporterMethod,
  netPrice: netPriceMethod,
  income: incomeMethod,
  netPriceCalculatorUrl: netPriceCalculatorUrlMethod,
  toggleAverageAnnualCosts: toggleAverageAnnualCostsMethod,
  groupName: groupNameMethod,
} = useComplexFieldMethods()

const isProgramReporter = computed(() => isProgramReporterMethod(props.school))
const income = computed(() => incomeMethod(props.school))
const toggleAverageAnnualCosts = computed(() => toggleAverageAnnualCostsMethod(props.school))
const netPriceCalculatorUrl = computed(() => netPriceCalculatorUrlMethod(props.school))
const netPrice = computed(() => netPriceMethod(props.school))
const groupName = computed(() => groupNameMethod(props.school))

const { fields } = useConstants()

const medianToggle = ref('group')
const handleMedianToggle = (toggleValue) => {
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}

const fixedUrl = computed(() => {
  if (netPriceCalculatorUrl.value == "#") return false
  else if (netPriceCalculatorUrl.value.match(/^http/)) return netPriceCalculatorUrl.value
  else return "http://" + netPriceCalculatorUrl.value
})


console.log(netPrice.value)
</script>


<style>

</style>