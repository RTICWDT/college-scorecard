<template>
  <h2 class="mb-5">Number Of Graduates</h2>

  <div class="pl-5">
    <div class="pl-5 pb-10">
      <CompareFieldsOfStudyDataDisplay :fieldsOfStudy="fieldsOfStudy">
        <template #data="{ fos }">
          <ChartHorizontalBarMedian
            v-if="gradCount(fos)"
            :value="{
              label: numeral(gradCount(fos)).format(),
              value: gradCount(fos),
            }"
            :min="{
              label: '$0',
              value: 0,
              style: { height: '60px' },
            }"
            :max="{
              label: '400',
              value: 1000,
              style: { height: '60px' },
            }"
            color="#00365e"
            :y-bar-thickness="50"
            :label-font-size="24"
            :labels="true"
          />
          <div class="data-na" v-else>Data Not Available</div>
        </template>
      </CompareFieldsOfStudyDataDisplay>
    </div>
  </div>
</template>

<script setup>
const { fields, getNestedField } = useConstants()
import numeral from 'numeral';
const props = defineProps({
  fieldsOfStudy: Object,
});

const gradCount = (fos) => getNestedField(fos, fields.FOS_GRAD_COUNT)
</script>

<style lang="scss" scoped>
</style>