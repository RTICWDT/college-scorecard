<template>
  <CompareSchoolsDataBlock :institutions="institutions.schools4Year" title="4-year schools">
    <template v-if="hasSlot('byline')" #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template v-if="hasSlot('data')" #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
    <template v-if="hasSlot('override')" #override="slotProps">
      <slot name="override" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schools2Year" title="2-year schools">
    <template v-if="hasSlot('byline')" #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template v-if="hasSlot('data')" #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
    <template v-if="hasSlot('override')" #override="slotProps">
      <slot name="override" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>

  <CompareSchoolsDataBlock :institutions="institutions.schoolsCertificate" title="Certificate schools">
    <template v-if="hasSlot('byline')" #byline="slotProps2">
      <slot name="byline" v-bind="slotProps2" />
    </template>
    <template v-if="hasSlot('data')" #data="slotProps">
      <slot name="data" v-bind="slotProps" />
    </template>
    <template v-if="hasSlot('override')" #override="slotProps">
      <slot name="override" v-bind="slotProps" />
    </template>
  </CompareSchoolsDataBlock>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const slots = useSlots();
const hasSlot = (name) => !!slots[name]
</script>