<template>
    <MedianToggle
      :display-toggle="medianToggle"
      @median-tab-change="handleMedianToggle"
      group-name="School Type"
      label-prefix="Midpoint for "
    />

  <h2 class="mb-5 mt-7">Average Annual Cost</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-1 mt-7">By Family Income Category</h2>
  <p class="mb-5" style="max-width: 800px">Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
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