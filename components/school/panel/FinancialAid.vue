<template>
  <div class="px-0 py-3 pa-sm-5">
    <v-card
      v-if="aidFlag > 3 && aidFlag < 8"
      color="blue"
      class="pa-5 text-white"
    >
      {{ site.data.glossary.ogc.default }}
    </v-card>
    <v-card
      v-else-if="aidFlag === 3"
      color="blue"
      class="pa-5 text-white"
    >
      {{ site.data.glossary.ogc.flag3 }}
    </v-card>
    <v-card
      v-else-if="aidFlag === 8"
      color="blue"
      class="pa-5 text-white"
    >
      {{ site.data.glossary.ogc.flag8 }}
    </v-card>
    <div v-else>
      <v-row>
        <v-col cols="12" md="8" class="pb-0">
          <p class="text-overline mb-1" id="loan-type-label">Loan Type</p>

          <v-select
            :items="aidLoanSelectItems"
            v-model="aidLoanSelect"
            color="secondary-green"
            aria-labelledby="loan-type-label"
          />
        </v-col>

        <v-col v-if="aidLoanSelect === 'plus'" cols="12" md="4" class="d-flex align-center">
          <v-checkbox
            v-model="aidShowMedianDebtWithPrior"
            label="Include debt borrowed at prior institutions"
            color="secondary-green"
            class="shrink"
            hide-details
          >
            <template #label>
              <span>
                Include debt borrowed at any prior
                institutions&nbsp;<TooltipModal
                  definition="include-debt-prior-inst"
                  class="pt-2 pl-2"
                />
              </span>
            </template>
          </v-checkbox>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="pa-4 fill-height" flat>
            <div v-if="aidLoanSelect === 'fed'">
              <h2 class="mb-3">
                Students Receiving Federal Loans
                <TooltipModal definition="student-aid" />
              </h2>
              <div v-if="studentsReceivingLoans != null">
                <div class="d-flex align-center justify-center">
                  <div style="height: 200px; width: 200px">
                    <ChartDonut
                      color="secondary-blue"
                      :value="studentsReceivingLoans * 100"
                      class="pb-3"
                      chart-id="loans-donut"
                    />
                  </div>
                </div>
                <div class="sr-only">
                  Students Receiving Federal Loans:
                  {{ Math.round(studentsReceivingLoans * 100) + "%" }}
                </div>
              </div>
              <div v-else class="data-na pb-3">
                Data Not Available
              </div>
              <p>
                At some schools where few students borrow
                federal loans, the typical undergraduate may
                leave school with $0 in debt.
              </p>
            </div>
            <div v-else>
              <h2 class="mb-3">
                Parent Borrowing Rate
                <TooltipModal definition="parent-borrowing-rate" />
              </h2>
              <h2
                v-if="estimatedParentBorrowedText"
                class="text-h4 medium-light-blue-text font-weight-bold"
              >
                {{ estimatedParentBorrowedText }}
              </h2>
              <div v-else class="data-na">
                Data Not Available
              </div>
              <p class="mt-2">
                This is an estimated percentage of the number
                of students who had a parent who borrowed a
                Parent PLUS loan.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <v-card flat class="pa-4">
            <h2 class="mb-3">
              Median Total Debt After Graduation
              <TooltipModal
                v-if="aidLoanSelect === 'fed'"
                definition="avg-debt"
                :isBranch="isBranch"
                :limitedFoS="fieldsLink"
              />
              <TooltipModal
                v-else-if="
                  aidLoanSelect === 'plus' &&
                  !aidShowMedianDebtWithPrior
                "
                definition="parent-plus-avg-debt"
                :isBranch="isBranch"
              />
              <TooltipModal
                v-else-if="
                  aidLoanSelect === 'plus' &&
                  aidShowMedianDebtWithPrior
                "
                definition="parent-plus-avg-debt-all-schools"
                :isBranch="isBranch"
              />
            </h2>
            <p v-if="aidLoanSelect === 'fed'">
              The typical total debt for undergraduate
              borrowers who complete college.
            </p>

            <h2
              class="text-h4 medium-light-blue-text font-weight-bold pb-5 pt-3"
              v-if="federalDebt && aidLoanSelect !== 'plus'"
            >
              {{ toDollar(federalDebt) }}
            </h2>

            <h2
              class="text-h4 medium-light-blue-text font-weight-bold pb-5"
              v-else-if="
                parentPlusDebt &&
                aidLoanSelect === 'plus' &&
                !aidShowMedianDebtWithPrior
              "
            >
              {{ toDollar(parentPlusDebt) }}
            </h2>

            <h2
              class="text-h4 medium-light-blue-text font-weight-bold pb-5"
              v-else-if="
                parentPlusDebtAll &&
                aidLoanSelect === 'plus' &&
                aidShowMedianDebtWithPrior
              "
            >
              {{ toDollar(parentPlusDebtAll) }}
            </h2>

            <div class="data-na" v-else>
              Data Not Available
            </div>
          </v-card>
          <v-card flat class="pa-4 mt-4">
            <h2 class="mb-3 mt-3">
              Typical Monthly Loan Payment
              <TooltipModal
                v-if="aidLoanSelect === 'fed'"
                definition="avg-loan-payment"
                :isBranch="isBranch"
                :limitedFoS="fieldsLink"
                style="padding-left:2px;"
              />
              <TooltipModal
                v-else-if="
                  aidLoanSelect === 'plus' &&
                  !aidShowMedianDebtWithPrior
                "
                definition="parent-plus-avg-loan-payment"
                :isBranch="isBranch"
                style="padding-left:2px;"
              />
              <TooltipModal
                v-else-if="
                  aidLoanSelect === 'plus' &&
                  aidShowMedianDebtWithPrior
                "
                definition="parent-plus-avg-loan-payment-all-schools"
                :isBranch="isBranch"
                style="padding-left:2px;"
              />
            </h2>

            <div v-if="monthlyLoanPayment && aidLoanSelect === 'fed'">
              <h2 class="text-h4 medium-light-blue-text font-weight-bold pb-3">
                {{ toDollar(monthlyLoanPayment) }}
              </h2>
            </div>
            <div v-else-if="aidLoanSelect === 'fed'" class="data-na pb-3">
              Data Not Available
            </div>

            <div v-else-if="aidLoanSelect === 'plus'">
              <div v-if="parentPlusPayment && !aidShowMedianDebtWithPrior">
                <h2 class="text-h4 medium-light-blue-text font-weight-bold">
                  {{ toDollar(Math.round(parseFloat(parentPlusPayment))) }}
                </h2>
              </div>
              <div v-else-if="parentPlusPaymentAll && aidShowMedianDebtWithPrior">
                <h2 class="text-h4 medium-light-blue-text font-weight-bold">
                  {{ toDollar(Math.round(parseFloat(parentPlusPaymentAll))) }}
                </h2>
              </div>
              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>

            <p class="mt-3 mb-0 pb-15">
              This is based on a standard 10-year payment
              plan, other
              <a href="https://studentaid.gov/loan-simulator" target="_blank" @click="analytics.transitionOutboundLink">
                payment options
                <v-icon size="x-small" class="pl-1" color="primary-green">mdi-open-in-new</v-icon>
              </a>
              are available, like income-driven repayment. An
              <a target="_blank" href="https://studentaid.gov/manage-loans/repayment/plans/income-driven" @click="analytics.transitionOutboundLink">
                income-driven repayment
                <v-icon size="x-small" class="pl-1" color="primary-green">mdi-open-in-new</v-icon>
              </a>
              plan sets your monthly student loan payment at
              an amount that is intended to be affordable
              based on your income and family size.
            </p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" v-if="aidLoanSelect === 'fed'">
          <v-card class="pa-4 fill-height" flat>
            <v-row>
              <v-col cols="12" md="12" id="showGradOnly">
                <h2 class="mb-3" v-if="showGradOnly">
                  Repayment Rate&nbsp;<TooltipModal
                    definition="repayment-rate"
                    :isBranch="isBranch"
                  />
                </h2>
                <h2 class="mb-3" v-else>
                  Repayment Rate&nbsp;<TooltipModal
                    definition="repayment-rate-completers"
                    :isBranch="isBranch"
                  />
                </h2>
                <span v-if="showGradOnly">
                  Percentage of borrowers in each category 2
                  years after entering repayment. For category
                  definitions, please see
                  <NuxtLink to="/data/glossary/#repayment-rate-completers">
                    the glossary
                  </NuxtLink>.
                </span>
                <span v-else>
                  Percentage of borrowers in each category 2
                  years after entering repayment. For category
                  definitions, please see
                  <NuxtLink to='/data/glossary/#repayment-rate'>
                    the glossary
                  </NuxtLink>.
                </span>
                <v-checkbox
                  v-model="showGradOnly"
                  label="Only show data for those who graduated"
                  color="secondary-green"
                  class="mt-0"
                >
                  <template #label>
                    <span>
                      Only show data for those who graduated
                    </span>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col class="pt-0">
                <v-table class="school-table">
                  <caption class="sr-only">
                    Repayment Rates
                  </caption>
                  <thead>
                    <tr>
                      <th>Repayment Status</th>
                      <th>Percent</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(rate, index) in repaymentRates[gradSubgroup]"
                      :key="index"
                    >
                      <td>{{ rate.label }}</td>
                      <td v-if="rate.value">
                        {{ toPercent(rate.value) }}
                      </td>
                      <td v-else>--</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card color="grey-lighten-4" class="pa-4">
            <h2 class="mb-3">Get Help Paying for College</h2>
            <p>
              Submit a
              <em>Free Application for Federal Student Aid</em>
              (FAFSA&reg;) form. You may be eligible to
              receive federal grants or loans.
            </p>
            <div class="d-flex justify-center">
              <v-btn
                color="secondary-green"
                href="https://studentaid.gov/h/apply-for-aid/fafsa"
                target="_blank"
                @click="analytics.transitionOutboundLink"
                class="mt-5 mb-1"
              >
                Start My FAFSA&reg; Form
                <v-icon size="x-small" color="white" class="pl-1 pb-1 align-self-end">mdi-open-in-new</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
