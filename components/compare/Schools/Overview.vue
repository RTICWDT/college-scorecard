<template>
  <h1>MIDPOINT TILES GO HERE</h1>

  <h2>Average Annual Cost</h2>
  <p>Cost includes tuition, living costs, books and supplies, and fees minus the average grants and scholarships for federal financial aid recipients.</p>

  <Spacer :height="20" />

  <CompareSchoolsDataSection :institutions="institutions">
    <template #data="{ institution }">
      <div class="institution-card">
        {{ netPrice(institution) }}
      </div>
    </template>
  </CompareSchoolsDataSection>

  <h2>Graduation Rate</h2>
  <CompareSchoolsDataSection :institutions="institutions">
    <template #data="{ institution }">
      <div class="institution-card">
        {{ completionRate(institution) }}
      </div>
    </template>
  </CompareSchoolsDataSection>

  <h2>Median Earnings</h2>
  <CompareSchoolsDataSection :institutions="institutions">
    <template #data="{ institution }">
      <div>
        {{ institution.school.name }}
      </div>
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
          label: '$100,000+',
          value: 100000,
          style: { height: '60px' },
        }"
        :median="{
          label: 'Midpoint',
          value:
            medianToggle === 'group'
              ? toggleMedianEarnings(institution)[0]
              : toggleMedianEarnings(institution)[1],
          style: { height: '60px' },
          show: true,
        }"
        :upperTipStyleOverride="{
          display: 'none',
        }"
        color="#00365e"
        :height="500"
        :y-bar-thickness="50"
        :label-font-size="24"
        :labels="true"
        class="pt-3"
        style="height:100px"
      />
    </template>
  </CompareSchoolsDataSection>
</template>

<script setup>
import numeral from 'numeral'
const props = defineProps({
  institutions: Object,
});

const medianToggle = ref('group')
const groupName = ref('')

const { netPrice, medianEarnings, completionRate, toggleMedianEarnings } = useComplexFieldMethods()
</script>

<style lang="scss" scoped>
</style>