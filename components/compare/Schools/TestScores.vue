<template>
  <h2 class="mb-1 mt-7">Test Scores</h2>
  <p class="mb-5" style="max-width: 800px">Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>

  <div class="px-0 px-md-5">
    <h3 class="mb-5">SAT Reading</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <ChartRange
            v-if="satReading(institution).available"
            :lower="{
              value: satReading(institution).lower,
              label: satReading(institution).lower,
            }"
            :upper="{
              value: satReading(institution).upper,
              label: satReading(institution).upper,
            }"
            :min="{
              value: satReading(institution).min,
              label: satReading(institution).min,
            }"
            :max="{
              value: satReading(institution).max,
              label: satReading(institution).max,
            }"
            hideMiddle
          />
          <div v-else class="data-na">Data Not Available</div>
        </template>
      </CompareSchoolsDataSection>
    </div>

    <h3 class="mb-5">SAT Math</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <ChartRange
            v-if="satMath(institution).available"
            :lower="{
              value: satMath(institution).lower,
              label: satMath(institution).lower,
            }"
            :upper="{
              value: satMath(institution).upper,
              label: satMath(institution).upper,
            }"
            :min="{
              value: satMath(institution).min,
              label: satMath(institution).min,
            }"
            :max="{
              value: satMath(institution).max,
              label: satMath(institution).max,
            }"
            hideMiddle
          />
          <div v-else class="data-na">Data Not Available</div>
        </template>
      </CompareSchoolsDataSection>
    </div>

    <h3 class="mb-5">ACT</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <ChartRange
            v-if="act(institution).available"
            :lower="{
              value: act(institution).lower,
              label: act(institution).lower,
            }"
            :upper="{
              value: act(institution).upper,
              label: act(institution).upper,
            }"
            :min="{
              value: act(institution).min,
              label: act(institution).min,
            }"
            :max="{
              value: act(institution).max,
              label: act(institution).max,
            }"
            hideMiddle
          />
          <div v-else class="data-na">Data Not Available</div>
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>

  <h2 class="mb-5">Acceptance Rate</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="acceptanceRateActual(institution)"
          :value="{
            label: toPercent(acceptanceRateActual(institution)),
            value: acceptanceRateActual(institution),
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
const { toPercent } = useNumberFormatter()
const { satReading, satMath, act, acceptanceRateActual } = useComplexFieldMethods()
</script>

<style lang="scss" scoped>
</style>