<template>
  <MedianToggle
    :display-toggle="medianToggle"
    @median-tab-change="handleMedianToggle"
    group-name="School Type"
    label-prefix="Midpoint for "
  />

  <h2 class="mb-1 mt-7">Average Annual Cost</h2>
  <p style="max-width: 800px">Cost includes tuition, living costs, books and supplies, and fees minus the average grants and scholarships for federal financial aid recipients.</p>

  <Spacer :height="20" />

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ numeral(netPriceMidpoint(institution)).format('$0,0') || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          v-if="netPrice(institution)"
          :value="{
            label: numeral(netPrice(institution)).format('$0,0'),
            value: netPrice(institution),
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
            label: 'Midpoint',
            value: netPriceMidpoint(institution),
            style: { height: '60px' },
            show: true,
          }"
        />
        <div class="data-na" v-else>Data Not Available</div>
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Graduation Rate</h2>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ numeral(completionRateMidpoint(institution)).format('0%') || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          v-if="completionRate(institution)"
          :value="{
            label: numeral(completionRate(institution)).format('0%'),
            value: completionRate(institution),
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
          :median="{
            label: 'Midpoint',
            value: completionRateMidpoint(institution),
            style: { height: '60px' },
            show: true,
          }"
        />
        <div class="data-na" v-else>Data Not Available</div>
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Median Earnings</h2>

  <div class="px-0 px-md-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ numeral(medianEarningsMidpoint(institution)).format('$0,0') || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">      
        <ChartHorizontalBarMedian
          v-if="medianEarnings(institution)"
          :value="{
            label: numeral(medianEarnings(institution)).format('$0,0'),
            value: medianEarnings(institution),
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
            label: 'Midpoint',
            value: medianEarningsMidpoint(institution),
            style: { height: '60px' },
            show: true,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
import numeral from 'numeral'
const {
  netPrice,
  medianEarnings,
  completionRate,
  toggleMedianEarnings,
  toggleAverageAnnualCosts,
  toggleGraduationRate
} = useComplexFieldMethods()
const { fields } = useConstants()
const props = defineProps({
  institutions: Object,
});

const medianToggle = ref('group')
const handleMedianToggle = (toggleValue) => {
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}

const medianEarningsMidpoint = (institution) => {
  const medianEarnings = toggleMedianEarnings(institution)
  return medianToggle.value === 'group' ? medianEarnings[0] : medianEarnings[1]
}

const netPriceMidpoint = (institution) => {
  const netPrice = toggleAverageAnnualCosts(institution)
  return medianToggle.value === 'group' ? netPrice[0] : netPrice[1]
}

const completionRateMidpoint = (institution) => {
  const completionRate = toggleGraduationRate(institution)
  return medianToggle.value === 'group' ? completionRate[0] : completionRate[1]
}
</script>

<style lang="scss" scoped>
</style>