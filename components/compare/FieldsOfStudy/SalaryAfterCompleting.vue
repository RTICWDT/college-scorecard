<template>
  <h2 class="mb-5">Salary After Completing</h2>

  <div class="px-0 px-md-5">
    <h3 class="mb-3">Median Earnings</h3>
    <div class="px-0 px-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarMedian
            v-if="medianEarnings(fos)"
            :value="{
              label: numeral(medianEarnings(fos)).format('$0,0'),
              value: medianEarnings(fos),
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

    <h3 class="mb-3">Monthly Earnings</h3>
    <div class="px-0 px-md-5">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarMedian
            v-if="monthlyEarnings(fos)"
            :value="{
              label: numeral(monthlyEarnings(fos)).format('$0,0'),
              value: monthlyEarnings(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '$20,000',
              value: 20000,
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
const { fields, getNestedField } = useConstants();

const medianEarnings = (fieldOfStudy) => {
  const field = getNestedField(fieldOfStudy, fields.FOS_EARNINGS_FED_5YR)
  return field
};

const monthlyEarnings = (fieldOfStudy) => {
  const field = medianEarnings(fieldOfStudy)
  if (!field) return null
  return field / 12
};

const props = defineProps({
  fieldsOfStudy: Object,
});
</script>

<style lang="scss" scoped>
</style>