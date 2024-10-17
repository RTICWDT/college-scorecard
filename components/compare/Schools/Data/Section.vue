<template>
  <div v-for="grouping in institutionGroupings">
    <CompareSchoolsDataBlock :institutions="grouping.institutions" :title="grouping.title">
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
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const slots = useSlots();
const hasSlot = (name) => !!slots[name]

const institutionGroupings = ref([
  { title: '2-year schools', institutions: props.institutions.schools2Year },
  { title: '4-year schools', institutions: props.institutions.schools4Year },
  { title: 'Certificate schools', institutions: props.institutions.schoolsCertificate },
])
</script>