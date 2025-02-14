<template>
  <h2 class="mb-5">Financial Aid</h2>

  <div class="px-0 px-md-5">
    <CompareTooltipHeader class="mb-3" title="Median Total Debt After Graduation" definition="fos-median-debt" />

    <div class="d-flex">
      <v-checkbox
        class="mx-5 mb-5"
        hide-details
        v-model="includeDebtBorrowed"
        label="Include debt borrowed at any prior institutions"
      >
        <template v-slot:label>
          <span class="profile-fos-include-prior-debt">
            Include debt borrowed at any prior
            institutions&nbsp;
            <TooltipModal definition="include-debt-prior-inst" />
          </span>
        </template>
      </v-checkbox>
    </div>

    <div class="px-0 px-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarRangeSimplified
            :hasData="medianTotalDebt(fos)"
            :showMinMax="true"
            :value="{
              label: toDollar(medianTotalDebt(fos)),
              value: medianTotalDebt(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
            }"
            :max="{
              label: '$150,000',
              value: 150000,
            }"
          />
        </template>
      </CompareFieldsOfStudyDataSection>
    </div>
  </div>

  <div class="px-0 px-md-5">
    <CompareTooltipHeader class="mb-3" title="Monthly Loan Payment" definition="fos-monthly-debt-payment" />

    <div class="d-flex">
      <v-checkbox
        class="mx-5 mb-5"
        hide-details
        v-model="includeDebtBorrowedMonthly"
        label="Include debt borrowed at any prior institutions"
      >
        <template v-slot:label>
          <span class="profile-fos-include-prior-debt">
            Include debt borrowed at any prior
            institutions&nbsp;
            <TooltipModal definition="include-debt-prior-inst" />
          </span>
        </template>
      </v-checkbox>
    </div>

    <div class="px-0 px-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarRangeSimplified
            :hasData="medianTotalMonthlyDebt(fos)"
            :showMinMax="true"
            :value="{
              label: toDollar(medianTotalMonthlyDebt(fos)),
              value: medianTotalMonthlyDebt(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
            }"
            :max="{
              label: '$2,000',
              value: 2000,
            }"
          />
        </template>
      </CompareFieldsOfStudyDataSection>
    </div>
  </div>
</template>

<script setup>
const { toDollar } = useNumberFormatter()
const { fields, getNestedField } = useConstants()
const props = defineProps({
  fieldsOfStudy: Object,
});

const includeDebtBorrowed = ref(false)
const includeDebtBorrowedMonthly = ref(false)

const medianTotalDebt = computed(() => (fos) => {
  return includeDebtBorrowed.value ? medianPrior(fos) : medianDebt(fos)
})

const medianTotalMonthlyDebt = computed(() => (fos) => {
  return includeDebtBorrowedMonthly.value ? medianDebtMonthlyPrior(fos) : medianDebtMonthly(fos)
})

const medianDebt = (fos) => getNestedField(fos, fields.FOS_DEBT_MEDIAN)
const medianPrior = (fos) => getNestedField(fos, fields.FOS_DEBT_MEDIAN_PRIOR)
const medianDebtMonthly = (fos) => getNestedField(fos, fields.FOS_DEBT_MONTHLY)
const medianDebtMonthlyPrior = (fos) => getNestedField(fos, fields.FOS_DEBT_MONTHLY_PRIOR)
</script>

<style lang="scss" scoped>
</style>