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

  <CompareTooltipHeader title="Median Earnings" definition="institution-median-earnings" :h="2" class="mb-1 mt-7" />
  <p class="mb-5" style="max-width: 800px">The median earnings of former students who received federal financial aid at 10 years after entering the school.</p>
  <div class="px-0 px-md-5 mb-5">
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

  <CompareTooltipHeader title="Percentage Earning More Than a High School Graduate" definition="threshold-earnings" :h="2" class="mb-5" />
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
            :hasData="percentMoreThanHS(institution)"
            :showMinMax="true"
            :value="{
              label: toPercent(percentMoreThanHS(institution)),
              value: percentMoreThanHS(institution),
            }"
            :min="{
              label: '0%',
              value: 0,
            }"
            :max="{
              label: '100%',
              value: 1,
            }"
          />
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toDollar, toPercent } = useNumberFormatter()
const medianToggle = ref('group')
const { color } = useVuetify()

const {
  medianEarnings,
  toggleMedianEarnings,
  percentMoreThanHS,
} = useComplexFieldMethods()

const medianEarningsMidpoint = (institution) => {
  const medianEarnings = toggleMedianEarnings(institution)
  return medianToggle.value === 'group' ? medianEarnings[0] : medianEarnings[1]
}
</script>

<style lang="scss" scoped>
</style>