<template>
  <h2 class="mb-1 mt-7">Test Scores</h2>
  <p class="mb-5" style="max-width: 800px">Students who were admitted and enrolled typically had standardized test scores in these ranges.</p>

  <div class="px-0 px-md-5">
    <h3 class="mb-5">SAT Reading</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          hi
        </template>
      </CompareSchoolsDataSection>
    </div>

    <h3 class="mb-5">SAT Math</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          hi
        </template>
      </CompareSchoolsDataSection>
    </div>

    <h3 class="mb-5">ACT</h3>
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          hi
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>

  <h2 class="mb-5">Acceptance Rate</h2>
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
</script>

<style lang="scss" scoped>
</style>