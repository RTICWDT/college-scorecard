<template>
  <h2 class="mb-5 mt-7">Full Time Enrollment</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        hi
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
</script>

<style lang="scss" scoped>
</style>