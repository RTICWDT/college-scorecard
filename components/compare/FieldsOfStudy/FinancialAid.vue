<template>
  <h2 class="mb-5">Financial Aid</h2>

  <div class="pl-0 pl-md-5">
    <h3 class="mb-3">Median Total Debt After Graduation</h3>

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
            <tooltip definition="include-debt-prior-inst" />
          </span>
        </template>
      </v-checkbox>
    </div>

    <div class="pl-0 pl-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarMedian
            v-if="medianTotalDebt(fos)"
            :value="{
              label: numeral(medianTotalDebt(fos)).format('$0,0'),
              value: medianTotalDebt(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '$150,000',
              value: 150000,
              style: { height: '60px' },
            }"
            color="#00365e"
            :y-bar-thickness="50"
            :label-font-size="24"
            :labels="true"
          />
          <div class="data-na" v-else>Data Not Available</div>
        </template>
      </CompareFieldsOfStudyDataSection>
    </div>
  </div>



  <div class="pl-0 pl-md-5">
    <h3 class="mb-3">Monthly Loan Payment  </h3>

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
            <tooltip definition="include-debt-prior-inst" />
          </span>
        </template>
      </v-checkbox>
    </div>

    <div class="pl-0 pl-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarMedian
            v-if="medianTotalMonthlyDebt(fos)"
            :value="{
              label: numeral(medianTotalMonthlyDebt(fos)).format('$0,0'),
              value: medianTotalMonthlyDebt(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '$2,000',
              value: 2000,
              style: { height: '60px' },
            }"
            color="#00365e"
            :y-bar-thickness="50"
            :label-font-size="24"
            :labels="true"
          />
          <div class="data-na" v-else>Data Not Available</div>
        </template>
      </CompareFieldsOfStudyDataSection>
    </div>
  </div>
</template>

<script setup>
import numeral from 'numeral';
const { fields, getNestedField } = useConstants()
const props = defineProps({
  fieldsOfStudy: Object,
});

const includeDebtBorrowed = ref(false)
const includeDebtBorrowedMonthly = ref(false)

const medianTotalDebt = computed(() => (fos) => {
  if (includeDebtBorrowed.value) {
    return medianPrior(fos)
  } else {
    return medianDebt(fos)
  }
})

const medianTotalMonthlyDebt = computed(() => (fos) => {
  if (includeDebtBorrowedMonthly.value) {
    return medianDebtMonthlyPrior(fos)
  } else {
    return medianDebtMonthly(fos)
  }
})

const medianDebt = (fos) => getNestedField(fos, fields.FOS_DEBT_MEDIAN)
const medianPrior = (fos) => getNestedField(fos, fields.FOS_DEBT_MEDIAN_PRIOR)
const medianDebtMonthly = (fos) => getNestedField(fos, fields.FOS_DEBT_MONTHLY)
const medianDebtMonthlyPrior = (fos) => getNestedField(fos, fields.FOS_DEBT_MONTHLY_PRIOR)
</script>

<style lang="scss" scoped>
</style>