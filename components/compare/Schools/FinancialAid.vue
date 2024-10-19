<template>
  <p class="text-caption text-uppercase pt-5 pb-1">Loan Type</p>
  <v-select
    class="mb-5 pt-0"
    hide-details
    :items="aidLoanSelection"
    v-model="aidLoanSelect"
    aria-labelledby="loan-type-label"
    variant="outlined"
    color="secondary"
  />

  <div v-if="isFedLoan">
    <CompareTooltipHeader title="Students Receiving Federal Loans" definition="student-aid" :h="2" class="mb-5 mt-7" />
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <ChartHorizontalBarMedian
            :shouldRender="studentsReceivingLoans(institution)"
            :value="{
              label: toPercent(studentsReceivingLoans(institution)),
              value: studentsReceivingLoans(institution),
            }"
            :min="{
              label: '0%',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '100%',
              value: 1,
              style: { height: '60px' },
            }"
          />
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>

  <div v-if="isPlusLoan">
    <CompareTooltipHeader title="Estimated percent of student who had a parent who borrowed" definition="parent-borrowing-rate" :h="2" class="mb-5 mt-7" />
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <p class="display-2">{{ estimatedParentBorrowedText(institution) }}</p>
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>

  <CompareTooltipHeader title="Median Total Debt After Graduation" :definition="isPlusLoan ? 'parent-plus-avg-debt' : 'avg-debt'" :h="2" class="mb-1 mt-7" />
  <p class="mb-5">The typical total debt for undergraduate borrowers who complete college.</p>

  <v-checkbox
    v-if="isPlusLoan"
    class="mb-2 mt-n4"
    hide-details
    v-model="includePriorDebt"
    label="Include debt borrowed at any prior institutions"
  >
    <template v-slot:label>
      <span class="profile-fos-include-prior-debt">
        Include debt borrowed at any prior institutions
        <TooltipModal definition="include-debt-prior-inst" />
      </span>
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="medianTotalDebt(institution)"
          :value="{
            label: toDollar(medianTotalDebt(institution)),
            value: medianTotalDebt(institution),
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
        />
      </template>
    </CompareSchoolsDataSection>
  </div>


  <h2 class="mb-1 mt-7"></h2>
  <CompareTooltipHeader title="Typical Monthly Loan Payment" :definition="isPlusLoan ? 'parent-plus-avg-loan-payment' : 'avg-loan-payment'" :h="2" class="mb-1 mt-7" />

  <p class="mb-5" style="max-width: 800px">
    This is based on a standard 10-year payment plan, other
    <a href="https://studentaid.gov/loan-simulator" target="_blank" @click="transitionOutboundLink($event)">
      payment options
      <v-icon size="x-small">mdi-open-in-new</v-icon>
    </a>
    are available,
    like income-driven repayment. An 
    <a href="https://studentaid.gov/manage-loans/repayment/plans/income-driven" target="_blank" @click="transitionOutboundLink($event)">
      income-driven repayment plan
      <v-icon size="x-small">mdi-open-in-new</v-icon>
    </a>
     sets your monthly student
    loan payment at an amount that is intended to be affordable based on your
    income and family size.
  </p>

  <v-checkbox
    v-if="isPlusLoan"
    class="mb-2 mt-n4"
    hide-details
    v-model="includePriorDebt"
    label="Include debt borrowed at any prior institutions"
  >
    <template v-slot:label>
      <span class="profile-fos-include-prior-debt">
        Include debt borrowed at any prior institutions
        <TooltipModal definition="include-debt-prior-inst" />
      </span>
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="typicalMonthlyLoanPayment(institution)"
          :value="{
            label: toDollar(typicalMonthlyLoanPayment(institution)),
            value: typicalMonthlyLoanPayment(institution),
          }"
          :min="{
            label: '$0',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '$1,000',
            value: 1000,
            style: { height: '60px' },
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <div v-if="isFedLoan">
    <CompareTooltipHeader title="Repayment Rate" definition="repayment-rate" :h="2" class="mb-1 mt-7" />
    <p class="mb-5" style="max-width: 800px">Percentage of borrowers in each category 2 years after entering repayment. For category definitions, please see the <NuxtLink to="/data/glossary">glossary</NuxtLink>.</p>

    <v-checkbox
      class="mb-2 mt-n4"
      hide-details
      v-model="includeGraduatedOnly"
      label="Only show data for those who graduated"
    />

    <v-select
      :items="repaymentRateSelection"
      v-model="repaymentRateSelect"
      item-text="label"
      item-value="value"
      color="secondary"
      variant="outlined"
    />

    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #override="{ institutions }">
          <v-table>
            <thead>
              <tr>
                <th class="text-caption text-uppercase font-weight-bold text-left">School</th>
                <th class="text-caption text-uppercase font-weight-bold text-right">Percent {{ repaymentRateSelect }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="institution in institutions" :key="institution.id">
                <td>{{ institution.school.name }}</td>
                <td class="text-right">{{ repaymentRate(institution) ? toPercent(repaymentRate(institution)) : '--' }}</td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>

</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toDollar, toPercent } = useNumberFormatter()
const { transitionOutboundLink } = useAnalytics()
const fedLoan = "fed"
const plusLoan = "plus"
const aidLoanSelection = [
  { title: "Federal Student Loans", value: fedLoan },
  { title: "Parent Plus Loans", value: plusLoan },
]
const aidLoanSelect = ref(aidLoanSelection[0].value)
const isFedLoan = computed(() => aidLoanSelect.value === fedLoan)
const isPlusLoan = computed(() => aidLoanSelect.value === plusLoan)
const includePriorDebt = ref(false)


const {
  studentsReceivingLoans,
  estimatedParentBorrowedText,
  federalDebt,
  parentPlusDebtAll,
  parentPlusDebt,
  monthlyLoanPayment,
  parentPlusPaymentAll,
  parentPlusPayment,
  repaymentRates
} = useComplexFieldMethods()

const medianTotalDebt = computed(() => (institution) => {
  if (isFedLoan.value) {
    return federalDebt(institution)
  }

  if (includePriorDebt.value) {
    return parentPlusDebtAll(institution)
  }

  return parentPlusDebt(institution)
})

const typicalMonthlyLoanPayment = computed(() => (institution) => {
  if (isFedLoan.value) {
    return monthlyLoanPayment(institution)
  }

  if (includePriorDebt.value) {
    return parentPlusPaymentAll(institution)
  }

  return parentPlusPayment(institution)
})

const repaymentRateSelection = [
  { title: 'Making Progress', value: 'Making Progress' },
  { title: 'Not Making Progress', value: 'Not Making Progress' },
  { title: 'Deferment', value: 'Deferment' },
  { title: 'Paid in Full', value: 'Paid in Full' },
  { title: 'Forbearance', value: 'Forbearance' },
  { title: 'Defaulted', value: 'Defaulted' },
  { title: 'Delinquent', value: 'Delinquent' },
  { title: 'Discharged', value: 'Discharged' },
]

const repaymentRateSelect = ref(repaymentRateSelection[0].value)
const includeGraduatedOnly = ref(false)

const repaymentRate = computed(() => (institution) => {
  const result = repaymentRates(institution)
  const cohort = includeGraduatedOnly.value ? 'ugcomp' : 'ug'
  const selected = repaymentRateSelect.value
  return result[cohort].find((item) => item.label === selected)?.value
})

</script>

<style lang="scss" scoped>
</style>