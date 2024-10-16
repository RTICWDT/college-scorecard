<template>
  <h2 class="mb-5 mt-7">Full Time Enrollment</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="fullTimeEnrollment(institution)"
          :value="{
            label: toPercent(fullTimeEnrollment(institution)),
            value: fullTimeEnrollment(institution),
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

  <h2 class="mb-5">School Information</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Socio-Evonomic Diversity</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Race/Ethnicity</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toPercent } = useNumberFormatter()

const {
  fullTimeEnrollment,
} = useComplexFieldMethods()

</script>

<style lang="scss" scoped>
</style>