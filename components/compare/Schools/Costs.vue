<template>
  <div style="max-width: 600px;">
    <Toggle
      v-model="medianToggle"
      :options="[
        { label: 'Midpoint for School Type', value: 'group', color: color('primary-green'), activeColor: 'transparent' },
        { label: 'Midpoint for All Schools', value: 'all', color: color('primary-green'), activeColor: 'transparent' },
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

  <CompareTooltipHeader title="Average Annual Cost" definition="avg-cost" :h="2" class="mb-5 mt-7" />
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

  <h2 class="mb-1 mt-7">By Family Income Category</h2>
  <p class="mb-5" style="max-width: 800px">Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
  <div class="px-0 px-md-5 mb-5">
    <p class="text-caption text-uppercase">What's your Family Income?</p>
    <v-select
      :items="incomeFilters"
      v-model="currentIncomeFilter"
      item-text="label"
      item-value="value"
      color="secondary-green"
      variant="outlined"
      class="compare-select"
    ></v-select>
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
          :hasData="currentIncomeAmount(institution)"
          :showMinMax="true"
          :value="{
            label: toDollar(currentIncomeAmount(institution)),
            value: currentIncomeAmount(institution),
          }"
          :min="{
            label: '$0',
            value: 0,
          }"
          :max="{
            label: '$100,000',
            value: 100000,
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
const { color } = useVuetify()

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