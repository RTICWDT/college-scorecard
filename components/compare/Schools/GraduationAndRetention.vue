<template>

  <div v-if="showMedian" style="max-width: 600px;">
    <Toggle
      v-model="medianToggle"
      :options="[
        { label: 'Midpoint for School Type', value: 'group', color: color('primary-green'), activeColor: 'transparent' },
        { label: 'Midpoint for All Schools', value: 'all', color: color('primary-green'), activeColor: '#transparent' },
      ]"
      backgroundColor="white"
      borderThickness="5px"
      :height="50"
    >
      <template #default="{ label }">
        <span class="compare-tab-title px-5 text-black">
          {{ label }}
        </span>
      </template>
    </Toggle>
  </div>

  <CompareTooltipHeader title="Graduation Rate" definition="graduation-rate" :h="2" class="mb-5 mt-7" />
  <v-checkbox
    v-model="showPellOnly"
    label="Show Pell Grant Recipients Only"
    color="secondary-green"
  >
    <template v-slot:label>
        Show Pell Grant Recipients Only
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <div v-if="!showPellOnly">
          <p class="text-caption text-right">
            <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toPercent(completionRateMidpoint(institution)) || "N/A" }}</em>
          </p>
        </div>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
          :hasData="contextualCompletionRate(institution)"
          :showMinMax="true"
          :value="{
            label: toPercent(contextualCompletionRate(institution)),
            value: contextualCompletionRate(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
          }"
          :max="{
            label: '100%',
            value: 1,
          }"
          :midpoint="{
            label: 'Midpoint',
            value: completionRateMidpoint(institution),
            style: { height: '60px' },
            show: !showPellOnly,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <CompareTooltipHeader title="Students Who Return After Their First Year" definition="retention-rate" :h="2" class="mb-5 mt-7" />
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarRangeSimplified
          :hasData="retentionRate(institution)"
          :showMinMax="true"
          :value="{
            label: toPercent(retentionRate(institution)),
            value: retentionRate(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
          }"
          :max="{
            label: '100%',
            value: 1,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <SchoolOutcomesConfig v-model:showPellOnly="showPellOnly" v-model:options="options" />
  <div class="px-0 px-md-5 my-5">
    <div class="px-0 px-md-5 mb-5">
      <CompareSchoolsDataSection :institutions="institutions">
        <template #data="{ institution }">
          <SchoolOutcomes :showPellOnly="showPellOnly" :options="options" :school="institution" />
        </template>
      </CompareSchoolsDataSection>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toPercent } = useNumberFormatter()
const medianToggle = ref('group')
const showMedian = computed(() => !showPellOnly.value)
const { color } = useVuetify()
const { showPellOnly, options } = useSchoolOutcomesHelper()

const {
  completionRate,
  completionRatePell,
  toggleGraduationRate,
  retentionRate,
} = useComplexFieldMethods()

const contextualCompletionRate = computed(() => (institution) => {
  return showPellOnly.value ? completionRatePell(institution) : completionRate(institution)
})

const completionRateMidpoint = (institution) => {
  const completionRate = toggleGraduationRate(institution)
  return medianToggle.value === 'group' ? completionRate[0] : completionRate[1]
}

</script>

<style lang="scss" scoped>
</style>