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

  <h2 class="mb-5 mt-7">Average Annual Cost</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <p class="text-caption text-right">
          <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toDollar(netPriceMidpoint(institution)) || "N/A" }}</em>
        </p>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="netPrice(institution)"
          :value="{
            label: toDollar(netPrice(institution)),
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
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-1 mt-7">By Family Income Category</h2>
  <p class="mb-5" style="max-width: 800px">Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
  <div class="px-0 px-md-5 mb-5">
    <p class="text-caption text-uppercase">What's your Family Income?</p>
    <v-select
      :items="incomeFilters"
      v-model="currentIncomeFilter"
      item-text="label"
      item-value="value"
      color="secondary"
      variant="outlined"
      class="compare-select"
    ></v-select>
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="currentIncomeAmount(institution)"
          :value="{
            label: toDollar(currentIncomeAmount(institution)),
            value: currentIncomeAmount(institution),
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
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toDollar } = useNumberFormatter()
const medianToggle = ref('group')

const {
  netPrice,
  toggleAverageAnnualCosts,
  income,
} = useComplexFieldMethods()

const netPriceMidpoint = (institution) => {
  const netPrice = toggleAverageAnnualCosts(institution)
  return medianToggle.value === 'group' ? netPrice[0] : netPrice[1]
}

const incomeFilters = [
  { title: '$0-$30,000', value: '0-30000' },
  { title: '$30,001-$48,000', value: '30001-48000' },
  { title: '$48,001-$75,000', value: '48001-75000' },
  { title: '$75,001-$110,000', value: '75001-110000' },
  { title: '$110,001+', value: '110001-plus' },
]

const currentIncomeFilter = ref(incomeFilters[0].value)

const currentIncomeAmount = computed(() => (institution) => {
  const data = income(institution)
  const current = currentIncomeFilter.value
  return data[current]
})

</script>

<style lang="scss" scoped>
</style>