const analytics = useAnalytics()
const { site } = useSiteData()
const { toDollar, toPercent } = useNumberFormatter()

const props = defineProps({
  school: {
    type: Object,
    required: true,
  }
})

const {
  aidFlag: aidFlagMethod,
  studentsReceivingLoans: studentsReceivingLoansMethod,
  estimatedParentBorrowedText: estimatedParentBorrowedTextMethod,
  isBranch: isBranchMethod,
  fieldsLink: fieldsLinkMethod,
  federalDebt: federalDebtMethod,
  parentPlusDebt: parentPlusDebtMethod,
  parentPlusDebtAll: parentPlusDebtAllMethod,
  monthlyLoanPayment: monthlyLoanPaymentMethod,
  parentPlusPayment: parentPlusPaymentMethod,
  parentPlusPaymentAll: parentPlusPaymentAllMethod,
  repaymentRates: repaymentRatesMethod,
} = useComplexFieldMethods()

const aidFlag = computed(() => aidFlagMethod(props.school))
const studentsReceivingLoans = computed(() => studentsReceivingLoansMethod(props.school))
const estimatedParentBorrowedText = computed(() => estimatedParentBorrowedTextMethod(props.school))
const isBranch = computed(() => isBranchMethod(props.school))
const fieldsLink = computed(() => fieldsLinkMethod(props.school))
const federalDebt = computed(() => federalDebtMethod(props.school))
const parentPlusDebt = computed(() => parentPlusDebtMethod(props.school))
const parentPlusDebtAll = computed(() => parentPlusDebtAllMethod(props.school))
const monthlyLoanPayment = computed(() => monthlyLoanPaymentMethod(props.school))
const parentPlusPayment = computed(() => parentPlusPaymentMethod(props.school))
const parentPlusPaymentAll = computed(() => parentPlusPaymentAllMethod(props.school))
const repaymentRates = computed(() => repaymentRatesMethod(props.school))

const showGradOnly = ref(false)
const aidShowMedianDebtWithPrior = ref(false)
const aidLoanSelect = ref("fed")
const aidLoanSelectItems = ref([
  { title: "Federal Student Loans", value: "fed" },
  { title: "Parent PLUS Loans", value: "plus" },
])

const gradSubgroup = computed(() => showGradOnly.value ? "ugcomp" : "ug")
</script>