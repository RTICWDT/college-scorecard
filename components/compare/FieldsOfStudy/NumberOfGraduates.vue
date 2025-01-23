<template>
  <CompareTooltipHeader class="mb-3" title="Number Of Graduates" definition="fos-number-of-graduates" :h="2" />

  <div class="px-0 px-md-5">
    <div class="px-0 px-md-5 pb-10">
      <CompareFieldsOfStudyDataSection :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarRangeSimplified
            :hasData="gradCount(fos)"
            :showMinMax="true"
            :value="{
              label: toNumber(gradCount(fos)),
              value: gradCount(fos),
            }"
            :min="{
              label: '0',
              value: 0,
            }"
            :max="{
              label: '1000',
              value: 1000,
            }"
          />
        </template>
      </CompareFieldsOfStudyDataSection>
    </div>
  </div>
</template>

<script setup>
const { toNumber } = useNumberFormatter()
const { fields, getNestedField } = useConstants()
const props = defineProps({
  fieldsOfStudy: Object,
});

const gradCount = (fos) => getNestedField(fos, fields.FOS_GRAD_COUNT)
</script>

<style lang="scss" scoped>
</style>