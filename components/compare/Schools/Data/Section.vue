<template>
  <CompareSchoolsDataBlock :institutions="institutions.schools2Year" title="2-year schools">
    <template #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schools4Year" title="4-year schools">
    <template #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schoolsCertificate" title="Certificate schools">
    <template #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>
</template>

<script setup>
const props = defineProps({ institutions: Object });
</script>