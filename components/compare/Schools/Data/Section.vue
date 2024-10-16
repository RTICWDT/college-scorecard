<template>
  <CompareSchoolsDataBlock :institutions="institutions.schools2Year" title="2-year schools">
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schools4Year" title="4-year schools">
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schoolsCertificate" title="Certificate schools">
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>
</template>

<script setup>
const props = defineProps({
  institutions: Object,
});
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>