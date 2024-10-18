<template>
  <div style="max-width: 600px;">
    <Toggle
      v-model="medianToggle"
      :options="[
        { label: 'Midpoint for School Type', value: 'group', color: '#007000', activeColor: 'transparent' },
        { label: 'Midpoint for All Schools', value: 'all', color: '#007000', activeColor: '#transparent' },
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

  <CompareHTooltip title="Median Earnings" definition="institution-median-earnings" :h="2" class="mb-1 mt-7" />
  <p class="mb-5" style="max-width: 800px">The median earnings of former students who received federal financial aid at 10 years after entering the school.</p>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toDollar(medianEarningsMidpoint(institution)) || "N/A" }}</em>
        </p>
      </template>
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="medianEarnings(institution)"
          :value="{
            label: toDollar(medianEarnings(institution)),
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

  <CompareHTooltip title="Percentage Earning More Than a High School Graduate" definition="threshold-earnings" :h="2" class="mb-5" />
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
            :shouldRender="percentMoreThanHS(institution)"
            :value="{
              label: toPercent(percentMoreThanHS(institution)),
              value: percentMoreThanHS(institution),
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
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toDollar, toPercent } = useNumberFormatter()
const medianToggle = ref('group')

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