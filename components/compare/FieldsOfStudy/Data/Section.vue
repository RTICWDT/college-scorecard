<template>
  <div class="my-5">
    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.undergrad" title="Undergraduate Certificate or Diploma">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.associates" title="Associate's Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock> 

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.bachelors" title="Bachelor's Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.baccalaureate" title="Post-baccalaureate Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.masters" title="Master's Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.doctorate" title="Doctoral Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.professionalDegree" title="First Professional Degree">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>

    <CompareFieldsOfStudyDataBlock :fields-of-study="fieldsOfStudy.professionalCertificate" title="Graduate/Professional Certificate">
      <template #data="slotProps">
        <slot name="data" v-bind="slotProps" />
      </template>
    </CompareFieldsOfStudyDataBlock>
  </div>
</template>

<script setup>
const props = defineProps({ fieldsOfStudy: Object });
</script>