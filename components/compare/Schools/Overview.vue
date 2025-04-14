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

  <CompareTooltipHeader title="Average Annual Cost" definition="avg-cost" :h="2" class="mb-1 mt-7" />
  <p class="mb-5" style="max-width: 800px">Cost includes tuition, living costs, books and supplies, and fees minus the average grants and scholarships for federal financial aid recipients.</p>

  <Spacer :height="20" />

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toDollar(netPriceMidpoint(institution)) || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
          :hasData="netPrice(institution)"
          :showMinMax="true"
          :value="{
            label: toDollar(netPrice(institution)),
            value: netPrice(institution),
          }"
          :min="{
            label: '$0',
            value: 0,
          }"
          :max="{
            label: '$100,000',
            value: 100000,
          }"
          :midpoint="{
            label: 'Midpoint',
            value: netPriceMidpoint(institution),
            show: true,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <CompareTooltipHeader title="Graduation Rate" definition="graduation-rate" :h="2" class="mb-5" />
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toPercent(completionRateMidpoint(institution)) || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
          :hasData="completionRate(institution)"
          :showMinMax="true"
          :value="{
            label: toPercent(completionRate(institution)),
            value: completionRate(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
          }"
          :max="{
            label: '100%',
            value: 1,
          }"
          :midpoint="{
            label: 'Midpoint',
            value: completionRateMidpoint(institution),
            show: true,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <CompareTooltipHeader title="Median Earnings" definition="institution-median-earnings" :h="2" class="mb-5" />
  <div class="px-0 px-md-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toDollar(medianEarningsMidpoint(institution)) || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">      
        <ChartHorizontalBarRangeSimplified
          :hasData="medianEarnings(institution)"
          :showMinMax="true"
          :value="{
            label: toDollar(medianEarnings(institution)),
            value: medianEarnings(institution),
          }"
          :min="{
            label: '$0',
            value: 0,
          }"
          :max="{
            label: '$100,000',
            value: 100000,
          }"
          :midpoint="{
            label: 'Midpoint',
            value: medianEarningsMidpoint(institution),
            show: true,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
const { toDollar, toPercent } = useNumberFormatter()
const { color } = useVuetify()
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