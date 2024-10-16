<template>
  <MedianToggle
    :display-toggle="medianToggle"
    @median-tab-change="handleMedianToggle"
    group-name="School Type"
    label-prefix="Midpoint for "
  />

  <h2 class="mb-5 mt-7">Median Earnings</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Percentage Earning More Than a High School Graduate</h2>
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

const medianToggle = ref('group')
const handleMedianToggle = (toggleValue) => {
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}
</script>

<style lang="scss" scoped>
</style>